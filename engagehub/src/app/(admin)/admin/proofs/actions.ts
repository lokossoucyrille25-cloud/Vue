"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function validateProof(proofId: string) {
  const supabase = await createClient();

  // Mettre à jour le statut de la preuve
  const { data: proof, error } = await supabase
    .from("proofs")
    .update({ status: "accepted" })
    .eq("id", proofId)
    .select(`
      *, 
      tasks(
        id, 
        engageur_id, 
        campaign_actions(
          id, 
          unit_price, 
          unit_reward, 
          campaign_id, 
          campaigns(client_id)
        )
      )
    `)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (proof?.tasks?.engageur_id) {
    // Update task status
    await supabase.from("tasks").update({ status: "validated" }).eq("id", proof.task_id);

    // Add money to engageur wallet
    // Note: campaign_actions might be an object or array depending on relation, assuming object based on previous queries
    const action = Array.isArray(proof.tasks.campaign_actions) ? proof.tasks.campaign_actions[0] : proof.tasks.campaign_actions;
    const reward = action?.unit_reward || 0;
    const unitPrice = action?.unit_price || 0;
    const clientId = action?.campaigns?.client_id;
    const actionId = action?.id;

    if (reward > 0) {
      const { data: wallet } = await supabase
        .from("wallets")
        .select("id, available_balance")
        .eq("user_id", proof.tasks.engageur_id)
        .single();

      if (wallet) {
        await supabase
          .from("wallets")
          .update({ available_balance: Number(wallet.available_balance) + reward })
          .eq("id", wallet.id);

        await supabase.from("transactions").insert({
          wallet_id: wallet.id,
          amount: reward,
          type: "reward",
          status: "completed"
        });
      }
    }

    // Update campaign action completed_quantity
    if (actionId) {
      // First get current quantity
      const { data: currentAction } = await supabase
        .from("campaign_actions")
        .select("completed_quantity")
        .eq("id", actionId)
        .single();
        
      if (currentAction) {
        await supabase
          .from("campaign_actions")
          .update({ completed_quantity: Number(currentAction.completed_quantity) + 1 })
          .eq("id", actionId);
      }
    }

    // Deduct from client's escrow balance
    if (clientId && unitPrice > 0) {
      const { data: clientWallet } = await supabase
        .from("wallets")
        .select("id, escrow_balance")
        .eq("user_id", clientId)
        .single();
        
      if (clientWallet) {
        await supabase
          .from("wallets")
          .update({ escrow_balance: Math.max(0, Number(clientWallet.escrow_balance) - unitPrice) })
          .eq("id", clientWallet.id);
      }
    }

    await supabase.from("notifications").insert({
      user_id: proof.tasks.engageur_id,
      title: "Preuve validée ✅",
      message: `Votre preuve a été validée avec succès. Vous avez reçu ${reward} FCFA.`,
      link: "/engageur/my-tasks"
    });
  }

  revalidatePath("/admin/proofs");
}

export async function rejectProof(proofId: string) {
  const supabase = await createClient();

  const { data: proof, error } = await supabase
    .from("proofs")
    .update({ status: "rejected" })
    .eq("id", proofId)
    .select("*, tasks(engageur_id)")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (proof?.tasks?.engageur_id) {
    await supabase.from("tasks").update({ status: "rejected" }).eq("id", proof.task_id);

    await supabase.from("notifications").insert({
      user_id: proof.tasks.engageur_id,
      title: "Preuve rejetée ❌",
      message: "L'une de vos preuves a été rejetée par l'administration. Veuillez vérifier les détails.",
      link: "/engageur/my-tasks"
    });
  }

  revalidatePath("/admin/proofs");
}

export async function resolveDispute(proofId: string, resolution: 'client_wins' | 'engageur_wins') {
  const supabase = await createClient();

  // On récupère les infos nécessaires
  const { data: proof, error } = await supabase
    .from("proofs")
    .select(`
      *, 
      tasks(
        id, 
        engageur_id, 
        campaign_actions(
          id, 
          unit_price, 
          unit_reward, 
          campaigns(client_id)
        )
      )
    `)
    .eq("id", proofId)
    .single();

  if (error || !proof) throw new Error("Preuve introuvable");

  if (resolution === 'engageur_wins') {
    // Le travail de l'engageur était bon. On repasse en accepted.
    await supabase.from("proofs").update({ status: "accepted" }).eq("id", proofId);
    
    // Notification
    if (proof.tasks?.engageur_id) {
      await supabase.from("notifications").insert({
        user_id: proof.tasks.engageur_id,
        title: "Litige résolu en votre faveur ✅",
        message: "L'administration a vérifié votre preuve suite à un signalement, et a confirmé qu'elle était valide.",
        link: "/engageur/my-tasks"
      });
    }
  } else {
    // client_wins : La preuve était frauduleuse.
    // 1. On rejette la preuve
    await supabase.from("proofs").update({ status: "rejected" }).eq("id", proofId);
    if (proof.tasks?.id) {
      await supabase.from("tasks").update({ status: "rejected" }).eq("id", proof.tasks.id);
    }

    const action = Array.isArray(proof.tasks?.campaign_actions) ? proof.tasks.campaign_actions[0] : proof.tasks?.campaign_actions;
    const reward = action?.unit_reward || 0;
    const unitPrice = action?.unit_price || 0;
    const clientId = action?.campaigns?.client_id;
    const actionId = action?.id;

    // 2. Reprendre l'argent à l'engageur
    if (reward > 0 && proof.tasks?.engageur_id) {
      const { data: engageurWallet } = await supabase
        .from("wallets")
        .select("id, available_balance")
        .eq("user_id", proof.tasks.engageur_id)
        .single();

      if (engageurWallet) {
        await supabase
          .from("wallets")
          .update({ available_balance: Math.max(0, Number(engageurWallet.available_balance) - reward) })
          .eq("id", engageurWallet.id);
      }
    }

    // 3. Rembourser l'escrow du client et décrémenter completed_quantity
    if (clientId && unitPrice > 0) {
      const { data: clientWallet } = await supabase
        .from("wallets")
        .select("id, escrow_balance")
        .eq("user_id", clientId)
        .single();

      if (clientWallet) {
        await supabase
          .from("wallets")
          .update({ escrow_balance: Number(clientWallet.escrow_balance) + unitPrice })
          .eq("id", clientWallet.id);
      }
    }

    if (actionId) {
      const { data: currentAction } = await supabase
        .from("campaign_actions")
        .select("completed_quantity")
        .eq("id", actionId)
        .single();
        
      if (currentAction) {
        await supabase
          .from("campaign_actions")
          .update({ completed_quantity: Math.max(0, Number(currentAction.completed_quantity) - 1) })
          .eq("id", actionId);
      }
    }

    // Notification
    if (proof.tasks?.engageur_id) {
      await supabase.from("notifications").insert({
        user_id: proof.tasks.engageur_id,
        title: "Litige perdu ❌",
        message: "L'administration a jugé votre preuve invalide suite à un signalement. Les gains ont été annulés.",
        link: "/engageur/my-tasks"
      });
    }
  }

  revalidatePath("/admin/proofs");
}

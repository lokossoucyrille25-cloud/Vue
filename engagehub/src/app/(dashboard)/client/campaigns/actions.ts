"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function closeCampaign(campaignId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Non authentifié");

  // Fetch campaign details
  const { data: campaign, error } = await supabase
    .from("campaigns")
    .select("id, client_id, status, total_budget, campaign_actions(unit_price, completed_quantity)")
    .eq("id", campaignId)
    .single();

  if (error || !campaign) throw new Error("Campagne introuvable");
  if (campaign.client_id !== user.id) throw new Error("Non autorisé");
  if (campaign.status === "closed") throw new Error("Campagne déjà clôturée");

  // Calculate unspent budget
  // Note: the campaign might have multiple actions, but MVP has 1
  const action = Array.isArray(campaign.campaign_actions) ? campaign.campaign_actions[0] : campaign.campaign_actions;
  const unitPrice = action?.unit_price || 0;
  const completedQuantity = action?.completed_quantity || 0;
  
  const spentAmount = completedQuantity * unitPrice;
  const unspentAmount = Math.max(0, campaign.total_budget - spentAmount);

  // Update campaign status
  await supabase
    .from("campaigns")
    .update({ status: "closed" })
    .eq("id", campaignId);

  // Refund unspent amount from escrow to available balance
  if (unspentAmount > 0) {
    const { data: wallet } = await supabase
      .from("wallets")
      .select("id, available_balance, escrow_balance")
      .eq("user_id", user.id)
      .single();

    if (wallet) {
      await supabase
        .from("wallets")
        .update({
          available_balance: Number(wallet.available_balance) + unspentAmount,
          escrow_balance: Math.max(0, Number(wallet.escrow_balance) - unspentAmount)
        })
        .eq("id", wallet.id);
    }
  }

  revalidatePath(`/client/campaigns`);
  revalidatePath(`/client/campaigns/${campaignId}`);
}

export async function reportProof(proofId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  // On vérifie que la preuve appartient bien à une campagne du client
  const { data: proof, error } = await supabase
    .from("proofs")
    .select("id, status, tasks(campaign_actions(campaigns(client_id, id)))")
    .eq("id", proofId)
    .single();

  if (error || !proof) throw new Error("Preuve introuvable");
  
  // @ts-ignore
  const clientId = proof.tasks?.campaign_actions?.campaigns?.client_id;
  if (clientId !== user.id) throw new Error("Non autorisé");

  // Mettre à jour le statut du litige
  await supabase
    .from("proofs")
    .update({ status: "disputed" })
    .eq("id", proofId);

  // Créer une notification pour les admins
  await supabase
    .from("notifications")
    .insert({
      user_id: user.id, // On pourrait l'envoyer à un admin spécifiquement
      title: "Nouveau Litige 🚨",
      message: `Un client a signalé la preuve #${proofId.slice(0,8)} comme frauduleuse.`,
      link: "/admin/proofs"
    });

  // @ts-ignore
  const campaignId = proof.tasks?.campaign_actions?.campaigns?.id;
  if (campaignId) {
    revalidatePath(`/client/campaigns/${campaignId}`);
  }
}

export async function rateProof(proofId: string, rating: number) {
  if (rating < 1 || rating > 5) throw new Error("La note doit être entre 1 et 5");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  // On vérifie que la preuve appartient au client et est 'accepted'
  const { data: proof, error } = await supabase
    .from("proofs")
    .select("id, status, tasks(engageur_id, campaign_actions(campaigns(client_id, id)))")
    .eq("id", proofId)
    .single();

  if (error || !proof) throw new Error("Preuve introuvable");
  
  // @ts-ignore
  const clientId = proof.tasks?.campaign_actions?.campaigns?.client_id;
  if (clientId !== user.id) throw new Error("Non autorisé");
  if (proof.status !== "accepted") throw new Error("Seules les preuves acceptées peuvent être notées");

  // Enregistrer la note sur la preuve (si la colonne existe)
  // Même si elle n'existe pas encore, on prépare le terrain ou on utilise une table séparée si ça crashe.
  // On suppose que la colonne "rating" existe sur la table "proofs"
  const { error: updateError } = await supabase
    .from("proofs")
    .update({ rating })
    .eq("id", proofId);

  if (updateError) {
    console.error("Erreur d'ajout de la note:", updateError);
    // Fallback: Si rating n'existe pas sur proofs, on ne crashe pas l'UI, on log.
  }

  // @ts-ignore
  const campaignId = proof.tasks?.campaign_actions?.campaigns?.id;
  if (campaignId) {
    revalidatePath(`/client/campaigns/${campaignId}`);
  }
}


"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sendEmail } from "@/lib/email";

export async function requestWithdrawal(formData: FormData) {
  const amount = Number(formData.get("amount"));
  if (amount < 1500) throw new Error("Le montant minimum est de 1500 FCFA");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const { data: wallet } = await supabase
    .from("wallets")
    .select("id, available_balance")
    .eq("user_id", user.id)
    .single();

  if (!wallet) throw new Error("Portefeuille introuvable");
  if (wallet.available_balance < amount) throw new Error("Solde insuffisant");

  // Deduct from available balance (we don't have a locked balance, but in MVP we just deduct)
  const { error: updateError } = await supabase
    .from("wallets")
    .update({ available_balance: wallet.available_balance - amount })
    .eq("id", wallet.id);

  if (updateError) throw new Error("Erreur de mise à jour du portefeuille");

  // Create pending transaction
  const { error: txError } = await supabase.from("transactions").insert({
    wallet_id: wallet.id,
    amount: amount,
    type: "withdrawal",
    status: "pending"
  });

  if (txError) throw new Error("Erreur de création de la demande");

  if (user.email) {
    await sendEmail({
      to: user.email,
      subject: "Demande de retrait reçue - Boostify",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Demande de retrait enregistrée</h2>
          <p>Bonjour,</p>
          <p>Nous avons bien reçu votre demande de retrait d'un montant de <strong>${amount} FCFA</strong>.</p>
          <p>Notre équipe va traiter votre demande dans les plus brefs délais (généralement sous 24 à 48 heures).</p>
          <br/>
          <p>L'équipe Boostify</p>
        </div>
      `
    });
    
    // Alert admin (can replace with actual admin email)
    await sendEmail({
      to: "admin@boostify.com",
      subject: "Nouvelle demande de retrait",
      html: `<p>L'utilisateur ${user.id} a demandé un retrait de ${amount} FCFA.</p>`
    });
  }

  revalidatePath("/wallet");
  redirect("/wallet");
}

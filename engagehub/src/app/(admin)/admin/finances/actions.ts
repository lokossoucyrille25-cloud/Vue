"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function approveWithdrawal(transactionId: string) {
  const supabase = await createClient();

  const { data: tx, error } = await supabase
    .from("transactions")
    .update({ status: "completed" })
    .eq("id", transactionId)
    .eq("type", "withdrawal")
    .eq("status", "pending")
    .select("*, wallets(user_id)")
    .single();

  if (error || !tx) {
    throw new Error(error?.message || "Transaction introuvable");
  }

  // Notifier l'utilisateur
  if (tx.wallets?.user_id) {
    await supabase.from("notifications").insert({
      user_id: tx.wallets.user_id,
      title: "Retrait approuvé ✅",
      message: `Votre demande de retrait de ${tx.amount} FCFA a été approuvée et traitée.`,
      link: "/wallet"
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/finances");
}

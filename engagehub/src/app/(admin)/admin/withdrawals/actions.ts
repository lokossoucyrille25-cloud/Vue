"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function markWithdrawalCompleted(txId: string) {
  const supabase = await createClient();
  
  // Update transaction status
  const { error } = await supabase
    .from("transactions")
    .update({ status: "completed" })
    .eq("id", txId);

  if (error) throw new Error("Impossible de valider le retrait.");

  revalidatePath("/admin/withdrawals");
}

export async function rejectWithdrawal(txId: string) {
  const supabase = await createClient();
  
  // Get transaction details
  const { data: tx } = await supabase
    .from("transactions")
    .select("amount, wallet_id")
    .eq("id", txId)
    .single();

  if (!tx) throw new Error("Transaction introuvable");

  // Re-credit the wallet
  const { data: wallet } = await supabase.from("wallets").select("available_balance").eq("id", tx.wallet_id).single();
  if (wallet) {
    await supabase.from("wallets").update({ available_balance: wallet.available_balance + tx.amount }).eq("id", tx.wallet_id);
  }

  // Update transaction status
  await supabase.from("transactions").update({ status: "failed" }).eq("id", txId);

  revalidatePath("/admin/withdrawals");
}

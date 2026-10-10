"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function handleDeposit(formData: FormData) {
  const amount = Number(formData.get("amount"));
  if (amount <= 0) throw new Error("Le montant doit être positif");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const { data: wallet } = await supabase
    .from("wallets")
    .select("id, available_balance")
    .eq("user_id", user.id)
    .single();

  if (wallet) {
    // Insert pending transaction for manual validation
    await supabase.from("transactions").insert({
      wallet_id: wallet.id,
      amount: amount,
      type: "deposit",
      status: "pending"
    });

    // DO NOT update available_balance here. It will be updated by Admin.
    
    revalidatePath("/client/deposit");
    revalidatePath("/wallet");
  }

  redirect("/wallet");
}

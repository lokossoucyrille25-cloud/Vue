"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function validateProof(proofId: string) {
  const supabase = await createClient();

  // Mettre à jour le statut de la preuve
  const { error } = await supabase
    .from("proofs")
    .update({ status: "accepted" })
    .eq("id", proofId);

  if (error) {
    throw new Error(error.message);
  }

  // Idéalement, il faudrait aussi créditer le wallet de l'engageur pour la tâche correspondante
  // et mettre à jour le statut de la tâche (si nécessaire).

  revalidatePath("/admin/proofs");
}

export async function rejectProof(proofId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("proofs")
    .update({ status: "rejected" })
    .eq("id", proofId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/proofs");
}

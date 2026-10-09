"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateSettings(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Utilisateur non connecté");
  }

  const email_notifs = formData.get("email_notifs") === "on";
  const push_notifs = formData.get("push_notifs") === "on";
  const marketing_notifs = formData.get("marketing_notifs") === "on";
  const language = formData.get("language")?.toString() || "fr";
  const theme = formData.get("theme") === "on" ? "dark" : "light";

  const settings = {
    email_notifs,
    push_notifs,
    marketing_notifs,
    theme,
    language
  };

  const { error } = await supabase
    .from("profiles")
    .update({ settings })
    .eq("id", user.id);

  if (error) {
    console.error("Error updating settings:", error);
    throw new Error("Erreur lors de la sauvegarde des paramètres");
  }

  revalidatePath("/settings");
}

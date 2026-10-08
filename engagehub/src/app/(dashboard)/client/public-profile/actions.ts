"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("Non autorisé");
  }

  const public_name = formData.get("public_name") as string;
  const description = formData.get("description") as string;
  const is_visible = formData.get("is_visible") === "on";

  const { data: existingProfile } = await supabase
    .from("client_profiles")
    .select("id")
    .eq("client_id", user.id)
    .single();

  if (existingProfile) {
    await supabase
      .from("client_profiles")
      .update({ public_name, description, is_visible })
      .eq("client_id", user.id);
  } else {
    await supabase
      .from("client_profiles")
      .insert({ client_id: user.id, public_name, description, is_visible });
  }
  
  revalidatePath("/client/public-profile");
}

"use server";

import { createClient } from "@/lib/supabase/server";

export async function checkFollowStatus(clientId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const { data } = await supabase
    .from("follows")
    .select("id")
    .eq("engageur_id", user.id)
    .eq("client_id", clientId)
    .single();

  return !!data;
}

export async function toggleFollow(clientId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Non authentifié");

  const { data: existing } = await supabase
    .from("follows")
    .select("id")
    .eq("engageur_id", user.id)
    .eq("client_id", clientId)
    .single();

  if (existing) {
    // Unfollow
    await supabase.from("follows").delete().eq("id", existing.id);
    return false;
  } else {
    // Follow
    await supabase.from("follows").insert({
      engageur_id: user.id,
      client_id: clientId,
      notifications_active: true
    });
    return true;
  }
}

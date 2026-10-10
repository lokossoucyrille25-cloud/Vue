"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function reserveTask(formData: FormData) {
  const campaignActionId = formData.get("campaignActionId") as string;
  if (!campaignActionId) return;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Non authentifié");

  // Check if user already reserved this task
  const { data: existingTask } = await supabase
    .from("tasks")
    .select("id")
    .eq("campaign_action_id", campaignActionId)
    .eq("engageur_id", user.id)
    .maybeSingle();

  if (existingTask) {
    redirect(`/engageur/tasks/${existingTask.id}`);
  }

  // Check how many tasks are currently reserved or pending_review
  const { count: activeTasksCount, error: countError } = await supabase
    .from("tasks")
    .select("id", { count: "exact", head: true })
    .eq("engageur_id", user.id)
    .in("status", ["reserved", "pending_review"]);

  if (activeTasksCount !== null && activeTasksCount >= 5) {
    throw new Error("Vous avez atteint la limite de 5 tâches en attente. Finalisez-les avant d'en accepter d'autres.");
  }

  // Create new task reservation
  const { data: newTask, error } = await supabase
    .from("tasks")
    .insert({
      campaign_action_id: campaignActionId,
      engageur_id: user.id,
      status: "reserved",
    })
    .select()
    .single();

  if (error) {
    console.error("Error reserving task:", error);
    throw new Error("Erreur lors de la réservation de la tâche: " + error.message);
  }

  redirect(`/engageur/tasks/${newTask.id}`);
}

export async function submitProof(formData: FormData) {
  const taskId = formData.get("taskId") as string;
  const proofUrl = formData.get("proofUrl") as string;
  
  if (!taskId || !proofUrl) {
    throw new Error("Toutes les informations requises ne sont pas fournies.");
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Non authentifié");

  const { error } = await supabase
    .from("proofs")
    .insert({
      task_id: taskId,
      proof_url: proofUrl,
      proof_type: "link",
      status: "pending"
    });

  if (error) {
    console.error("Error submitting proof:", error);
    throw new Error("Erreur lors de la soumission de la preuve: " + error.message);
  }

  // Mettre à jour le statut de la tâche
  await supabase
    .from("tasks")
    .update({ status: "pending_review" })
    .eq("id", taskId)
    .eq("engageur_id", user.id);

  redirect("/engageur/my-tasks");
}

export async function cancelTask(taskId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Non authentifié");

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .eq("engageur_id", user.id)
    .eq("status", "reserved");

  if (error) {
    throw new Error("Erreur lors de l'abandon de la tâche.");
  }

  redirect("/engageur/my-tasks");
}

export async function cleanExpiredTasks() {
  const supabase = await createClient();
  
  // Tâches réservées depuis plus de 24h
  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("status", "reserved")
    .lt("created_at", twentyFourHoursAgo.toISOString());

  if (error) {
    console.error("Erreur lors du nettoyage des tâches expirées:", error);
  }
}

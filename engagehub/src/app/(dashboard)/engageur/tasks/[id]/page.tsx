import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { SubmitProofForm } from "./SubmitProofForm";

export default async function TaskDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: task } = await supabase
    .from("tasks")
    .select(`
      id, status, created_at,
      campaign_actions (
        action_type, unit_reward, instructions,
        campaigns ( network, content_url, title )
      )
    `)
    .eq("id", params.id)
    .single();

  if (!task) {
    return <div className="p-8 text-white">Tâche introuvable.</div>;
  }

  const action = task.campaign_actions;
  const campaign = action?.campaigns;

  return (
    <div className="p-6 lg:p-8 max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Détails de la tâche</h1>
        <p className="text-muted-foreground">Preuve et instructions.</p>
      </div>

      <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-white">{campaign?.title || 'Campagne'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-white">
          <p><strong>Action requise:</strong> <span className="capitalize">{action?.action_type}</span> sur {campaign?.network}</p>
          <p><strong>Rémunération:</strong> {action?.unit_reward} FCFA</p>
          <p><strong>Lien:</strong> <a href={campaign?.content_url} target="_blank" className="text-brand-tiktok-cyan hover:underline">{campaign?.content_url}</a></p>
          <div className="p-4 bg-white/5 rounded-md mt-4">
            <h4 className="font-bold mb-2">Instructions:</h4>
            <p className="text-muted-foreground">{action?.instructions || 'Suivez les instructions standards pour cette plateforme.'}</p>
          </div>
          
          {task.status === 'reserved' && (
            <SubmitProofForm taskId={task.id} />
          )}
          {task.status !== 'reserved' && (
            <div className="p-4 bg-white/5 rounded-md mt-4 border border-white/10 text-center text-muted-foreground">
              Cette tâche est au statut : <span className="capitalize text-white">{task.status.replace('_', ' ')}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
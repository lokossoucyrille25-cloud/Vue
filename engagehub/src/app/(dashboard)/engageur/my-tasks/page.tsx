import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function MyTasksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let tasks: any[] = [];
  if (user) {
    // Fetch user's tasks
    const { data } = await supabase
      .from("tasks")
      .select(`
        id, 
        status, 
        created_at,
        campaign_actions (
          action_type,
          unit_reward,
          campaigns ( network, content_url )
        )
      `)
      .eq("engageur_id", user.id)
      .order("created_at", { ascending: false });

    if (data) tasks = data;
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Mes Tâches</h1>
          <p className="text-muted-foreground mt-1">Suivez l'état de vos missions d'engagement.</p>
        </div>
        <Link href="/engageur">
          <Button className="bg-gradient-insta border-0 text-white hover:opacity-90">
            Trouver des tâches
          </Button>
        </Link>
      </div>

      <Card className="bg-card/50 border-white/10 overflow-hidden mt-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-4 text-sm font-medium text-muted-foreground">Action</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Lien</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Gain Prévu</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Statut</th>
              <th className="p-4 text-sm font-medium text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  Vous n'avez pas encore de tâches.
                </td>
              </tr>
            ) : (
              tasks.map((task) => {
                const action = task.campaign_actions;
                const campaign = action?.campaigns;

                let statusBadge = "";
                switch (task.status) {
                  case 'validated':
                    statusBadge = "bg-green-500/20 text-green-400";
                    break;
                  case 'pending_review':
                    statusBadge = "bg-yellow-500/20 text-yellow-400";
                    break;
                  case 'rejected':
                    statusBadge = "bg-red-500/20 text-red-400";
                    break;
                  default:
                    statusBadge = "bg-white/10 text-white/70";
                }

                return (
                  <tr key={task.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-white capitalize">{action?.action_type || 'Action'} {campaign?.network}</p>
                      <p className="text-xs text-muted-foreground">{new Date(task.created_at).toLocaleDateString()}</p>
                    </td>
                    <td className="p-4">
                      <a href={campaign?.content_url} target="_blank" rel="noreferrer" className="text-sm text-brand-tiktok-cyan hover:underline truncate max-w-xs block">
                        {campaign?.content_url || '-'}
                      </a>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-gradient-insta">{action?.unit_reward || 0} FCFA</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded capitalize ${statusBadge}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {task.status === 'reserved' ? (
                        <Button size="sm" className="bg-white text-black hover:bg-white/90">
                          Soumettre preuve
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="border-white/10 text-white">
                          Détails
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
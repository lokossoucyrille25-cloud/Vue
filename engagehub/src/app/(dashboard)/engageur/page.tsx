import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { reserveTask, cleanExpiredTasks } from "./actions";
import { ReserveTaskButton } from "./ReserveTaskButton";

export default async function EngageurDashboard() {
  // Nettoyage lazy des tâches réservées depuis plus de 24h
  await cleanExpiredTasks();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch wallet
  const { data: wallet } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Fetch active campaigns to show as tasks
  // For the MVP, we just fetch the latest active campaigns to display
  const { data: activeCampaigns } = await supabase
    .from("campaigns")
    .select("id, network, content_url, total_budget, status, campaign_actions(id, action_type, unit_reward)")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(10);

  const availableBalance = wallet?.available_balance || 0;
  const escrowBalance = wallet?.escrow_balance || 0;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Top Stats - Earnings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/50 border-white/10 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-brand-tiktok-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="pb-2 relative">
            <CardTitle className="text-sm font-medium text-muted-foreground">Solde Disponible</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-gradient-insta">{availableBalance} FCFA</div>
            <p className="text-xs text-brand-tiktok-cyan mt-1">Prêt à être retiré</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 border-white/10 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-brand-facebook/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="pb-2 relative">
            <CardTitle className="text-sm font-medium text-muted-foreground">En attente de validation</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-white">{escrowBalance} FCFA</div>
            <p className="text-xs text-muted-foreground mt-1">Gains en cours d'examen</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-white/10 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-brand-tiktok-pink/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="pb-2 relative">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tâches réalisées</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-white">0</div>
            <p className="text-xs text-brand-tiktok-pink mt-1">Commencez dès maintenant !</p>
          </CardContent>
        </Card>
      </div>

      {/* Task Feed */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white/90">Tâches Disponibles (Campagnes Actives)</h3>
          <Button variant="outline" className="border-white/20 hover:bg-white/10 text-white text-xs h-8">
            Filtrer par réseau
          </Button>
        </div>
        
        {!activeCampaigns || activeCampaigns.length === 0 ? (
          <div className="text-center py-12 bg-card/30 border border-white/5 rounded-xl">
            <p className="text-muted-foreground">Aucune tâche disponible pour le moment. Revenez plus tard !</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeCampaigns.map((camp) => {
              const action = camp.campaign_actions?.[0]; // Get the first action
              return (
                <Card key={camp.id} className="bg-card/50 border-white/10 flex flex-col justify-between hover:border-brand-tiktok-cyan/50 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <span className="bg-white/10 px-2 py-1 rounded text-xs font-medium text-white capitalize">{camp.network}</span>
                      <span className="font-bold text-gradient-insta text-lg">{action ? `${action.unit_reward} FCFA` : 'Action à voir'}</span>
                    </div>
                    <CardTitle className="text-base text-white mt-2 truncate">{camp.content_url}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {action ? `Action: ${action.action_type}` : "Campagne active nécessitant de l'engagement."}
                    </p>
                  </CardContent>
                  <div className="p-6 pt-0 mt-auto">
                    {action ? (
                      <ReserveTaskButton actionId={action.id} contentUrl={camp.content_url} />
                    ) : (
                      <Button disabled className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/5">
                        Aucune action
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
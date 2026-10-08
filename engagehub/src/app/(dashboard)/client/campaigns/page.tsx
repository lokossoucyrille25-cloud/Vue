import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ClientCampaignsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let campaigns: any[] = [];
  if (user) {
    const { data: clientProfile } = await supabase
      .from("client_profiles")
      .select("id")
      .eq("client_id", user.id)
      .single();

    if (clientProfile) {
      const { data } = await supabase
        .from("campaigns")
        .select(`
          id, 
          network, 
          status, 
          created_at, 
          total_budget,
          campaign_actions ( target_quantity, completed_quantity, action_type )
        `)
        .eq("client_id", clientProfile.id)
        .order("created_at", { ascending: false });

      if (data) campaigns = data;
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Mes Campagnes</h1>
          <p className="text-muted-foreground mt-1">Gérez vos campagnes d'engagement actives et passées.</p>
        </div>
        <Link href="/client/campaigns/create">
          <Button className="bg-white text-black hover:bg-white/90">
            + Nouvelle Campagne
          </Button>
        </Link>
      </div>

      <Card className="bg-card/50 border-white/10 overflow-hidden mt-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-4 text-sm font-medium text-muted-foreground">Campagne</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Objectif</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Progression</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Statut</th>
              <th className="p-4 text-sm font-medium text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  Aucune campagne trouvée.
                </td>
              </tr>
            ) : (
              campaigns.map((camp) => {
                const action = camp.campaign_actions?.[0];
                const target = action?.target_quantity || 1;
                const completed = action?.completed_quantity || 0;
                const progress = Math.min(100, Math.round((completed / target) * 100));

                return (
                  <tr key={camp.id} className="hover:bg-white/5">
                    <td className="p-4">
                      <p className="font-bold text-white capitalize">{action?.action_type || 'Engagement'} {camp.network}</p>
                      <p className="text-xs text-muted-foreground">Créé le {new Date(camp.created_at).toLocaleDateString()}</p>
                    </td>
                    <td className="p-4 text-white">{target} actions</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-tiktok-cyan" style={{ width: `${progress}%` }}></div>
                        </div>
                        <span className="text-xs text-white">{progress}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded capitalize ${camp.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/70'}`}>
                        {camp.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/client/campaigns/${camp.id}`}>
                        <Button size="sm" variant="outline" className="border-white/10 text-white">Détails</Button>
                      </Link>
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

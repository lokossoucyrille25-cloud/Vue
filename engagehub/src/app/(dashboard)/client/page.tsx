import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ClientDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch client profile ID
  const { data: clientProfile } = await supabase
    .from("client_profiles")
    .select("id")
    .eq("client_id", user.id)
    .single();

  // Fetch wallet for budget stats
  const { data: wallet } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Fetch campaigns
  let campaigns: any[] = [];
  if (clientProfile) {
    const { data } = await supabase
      .from("campaigns")
      .select("*")
      .eq("client_id", clientProfile.id)
      .order("created_at", { ascending: false })
      .limit(5);
    if (data) campaigns = data;
  }

  // Aggregate stats (simplified for now)
  const budgetConsumed = wallet?.escrow_balance || 0;
  const balance = wallet?.available_balance || 0;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Campagnes Créées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{campaigns.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Budget en cours (Escrow)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gradient-insta">{budgetConsumed} FCFA</div>
            <p className="text-xs text-muted-foreground mt-1">Sécurisé pour vos campagnes</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-white/10 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-brand-tiktok-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardHeader className="pb-2 relative">
            <CardTitle className="text-sm font-medium text-muted-foreground">Solde Disponible</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-2xl font-bold text-white">{balance} FCFA</div>
            <Link href="/wallet" className="text-xs text-brand-tiktok-cyan mt-1 hover:underline inline-block">Recharger mon compte</Link>
          </CardContent>
        </Card>
      </div>

      {/* Active Campaigns */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white/90">Dernières Campagnes</h3>
          <Link href="/client/campaigns/create">
            <Button size="sm" className="bg-gradient-insta border-0 text-white hover:opacity-90">Nouvelle Campagne</Button>
          </Link>
        </div>
        
        {campaigns.length === 0 ? (
          <div className="text-center py-12 bg-card/30 border border-white/5 rounded-xl">
            <p className="text-muted-foreground">Vous n'avez pas encore créé de campagne.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="bg-card/50 border-white/10 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-white">Campagne sur {campaign.network}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 uppercase tracking-wider text-white/80">{campaign.status}</span>
                  </div>
                  <a href={campaign.content_url} target="_blank" rel="noreferrer" className="text-sm text-brand-tiktok-cyan hover:underline truncate max-w-xs block mt-1">
                    {campaign.content_url}
                  </a>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="text-right">
                    <div className="text-sm font-bold text-white">{campaign.total_budget} FCFA</div>
                    <div className="text-xs text-muted-foreground">Budget total</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { WithdrawApproveButton } from "./WithdrawApproveButton";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch actual platform stats
  const { count: activeCampaignsCount } = await supabase
    .from("campaigns")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  const { count: pendingProofsCount } = await supabase
    .from("proofs")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  const { count: totalUsersCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  // Calculate total commissions (simplified MVP: querying all commission transactions)
  const { data: commissions } = await supabase
    .from("transactions")
    .select("amount")
    .eq("type", "commission");
    
  const totalCommissions = commissions?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

  // Fetch recent withdrawal requests
  const { data: withdrawals } = await supabase
    .from("transactions")
    .select("id, amount, wallets(user_id)")
    .eq("type", "withdrawal")
    .eq("status", "pending")
    .limit(5);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Administration</h1>
          <p className="text-muted-foreground">Vue d'ensemble de la plateforme.</p>
        </div>
        <Button variant="outline" className="border-brand-tiktok-pink text-brand-tiktok-pink hover:bg-brand-tiktok-pink/10">
          Générer un rapport
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Revenus (Commissions)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{totalCommissions} FCFA</div>
            <p className="text-xs text-muted-foreground mt-1">Total généré</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Campagnes Actives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activeCampaignsCount || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Preuves en attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-youtube">{pendingProofsCount || 0}</div>
            <p className="text-xs text-brand-youtube mt-1">Modération manuelle requise</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Utilisateurs Inscrits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalUsersCount || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-white">À vérifier en urgence (Litiges)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center pt-2">Aucun litige signalé.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-white">Demandes de retrait</CardTitle>
            <div className="flex gap-4">
              <a href="/admin/withdrawals" className="text-xs text-brand-tiktok-cyan hover:underline">
                Gérer les retraits
              </a>
              <a href="/admin/deposits" className="text-xs text-brand-tiktok-pink hover:underline">
                Valider les dépôts manuels
              </a>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!withdrawals || withdrawals.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center">Aucune demande en attente.</p>
              ) : (
                withdrawals.map((w) => (
                  <div key={w.id} className="p-3 bg-white/5 border border-white/5 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-white">Retrait #{w.id.substring(0,6)}</p>
                      <p className="text-xs text-muted-foreground mt-1">Demande: {w.amount} FCFA</p>
                    </div>
                    <WithdrawApproveButton transactionId={w.id} />
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
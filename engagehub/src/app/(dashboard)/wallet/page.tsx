import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function WalletPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch wallet
  const { data: wallet } = await supabase
    .from("wallets")
    .select("*")
    .eq("user_id", user.id)
    .single();
    
  const role = user.user_metadata?.role || "engageur";

  // Fetch transactions
  let transactions: any[] = [];
  if (wallet) {
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .eq("wallet_id", wallet.id)
      .order("created_at", { ascending: false })
      .limit(20);
    
    if (data) transactions = data;
  }

  const balance = wallet?.available_balance || 0;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Mon Portefeuille</h1>
        <p className="text-muted-foreground mt-1">Gérez votre solde et consultez vos transactions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-white/10 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-tiktok-cyan/10 rounded-full blur-[80px] -z-10"></div>
          <CardHeader>
            <CardTitle className="text-muted-foreground font-medium">Solde Actuel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-5xl font-bold text-white">
              {balance} <span className="text-2xl text-muted-foreground">FCFA</span>
            </div>
            <div className="flex gap-4">
              <Link href="/client/deposit" className="flex-1">
                <Button className="w-full bg-gradient-insta text-white border-0 hover:opacity-90">
                  Recharger
                </Button>
              </Link>
              {role !== "client" && (
                <Button variant="outline" className="flex-1 border-white/20 hover:bg-white/10 text-white">
                  Retirer
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-white/10 backdrop-blur-sm flex items-center justify-center p-6 text-center">
          <div>
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
              <span className="text-2xl">💳</span>
            </div>
            <h3 className="text-lg font-medium text-white">Moyens de paiement</h3>
            <p className="text-sm text-muted-foreground mt-2">Mobile Money et Cartes acceptés via Chariow.</p>
            <Button variant="link" className="text-brand-tiktok-cyan mt-2">Gérer mes moyens de paiement</Button>
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white mb-4">Historique des transactions</h2>
        <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
          {transactions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Aucune transaction pour le moment.
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {transactions.map((tx) => {
                const isPositive = ['deposit', 'reward', 'refund'].includes(tx.type);
                const color = isPositive ? "text-green-400" : "text-white";
                const sign = isPositive ? "+" : "-";

                return (
                  <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 ${color}`}>
                        {isPositive ? '↓' : '↑'}
                      </div>
                      <div>
                        <p className="font-medium text-white capitalize">{tx.type.replace('_', ' ')}</p>
                        <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${color}`}>{sign} {tx.amount} FCFA</p>
                      <p className="text-xs text-muted-foreground capitalize">{tx.status}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
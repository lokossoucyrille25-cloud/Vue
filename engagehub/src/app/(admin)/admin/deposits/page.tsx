import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { DepositActions } from "./DepositActions";

export default async function AdminDepositsPage() {
  const supabase = await createClient();

  const { data: deposits } = await supabase
    .from("transactions")
    .select("id, amount, status, created_at, wallets(profiles(phone, public_name))")
    .eq("type", "deposit")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Validation des Dépôts</h1>
        <p className="text-muted-foreground mt-1">Vérifiez les paiements Mobile Money et créditez les clients.</p>
      </div>

      <Card className="bg-card/50 border-white/10 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-4 text-sm font-medium text-muted-foreground">ID Transaction</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Client</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Montant</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Date</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Statut</th>
              <th className="p-4 text-sm font-medium text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {!deposits || deposits.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">Aucun dépôt trouvé.</td>
              </tr>
            ) : (
              deposits.map((d: any) => (
                <tr key={d.id} className="hover:bg-white/5">
                  <td className="p-4 text-white font-medium">#{d.id.substring(0, 8)}</td>
                  <td className="p-4">
                    <p className="font-medium text-white">{d.wallets?.profiles?.public_name || "Client"}</p>
                    <p className="text-xs text-muted-foreground">{d.wallets?.profiles?.phone || "Inconnu"}</p>
                  </td>
                  <td className="p-4 font-bold text-gradient-insta">{d.amount} FCFA</td>
                  <td className="p-4 text-muted-foreground">{new Date(d.created_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded capitalize ${d.status === 'completed' ? 'bg-green-500/20 text-green-400' : d.status === 'failed' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {d.status === 'pending' ? 'En attente' : d.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <DepositActions txId={d.id} currentStatus={d.status} amount={d.amount} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

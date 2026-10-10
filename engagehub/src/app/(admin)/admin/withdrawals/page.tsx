import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { WithdrawalActions } from "./WithdrawalActions";

export default async function AdminWithdrawalsPage() {
  const supabase = await createClient();

  const { data: withdrawals } = await supabase
    .from("transactions")
    .select("id, amount, status, created_at, wallets(profiles(phone, public_name))")
    .eq("type", "withdrawal")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Demandes de Retrait</h1>
        <p className="text-muted-foreground mt-1">Gérez et payez les engageurs.</p>
      </div>

      <Card className="bg-card/50 border-white/10 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-4 text-sm font-medium text-muted-foreground">ID Transaction</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Utilisateur (Tél)</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Montant</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Date</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Statut</th>
              <th className="p-4 text-sm font-medium text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {!withdrawals || withdrawals.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">Aucun retrait trouvé.</td>
              </tr>
            ) : (
              withdrawals.map((w: any) => (
                <tr key={w.id} className="hover:bg-white/5">
                  <td className="p-4 text-white font-medium">#{w.id.substring(0, 8)}</td>
                  <td className="p-4">
                    <p className="font-medium text-white">{w.wallets?.profiles?.phone || "Inconnu"}</p>
                    <p className="text-xs text-muted-foreground">{w.wallets?.profiles?.public_name}</p>
                  </td>
                  <td className="p-4 font-bold text-gradient-insta">{w.amount} FCFA</td>
                  <td className="p-4 text-muted-foreground">{new Date(w.created_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded capitalize ${w.status === 'completed' ? 'bg-green-500/20 text-green-400' : w.status === 'failed' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {w.status === 'pending' ? 'En attente' : w.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <WithdrawalActions txId={w.id} currentStatus={w.status} amount={w.amount} />
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

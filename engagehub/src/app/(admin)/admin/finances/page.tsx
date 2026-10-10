import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { WithdrawApproveButton } from "../WithdrawApproveButton";

export default async function AdminFinancesPage() {
  const supabase = await createClient();

  const { data: transactions } = await supabase
    .from("transactions")
    .select("id, type, amount, status, created_at, wallets(user_id)")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Finances & Retraits</h1>
        <p className="text-muted-foreground mt-1">Gérez les flux financiers de la plateforme.</p>
      </div>

      <Card className="bg-card/50 border-white/10 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-4 text-sm font-medium text-muted-foreground">ID Transaction</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Type</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Montant</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Date</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Statut</th>
              <th className="p-4 text-sm font-medium text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {!transactions || transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">Aucune transaction trouvée.</td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/5">
                  <td className="p-4 text-white font-medium">#{tx.id.substring(0, 8)}</td>
                  <td className="p-4 text-white capitalize">{tx.type.replace('_', ' ')}</td>
                  <td className="p-4 font-bold text-white">{tx.amount} FCFA</td>
                  <td className="p-4 text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded capitalize ${tx.status === 'completed' ? 'bg-green-500/20 text-green-400' : tx.status === 'failed' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {tx.type === 'withdrawal' && tx.status === 'pending' ? (
                      <div className="flex justify-end gap-2">
                        <WithdrawApproveButton 
                          transactionId={tx.id} 
                          className="border-green-500/50 text-green-400 hover:bg-green-500/10" 
                        />
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
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

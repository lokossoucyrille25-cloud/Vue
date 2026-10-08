import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function AdminProofsPage() {
  const supabase = await createClient();

  const { data: proofs } = await supabase
    .from("proofs")
    .select("id, status, proof_url, proof_type, created_at, tasks(campaign_actions(campaigns(network)))")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Validation des Preuves</h1>
        <p className="text-muted-foreground mt-1">Vérifiez les actions effectuées par les engageurs.</p>
      </div>

      <Card className="bg-card/50 border-white/10 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-4 text-sm font-medium text-muted-foreground">ID Preuve</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Type</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Lien / Fichier</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Date</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Statut</th>
              <th className="p-4 text-sm font-medium text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {!proofs || proofs.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">Aucune preuve trouvée.</td>
              </tr>
            ) : (
              proofs.map((proof) => (
                <tr key={proof.id} className="hover:bg-white/5">
                  <td className="p-4 text-white font-medium">#{proof.id.substring(0, 8)}</td>
                  <td className="p-4 text-white capitalize">{proof.proof_type}</td>
                  <td className="p-4">
                    <a href={proof.proof_url} target="_blank" rel="noreferrer" className="text-brand-tiktok-cyan hover:underline truncate max-w-xs block">
                      {proof.proof_url}
                    </a>
                  </td>
                  <td className="p-4 text-muted-foreground">{new Date(proof.created_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded capitalize ${proof.status === 'accepted' ? 'bg-green-500/20 text-green-400' : proof.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {proof.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" className="border-green-500/50 text-green-400 hover:bg-green-500/10">Valider</Button>
                      <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">Rejeter</Button>
                    </div>
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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDisputesPage() {
  const supabase = await createClient();

  const { data: disputes } = await supabase
    .from("disputes")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Gestion des Litiges</h1>
        <p className="text-muted-foreground mt-1">Résolvez les conflits entre clients et engageurs.</p>
      </div>

      <Card className="bg-card/50 border-white/10 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-4 text-sm font-medium text-muted-foreground">ID Litige</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Sujet</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Ouvert par</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Date</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Statut</th>
              <th className="p-4 text-sm font-medium text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {!disputes || disputes.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">Aucun litige en cours.</td>
              </tr>
            ) : (
              disputes.map((d) => (
                <tr key={d.id} className="hover:bg-white/5">
                  <td className="p-4 text-white font-medium">#{d.id.substring(0, 8)}</td>
                  <td className="p-4 text-white">{d.reason}</td>
                  <td className="p-4 text-muted-foreground">{d.reporter_id}</td>
                  <td className="p-4 text-muted-foreground">{new Date(d.created_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded capitalize ${d.status === 'resolved' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Button size="sm" variant="outline" className="border-white/10 text-white">Examiner</Button>
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

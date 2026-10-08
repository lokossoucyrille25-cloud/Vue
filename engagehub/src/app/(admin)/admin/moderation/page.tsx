import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function ModerationPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from("profiles")
    .select("id, phone, status, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Modération</h1>
        <p className="text-muted-foreground mt-1">Gérez les signalements et les profils en attente.</p>
      </div>

      <Card className="bg-card/50 border-white/10 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-4 text-sm font-medium text-muted-foreground">ID Utilisateur</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Téléphone</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Date d'inscription</th>
              <th className="p-4 text-sm font-medium text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {!users || users.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">Aucun profil en attente.</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-white/5">
                  <td className="p-4 text-white font-medium">#{u.id.substring(0, 8)}</td>
                  <td className="p-4 text-white">{u.phone || 'Non renseigné'}</td>
                  <td className="p-4 text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" className="border-green-500/50 text-green-400 hover:bg-green-500/10">Valider</Button>
                      <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">Bannir</Button>
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
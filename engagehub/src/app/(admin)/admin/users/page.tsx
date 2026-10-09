import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { UserActions } from "./UserActions";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from("profiles")
    .select("id, phone, roles, trust_level, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Utilisateurs</h1>
        <p className="text-muted-foreground mt-1">Gérez les comptes clients et engageurs.</p>
      </div>

      <Card className="bg-card/50 border-white/10 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-4 text-sm font-medium text-muted-foreground">Identifiant</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Rôles</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Confiance</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Date Inscription</th>
              <th className="p-4 text-sm font-medium text-muted-foreground">Statut</th>
              <th className="p-4 text-sm font-medium text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {!users || users.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">Aucun utilisateur trouvé.</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-white/5">
                  <td className="p-4">
                    <p className="font-medium text-white">{u.phone || u.id.substring(0, 8)}</p>
                  </td>
                  <td className="p-4 text-white">
                    {u.roles?.join(', ')}
                  </td>
                  <td className="p-4 text-white capitalize">{u.trust_level}</td>
                  <td className="p-4 text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded capitalize ${u.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <UserActions userId={u.id} currentStatus={u.status} />
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { DepositForm } from "./DepositForm";

export default async function DepositPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: wallet } = await supabase
    .from("wallets")
    .select("available_balance")
    .eq("user_id", user?.id)
    .single();

  return (
    <div className="p-6 lg:p-8 max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Recharger mon compte</h1>
        <p className="text-muted-foreground">Ajoutez des fonds pour financer vos campagnes.</p>
      </div>

      <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-white">Dépôt par Mobile Money ou Carte</CardTitle>
          <CardDescription>Solde actuel : <strong className="text-white">{wallet?.available_balance || 0} FCFA</strong></CardDescription>
        </CardHeader>
        <CardContent>
          <DepositForm />
        </CardContent>
      </Card>
    </div>
  );
}
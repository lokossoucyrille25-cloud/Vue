import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { WithdrawForm } from "./WithdrawForm";
import { redirect } from "next/navigation";

export default async function WithdrawPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: wallet } = await supabase
    .from("wallets")
    .select("available_balance")
    .eq("user_id", user.id)
    .single();

  const maxAmount = wallet?.available_balance || 0;

  return (
    <div className="p-6 lg:p-8 max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Retirer mes gains</h1>
        <p className="text-muted-foreground">Transférez votre solde disponible vers votre compte Mobile Money.</p>
      </div>

      <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-white">Nouvelle demande de retrait</CardTitle>
          <CardDescription>Solde disponible : <strong className="text-white">{maxAmount} FCFA</strong></CardDescription>
        </CardHeader>
        <CardContent>
          <WithdrawForm maxAmount={maxAmount} />
        </CardContent>
      </Card>
    </div>
  );
}

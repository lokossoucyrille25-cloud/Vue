import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export default async function DepositPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: wallet } = await supabase
    .from("wallets")
    .select("balance")
    .eq("user_id", user?.id)
    .single();

  async function handleDeposit(formData: FormData) {
    "use server";
    const amount = Number(formData.get("amount"));
    if (amount <= 0) return;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: wallet } = await supabase
      .from("wallets")
      .select("id, balance")
      .eq("user_id", user.id)
      .single();

    if (wallet) {
      // Simulate real deposit - insert transaction
      await supabase.from("transactions").insert({
        wallet_id: wallet.id,
        amount: amount,
        type: "deposit",
        status: "completed" // Direct completion for simulation
      });

      // Update wallet balance
      await supabase.from("wallets").update({
        balance: Number(wallet.balance) + amount
      }).eq("id", wallet.id);

      revalidatePath("/client/deposit");
      revalidatePath("/wallet");
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Recharger mon compte</h1>
        <p className="text-muted-foreground">Ajoutez des fonds pour financer vos campagnes.</p>
      </div>

      <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-white">Dépôt par Mobile Money ou Carte</CardTitle>
          <CardDescription>Solde actuel : <strong className="text-white">{wallet?.balance || 0} FCFA</strong></CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleDeposit} className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-white/90">Montant (FCFA)</label>
              <Input 
                name="amount"
                type="number"
                min="1000"
                placeholder="Ex: 5000" 
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 text-lg py-6"
                required
              />
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {[5000, 10000, 20000].map((amt) => (
                <div key={amt} className="border border-white/10 rounded-md p-3 text-center text-white bg-white/5 cursor-pointer hover:border-brand-tiktok-cyan/50 hover:bg-brand-tiktok-cyan/10 transition-colors">
                  {amt}
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-[#FF0050] to-[#00F2FE] text-white border-0 py-6 text-lg font-bold hover:opacity-90">
              Payer maintenant
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Les paiements sont sécurisés. Les fonds seront crédités instantanément.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
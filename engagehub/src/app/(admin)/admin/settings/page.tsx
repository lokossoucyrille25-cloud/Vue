import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  // Settings mock implementation as they might not have a dedicated table
  const platformSettings = {
    commission_rate: 15,
    min_withdrawal: 5000,
  };

  async function updateSettings(formData: FormData) {
    "use server";
    // Updates would go here
    revalidatePath("/admin/settings");
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Configuration de la Plateforme</h1>
        <p className="text-muted-foreground">Paramètres globaux, frais et règles système.</p>
      </div>

      <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-white">Frais & Commissions</CardTitle>
          <CardDescription>Configurez les marges prises sur chaque campagne.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateSettings} className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-white/90">Commission Globale (%)</label>
              <Input 
                name="commission_rate"
                type="number"
                defaultValue={platformSettings.commission_rate}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-white/90">Montant Minimum de Retrait (FCFA)</label>
              <Input 
                name="min_withdrawal"
                type="number"
                defaultValue={platformSettings.min_withdrawal}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <Button type="submit" className="bg-gradient-insta text-white border-0 hover:opacity-90">
              Enregistrer les modifications
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
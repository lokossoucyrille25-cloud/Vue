import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export default async function PublicProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("client_profiles")
    .select("*")
    .eq("client_id", user.id)
    .single();

  async function updateProfile(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const public_name = formData.get("public_name") as string;
    const description = formData.get("description") as string;
    const is_visible = formData.get("is_visible") === "on";

    const { data: existingProfile } = await supabase
      .from("client_profiles")
      .select("id")
      .eq("client_id", user.id)
      .single();

    if (existingProfile) {
      await supabase
        .from("client_profiles")
        .update({ public_name, description, is_visible })
        .eq("client_id", user.id);
    } else {
      await supabase
        .from("client_profiles")
        .insert({ client_id: user.id, public_name, description, is_visible });
    }
    revalidatePath("/client/public-profile");
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Mon Profil Public</h1>
        <p className="text-muted-foreground">Configurez la façon dont les engageurs vous perçoivent.</p>
      </div>

      <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-white">Informations Publiques</CardTitle>
          <CardDescription>Ces informations sont affichées dans l'annuaire des clients.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateProfile} className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-white/90">Nom Public / Nom de Marque</label>
              <Input 
                name="public_name"
                defaultValue={profile?.public_name || ""}
                placeholder="Ex: Ma Marque" 
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                required
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-white/90">Description</label>
              <Textarea 
                name="description"
                defaultValue={profile?.description || ""}
                placeholder="Parlez de votre marque ou de vos objectifs..." 
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[100px]"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                name="is_visible" 
                id="is_visible"
                defaultChecked={profile?.is_visible || false}
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-brand-tiktok-cyan focus:ring-brand-tiktok-cyan focus:ring-offset-background"
              />
              <label htmlFor="is_visible" className="text-sm font-medium leading-none text-white/90 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Rendre mon profil visible dans l'annuaire des engageurs
              </label>
            </div>
            <Button type="submit" className="w-full sm:w-auto bg-gradient-insta text-white border-0 hover:opacity-90">
              Mettre à jour le profil
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
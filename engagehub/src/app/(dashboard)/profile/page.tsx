import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  async function updateProfile(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    // Simplification for now
    revalidatePath("/profile");
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Mon Compte</h1>
        <p className="text-muted-foreground">Gérez vos informations personnelles et vos paramètres de sécurité.</p>
      </div>

      <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-white">Informations Personnelles</CardTitle>
          <CardDescription>Ces informations sont privées.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateProfile} className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-white/90">Email</label>
              <Input 
                value={user.email || ""} 
                disabled 
                className="bg-white/5 border-white/10 text-white opacity-50"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-white/90">Téléphone</label>
              <Input 
                name="phone"
                defaultValue={profile?.phone || ""}
                placeholder="+221 XX XXX XX XX" 
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <Button type="submit" className="w-full sm:w-auto bg-gradient-insta text-white border-0 hover:opacity-90">
              Mettre à jour
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
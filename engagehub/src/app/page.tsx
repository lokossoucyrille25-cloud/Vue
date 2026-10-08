import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let dashboardPath = "/login";
  let isLogged = false;

  if (user) {
    isLogged = true;
    const { data: profile } = await supabase
      .from('profiles')
      .select('roles')
      .eq('id', user.id)
      .single();

    if (profile?.roles?.includes('admin')) dashboardPath = "/admin";
    else if (profile?.roles?.includes('client')) dashboardPath = "/client";
    else dashboardPath = "/engageur";
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-tiktok-cyan/20 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-tiktok-pink/20 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-insta-purple/10 rounded-full blur-[150px] -z-10"></div>

      <div className="max-w-3xl space-y-6">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
          Bienvenue sur <br />
          <span className="text-transparent bg-clip-text bg-gradient-insta">
            Boostify
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          La plateforme qui connecte les créateurs de contenus et les marques avec de vrais utilisateurs pour booster votre visibilité en Afrique francophone.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          {isLogged ? (
            <Link href={dashboardPath}>
              <Button size="lg" className="w-full sm:w-auto bg-gradient-insta text-white border-0 hover:opacity-90 px-8 h-12 text-lg">
                Accéder au Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-insta text-white border-0 hover:opacity-90 px-8 h-12 text-lg">
                  S'inscrire
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20 hover:bg-white/5 h-12 text-lg">
                  Connexion
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl text-left">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-full bg-brand-tiktok-cyan/20 flex items-center justify-center mb-4">
            <span className="text-brand-tiktok-cyan text-xl">📱</span>
          </div>
          <h3 className="text-white font-medium text-lg">Pour les Créateurs</h3>
          <p className="text-sm text-muted-foreground mt-2">Achetez des vues, likes et abonnements réels pour booster votre croissance.</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-full bg-brand-insta-purple/20 flex items-center justify-center mb-4">
            <span className="text-brand-insta-pink text-xl">💸</span>
          </div>
          <h3 className="text-white font-medium text-lg">Pour les Engageurs</h3>
          <p className="text-sm text-muted-foreground mt-2">Gagnez de l'argent depuis votre téléphone en réalisant de simples tâches.</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-full bg-brand-facebook/20 flex items-center justify-center mb-4">
            <span className="text-brand-facebook text-xl">🔒</span>
          </div>
          <h3 className="text-white font-medium text-lg">100% Sécurisé</h3>
          <p className="text-sm text-muted-foreground mt-2">Paiements garantis par Chariow et système anti-fraude intégré.</p>
        </div>
      </div>
    </div>
  );
}

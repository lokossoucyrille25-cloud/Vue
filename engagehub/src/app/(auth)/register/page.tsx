"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [role, setRole] = useState<"client" | "engageur">("engageur");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: role,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Create profile manually (since we don't have a trigger yet)
        const { error: profileError } = await supabase.from('profiles').insert({
          id: authData.user.id,
          phone: null, // can be added later
          roles: [role],
        });
        
        if (profileError && profileError.code !== '23505') {
           // Ignore duplicate key error in case they ran a trigger
           console.error("Profile error:", profileError);
        }

        // 3. Create wallet
        await supabase.from('wallets').insert({
          user_id: authData.user.id,
          available_balance: 0,
        });

        // 4. Create specific profile
        if (role === 'client') {
          await supabase.from('client_profiles').insert({
            client_id: authData.user.id,
            public_name: name,
          });
        } else {
          // Engageur
          await supabase.from('social_accounts').insert({
            user_id: authData.user.id,
            network: 'tiktok', // default
            username: name,
          });
        }

        // Redirect based on role
        router.push(role === "client" ? "/client" : "/engageur");
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-insta-purple/20 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-youtube/20 rounded-full blur-[100px] -z-10"></div>

      <Link href="/" className="absolute top-8 left-8">
        <Button variant="ghost" className="text-muted-foreground hover:text-white">
          ← Retour à l'accueil
        </Button>
      </Link>

      <Card className="w-full max-w-md bg-card/50 border-white/10 backdrop-blur-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Créer un compte</CardTitle>
          <CardDescription className="text-muted-foreground">
            Rejoignez Boostify en tant que client ou engageur.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => setRole("client")}
                className={`border-brand-tiktok-cyan/50 text-white ${role === "client" ? "bg-brand-tiktok-cyan/20" : "bg-white/5 hover:bg-brand-tiktok-cyan/10"}`}
              >
                Client
              </Button>
              <Button 
                type="button"
                variant="outline" 
                onClick={() => setRole("engageur")}
                className={`border-brand-insta-purple text-white ${role === "engageur" ? "bg-brand-insta-purple/40" : "bg-brand-insta-purple/10 hover:bg-brand-insta-purple/30"}`}
              >
                Engageur
              </Button>
            </div>
            
            <div className="space-y-2 pt-2">
              <label htmlFor="name" className="text-sm font-medium text-white/90">Nom complet ou Pseudo</label>
              <Input 
                id="name" 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === "client" ? "Nom de votre boutique" : "Votre pseudo"} 
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30" 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-white/90">Email</label>
              <Input 
                id="email" 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com" 
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30" 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-white/90">Mot de passe</label>
              <Input 
                id="password" 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/10 text-white" 
              />
            </div>
            
            {error && <p className="text-red-400 text-sm font-medium">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full bg-gradient-insta text-white border-0 hover:opacity-90 h-11 mt-4">
              {loading ? "Création en cours..." : "Créer mon compte"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-center">
          <div className="text-xs text-muted-foreground">
            En vous inscrivant, vous acceptez nos <Link href="/terms" className="underline hover:text-white">Conditions d'utilisation</Link> et notre <Link href="/privacy" className="underline hover:text-white">Politique de confidentialité</Link>.
          </div>
          <div className="text-sm text-muted-foreground border-t border-white/10 pt-4 w-full">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-brand-tiktok-cyan hover:underline font-medium">
              Se connecter
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.user) {
        // Fetch role to redirect
        const { data: profile } = await supabase
          .from('profiles')
          .select('roles')
          .eq('id', data.user.id)
          .single();

        const isClient = profile?.roles?.includes('client');
        router.push(isClient ? "/client" : "/engageur");
      }
    } catch (err: any) {
      const msg = err.message === "Invalid login credentials" ? "Identifiants incorrects." : err.message;
      setError(msg || "Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-tiktok-cyan/20 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-tiktok-pink/20 rounded-full blur-[100px] -z-10"></div>

      <Link href="/" className="absolute top-8 left-8">
        <Button variant="ghost" className="text-muted-foreground hover:text-white">
          ← Retour à l'accueil
        </Button>
      </Link>

      <Card className="w-full max-w-md bg-card/50 border-white/10 backdrop-blur-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Connexion</CardTitle>
          <CardDescription className="text-muted-foreground">
            Entrez vos identifiants pour accéder à votre espace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-white/90">Mot de passe</label>
                <Link href="/forgot-password" className="text-xs text-brand-tiktok-cyan hover:underline">
                  Oublié ?
                </Link>
              </div>
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

            <Button type="submit" disabled={loading} className="w-full bg-gradient-insta text-white border-0 hover:opacity-90 h-11 mt-2">
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-center">
          <div className="text-sm text-muted-foreground border-t border-white/10 pt-4 w-full">
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-brand-tiktok-cyan hover:underline font-medium">
              S'inscrire
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
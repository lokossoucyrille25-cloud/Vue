"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (resetError) throw resetError;

      setMessage("Un email de réinitialisation vous a été envoyé.");
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-twitter/20 rounded-full blur-[100px] -z-10"></div>
      
      <Link href="/login" className="absolute top-8 left-8">
        <Button variant="ghost" className="text-muted-foreground hover:text-white">
          ← Retour à la connexion
        </Button>
      </Link>

      <Card className="w-full max-w-md bg-card/50 border-white/10 backdrop-blur-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Mot de passe oublié</CardTitle>
          <CardDescription className="text-muted-foreground">
            Entrez votre email pour réinitialiser votre mot de passe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleReset} className="space-y-4">
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

            {error && <p className="text-red-400 text-sm font-medium text-center">{error}</p>}
            {message && <p className="text-green-400 text-sm font-medium text-center">{message}</p>}

            <Button type="submit" disabled={loading} className="w-full bg-gradient-insta text-white border-0 hover:opacity-90 h-11 mt-2">
              {loading ? "Envoi..." : "Envoyer le lien"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

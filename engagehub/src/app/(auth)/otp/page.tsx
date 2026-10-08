"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export default function OTPPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });

      if (verifyError) throw verifyError;

      router.push("/client"); // Or /engageur depending on logic
    } catch (err: any) {
      setError(err.message || "Code invalide.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-facebook/20 rounded-full blur-[100px] -z-10"></div>
      
      <Link href="/login" className="absolute top-8 left-8">
        <Button variant="ghost" className="text-muted-foreground hover:text-white">
          ← Retour
        </Button>
      </Link>

      <Card className="w-full max-w-md bg-card/50 border-white/10 backdrop-blur-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Vérification</CardTitle>
          <CardDescription className="text-muted-foreground">
            Entrez votre email et le code reçu.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
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
              <label htmlFor="otp" className="text-sm font-medium text-white/90">Code OTP</label>
              <Input 
                id="otp" 
                type="text" 
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456" 
                className="bg-white/5 border-white/10 text-white text-center tracking-[1em] font-bold text-lg" 
                maxLength={6}
              />
            </div>

            {error && <p className="text-red-400 text-sm font-medium text-center">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full bg-gradient-insta text-white border-0 hover:opacity-90 h-11 mt-2">
              {loading ? "Vérification..." : "Valider"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
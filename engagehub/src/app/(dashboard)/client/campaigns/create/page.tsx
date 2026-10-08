"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function CreateCampaignPage() {
  const [platform, setPlatform] = useState("TikTok");
  const [actionType, setActionType] = useState("likes");
  const [url, setUrl] = useState("");
  const [quantity, setQuantity] = useState(100);
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const router = useRouter();
  const supabase = createClient();
  
  // Base price per action (example: 10 FCFA per like/view)
  const estimatedPrice = quantity * 10;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      // Ensure profiles and wallets exist just in case (fallback)
      await supabase.from('profiles').upsert({ id: user.id, roles: ['client'] });
      await supabase.from('wallets').upsert({ user_id: user.id, available_balance: 0 });

      let { data: clientProfile, error: profileError } = await supabase
        .from('client_profiles')
        .select('id')
        .eq('client_id', user.id)
        .maybeSingle();
        
      if (profileError) {
        console.error("Profile Error Details:", profileError);
        throw new Error(`Erreur lors de la lecture du profil: ${profileError.message}`);
      }
      
      if (!clientProfile) {
        const { data: newProfile, error: createError } = await supabase
          .from('client_profiles')
          .insert({ client_id: user.id, public_name: 'Mon compte Client' })
          .select('id')
          .single();
          
        if (createError) throw new Error("Impossible de créer le profil client: " + createError.message);
        clientProfile = newProfile;
      }

      // 1. Create Campaign
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .insert({
          client_id: clientProfile.id,
          network: platform,
          content_url: url,
          total_budget: estimatedPrice,
          status: 'active'
        })
        .select()
        .single();

      if (campaignError) throw campaignError;

      // 2. Create Campaign Action
      const { error: actionError } = await supabase
        .from('campaign_actions')
        .insert({
          campaign_id: campaign.id,
          action_type: actionType,
          target_quantity: quantity,
          unit_price: 10,
          unit_reward: 8, // The engageur gets 8 FCFA, Boostify keeps 2 FCFA
          guidelines: instructions
        });

      if (actionError) throw actionError;

      // Deduct from wallet (simplified for MVP)
      const { data: wallet } = await supabase
        .from('wallets')
        .select('available_balance, escrow_balance')
        .eq('user_id', user.id)
        .single();

      if (wallet) {
        await supabase
          .from('wallets')
          .update({
            available_balance: wallet.available_balance - estimatedPrice,
            escrow_balance: wallet.escrow_balance + estimatedPrice
          })
          .eq('user_id', user.id);
      }

      router.push("/client/campaigns");
      router.refresh();

    } catch (err: any) {
      setError(err.message || "Erreur lors de la création de la campagne");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Créer une campagne</h1>
        <p className="text-muted-foreground">Configurez votre nouvelle campagne d'engagement.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-white">Détails de la campagne</CardTitle>
              <CardDescription>Sélectionnez la plateforme et l'objectif.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-3">
                <label className="text-sm font-medium text-white/90">Plateforme cible</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['TikTok', 'Instagram', 'YouTube', 'Facebook'].map((p) => (
                    <div 
                      key={p}
                      onClick={() => setPlatform(p)}
                      className={`cursor-pointer rounded-lg border p-4 flex flex-col items-center justify-center transition-all ${
                        platform === p 
                          ? 'bg-brand-tiktok-cyan/20 border-brand-tiktok-cyan text-white' 
                          : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10'
                      }`}
                    >
                      <span className="font-medium">{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-white/90">Type d'engagement</label>
                <Select value={actionType} onValueChange={setActionType}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-white/10 text-white">
                    <SelectItem value="likes">Likes / J'aime</SelectItem>
                    <SelectItem value="followers">Abonnés / Followers</SelectItem>
                    <SelectItem value="views">Vues de vidéo</SelectItem>
                    <SelectItem value="comments">Commentaires personnalisés</SelectItem>
                    <SelectItem value="shares">Partages</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-white/90">Lien (URL)</label>
                <Input 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.tiktok.com/@votre_compte/video/..." 
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
                <p className="text-xs text-muted-foreground">Assurez-vous que le lien est public.</p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-white/90">Quantité souhaitée</label>
                <Input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min={50}
                  step={50}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-white/90">Instructions spécifiques (Optionnel)</label>
                <Textarea 
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Ex: Laissez des commentaires du type 'Super vidéo !' ou 'J'adore ton style'." 
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[100px]"
                />
              </div>

              {error && <p className="text-red-400 text-sm font-medium">{error}</p>}

            </CardContent>
          </Card>
        </div>

        {/* Recap sidebar */}
        <div className="space-y-6">
          <Card className="bg-card/50 border-brand-tiktok-pink/30 backdrop-blur-sm sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg text-white">Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Plateforme</span>
                <span className="text-white font-medium">{platform || "-"}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Action</span>
                <span className="text-white font-medium">{actionType}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Quantité</span>
                <span className="text-white font-medium">{quantity}</span>
              </div>
              <div className="border-t border-white/10 my-4 pt-4 flex justify-between items-center">
                <span className="text-white font-medium">Prix estimé</span>
                <span className="text-2xl font-bold text-gradient-insta">{estimatedPrice} FCFA</span>
              </div>
              
              <Button 
                onClick={handleSubmit} 
                disabled={loading || !url} 
                className="w-full bg-gradient-insta text-white border-0 hover:opacity-90 mt-4"
              >
                {loading ? "Création en cours..." : "Lancer la campagne"}
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Le montant sera déduit de votre portefeuille et mis en séquestre.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
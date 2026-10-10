import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function ClientDirectoryPage() {
  const supabase = await createClient();

  // Fetch all engageur profiles
  const { data: engageurs } = await supabase
    .from("profiles")
    .select("id, phone, trust_level, status")
    .contains("roles", ["engageur"])
    .eq("status", "active");

  // Fetch all rated proofs to calculate trust scores
  const { data: ratedProofs } = await supabase
    .from("proofs")
    .select("rating, tasks!inner(engageur_id)")
    .not("rating", "is", null)
    .gt("rating", 0);

  // Calculate average rating per engageur
  const engageurRatings: Record<string, { total: number, count: number }> = {};
  if (ratedProofs) {
    ratedProofs.forEach((p: any) => {
      const eId = p.tasks?.engageur_id;
      if (eId && p.rating) {
        if (!engageurRatings[eId]) engageurRatings[eId] = { total: 0, count: 0 };
        engageurRatings[eId].total += p.rating;
        engageurRatings[eId].count += 1;
      }
    });
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Annuaire des Engageurs</h1>
          <p className="text-muted-foreground mt-1">Découvrez les meilleurs profils pour exécuter vos campagnes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {!engageurs || engageurs.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-card/30 border border-white/5 rounded-xl">
            Aucun engageur n'est disponible pour le moment.
          </div>
        ) : (
          engageurs.map((engageur) => {
            const stats = engageurRatings[engageur.id];
            const avgRating = stats ? (stats.total / stats.count).toFixed(1) : "Nouveau";
            const reviewCount = stats ? stats.count : 0;
            
            return (
              <Card key={engageur.id} className="bg-card/50 border-white/10 hover:border-brand-tiktok-cyan/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-tiktok-cyan to-brand-tiktok-pink p-[2px]">
                      <div className="w-full h-full bg-background rounded-full flex items-center justify-center font-bold text-white">
                        {engageur.phone ? engageur.phone.substring(0, 2) : "EN"}
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-lg text-white">
                        {engageur.phone ? `+${engageur.phone.substring(0, 5)}...` : `Engageur #${engageur.id.substring(0,4)}`}
                      </CardTitle>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-yellow-400 text-sm">★</span>
                        <span className="text-sm font-medium text-white">{avgRating}</span>
                        {reviewCount > 0 && <span className="text-xs text-muted-foreground">({reviewCount} avis)</span>}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className={`px-2 py-1 text-xs rounded capitalize ${engageur.trust_level === 'high' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      Fiabilité : {engageur.trust_level}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <a href={`/client/directory/${engageur.id}`} className="flex-1">
                      <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-0">
                        Voir Profil
                      </Button>
                    </a>
                    <Button variant="outline" className="flex-1 border-white/10 text-white hover:bg-brand-tiktok-cyan/10 hover:text-brand-tiktok-cyan hover:border-brand-tiktok-cyan/30">
                      Inviter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

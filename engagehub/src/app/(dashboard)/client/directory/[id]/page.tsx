import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function EngageurProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, phone, trust_level, status, created_at")
    .eq("id", resolvedParams.id)
    .single();

  if (!profile) return <div className="p-8 text-white">Profil introuvable</div>;

  const { data: proofs } = await supabase
    .from("proofs")
    .select("rating, created_at, tasks(campaign_actions(action_type, campaigns(network)))")
    .eq("tasks.engageur_id", resolvedParams.id)
    .not("rating", "is", null);

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Profil de l'Engageur</h1>
          <p className="text-muted-foreground mt-1">Détails et historique de fiabilité.</p>
        </div>
        <Button className="bg-gradient-insta text-white border-0">Inviter à une campagne</Button>
      </div>

      <Card className="bg-card/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-xl text-white">Informations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Téléphone Masqué</p>
              <p className="text-lg font-bold text-white">{profile.phone ? `+${profile.phone.substring(0, 5)}...` : 'Non renseigné'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Niveau de confiance</p>
              <p className="text-lg font-bold text-gradient-insta capitalize">{profile.trust_level}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Inscrit depuis</p>
              <p className="text-lg font-bold text-white">{new Date(profile.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Historique des missions</h2>
      {!proofs || proofs.length === 0 ? (
        <p className="text-muted-foreground bg-white/5 p-4 rounded-lg">Aucune mission notée pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {proofs.map((p: any, i) => (
            <Card key={i} className="bg-card/50 border-white/10">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white capitalize">{p.tasks?.campaign_actions?.campaigns?.network} - {p.tasks?.campaign_actions?.action_type}</p>
                  <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-lg font-bold text-white">{p.rating} / 5</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

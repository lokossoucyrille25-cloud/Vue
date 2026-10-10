import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { FollowButton } from "./FollowButton";

export default async function ClientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();

  const { data: client } = await supabase
    .from("client_profiles")
    .select("*, client_id")
    .eq("id", resolvedParams.id)
    .single();

  if (!client) return <div className="p-8 text-white">Profil client introuvable</div>;

  // Récupérer les campagnes actives du client
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("network, content_url, created_at, status")
    .eq("client_id", client.client_id)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{client.public_name}</h1>
          <p className="text-muted-foreground mt-1">Client Vérifié</p>
        </div>
        <FollowButton clientId={client.client_id} />
      </div>

      <Card className="bg-card/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-xl text-white">À propos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            {client.description || "Aucune description fournie par ce client."}
          </p>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Campagnes actives</h2>
      {!campaigns || campaigns.length === 0 ? (
        <p className="text-muted-foreground bg-white/5 p-4 rounded-lg">Ce client n'a aucune campagne active pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((camp: any, i) => (
            <Card key={i} className="bg-card/50 border-white/10 hover:border-brand-tiktok-cyan/30 transition-colors">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-white capitalize">{camp.network}</p>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded uppercase">
                    {camp.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">{camp.content_url}</p>
                <div className="pt-2">
                  <a href="/engageur">
                    <Button variant="outline" size="sm" className="w-full border-white/10 text-white hover:bg-brand-tiktok-cyan/20">
                      Voir dans les missions
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

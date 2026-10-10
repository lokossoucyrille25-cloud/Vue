import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { FollowButton } from "./[id]/FollowButton";

export default async function EngageurDirectoryPage() {
  const supabase = await createClient();

  // Fetch all visible client profiles
  const { data: clients } = await supabase
    .from("client_profiles")
    .select("id, client_id, public_name, description, is_visible")
    .eq("is_visible", true)
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Annuaire des Clients</h1>
          <p className="text-muted-foreground mt-1">Découvrez les marques et créateurs qui proposent des campagnes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {!clients || clients.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-card/30 border border-white/5 rounded-xl">
            Aucun client n'est visible pour le moment.
          </div>
        ) : (
          clients.map((client) => (
            <Card key={client.id} className="bg-card/50 border-white/10 hover:border-brand-tiktok-pink/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-tiktok-cyan to-brand-tiktok-pink p-[2px]">
                    <div className="w-full h-full bg-background rounded-full flex items-center justify-center font-bold text-white">
                      {client.public_name.substring(0, 2).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-lg text-white">{client.public_name}</CardTitle>
                    <p className="text-xs text-muted-foreground">Client Vérifié</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {client.description || "Aucune description fournie par ce client."}
                </p>
                <div className="flex gap-2">
                  <a href={`/engageur/directory/${client.id}`} className="flex-1">
                    <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-0">
                      Voir Profil
                    </Button>
                  </a>
                  <div className="flex-1">
                    <FollowButton clientId={client.client_id} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
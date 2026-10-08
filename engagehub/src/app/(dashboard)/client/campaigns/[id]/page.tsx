import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function CampaignDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select(`
      id, title, network, content_url, status, total_budget,
      campaign_actions ( id, action_type, quantity, unit_reward )
    `)
    .eq("id", params.id)
    .single();

  if (!campaign) {
    return <div className="p-8 text-white">Campagne introuvable.</div>;
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Détails de la campagne</h1>
        <p className="text-muted-foreground">ID: {campaign.id}</p>
      </div>

      <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-white">{campaign.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-white">
          <p><strong>Réseau:</strong> <span className="capitalize">{campaign.network}</span></p>
          <p><strong>Statut:</strong> <span className="capitalize">{campaign.status}</span></p>
          <p><strong>Budget total:</strong> {campaign.total_budget} FCFA</p>
          <p><strong>Lien:</strong> <a href={campaign.content_url} target="_blank" className="text-brand-tiktok-cyan hover:underline">{campaign.content_url}</a></p>
          
          <h3 className="text-lg font-bold mt-6 mb-2">Actions demandées</h3>
          <div className="space-y-2">
            {campaign.campaign_actions?.map((action: any) => (
              <div key={action.id} className="p-3 bg-white/5 border border-white/10 rounded flex justify-between">
                <span className="capitalize">{action.action_type}</span>
                <span>{action.quantity} demandés - {action.unit_reward} FCFA / action</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
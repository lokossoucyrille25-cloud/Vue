import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { CloseCampaignButton } from "../CloseCampaignButton";
import { ReportProofButton } from "../ReportProofButton";
import { RateProofStars } from "../RateProofStars";

export default async function CampaignDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();

  const { data: campaign, error } = await supabase
    .from("campaigns")
    .select(`
      id, network, content_url, status, total_budget,
      campaign_actions ( id, action_type, target_quantity, unit_reward ),
      tasks ( id, status, proofs ( id, proof_url, status, created_at, rating ) )
    `)
    .eq("id", resolvedParams.id)
    .single();

  if (error) {
    console.error("Campaign details fetch error:", error);
  }

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
          <CardTitle className="text-xl text-white capitalize">Campagne {campaign.network}</CardTitle>
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
                <span>{action.target_quantity} demandés - {action.unit_reward} FCFA / action</span>
              </div>
            ))}
          </div>
          
          {campaign.status === "active" && (
            <div className="pt-4 border-t border-white/10 mt-4">
              <CloseCampaignButton campaignId={campaign.id} />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-4">Preuves soumises</h2>
        <div className="bg-card/50 border border-white/10 rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="p-4 font-medium text-muted-foreground">ID Tâche</th>
                <th className="p-4 font-medium text-muted-foreground">Lien/Fichier</th>
                <th className="p-4 font-medium text-muted-foreground">Statut</th>
                <th className="p-4 font-medium text-muted-foreground">Date</th>
                <th className="p-4 font-medium text-muted-foreground">Note</th>
                <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {campaign.tasks && campaign.tasks.length > 0 ? (
                campaign.tasks.flatMap((task: any) => 
                  task.proofs ? task.proofs.map((proof: any) => (
                    <tr key={proof.id} className="hover:bg-white/5 text-white">
                      <td className="p-4 text-sm">{task.id.slice(0,8)}...</td>
                      <td className="p-4">
                        <a href={proof.proof_url} target="_blank" className="text-brand-tiktok-cyan hover:underline text-sm truncate max-w-[200px] block">
                          Voir la preuve
                        </a>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs capitalize ${
                          proof.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                          proof.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                          proof.status === 'disputed' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {proof.status === 'pending' ? 'En attente' : proof.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(proof.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        {proof.status === 'accepted' ? (
                          <RateProofStars proofId={proof.id} currentRating={proof.rating} />
                        ) : (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {(proof.status === 'accepted' || proof.status === 'pending') && (
                          <ReportProofButton proofId={proof.id} />
                        )}
                      </td>
                    </tr>
                  )) : []
                )
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">Aucune preuve soumise pour le moment.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
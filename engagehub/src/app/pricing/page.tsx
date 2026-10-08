import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="max-w-5xl mx-auto p-6 lg:p-12">
        <header className="flex justify-between items-center mb-16">
          <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-insta">
            Boostify
          </Link>
          <Link href="/register"><Button className="bg-white/10 text-white hover:bg-white/20">S'inscrire</Button></Link>
        </header>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white">Tarifs des Campagnes</h1>
          <p className="text-muted-foreground mt-4">Payez uniquement pour des résultats réels. 100% de vrais utilisateurs.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { platform: "TikTok", actions: [{name: "Abonnement", price: "25"}, {name: "Like", price: "15"}, {name: "Commentaire", price: "40"}], color: "text-brand-tiktok-cyan" },
            { platform: "Instagram", actions: [{name: "Abonnement", price: "30"}, {name: "Like", price: "20"}, {name: "Commentaire", price: "50"}], color: "text-brand-tiktok-pink" },
            { platform: "YouTube", actions: [{name: "Abonnement", price: "50"}, {name: "Vue (1min)", price: "25"}, {name: "Commentaire", price: "60"}], color: "text-red-500" },
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-xl bg-card/50 border border-white/10 backdrop-blur-sm">
              <h3 className={`text-2xl font-bold mb-6 ${item.color}`}>{item.platform}</h3>
              <ul className="space-y-4">
                {item.actions.map((act, j) => (
                  <li key={j} className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-white/80">{act.name}</span>
                    <span className="font-bold text-white">{act.price} FCFA</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-8 bg-white/5 hover:bg-white/10 text-white border border-white/10">Créer une campagne</Button>
            </div>
          ))}
        </div>
        
        <p className="text-center text-sm text-muted-foreground mt-12">
          * Les prix affichés sont ceux payés par le client. L'engageur reçoit une part après déduction de la commission de la plateforme.
        </p>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background p-6 lg:p-12">
      <Link href="/">
        <Button variant="ghost" className="text-muted-foreground hover:text-white mb-8">
          ← Retour à l'accueil
        </Button>
      </Link>
      
      <div className="max-w-3xl mx-auto space-y-8 text-white/90">
        <h1 className="text-4xl font-bold text-white">Conditions d'utilisation</h1>
        <p className="text-muted-foreground">Dernière mise à jour : 07 Octobre 2026</p>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Acceptation des conditions</h2>
            <p>En utilisant EngageHub, vous acceptez d'être lié par ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">2. Description du service</h2>
            <p>EngageHub est une plateforme de mise en relation permettant aux créateurs (Clients) d'acheter de l'engagement (likes, vues, abonnements) réalisé par de vrais utilisateurs (Engageurs) contre une rémunération.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Règles de conduite</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Les bots et l'automatisation sont strictement interdits.</li>
              <li>Les fausses preuves entraîneront un bannissement immédiat.</li>
              <li>Le contenu illégal ou haineux ne peut pas faire l'objet d'une campagne.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
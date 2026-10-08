import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background p-6 lg:p-12">
      <Link href="/">
        <Button variant="ghost" className="text-muted-foreground hover:text-white mb-8">
          ← Retour à l'accueil
        </Button>
      </Link>
      
      <div className="max-w-3xl mx-auto space-y-8 text-white/90">
        <h1 className="text-4xl font-bold text-white">Politique de confidentialité</h1>
        <p className="text-muted-foreground">Dernière mise à jour : 07 Octobre 2026</p>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Collecte des données</h2>
            <p>Nous collectons uniquement les informations nécessaires au fonctionnement du service : numéro de téléphone, email, pseudos sur les réseaux sociaux, et historiques de transactions financières.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">2. Utilisation des données</h2>
            <p>Vos données servent exclusivement à :</p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground mt-2">
              <li>Valider vos tâches et transferts d'argent.</li>
              <li>Assurer la sécurité et lutter contre la fraude.</li>
              <li>Améliorer l'expérience utilisateur.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Partage des données</h2>
            <p>Nous ne vendons pas vos données. Vos informations de paiement sont traitées de manière sécurisée par notre partenaire financier Chariow et ne transitent pas en clair sur nos serveurs.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
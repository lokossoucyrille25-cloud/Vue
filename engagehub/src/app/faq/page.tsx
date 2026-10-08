import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background p-6 lg:p-12">
      <Link href="/">
        <Button variant="ghost" className="text-muted-foreground hover:text-white mb-8">
          ← Retour à l'accueil
        </Button>
      </Link>
      
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-white text-center">Foire Aux Questions</h1>
        <p className="text-center text-muted-foreground">Tout ce que vous devez savoir sur EngageHub.</p>
        
        <div className="space-y-4 mt-8">
          {[
            { q: "Comment gagner de l'argent ?", a: "Créez un compte Engageur, consultez les tâches disponibles et soumettez des preuves (captures d'écran) une fois la tâche réalisée." },
            { q: "Quels sont les moyens de paiement ?", a: "Nous utilisons Chariow pour traiter les paiements par Mobile Money et Cartes Bancaires." },
            { q: "Combien de temps dure la validation ?", a: "Les clients ont 48h pour valider manuellement une preuve. Passé ce délai, elle est validée automatiquement." },
            { q: "Est-ce sécurisé ?", a: "Oui, notre système anti-fraude vérifie les preuves et le budget est bloqué dès la création de la campagne." }
          ].map((faq, i) => (
            <div key={i} className="p-6 rounded-lg bg-white/5 border border-white/10">
              <h3 className="text-lg font-medium text-white">{faq.q}</h3>
              <p className="text-muted-foreground mt-2">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-tiktok-cyan/10 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-tiktok-pink/10 rounded-full blur-[120px] -z-10"></div>
      
      <div className="max-w-6xl mx-auto p-6 lg:p-12">
        <header className="flex justify-between items-center mb-16">
          <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-insta">
            Boostify
          </Link>
          <div className="space-x-4">
            <Link href="/login"><Button variant="ghost" className="text-white">Connexion</Button></Link>
            <Link href="/register"><Button className="bg-white/10 text-white hover:bg-white/20">S'inscrire</Button></Link>
          </div>
        </header>

        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Comment ça marche ?</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Que vous vouliez booster votre visibilité ou gagner de l'argent avec vos réseaux sociaux, c'est simple et rapide.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mt-12">
          {/* Pour les Clients */}
          <div className="p-8 rounded-2xl bg-card/50 border border-brand-tiktok-cyan/30 backdrop-blur-sm relative">
            <div className="absolute -top-6 left-8 bg-background px-4 py-1 border border-brand-tiktok-cyan/50 text-brand-tiktok-cyan rounded-full text-sm font-bold">
              POUR LES CLIENTS
            </div>
            <h2 className="text-2xl font-bold text-white mb-6 mt-2">Achetez de l'engagement réel</h2>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-tiktok-cyan/20 text-brand-tiktok-cyan flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="text-lg font-medium text-white">Créez une campagne</h4>
                  <p className="text-muted-foreground text-sm">Définissez votre objectif (ex: 1000 likes TikTok) et ajoutez des fonds.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-tiktok-cyan/20 text-brand-tiktok-cyan flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="text-lg font-medium text-white">Les engageurs travaillent</h4>
                  <p className="text-muted-foreground text-sm">Notre communauté exécute vos tâches manuellement.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-tiktok-cyan/20 text-brand-tiktok-cyan flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="text-lg font-medium text-white">Validez et profitez</h4>
                  <p className="text-muted-foreground text-sm">Vérifiez les preuves fournies. Votre compte décolle !</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Pour les Engageurs */}
          <div className="p-8 rounded-2xl bg-card/50 border border-brand-tiktok-pink/30 backdrop-blur-sm relative">
            <div className="absolute -top-6 left-8 bg-background px-4 py-1 border border-brand-tiktok-pink/50 text-brand-tiktok-pink rounded-full text-sm font-bold">
              POUR LES ENGAGEURS
            </div>
            <h2 className="text-2xl font-bold text-white mb-6 mt-2">Monétisez votre temps</h2>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-tiktok-pink/20 text-brand-tiktok-pink flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="text-lg font-medium text-white">Trouvez des tâches</h4>
                  <p className="text-muted-foreground text-sm">Parcourez le fil des campagnes (Likes, Abonnements, Vues).</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-tiktok-pink/20 text-brand-tiktok-pink flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="text-lg font-medium text-white">Exécutez et prouvez</h4>
                  <p className="text-muted-foreground text-sm">Faites l'action demandée et envoyez une capture d'écran.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-tiktok-pink/20 text-brand-tiktok-pink flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="text-lg font-medium text-white">Recevez votre argent</h4>
                  <p className="text-muted-foreground text-sm">Retirez vos gains directement par Mobile Money.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

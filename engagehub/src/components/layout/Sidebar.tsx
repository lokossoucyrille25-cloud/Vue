"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BarChart3, Home, Users, Settings, LogOut, Wallet, ListChecks } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function Sidebar({ profile }: { profile: any }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  
  const isClient = profile?.roles?.includes('client');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <aside className="w-64 border-r border-white/10 bg-card hidden md:flex flex-col h-full sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <span className="text-brand-tiktok-cyan glow-tiktok-cyan">Boost</span>
          <span className="text-brand-tiktok-pink glow-tiktok-pink">ify</span>
        </h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <Link href={isClient ? "/client" : "/engageur"}>
          <Button variant="ghost" className={`w-full justify-start ${isActive(isClient ? '/client' : '/engageur') && pathname.split('/').length <= 2 ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}>
            <Home className="mr-2 h-4 w-4" /> Tableau de bord
          </Button>
        </Link>
        
        {isClient ? (
          <>
            <Link href="/client/campaigns">
              <Button variant="ghost" className={`w-full justify-start ${isActive('/client/campaigns') ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}>
                <BarChart3 className="mr-2 h-4 w-4" /> Mes Campagnes
              </Button>
            </Link>
            <Link href="/client/public-profile">
              <Button variant="ghost" className={`w-full justify-start ${isActive('/client/public-profile') ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}>
                <Users className="mr-2 h-4 w-4" /> Profil Public
              </Button>
            </Link>
            <Link href="/client/directory">
              <Button variant="ghost" className={`w-full justify-start ${isActive('/client/directory') ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}>
                <Users className="mr-2 h-4 w-4" /> Annuaire Engageurs
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/engageur/directory">
              <Button variant="ghost" className={`w-full justify-start ${isActive('/engageur/directory') ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}>
                <Users className="mr-2 h-4 w-4" /> Annuaire Clients
              </Button>
            </Link>
            <Link href="/engageur/my-tasks">
              <Button variant="ghost" className={`w-full justify-start ${isActive('/engageur/my-tasks') ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}>
                <ListChecks className="mr-2 h-4 w-4" /> Mes Tâches
              </Button>
            </Link>
          </>
        )}
        
        <Link href="/wallet">
          <Button variant="ghost" className={`w-full justify-start ${isActive('/wallet') ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}>
            <Wallet className="mr-2 h-4 w-4" /> Portefeuille
          </Button>
        </Link>
        <Link href="/settings">
          <Button variant="ghost" className={`w-full justify-start ${isActive('/settings') ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}>
            <Settings className="mr-2 h-4 w-4" /> Paramètres
          </Button>
        </Link>
      </nav>
      
      <div className="p-4 border-t border-white/10 space-y-4">
        {isClient && (
          <Link href="/client/campaigns/create">
            <Button className="w-full bg-gradient-insta text-white hover:opacity-90 border-0">
              Créer une Campagne
            </Button>
          </Link>
        )}
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10"
        >
          <LogOut className="mr-2 h-4 w-4" /> Déconnexion
        </Button>
      </div>
    </aside>
  );
}

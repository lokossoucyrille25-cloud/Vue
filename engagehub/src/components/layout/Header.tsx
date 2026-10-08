"use client";

import { Bell, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header({ profile, wallet }: { profile: any, wallet: any }) {
  const isClient = profile?.roles?.includes('client');

  return (
    <header className="h-16 border-b border-white/10 bg-background/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
      <h2 className="text-lg font-medium text-white/90">
        Vue d'ensemble - Espace {isClient ? 'Client' : 'Engageur'}
      </h2>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
          <Wallet className="h-4 w-4 text-brand-tiktok-cyan" />
          <span className="text-sm font-medium text-white">
            {wallet?.available_balance || 0} FCFA
          </span>
        </div>
        
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white rounded-full">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="w-8 h-8 rounded-full bg-gradient-insta border border-white/20 overflow-hidden flex items-center justify-center text-xs font-bold text-white uppercase">
          {profile?.phone ? profile.phone.substring(0, 2) : "US"}
        </div>
      </div>
    </header>
  );
}

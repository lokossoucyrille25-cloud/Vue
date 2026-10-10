"use client";

import { Button } from "@/components/ui/button";
import { reserveTask } from "./actions";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function ReserveTaskButton({ 
  actionId, 
  contentUrl 
}: { 
  actionId: string; 
  contentUrl: string; 
}) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    // Ouvre le lien dans un nouvel onglet
    window.open(contentUrl, "_blank", "noopener,noreferrer");
    
    // Lance l'action serveur en arrière-plan
    startTransition(async () => {
      const formData = new FormData();
      formData.append("campaignActionId", actionId);
      await reserveTask(formData);
    });
  };

  return (
    <Button 
      onClick={handleClick}
      disabled={isPending}
      className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/5"
    >
      {isPending ? "Réservation..." : "Réaliser"}
    </Button>
  );
}

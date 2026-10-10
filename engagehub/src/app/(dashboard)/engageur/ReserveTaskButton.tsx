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

  return (
    <Button 
      asChild
      disabled={isPending}
      className={`w-full bg-white/10 hover:bg-white/20 text-white border border-white/5 ${isPending ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <a
        href={contentUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          if (isPending) {
            e.preventDefault();
            return;
          }
          
          startTransition(async () => {
            const formData = new FormData();
            formData.append("campaignActionId", actionId);
            await reserveTask(formData);
          });
        }}
      >
        {isPending ? "Réservation..." : "Réaliser"}
      </a>
    </Button>
  );
}

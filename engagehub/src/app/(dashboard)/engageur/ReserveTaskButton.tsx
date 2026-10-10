"use client";

import { Button } from "@/components/ui/button";
import { reserveTask } from "./actions";

export function ReserveTaskButton({ 
  actionId, 
  contentUrl 
}: { 
  actionId: string; 
  contentUrl: string; 
}) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Open the content URL in a new tab immediately
    window.open(contentUrl, "_blank", "noopener,noreferrer");
    // Let the form submit naturally to trigger the server action (reserves and redirects)
  };

  return (
    <form action={reserveTask} onSubmit={handleSubmit}>
      <input type="hidden" name="campaignActionId" value={actionId} />
      <Button type="submit" className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/5">
        Réaliser
      </Button>
    </form>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { useState, useTransition, useEffect } from "react";
import { toggleFollow, checkFollowStatus } from "./actions";

export function FollowButton({ clientId }: { clientId: string }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    checkFollowStatus(clientId).then(setIsFollowing);
  }, [clientId]);

  return (
    <Button 
      onClick={() => {
        startTransition(async () => {
          const newStatus = await toggleFollow(clientId);
          setIsFollowing(newStatus);
        });
      }}
      disabled={isPending}
      className={`w-full border-0 ${
        isFollowing 
          ? "bg-white/10 hover:bg-white/20 text-white" 
          : "bg-gradient-insta hover:opacity-90 text-white"
      }`}
    >
      {isPending ? "..." : isFollowing ? "Abonné" : "S'abonner"}
    </Button>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { updateUserStatus } from "./actions";
import { toast } from "@/components/ui/toast";

export function UserActions({ userId, currentStatus }: { userId: string, currentStatus: string }) {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (status: string) => {
    setLoading(true);
    try {
      await updateUserStatus(userId, status);
      toast.add({ title: "Statut mis à jour", description: `L'utilisateur est maintenant ${status}.` });
    } catch (error) {
      toast.add({ title: "Erreur", description: "Impossible de mettre à jour l'utilisateur." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-end gap-2">
      {currentStatus !== 'active' ? (
        <Button 
          size="sm" 
          variant="outline" 
          className="border-green-500/50 text-green-400 hover:bg-green-500/10"
          onClick={() => handleStatusChange('active')}
          disabled={loading}
        >
          Activer
        </Button>
      ) : (
        <Button 
          size="sm" 
          variant="outline" 
          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
          onClick={() => handleStatusChange('suspended')}
          disabled={loading}
        >
          Suspendre
        </Button>
      )}
    </div>
  );
}

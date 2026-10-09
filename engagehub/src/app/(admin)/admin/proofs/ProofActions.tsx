"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { validateProof, rejectProof } from "./actions";
import { toast } from "@/components/ui/toast";

export function ProofActions({ proofId, currentStatus }: { proofId: string, currentStatus: string }) {
  const [loading, setLoading] = useState(false);

  const handleValidate = async () => {
    setLoading(true);
    try {
      await validateProof(proofId);
      toast.add({ title: "Preuve validée", description: "La preuve a été acceptée avec succès." });
    } catch (error) {
      toast.add({ title: "Erreur", description: "Impossible de valider la preuve." });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await rejectProof(proofId);
      toast.add({ title: "Preuve rejetée", description: "La preuve a été refusée." });
    } catch (error) {
      toast.add({ title: "Erreur", description: "Impossible de rejeter la preuve." });
    } finally {
      setLoading(false);
    }
  };

  if (currentStatus !== 'pending') return null;

  return (
    <div className="flex justify-end gap-2">
      <Button 
        size="sm" 
        variant="outline" 
        className="border-green-500/50 text-green-400 hover:bg-green-500/10"
        onClick={handleValidate}
        disabled={loading}
      >
        Valider
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
        onClick={handleReject}
        disabled={loading}
      >
        Rejeter
      </Button>
    </div>
  );
}

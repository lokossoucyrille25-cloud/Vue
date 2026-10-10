"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { validateDeposit, rejectDeposit } from "./actions";
import { toast } from "@/components/ui/toast";

export function DepositActions({ txId, currentStatus, amount }: { txId: string, currentStatus: string, amount: number }) {
  const [loading, setLoading] = useState(false);

  const handleValidate = async () => {
    if (!window.confirm(`Confirmez-vous avoir reçu ${amount} FCFA ? Le compte du client sera crédité.`)) return;
    
    setLoading(true);
    try {
      await validateDeposit(txId);
      toast.add({ title: "Dépôt validé", description: "Le client a été crédité." });
    } catch (error) {
      toast.add({ title: "Erreur", description: "Impossible de valider le dépôt." });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!window.confirm(`Voulez-vous rejeter ce dépôt ?`)) return;

    setLoading(true);
    try {
      await rejectDeposit(txId);
      toast.add({ title: "Dépôt rejeté", description: "Le dépôt a été refusé." });
    } catch (error) {
      toast.add({ title: "Erreur", description: "Impossible de rejeter le dépôt." });
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

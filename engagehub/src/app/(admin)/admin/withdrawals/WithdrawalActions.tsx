"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { markWithdrawalCompleted, rejectWithdrawal } from "./actions";
import { toast } from "@/components/ui/toast";

export function WithdrawalActions({ txId, currentStatus, amount }: { txId: string, currentStatus: string, amount: number }) {
  const [loading, setLoading] = useState(false);

  const handleValidate = async () => {
    if (!window.confirm(`Confirmez-vous avoir envoyé ${amount} FCFA à l'utilisateur ?`)) return;
    
    setLoading(true);
    try {
      await markWithdrawalCompleted(txId);
      toast.add({ title: "Retrait validé", description: "La transaction a été marquée comme payée." });
    } catch (error) {
      toast.add({ title: "Erreur", description: "Impossible de valider le retrait." });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!window.confirm(`Voulez-vous rejeter ce retrait et recréditer le solde de l'utilisateur ?`)) return;

    setLoading(true);
    try {
      await rejectWithdrawal(txId);
      toast.add({ title: "Retrait rejeté", description: "Les fonds ont été recrédités sur le solde disponible." });
    } catch (error) {
      toast.add({ title: "Erreur", description: "Impossible de rejeter le retrait." });
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
        Marquer Payé
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
        onClick={handleReject}
        disabled={loading}
      >
        Rejeter & Recréditer
      </Button>
    </div>
  );
}

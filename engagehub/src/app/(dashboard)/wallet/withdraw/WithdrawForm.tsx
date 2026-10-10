"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requestWithdrawal } from "./actions";

export function WithdrawForm({ maxAmount }: { maxAmount: number }) {
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (formData: FormData) => {
    setLoading(true);
    setError("");
    try {
      await requestWithdrawal(formData);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la demande");
      setLoading(false);
    }
  };

  return (
    <form action={onSubmit} className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-medium text-white/90">Montant à retirer (FCFA)</label>
        <Input 
          name="amount"
          type="number"
          min="1500"
          max={maxAmount}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Min. 1500 FCFA" 
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 text-lg py-6"
          required
        />
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>Minimum: 1500 FCFA</span>
          <span className="cursor-pointer text-brand-tiktok-cyan hover:underline" onClick={() => setAmount(maxAmount.toString())}>
            Retirer le maximum ({maxAmount} FCFA)
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-white/90">Numéro Mobile Money</label>
        <Input 
          type="text"
          placeholder="Ex: 07 00 00 00 00"
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
          required
        />
        <p className="text-xs text-muted-foreground">Assurez-vous que le numéro est correct.</p>
      </div>

      {error && <p className="text-sm text-red-400 font-medium">{error}</p>}

      <Button type="submit" disabled={loading || Number(amount) > maxAmount} className="w-full bg-gradient-insta text-white border-0 py-6 text-lg font-bold hover:opacity-90">
        {loading ? "Demande en cours..." : "Confirmer le retrait"}
      </Button>
    </form>
  );
}

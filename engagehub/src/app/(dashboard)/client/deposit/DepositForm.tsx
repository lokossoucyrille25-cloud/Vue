"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { handleDeposit } from "./actions";

export function DepositForm() {
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      await handleDeposit(formData);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <form action={onSubmit} className="space-y-6">
      <div className="bg-brand-tiktok-cyan/10 border border-brand-tiktok-cyan/30 rounded-lg p-4 mb-6">
        <h4 className="font-bold text-white mb-2">Instructions de paiement manuel</h4>
        <p className="text-sm text-white/80 mb-2">
          1. Effectuez un transfert Mobile Money (Wave, Orange Money) au numéro suivant : <strong className="text-brand-tiktok-cyan">07 00 00 00 00</strong>
        </p>
        <p className="text-sm text-white/80">
          2. Saisissez le montant exact transféré ci-dessous et validez. Votre dépôt sera crédité après vérification par un administrateur.
        </p>
      </div>
      
      <div className="space-y-3">
        <label className="text-sm font-medium text-white/90">Montant (FCFA)</label>
        <Input 
          name="amount"
          type="number"
          min="1000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Ex: 5000" 
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 text-lg py-6"
          required
        />
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {[5000, 10000, 20000].map((amt) => (
          <div 
            key={amt} 
            onClick={() => setAmount(amt.toString())}
            className="border border-white/10 rounded-md p-3 text-center text-white bg-white/5 cursor-pointer hover:border-brand-tiktok-cyan/50 hover:bg-brand-tiktok-cyan/10 transition-colors"
          >
            {amt}
          </div>
        ))}
      </div>

      <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#FF0050] to-[#00F2FE] text-white border-0 py-6 text-lg font-bold hover:opacity-90">
        {loading ? "Traitement..." : "J'ai effectué le transfert"}
      </Button>
      <p className="text-xs text-center text-muted-foreground">
        En cliquant sur ce bouton, vous confirmez avoir envoyé l'argent au numéro indiqué.
      </p>
    </form>
  );
}

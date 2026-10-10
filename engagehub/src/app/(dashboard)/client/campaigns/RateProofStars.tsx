"use client";

import { useState } from "react";
import { rateProof } from "./actions";

export function RateProofStars({ proofId, currentRating }: { proofId: string, currentRating?: number }) {
  const [rating, setRating] = useState(currentRating || 0);
  const [loading, setLoading] = useState(false);

  const handleRate = async (score: number) => {
    if (rating > 0) return; // Déjà noté
    setLoading(true);
    setRating(score);
    try {
      await rateProof(proofId, score);
    } catch (e) {
      console.error("Erreur de notation", e);
      setRating(currentRating || 0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={loading || (currentRating && currentRating > 0)}
          onClick={() => handleRate(star)}
          className={`text-lg transition-colors ${star <= rating ? 'text-yellow-400' : 'text-white/20 hover:text-white/40'} disabled:cursor-default`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

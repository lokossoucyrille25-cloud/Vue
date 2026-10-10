"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { reportProof } from "./actions";

export function ReportProofButton({ proofId }: { proofId: string }) {
  const [loading, setLoading] = useState(false);

  const handleReport = async () => {
    if (!confirm("Voulez-vous signaler cette preuve comme frauduleuse / incorrecte ? Cela alertera un administrateur.")) {
      return;
    }
    setLoading(true);
    try {
      await reportProof(proofId);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleReport} 
      disabled={loading}
      variant="outline"
      size="sm"
      className="text-red-400 border-red-500/20 hover:bg-red-500/10 hover:text-red-300 h-7 text-xs"
    >
      {loading ? "..." : "Signaler"}
    </Button>
  );
}

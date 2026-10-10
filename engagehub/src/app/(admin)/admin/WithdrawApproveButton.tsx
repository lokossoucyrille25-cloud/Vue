"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { approveWithdrawal } from "./finances/actions";

export function WithdrawApproveButton({ transactionId, className }: { transactionId: string, className?: string }) {
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      await approveWithdrawal(transactionId);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <Button 
      size="sm" 
      onClick={handleApprove} 
      disabled={loading}
      className={className || "bg-white/10 text-white hover:bg-white/20"}
    >
      {loading ? "..." : "Approuver"}
    </Button>
  );
}

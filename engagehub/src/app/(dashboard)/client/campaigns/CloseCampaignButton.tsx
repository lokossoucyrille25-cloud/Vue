"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { closeCampaign } from "./actions";

export function CloseCampaignButton({ campaignId }: { campaignId: string }) {
  const [loading, setLoading] = useState(false);

  const handleClose = async () => {
    if (!confirm("Voulez-vous vraiment clôturer cette campagne ? Le budget non consommé vous sera remboursé.")) {
      return;
    }
    setLoading(true);
    try {
      await closeCampaign(campaignId);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleClose} 
      disabled={loading}
      variant="destructive"
      className="mt-4"
    >
      {loading ? "Clôture en cours..." : "Clôturer la campagne"}
    </Button>
  );
}

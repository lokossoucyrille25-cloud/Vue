"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitProof, cancelTask } from "../../actions";
import { createClient } from "@/lib/supabase/client";

export function SubmitProofForm({ taskId }: { taskId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const formData = new FormData(e.currentTarget);
      
      let finalProofUrl = formData.get("proofUrl") as string;

      if (file) {
        const supabase = createClient();
        const fileExt = file.name.split('.').pop();
        const filePath = `${taskId}-${Date.now()}.${fileExt}`;
        
        const { data, error: uploadError } = await supabase.storage
          .from("proofs")
          .upload(filePath, file);
          
        if (uploadError) {
          throw new Error("Erreur lors de l'upload de l'image. Assurez-vous que le bucket 'proofs' existe. Détail: " + uploadError.message);
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from("proofs")
          .getPublicUrl(filePath);
          
        finalProofUrl = publicUrl;
      }
      
      if (!finalProofUrl) {
        throw new Error("Veuillez fournir un lien ou une image de preuve.");
      }
      
      // Update the formData with the actual URL
      formData.set("proofUrl", finalProofUrl);

      await submitProof(formData);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <div>
        <label className="text-sm font-medium text-white/90">Lien vers la preuve (Optionnel si image)</label>
        <Input 
          name="proofUrl"
          type="url"
          placeholder="https://..."
          className="bg-white/5 border-white/10 text-white mt-1"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-white/90">Ou uploader une capture d'écran</label>
        <Input 
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="bg-white/5 border-white/10 text-white mt-1 cursor-pointer"
        />
      </div>
      <input type="hidden" name="taskId" value={taskId} />
      
      {error && <p className="text-sm text-red-400">{error}</p>}
      
      <div className="flex gap-4">
        <Button 
          type="button" 
          variant="outline"
          disabled={loading} 
          onClick={async () => {
            if (confirm("Voulez-vous vraiment abandonner cette tâche ?")) {
              setLoading(true);
              try { await cancelTask(taskId); } catch(e:any) { setError(e.message); setLoading(false); }
            }
          }}
          className="flex-1 bg-white/5 text-white border-white/10 hover:bg-white/10"
        >
          Abandonner
        </Button>

        <Button type="submit" disabled={loading} className="flex-1 bg-gradient-insta text-white border-0 hover:opacity-90">
          {loading ? "..." : "Soumettre"}
        </Button>
      </div>
    </form>
  );
}

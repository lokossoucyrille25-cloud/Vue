"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { updateProfile } from "./actions";

export function ProfileForm({ profile }: { profile: any }) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      await updateProfile(formData);
      toast.add({
        title: "Profil validé",
        description: "Votre profil a été mis à jour et sauvegardé avec succès.",
      });
    } catch (error) {
      toast.add({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour.",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      toast.add({
        title: "Visibilité activée",
        description: "Votre profil sera visible par les engageurs après l'enregistrement.",
      });
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-medium text-white/90">Nom Public / Nom de Marque</label>
        <Input 
          name="public_name"
          defaultValue={profile?.public_name || ""}
          placeholder="Ex: Ma Marque" 
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
          required
        />
      </div>
      <div className="space-y-3">
        <label className="text-sm font-medium text-white/90">Description</label>
        <Textarea 
          name="description"
          defaultValue={profile?.description || ""}
          placeholder="Parlez de votre marque ou de vos objectifs..." 
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[100px]"
        />
      </div>
      <div className="flex items-center space-x-2">
        <input 
          type="checkbox" 
          name="is_visible" 
          id="is_visible"
          defaultChecked={profile?.is_visible || false}
          onChange={handleCheckboxChange}
          className="w-4 h-4 rounded border-white/10 bg-white/5 text-brand-tiktok-cyan focus:ring-brand-tiktok-cyan focus:ring-offset-background"
        />
        <label htmlFor="is_visible" className="text-sm font-medium leading-none text-white/90 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Rendre mon profil visible dans l'annuaire des engageurs
        </label>
      </div>
      <Button disabled={loading} type="submit" className="w-full sm:w-auto bg-gradient-insta text-white border-0 hover:opacity-90">
        {loading ? "Mise à jour..." : "Mettre à jour le profil"}
      </Button>
    </form>
  );
}

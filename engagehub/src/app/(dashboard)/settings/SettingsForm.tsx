"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { updateSettings } from "./actions";

export function SettingsForm({ initialSettings }: { initialSettings: any }) {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(initialSettings || {
    email_notifs: true,
    push_notifs: false,
    marketing_notifs: false,
    theme: "dark",
    language: "fr"
  });

  const handleToggle = (key: string) => {
    setSettings((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings((prev: any) => ({ ...prev, language: e.target.value }));
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      if (settings.email_notifs) formData.append("email_notifs", "on");
      if (settings.push_notifs) formData.append("push_notifs", "on");
      if (settings.marketing_notifs) formData.append("marketing_notifs", "on");
      if (settings.theme === "dark") formData.append("theme", "on");
      formData.append("language", settings.language);

      await updateSettings(formData);
      
      toast.add({
        title: "Paramètres sauvegardés",
        description: "Vos préférences ont été mises à jour avec succès."
      });
    } catch (error) {
      toast.add({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tabs defaultValue="notifications" className="space-y-6">
      <TabsList className="bg-white/5 border border-white/10 p-1">
        <TabsTrigger value="notifications" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
          Notifications
        </TabsTrigger>
        <TabsTrigger value="appearance" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
          Apparence
        </TabsTrigger>
      </TabsList>

      <TabsContent value="notifications" className="space-y-6">
        <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white">Préférences de Notifications</CardTitle>
            <CardDescription>Choisissez comment nous vous contactons.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
              <Label className="flex flex-col space-y-1">
                <span className="text-white font-medium">Notifications par Email</span>
                <span className="font-normal text-muted-foreground">Recevez un résumé de l'activité sur votre compte.</span>
              </Label>
              <Switch checked={settings.email_notifs} onCheckedChange={() => handleToggle('email_notifs')} />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label className="flex flex-col space-y-1">
                <span className="text-white font-medium">Notifications Push</span>
                <span className="font-normal text-muted-foreground">Soyez alerté en temps réel sur cet appareil.</span>
              </Label>
              <Switch checked={settings.push_notifs} onCheckedChange={() => handleToggle('push_notifs')} />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label className="flex flex-col space-y-1">
                <span className="text-white font-medium">Offres et nouveautés</span>
                <span className="font-normal text-muted-foreground">Recevez nos dernières actualités.</span>
              </Label>
              <Switch checked={settings.marketing_notifs} onCheckedChange={() => handleToggle('marketing_notifs')} />
            </div>
            <div className="pt-4">
              <Button onClick={saveSettings} disabled={loading} className="bg-white/10 text-white hover:bg-white/20">
                {loading ? "Sauvegarde..." : "Enregistrer les préférences"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="appearance" className="space-y-6">
        <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white">Apparence</CardTitle>
            <CardDescription>Personnalisez l'interface.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
              <Label className="flex flex-col space-y-1">
                <span className="text-white font-medium">Mode Sombre</span>
                <span className="font-normal text-muted-foreground">Boostify est conçu en mode sombre par défaut.</span>
              </Label>
              <Switch checked={settings.theme === 'dark'} onCheckedChange={() => handleToggle('theme')} />
            </div>
            <div className="space-y-3 max-w-xs mt-6">
              <Label className="text-white">Langue de l'interface</Label>
              <select value={settings.language} onChange={handleLanguageChange} className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <option value="fr">Français (France)</option>
                <option value="en">English (US)</option>
              </select>
            </div>
            <div className="pt-4">
              <Button onClick={saveSettings} disabled={loading} className="bg-white/10 text-white hover:bg-white/20">
                {loading ? "Sauvegarde..." : "Enregistrer les préférences"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

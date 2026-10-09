import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "./SettingsForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const role = user.user_metadata?.role || "engageur";

  // Fetch current user settings
  const { data: profile } = await supabase
    .from("profiles")
    .select("settings")
    .eq("id", user.id)
    .single();

  const initialSettings = profile?.settings || {
    email_notifs: true,
    push_notifs: false,
    marketing_notifs: false,
    theme: "dark",
    language: "fr"
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Paramètres</h1>
        <p className="text-muted-foreground mt-1">Gérez vos préférences, votre sécurité et vos données.</p>
      </div>

      <SettingsForm initialSettings={initialSettings} />
      
      {/* We keep other static sections out of the form or inside it later */}
      <Tabs defaultValue="security" className="space-y-6 mt-8 hidden">
         <TabsList></TabsList>
      </Tabs>
    </div>
  );
}

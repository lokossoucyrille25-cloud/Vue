import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const role = user.user_metadata?.role || "engageur";

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Paramètres</h1>
        <p className="text-muted-foreground mt-1">Gérez vos préférences, votre sécurité et vos données.</p>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10 p-1">
          <TabsTrigger value="notifications" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
            Apparence
          </TabsTrigger>
          <TabsTrigger value="integrations" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
            Intégrations
          </TabsTrigger>
          <TabsTrigger value="privacy" className="data-[state=active]:bg-white/10 data-[state=active]:text-white">
            Confidentialité
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
                <Label htmlFor="email-notifs" className="flex flex-col space-y-1">
                  <span className="text-white font-medium">Notifications par Email</span>
                  <span className="font-normal text-muted-foreground">Recevez un résumé de l'activité sur votre compte.</span>
                </Label>
                <Switch id="email-notifs" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="push-notifs" className="flex flex-col space-y-1">
                  <span className="text-white font-medium">Notifications Push</span>
                  <span className="font-normal text-muted-foreground">Soyez alerté en temps réel sur cet appareil.</span>
                </Label>
                <Switch id="push-notifs" />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="marketing-notifs" className="flex flex-col space-y-1">
                  <span className="text-white font-medium">Offres et nouveautés</span>
                  <span className="font-normal text-muted-foreground">Recevez nos dernières actualités (rare).</span>
                </Label>
                <Switch id="marketing-notifs" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-white">Sécurité du compte</CardTitle>
              <CardDescription>Gérez votre mot de passe et l'authentification.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3 max-w-md">
                <Label className="text-white">Nouveau mot de passe</Label>
                <Input type="password" placeholder="••••••••" className="bg-white/5 border-white/10 text-white" />
                <Label className="text-white mt-4">Confirmer le mot de passe</Label>
                <Input type="password" placeholder="••••••••" className="bg-white/5 border-white/10 text-white" />
                <Button className="mt-4 bg-white/10 hover:bg-white/20 text-white border-0">Changer de mot de passe</Button>
              </div>

              <hr className="border-white/10" />

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="2fa" className="flex flex-col space-y-1">
                  <span className="text-white font-medium">Authentification à deux facteurs (2FA)</span>
                  <span className="font-normal text-muted-foreground">Protégez votre compte avec un code supplémentaire.</span>
                </Label>
                <Switch id="2fa" disabled />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-white">Apparence</CardTitle>
              <CardDescription>Personnalisez l'interface de Boostify.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                  <span className="text-white font-medium">Mode Sombre</span>
                  <span className="font-normal text-muted-foreground">Boostify est conçu en mode sombre par défaut.</span>
                </Label>
                <Switch id="dark-mode" defaultChecked disabled />
              </div>
              <div className="space-y-3 max-w-xs mt-6">
                <Label className="text-white">Langue de l'interface</Label>
                <select className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="fr">Français (France)</option>
                  <option value="en">English (US)</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-white">Réseaux Sociaux & Intégrations</CardTitle>
              <CardDescription>Connectez vos comptes externes à votre profil.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white">
                      🆃
                    </div>
                    <div>
                      <h4 className="text-white font-medium">TikTok</h4>
                      <p className="text-sm text-muted-foreground">Non connecté</p>
                    </div>
                  </div>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">Connecter</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                      📸
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Instagram</h4>
                      <p className="text-sm text-muted-foreground">Non connecté</p>
                    </div>
                  </div>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">Connecter</Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                      🅵
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Facebook</h4>
                      <p className="text-sm text-muted-foreground">Non connecté</p>
                    </div>
                  </div>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">Connecter</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card className="bg-card/50 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-white">Confidentialité et Données</CardTitle>
              <CardDescription>Gérez vos données personnelles et votre compte.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-medium">Exporter mes données</h4>
                  <p className="text-sm text-muted-foreground mb-3">Téléchargez une archive contenant vos informations, campagnes et historique financier.</p>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">Demander l'export (PDF/CSV)</Button>
                </div>

                <hr className="border-white/10" />

                <div>
                  <h4 className="text-red-400 font-medium">Zone de danger</h4>
                  <p className="text-sm text-muted-foreground mb-3">La suppression de votre compte est définitive. Toutes vos données seront perdues.</p>
                  <Button variant="destructive" className="bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 border border-red-500/30">
                    Supprimer mon compte
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}

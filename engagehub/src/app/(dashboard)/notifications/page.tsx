import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Notifications</h1>
          <p className="text-muted-foreground mt-1">Vos alertes et messages système.</p>
        </div>
      </div>

      <div className="space-y-4 mt-6">
        {!notifications || notifications.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground bg-card/30 border border-white/5 rounded-xl">
            Vous n'avez aucune notification.
          </div>
        ) : (
          notifications.map((n) => (
            <Card key={n.id} className="bg-card/50 border-white/10 hover:border-white/20 transition-colors">
              <CardContent className="p-4 flex gap-4 items-start">
                <div className={`w-2 h-2 mt-2 rounded-full ${n.is_read ? 'bg-transparent' : 'bg-brand-tiktok-cyan'}`} />
                <div className="flex-1">
                  <h4 className="text-white font-medium">{n.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{n.content}</p>
                  <p className="text-xs text-white/30 mt-2">{new Date(n.created_at).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
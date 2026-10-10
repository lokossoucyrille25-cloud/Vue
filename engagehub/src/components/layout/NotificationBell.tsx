"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import Link from "next/link";

type Notification = {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  link: string | null;
  created_at: string;
};

export function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userId) return;

    // Fetch initial notifications
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (!error && data) {
        setNotifications(data);
      }
    };
    fetchNotifications();

    // Subscribe to new notifications
    const channel = supabase
      .channel('realtime_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotif = payload.new as Notification;
          setNotifications((prev) => [newNotif, ...prev].slice(0, 10));
          toast.add({
            title: newNotif.title,
            description: newNotif.message,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (notifId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notifId ? { ...n, is_read: true } : n)
    );
    await supabase.from("notifications").update({ is_read: true }).eq("id", notifId);
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    await supabase.from("notifications").update({ is_read: true }).eq("user_id", userId);
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative text-white hover:bg-white/10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-brand-tiktok-pink rounded-full border border-black animate-pulse"></span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[#121212] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
            <h3 className="font-bold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-brand-tiktok-cyan hover:underline">
                Tout marquer lu
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-sm">
                Aucune notification
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-4 border-b border-white/5 transition-colors cursor-pointer hover:bg-white/5 ${!notif.is_read ? 'bg-white/[0.02]' : ''}`}
                  onClick={() => {
                    if (!notif.is_read) markAsRead(notif.id);
                  }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-sm ${!notif.is_read ? 'font-semibold text-white' : 'font-medium text-white/80'}`}>
                      {notif.title}
                    </h4>
                    {!notif.is_read && <span className="w-2 h-2 bg-brand-tiktok-cyan rounded-full mt-1.5 flex-shrink-0"></span>}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{notif.message}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-muted-foreground/60">
                      {new Date(notif.created_at).toLocaleDateString()}
                    </span>
                    {notif.link && (
                      <Link href={notif.link} className="text-xs text-brand-tiktok-cyan hover:underline" onClick={(e) => e.stopPropagation()}>
                        Voir détails →
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import { createFileRoute } from '@tanstack/react-router';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks/useNotifications';
import { Bell, Loader2, CheckCircle2 } from 'lucide-react';

export const Route = createFileRoute('/tutor/notifications')({
  component: NotificationsPage,
});

function NotificationsPage() {
  const { data, isLoading, error } = useNotifications(50);
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  if (isLoading) {
    return <div className="p-8 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Failed to load notifications.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-1">Stay updated with your teaching activity</p>
        </div>
        {data?.unreadCount > 0 && (
          <button
            onClick={() => markAllReadMutation.mutate()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 font-semibold transition-colors"
          >
            <CheckCircle2 className="h-4 w-4" /> Mark all read
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-border shadow-[var(--shadow-soft)] overflow-hidden">
        {data?.notifications?.length ? (
          <div className="divide-y divide-border">
            {data.notifications.map((n: any) => (
              <div
                key={n.id}
                className={`p-5 flex items-start gap-4 transition-colors hover:bg-secondary/50 cursor-pointer ${
                  !n.isRead ? "bg-primary/5" : ""
                }`}
                onClick={() => {
                  if (!n.isRead) markReadMutation.mutate(n.id);
                }}
              >
                <div className={`h-10 w-10 shrink-0 rounded-full grid place-items-center text-white ${!n.isRead ? "shadow-[var(--shadow-glow)]" : ""}`} style={{ background: "var(--brand-blue)" }}>
                  <Bell className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4 mb-1">
                    <p className={`text-base leading-tight ${!n.isRead ? "font-bold" : "font-medium text-foreground/80"}`}>{n.title}</p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className={`text-sm ${!n.isRead ? "text-foreground/90" : "text-muted-foreground"}`}>{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-bold">You're all caught up!</h3>
            <p className="text-muted-foreground">No new notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
}

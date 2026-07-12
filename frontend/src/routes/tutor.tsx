import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, BookOpen, Video, PlayCircle, GraduationCap, FileText,
  ClipboardCheck, Wallet, ShoppingBag, Calendar as CalIcon,
  Star, Bell, Settings, LogOut, Search, ChevronLeft, ChevronRight,
  Sun
} from "lucide-react";
import logo from "@/assets/lead-learnhub-logo.png";
import { useAuthStore } from "@/stores/auth.store";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/hooks/useNotifications";

export const Route = createFileRoute('/tutor')({
  component: TutorLayout,
});

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/tutor", exact: true },
  { icon: BookOpen, label: "My Classes", href: "/tutor/classes" },
  { icon: Video, label: "Live Sessions", href: "/tutor/live-sessions", badge: "1" },
  { icon: PlayCircle, label: "Recorded Lessons", href: "/tutor/recorded-lessons" },
  { icon: GraduationCap, label: "Students", href: "/tutor/students" },
  { icon: FileText, label: "Assignments", href: "/tutor/assignments", badge: "8" },
  { icon: ClipboardCheck, label: "Assessments", href: "/tutor/assessments" },
  { icon: Wallet, label: "Earnings", href: "/tutor/earnings" },
  { icon: ShoppingBag, label: "Marketplace", href: "/tutor/marketplace" },
  { icon: CalIcon, label: "Calendar", href: "/tutor/calendar" },
  { icon: Star, label: "Reviews & Ratings", href: "/tutor/reviews" },
  { icon: Bell, label: "Notifications", href: "/tutor/notifications", badge: "4" },
  { icon: Settings, label: "Settings", href: "/tutor/settings" },
];

function TutorLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuthStore();
  const location = useLocation();

  const menu = MENU_ITEMS.map(item => ({
    ...item,
    active: item.exact ? location.pathname === item.href || location.pathname === item.href + '/' : location.pathname.startsWith(item.href)
  }));

  return (
    <div className="min-h-screen bg-[oklch(0.98_0.01_250)] flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} menu={menu} />

      <div className={`flex-1 min-w-0 transition-all duration-300 ${collapsed ? "lg:ml-20" : "lg:ml-72"} flex flex-col`}>
        <TopBar onMenu={() => setMobileOpen(true)} user={user} />
        
        <div className="flex-1 relative">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen, menu }: {
  collapsed: boolean; setCollapsed: (v: boolean) => void;
  mobileOpen: boolean; setMobileOpen: (v: boolean) => void;
  menu: any[];
}) {
  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-border shadow-[var(--shadow-soft)] flex flex-col transition-all duration-300
          ${collapsed ? "w-20" : "w-72"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex items-center justify-between px-4 h-20 border-b border-border">
          <Link to="/" className={`flex items-center gap-2 ${collapsed ? "justify-center w-full" : ""}`}>
            <img src={logo} alt="LEAD LearnHub" className={collapsed ? "h-9 w-auto" : "h-10 w-auto"} />
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:grid h-8 w-8 place-items-center rounded-lg hover:bg-secondary text-muted-foreground"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {!collapsed && (
          <div className="mx-3 mt-3 mb-1 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Tutor Workspace
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-1">
          {menu.map((item) => (
            <Link
              to={item.href}
              key={item.label}
              onClick={() => setMobileOpen(false)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative
                ${item.active
                  ? "text-white shadow-[var(--shadow-glow)]"
                  : "text-foreground/70 hover:bg-secondary hover:text-foreground"}`}
              style={item.active ? { background: "var(--gradient-brand)" } : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.active ? "bg-white/25 text-white" : "bg-[var(--brand-red)] text-white"
                }`}>{item.badge}</span>
              )}
              {collapsed && item.badge && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[var(--brand-red)]" />
              )}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-border space-y-2">
          {!collapsed && (
            <div className="rounded-2xl p-3 text-white" style={{ background: "var(--gradient-warm)" }}>
              <p className="text-[10px] font-bold uppercase opacity-80">This Month</p>
              <p className="text-xl font-bold mt-0.5">₦485,200</p>
              <p className="text-[11px] opacity-90">Available for payout</p>
            </div>
          )}
          <Link
            to="/login"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/70 hover:bg-[var(--brand-red)]/10 hover:text-[var(--brand-red)] transition-all"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}

function TopBar({ onMenu, user }: { onMenu: () => void, user: any }) {
  const tutorName = user ? `${user.firstName} ${user.lastName}` : "Tutor";
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-border shrink-0">
      <div className="flex items-center gap-3 px-4 sm:px-6 lg:px-8 h-20">
        <button onClick={onMenu} className="lg:hidden h-10 w-10 grid place-items-center rounded-xl bg-secondary">
          <LayoutDashboard className="h-5 w-5" />
        </button>

        <div className="hidden md:block">
          <h1 className="text-xl font-bold flex items-center gap-1">
            Welcome back, {tutorName}
            <motion.span animate={{ rotate: [0, 20, -10, 20, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}>👋</motion.span>
          </h1>
          <p className="text-xs text-muted-foreground">Senior Tutor · Mathematics & Physics · 4.9 ★</p>
        </div>

        <div className="flex-1 max-w-md mx-auto hidden sm:block">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search students, classes, lessons…"
              className="w-full rounded-2xl border border-border bg-secondary/60 pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-primary/15 focus:border-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ background: "var(--gradient-brand)" }}>
            <Wallet className="h-3.5 w-3.5" /> ₦485K
          </span>
          <button className="h-10 w-10 grid place-items-center rounded-xl bg-secondary hover:bg-secondary/80">
            <CalIcon className="h-5 w-5 text-foreground/70" />
          </button>
          <button className="h-10 w-10 grid place-items-center rounded-xl bg-secondary hover:bg-secondary/80">
            <Sun className="h-5 w-5 text-foreground/70" />
          </button>
          <NotificationDropdown />
          <button className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl bg-secondary hover:bg-secondary/80">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="h-8 w-8 rounded-lg object-cover" />
            ) : (
              <span className="h-8 w-8 rounded-lg grid place-items-center text-white font-bold text-sm" style={{ background: "var(--gradient-vibrant)" }}>
                {user?.firstName?.[0] || "T"}
              </span>
            )}
            <span className="hidden lg:block text-xs font-semibold">{tutorName}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useNotifications(5);
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const handleMarkRead = (id: string) => {
    markReadMutation.mutate(id);
  };

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-10 w-10 grid place-items-center rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
      >
        <Bell className="h-5 w-5 text-foreground/70" />
        {data?.unreadCount > 0 && (
          <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-[var(--brand-red)] border-2 border-white animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-border z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-border flex justify-between items-center bg-secondary/30">
                <h4 className="font-bold">Notifications</h4>
                {data?.unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-primary font-semibold hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {data?.notifications?.length ? (
                  data.notifications.map((n: any) => (
                    <div
                      key={n.id}
                      className={`p-4 border-b border-border last:border-0 hover:bg-secondary/50 cursor-pointer transition-colors ${
                        !n.isRead ? "bg-primary/5" : ""
                      }`}
                      onClick={() => handleMarkRead(n.id)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className={`text-sm ${!n.isRead ? "font-bold text-foreground" : "font-medium text-muted-foreground"}`}>
                          {n.title}
                        </p>
                        {!n.isRead && <span className="h-2 w-2 rounded-full bg-[var(--brand-red)] shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground opacity-70">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-muted-foreground">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-border bg-secondary/30 text-center">
                <Link
                  to="/tutor/notifications"
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  View all notifications
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

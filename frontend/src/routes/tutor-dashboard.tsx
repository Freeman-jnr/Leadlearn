import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, BookOpen, Video, PlayCircle, GraduationCap, FileText,
  ClipboardCheck, Wallet, ShoppingBag, MessageSquare, Calendar as CalIcon,
  Star, Bell, Settings, LogOut, Search, ChevronLeft, ChevronRight,
  Plus, Upload, Play, Users, TrendingUp, DollarSign, Clock,
  CheckCircle2, AlertCircle, MoreVertical, Send, FileUp, Eye,
  PenTool, MessageCircle, Mic, ScreenShare, Sparkles, Award, Sun,
} from "lucide-react";
import logo from "@/assets/lead-learnhub-logo.png";

export const Route = createFileRoute("/tutor-dashboard")({
  head: () => ({
    meta: [
      { title: "Tutor Dashboard — LEAD LearnHub" },
      { name: "description", content: "Manage classes, students, earnings and live sessions on LEAD LearnHub." },
      { property: "og:title", content: "Tutor Dashboard — LEAD LearnHub" },
      { property: "og:description", content: "Premium teaching command center for Nigerian educators." },
    ],
  }),
  component: TutorDashboardPage,
});

const menu = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: BookOpen, label: "My Classes" },
  { icon: Video, label: "Live Sessions", badge: "1" },
  { icon: PlayCircle, label: "Recorded Lessons" },
  { icon: GraduationCap, label: "Students" },
  { icon: FileText, label: "Assignments", badge: "8" },
  { icon: ClipboardCheck, label: "Assessments" },
  { icon: Wallet, label: "Earnings" },
  { icon: ShoppingBag, label: "Marketplace Uploads" },
  { icon: MessageSquare, label: "Messages", badge: "12" },
  { icon: CalIcon, label: "Calendar" },
  { icon: Star, label: "Reviews & Ratings" },
  { icon: Bell, label: "Notifications", badge: "4" },
  { icon: Settings, label: "Settings" },
];

const classes = [
  { subject: "Mathematics", level: "JSS 2", students: 48, next: "Today · 2:00 PM", progress: 72, color: "var(--brand-blue)", emoji: "📐" },
  { subject: "Physics", level: "SSS 1", students: 36, next: "Today · 4:30 PM", progress: 64, color: "var(--brand-pink)", emoji: "⚛️" },
  { subject: "Chemistry", level: "SSS 2", students: 29, next: "Tomorrow · 9:00 AM", progress: 81, color: "var(--brand-green)", emoji: "🧪" },
  { subject: "Computer Studies", level: "JSS 3", students: 52, next: "Tomorrow · 11:00 AM", progress: 55, color: "var(--brand-orange)", emoji: "💻" },
  { subject: "Economics", level: "SSS 3", students: 31, next: "Wed · 1:00 PM", progress: 89, color: "var(--brand-yellow)", emoji: "📊" },
  { subject: "Government", level: "SSS 2", students: 27, next: "Thu · 10:00 AM", progress: 47, color: "var(--brand-red)", emoji: "🏛️" },
];

const recordedLessons = [
  { title: "Quadratic Equations Masterclass", subject: "Mathematics", duration: "24:18", views: 1240, hue: 220 },
  { title: "Newton's Laws Visual Guide", subject: "Physics", duration: "18:42", views: 890, hue: 264 },
  { title: "Balancing Chemical Equations", subject: "Chemistry", duration: "32:05", views: 642, hue: 145 },
  { title: "Intro to Microeconomics", subject: "Economics", duration: "27:33", views: 1580, hue: 92 },
];

const assignments = [
  { title: "Algebra Test — Chapter 5", class: "Mathematics · JSS 2", due: "Tomorrow", submitted: 36, total: 48, status: "active" },
  { title: "Lab Report: Velocity & Time", class: "Physics · SSS 1", due: "In 3 days", submitted: 18, total: 36, status: "active" },
  { title: "Essay: Nigerian Democracy", class: "Government · SSS 2", due: "Yesterday", submitted: 25, total: 27, status: "review" },
];

const messages = [
  { name: "Chioma A.", msg: "Sir, please can you re-explain question 4?", time: "2m", color: "var(--brand-pink)" },
  { name: "Tunde B.", msg: "I've submitted my homework, thank you!", time: "18m", color: "var(--brand-blue)" },
  { name: "Aisha M.", msg: "When is the next live class?", time: "1h", color: "var(--brand-orange)" },
  { name: "David O.", msg: "Got 92% in the assessment 🎉", time: "3h", color: "var(--brand-green)" },
];

const reviews = [
  { name: "Mrs. Okonkwo (Parent)", text: "Mr. Adewale's teaching style transformed my daughter's grades. Outstanding!", rating: 5 },
  { name: "Tunde B. (SSS 1)", text: "He explains physics in a way that just clicks. Best tutor on the platform.", rating: 5 },
  { name: "Aisha M. (JSS 2)", text: "Patient, friendly and very knowledgeable. Highly recommended.", rating: 4 },
];

const materials = [
  { name: "JSS 2 Math Workbook (PDF)", type: "PDF", sales: 142, price: "₦2,500", emoji: "📕" },
  { name: "Physics Past Questions Pack", type: "PDF", sales: 98, price: "₦1,800", emoji: "📘" },
  { name: "AR Chemistry Visualizer", type: "VR/QR", sales: 64, price: "₦5,500", emoji: "🧬" },
  { name: "Weekly Worksheet Bundle", type: "Worksheet", sales: 211, price: "₦1,200", emoji: "📝" },
];

const notifications = [
  { icon: Users, color: "var(--brand-green)", title: "5 new students enrolled in Physics SSS 1", time: "10m ago" },
  { icon: FileText, color: "var(--brand-blue)", title: "12 new assignment submissions to review", time: "1h ago" },
  { icon: Wallet, color: "var(--brand-orange)", title: "Payout of ₦185,400 processed successfully", time: "Today" },
  { icon: ShoppingBag, color: "var(--brand-pink)", title: "Workbook sold to 8 new students", time: "Today" },
];

function TutorDashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[oklch(0.98_0.01_250)] flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className={`flex-1 min-w-0 transition-all duration-300 ${collapsed ? "lg:ml-20" : "lg:ml-72"}`}>
        <TopBar onMenu={() => setMobileOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8 space-y-8 pb-32">
          <HeroOverview />
          <ClassManagement />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2"><LiveClassroom /></div>
            <NotificationsPanel />
          </div>
          <RecordedLessons />
          <div className="grid lg:grid-cols-2 gap-6">
            <Assignments />
            <StudentPerformance />
          </div>
          <Earnings />
          <div className="grid lg:grid-cols-2 gap-6">
            <Messages />
            <Schedule />
          </div>
          <MarketplaceUploads />
          <Reviews />
        </main>
      </div>

      <motion.button
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full text-white grid place-items-center shadow-[var(--shadow-glow)]"
        style={{ background: "var(--gradient-vibrant)" }}
        aria-label="Quick create"
      >
        <Plus className="h-6 w-6" />
      </motion.button>
    </div>
  );
}

/* ---------------- Sidebar ---------------- */
function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: {
  collapsed: boolean; setCollapsed: (v: boolean) => void;
  mobileOpen: boolean; setMobileOpen: (v: boolean) => void;
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
            <button
              key={item.label}
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
            </button>
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

/* ---------------- Top Bar ---------------- */
function TopBar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center gap-3 px-4 sm:px-6 lg:px-8 h-20">
        <button onClick={onMenu} className="lg:hidden h-10 w-10 grid place-items-center rounded-xl bg-secondary">
          <LayoutDashboard className="h-5 w-5" />
        </button>

        <div className="hidden md:block">
          <h1 className="text-xl font-bold flex items-center gap-1">
            Welcome back, Mr. Adewale
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
          <button className="relative h-10 w-10 grid place-items-center rounded-xl bg-secondary hover:bg-secondary/80">
            <Bell className="h-5 w-5 text-foreground/70" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[var(--brand-red)] animate-pulse" />
          </button>
          <button className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl bg-secondary hover:bg-secondary/80">
            <span className="h-8 w-8 rounded-lg grid place-items-center text-white font-bold text-sm" style={{ background: "var(--gradient-vibrant)" }}>A</span>
            <span className="hidden lg:block text-xs font-semibold">Mr. Adewale</span>
          </button>
        </div>
      </div>
    </header>
  );
}

/* ---------------- Section helpers ---------------- */
function SectionHeader({ title, subtitle, action = "View all" }: { title: string; subtitle?: string; action?: string }) {
  return (
    <div className="flex items-end justify-between mb-5 gap-4">
      <div>
        <h3 className="text-xl sm:text-2xl font-bold">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      <button className="text-sm font-semibold text-primary hover:underline whitespace-nowrap">{action}</button>
    </div>
  );
}

/* ---------------- Hero Overview ---------------- */
function HeroOverview() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-3xl p-6 sm:p-10 text-white shadow-[var(--shadow-glow)]"
      style={{ background: "var(--gradient-hero)" }}
    >
      <motion.div
        className="absolute -top-20 -right-10 h-80 w-80 rounded-full blur-3xl opacity-50"
        style={{ background: "var(--gradient-vibrant)" }}
        animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-20 left-1/3 h-72 w-72 rounded-full blur-3xl opacity-40"
        style={{ background: "var(--gradient-warm)" }}
        animate={{ x: [0, 30, 0] }} transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative grid lg:grid-cols-5 gap-8 items-center">
        <div className="lg:col-span-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-semibold">
            <Sparkles className="h-3 w-3" /> Top 5% Tutor This Month
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Empowering <span className="text-gradient-rainbow">223 students</span> across Nigeria
          </h2>
          <p className="mt-3 text-white/80 max-w-xl italic">
            "A teacher affects eternity; he can never tell where his influence stops." — Henry Adams
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-[var(--brand-blue)] bg-white shadow-lg hover:scale-105 transition-transform">
              <Video className="h-4 w-4" /> Start Live Class
            </button>
            <button className="btn-ghost"><Upload className="h-4 w-4" /> Upload Lesson</button>
            <button className="btn-ghost"><FileText className="h-4 w-4" /> Create Assignment</button>
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 gap-3">
          <StatCard icon={Users} value="223" label="Total Students" tint="var(--brand-blue)" />
          <StatCard icon={BookOpen} value="6" label="Active Classes" tint="var(--brand-pink)" />
          <StatCard icon={DollarSign} value="₦485K" label="This Month" tint="var(--brand-green)" />
          <StatCard icon={Star} value="4.9" label="Avg Rating" tint="var(--brand-yellow)" />
        </div>
      </div>
    </motion.section>
  );
}

function StatCard({ icon: Icon, value, label, tint }: any) {
  return (
    <motion.div whileHover={{ y: -4 }} className="glass rounded-2xl p-4">
      <div className="h-9 w-9 rounded-xl grid place-items-center mb-2" style={{ background: tint, color: "white" }}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-[11px] text-white/70 uppercase tracking-wide">{label}</div>
    </motion.div>
  );
}

/* ---------------- Class Management ---------------- */
function ClassManagement() {
  return (
    <section>
      <SectionHeader title="My Classes" subtitle="Manage your subjects and student groups" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.map((c) => (
          <motion.div
            key={c.subject + c.level}
            whileHover={{ y: -6 }}
            className="bg-white rounded-3xl p-5 border border-border shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-shadow"
          >
            <div
              className="h-32 rounded-2xl flex items-center justify-between p-4 mb-4 relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${c.color}, color-mix(in oklab, ${c.color} 50%, white))` }}
            >
              <span className="text-5xl">{c.emoji}</span>
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-white/30 text-white backdrop-blur">{c.level}</span>
            </div>
            <div className="flex items-center justify-between">
              <h4 className="font-bold">{c.subject}</h4>
              <button className="h-7 w-7 grid place-items-center rounded-lg hover:bg-secondary text-muted-foreground">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {c.students} students</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {c.next}</span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Syllabus progress</span>
                <span className="font-bold" style={{ color: c.color }}>{c.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${c.progress}%` }} transition={{ duration: 1 }}
                  className="h-full rounded-full" style={{ background: c.color }}
                />
              </div>
            </div>
            <button className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110" style={{ background: c.color }}>
              Manage Class
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Live Classroom ---------------- */
function LiveClassroom() {
  return (
    <section>
      <SectionHeader title="Live Classroom" subtitle="Your virtual teaching studio" />
      <div className="rounded-3xl overflow-hidden border border-border shadow-[var(--shadow-soft)] bg-white">
        {/* Video preview */}
        <div className="relative aspect-video grid place-items-center text-white" style={{ background: "var(--gradient-hero)" }}>
          <motion.div
            className="absolute -top-10 -left-10 h-60 w-60 rounded-full blur-3xl opacity-50"
            style={{ background: "var(--gradient-vibrant)" }}
            animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity }}
          />
          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--brand-red)] text-white text-[10px] font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> LIVE PREVIEW
          </span>
          <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur text-white text-[11px] font-semibold">
            <Users className="h-3 w-3" /> 36 students online
          </span>

          <div className="relative text-center">
            <div className="h-20 w-20 mx-auto rounded-full grid place-items-center text-3xl font-bold backdrop-blur-xl bg-white/15 border border-white/20">A</div>
            <p className="mt-3 text-sm font-semibold">Mr. Adewale · Physics SSS 1</p>
            <p className="text-xs text-white/70">Topic: Waves & Sound</p>
          </div>

          {/* Toolbar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2 rounded-2xl bg-black/50 backdrop-blur-xl">
            {[Mic, Video, ScreenShare, PenTool, MessageCircle].map((Icon, i) => (
              <button key={i} className="h-9 w-9 grid place-items-center rounded-xl bg-white/10 hover:bg-white/20 text-white">
                <Icon className="h-4 w-4" />
              </button>
            ))}
            <button className="ml-1 px-4 py-2 rounded-xl text-xs font-bold text-white" style={{ background: "var(--brand-red)" }}>
              End
            </button>
          </div>
        </div>

        {/* Side panels preview */}
        <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
          <div className="p-4">
            <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2">Live Chat</p>
            <div className="space-y-2 text-xs">
              <p><span className="font-semibold text-primary">Chioma:</span> Sir, can you repeat the formula?</p>
              <p><span className="font-semibold text-[var(--brand-pink)]">Tunde:</span> Yes please 🙏</p>
              <p><span className="font-semibold text-[var(--brand-green)]">Aisha:</span> Got it, thank you!</p>
            </div>
          </div>
          <div className="p-4">
            <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2">Whiteboard</p>
            <div className="aspect-video rounded-lg bg-gradient-to-br from-[var(--brand-yellow)]/15 to-[var(--brand-pink)]/15 grid place-items-center text-xs text-muted-foreground">
              v = f × λ
            </div>
          </div>
          <div className="p-4">
            <p className="text-[10px] font-bold uppercase text-muted-foreground mb-2">Next Session</p>
            <p className="font-bold text-sm">Chemistry SSS 2</p>
            <p className="text-xs text-muted-foreground mt-1">Tomorrow · 9:00 AM</p>
            <button className="mt-3 w-full py-2 rounded-lg text-xs font-bold text-white" style={{ background: "var(--gradient-brand)" }}>
              Start Session
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Notifications ---------------- */
function NotificationsPanel() {
  return (
    <section className="bg-white rounded-3xl p-5 border border-border shadow-[var(--shadow-soft)] h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" /> Notifications
        </h3>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--brand-red)] text-white">4 NEW</span>
      </div>
      <div className="space-y-3">
        {notifications.map((n, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary/60 transition-colors">
            <div className="h-9 w-9 rounded-xl grid place-items-center shrink-0 text-white" style={{ background: n.color }}>
              <n.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-tight">{n.title}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-3 w-full py-2 rounded-xl text-xs font-semibold text-primary hover:bg-primary/5">
        View all notifications
      </button>
    </section>
  );
}

/* ---------------- Recorded Lessons ---------------- */
function RecordedLessons() {
  return (
    <section>
      <div className="flex items-end justify-between mb-5 gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold">Recorded Lessons</h3>
          <p className="text-sm text-muted-foreground mt-1">Manage your video library</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: "var(--gradient-brand)" }}>
          <Upload className="h-4 w-4" /> Upload New
        </button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
        {recordedLessons.map((r) => (
          <motion.div
            key={r.title} whileHover={{ scale: 1.04, y: -4 }}
            className="snap-start shrink-0 w-72 bg-white rounded-2xl overflow-hidden border border-border shadow-[var(--shadow-soft)]"
          >
            <div className="relative h-40" style={{ background: `linear-gradient(135deg, oklch(0.6 0.2 ${r.hue}), oklch(0.45 0.21 ${(r.hue + 60) % 360}))` }}>
              <button className="absolute inset-0 grid place-items-center group">
                <span className="h-12 w-12 rounded-full bg-white/90 grid place-items-center group-hover:scale-110 transition-transform">
                  <Play className="h-5 w-5 text-foreground translate-x-0.5" fill="currentColor" />
                </span>
              </button>
              <span className="absolute bottom-2 right-2 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">{r.duration}</span>
              <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-foreground">
                <Eye className="h-3 w-3" /> {r.views.toLocaleString()}
              </span>
            </div>
            <div className="p-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{r.subject}</span>
              <h4 className="font-semibold text-sm mt-1 leading-tight">{r.title}</h4>
              <div className="mt-3 flex gap-2">
                <button className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold bg-secondary hover:bg-secondary/70">Edit</button>
                <button className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold text-[var(--brand-red)] bg-[var(--brand-red)]/10 hover:bg-[var(--brand-red)]/20">Delete</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Assignments ---------------- */
function Assignments() {
  return (
    <section className="bg-white rounded-3xl p-6 border border-border shadow-[var(--shadow-soft)]">
      <SectionHeader title="Assignments & Assessments" subtitle="Review submissions and create new tests" />
      <div className="space-y-3">
        {assignments.map((a) => {
          const pct = Math.round((a.submitted / a.total) * 100);
          return (
            <div key={a.title} className="p-4 rounded-2xl border border-border hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{a.class}</p>
                  <h4 className="font-bold text-sm mt-0.5">{a.title}</h4>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                  a.status === "review" ? "bg-[var(--brand-orange)] text-white" : "bg-[var(--brand-blue)] text-white"
                }`}>{a.status === "review" ? "REVIEW" : "ACTIVE"}</span>
              </div>
              <div className="mt-3 flex items-center gap-3 text-xs">
                <span className="text-muted-foreground"><Clock className="h-3 w-3 inline" /> Due {a.due}</span>
                <span className="font-semibold">{a.submitted}/{a.total} submitted</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }}
                  className="h-full" style={{ background: "var(--gradient-brand)" }} />
              </div>
              <button className="mt-3 text-xs font-bold text-primary hover:underline">Review submissions →</button>
            </div>
          );
        })}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button className="py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "var(--gradient-brand)" }}>
          + New Assignment
        </button>
        <button className="py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "var(--gradient-warm)" }}>
          Create CBT Test
        </button>
      </div>
    </section>
  );
}

/* ---------------- Performance ---------------- */
function StudentPerformance() {
  const engagement = [62, 75, 58, 82, 90, 71, 86];
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <section className="bg-white rounded-3xl p-6 border border-border shadow-[var(--shadow-soft)]">
      <SectionHeader title="Student Performance" subtitle="Engagement and outcomes this week" />
      <div className="grid grid-cols-3 gap-3 mb-5">
        <RingStat label="Avg Score" value={82} color="var(--brand-blue)" />
        <RingStat label="Attendance" value={91} color="var(--brand-green)" />
        <RingStat label="Completion" value={76} color="var(--brand-pink)" />
      </div>
      <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
        <TrendingUp className="h-3 w-3" /> Weekly engagement (%)
      </p>
      <div className="flex items-end gap-2 h-32">
        {engagement.map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <motion.div
              initial={{ height: 0 }} animate={{ height: `${h * 1.1}px` }} transition={{ duration: 0.8, delay: i * 0.05 }}
              className="w-full rounded-t-lg"
              style={{ background: "var(--gradient-rainbow)" }}
            />
            <span className="text-[10px] text-muted-foreground font-semibold">{days[i]}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function RingStat({ label, value, color }: { label: string; value: number; color: string }) {
  const c = 2 * Math.PI * 26;
  return (
    <div className="text-center">
      <div className="relative h-20 w-20 mx-auto">
        <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
          <circle cx="32" cy="32" r="26" fill="none" stroke="var(--secondary)" strokeWidth="6" />
          <motion.circle
            cx="32" cy="32" r="26" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: c - (c * value) / 100 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center text-sm font-bold">{value}%</div>
      </div>
      <p className="text-[11px] text-muted-foreground mt-2">{label}</p>
    </div>
  );
}

/* ---------------- Earnings ---------------- */
function Earnings() {
  const months = [
    { m: "Apr", v: 60 }, { m: "May", v: 75 }, { m: "Jun", v: 65 },
    { m: "Jul", v: 88 }, { m: "Aug", v: 92 }, { m: "Sep", v: 78 },
    { m: "Oct", v: 96 },
  ];
  const max = 100;
  return (
    <section className="rounded-3xl overflow-hidden border border-border shadow-[var(--shadow-soft)]" style={{ background: "linear-gradient(135deg, oklch(0.18 0.04 264), oklch(0.22 0.05 264))" }}>
      <div className="p-6 sm:p-8 text-white">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-[11px] uppercase font-bold tracking-wider text-white/60">Earnings & Payouts</p>
            <h3 className="text-2xl font-bold mt-1">Your revenue command center</h3>
          </div>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-[var(--brand-blue)] bg-white">
            <Wallet className="h-4 w-4" /> Withdraw Funds
          </button>
        </div>

        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          <EarnCard label="Total Earnings" value="₦4.82M" tint="var(--brand-green)" trend="+18%" />
          <EarnCard label="This Month" value="₦485,200" tint="var(--brand-blue)" trend="+24%" />
          <EarnCard label="Pending Payout" value="₦142,500" tint="var(--brand-orange)" trend="3 days" />
          <EarnCard label="Avg / Session" value="₦18,400" tint="var(--brand-pink)" trend="+6%" />
        </div>

        <div className="rounded-2xl p-5 bg-white/5 backdrop-blur border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">Revenue trend (₦000)</p>
            <div className="flex gap-1 text-[11px]">
              {["1M", "3M", "6M", "1Y"].map((p, i) => (
                <button key={p} className={`px-2.5 py-1 rounded-md ${i === 2 ? "bg-white text-foreground font-bold" : "text-white/60 hover:text-white"}`}>{p}</button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-3 h-40">
            {months.map((m, i) => (
              <div key={m.m} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }} animate={{ height: `${(m.v / max) * 140}px` }} transition={{ duration: 0.9, delay: i * 0.05 }}
                  className="w-full rounded-t-xl relative group"
                  style={{ background: i === months.length - 1 ? "var(--gradient-rainbow)" : "linear-gradient(180deg, color-mix(in oklab, var(--brand-blue) 80%, white) 0%, var(--brand-blue) 100%)" }}
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-white text-foreground px-1.5 py-0.5 rounded whitespace-nowrap">
                    ₦{(m.v * 5).toFixed(0)}K
                  </span>
                </motion.div>
                <span className="text-[10px] text-white/60 font-semibold">{m.m}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function EarnCard({ label, value, tint, trend }: { label: string; value: string; tint: string; trend: string }) {
  return (
    <motion.div whileHover={{ y: -3 }} className="rounded-2xl p-4 bg-white/5 backdrop-blur border border-white/10">
      <div className="flex items-center justify-between">
        <div className="h-9 w-9 rounded-xl grid place-items-center" style={{ background: tint }}>
          <DollarSign className="h-4 w-4 text-white" />
        </div>
        <span className="text-[10px] font-bold text-[var(--brand-green)] bg-[var(--brand-green)]/15 px-2 py-0.5 rounded-full">{trend}</span>
      </div>
      <div className="text-2xl font-bold mt-3">{value}</div>
      <div className="text-[11px] text-white/60 uppercase tracking-wide mt-0.5">{label}</div>
    </motion.div>
  );
}

/* ---------------- Messages ---------------- */
function Messages() {
  return (
    <section className="bg-white rounded-3xl p-6 border border-border shadow-[var(--shadow-soft)]">
      <SectionHeader title="Student Messages" subtitle="Recent conversations" action="Open inbox" />
      <div className="space-y-2">
        {messages.map((m) => (
          <div key={m.name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/60 transition-colors cursor-pointer">
            <div className="h-10 w-10 rounded-xl grid place-items-center text-white font-bold text-sm shrink-0" style={{ background: m.color }}>
              {m.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-sm truncate">{m.name}</p>
                <span className="text-[10px] text-muted-foreground shrink-0">{m.time}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{m.msg}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input placeholder="Send a class announcement…" className="flex-1 rounded-xl border border-border bg-secondary/40 px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
        <button className="h-10 w-10 grid place-items-center rounded-xl text-white shrink-0" style={{ background: "var(--gradient-brand)" }}>
          <Send className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

/* ---------------- Schedule / Calendar ---------------- */
function Schedule() {
  const events = [
    { time: "09:00", title: "Chemistry SSS 2 — Live", color: "var(--brand-pink)", type: "Class" },
    { time: "11:00", title: "Computer Studies JSS 3", color: "var(--brand-orange)", type: "Class" },
    { time: "14:00", title: "Algebra Test deadline", color: "var(--brand-red)", type: "Deadline" },
    { time: "16:30", title: "1-on-1 with Chioma A.", color: "var(--brand-blue)", type: "Booking" },
  ];
  const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = 2;
  return (
    <section className="bg-white rounded-3xl p-6 border border-border shadow-[var(--shadow-soft)]">
      <SectionHeader title="Schedule" subtitle="This week's teaching timeline" action="Full calendar" />
      <div className="grid grid-cols-7 gap-1.5 mb-5">
        {week.map((d, i) => (
          <div key={d} className={`text-center py-2 rounded-xl text-xs font-semibold ${
            i === today ? "text-white shadow-[var(--shadow-glow)]" : "bg-secondary/60 text-foreground/70"
          }`} style={i === today ? { background: "var(--gradient-brand)" } : undefined}>
            <div className="text-[10px] opacity-80">{d}</div>
            <div className="text-base font-bold mt-0.5">{10 + i}</div>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {events.map((e) => (
          <div key={e.title} className="flex items-center gap-3 p-3 rounded-xl border-l-4 bg-secondary/40" style={{ borderColor: e.color }}>
            <div className="text-xs font-bold text-muted-foreground w-12">{e.time}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{e.title}</p>
              <p className="text-[11px] text-muted-foreground">{e.type}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Marketplace Uploads ---------------- */
function MarketplaceUploads() {
  return (
    <section>
      <div className="flex items-end justify-between mb-5 gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold">Marketplace Uploads</h3>
          <p className="text-sm text-muted-foreground mt-1">Sell your educational materials to students nationwide</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: "var(--gradient-warm)" }}>
          <FileUp className="h-4 w-4" /> Upload Material
        </button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {materials.map((m) => (
          <motion.div
            key={m.name} whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-4 border border-border shadow-[var(--shadow-soft)]"
          >
            <div className="relative h-32 rounded-xl grid place-items-center text-5xl mb-3" style={{ background: "linear-gradient(135deg, var(--secondary), color-mix(in oklab, var(--brand-blue) 15%, white))" }}>
              {m.emoji}
              <span className="absolute top-2 left-2 text-[9px] font-bold bg-white px-1.5 py-0.5 rounded">{m.type}</span>
            </div>
            <h4 className="font-semibold text-sm leading-tight line-clamp-2">{m.name}</h4>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{m.sales} sold</span>
              <span className="font-bold text-primary">{m.price}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold bg-secondary hover:bg-secondary/70">Edit</button>
              <button className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold text-white" style={{ background: "var(--gradient-brand)" }}>Stats</button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Reviews ---------------- */
function Reviews() {
  return (
    <section className="rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      <motion.div
        className="absolute -top-20 right-10 h-72 w-72 rounded-full blur-3xl opacity-40"
        style={{ background: "var(--gradient-warm)" }}
        animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity }}
      />
      <div className="relative">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Award className="h-6 w-6 text-[var(--brand-yellow)]" /> Reviews & Ratings
            </h3>
            <p className="text-sm text-white/70 mt-1">What students and parents are saying</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-[var(--brand-yellow)] text-[var(--brand-yellow)]" />)}
            </div>
            <div className="text-3xl font-bold mt-1 text-gradient-rainbow">4.9 / 5.0</div>
            <p className="text-xs text-white/60">Based on 248 reviews</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {reviews.map((r) => (
            <motion.div key={r.name} whileHover={{ y: -4 }} className="glass rounded-2xl p-5">
              <div className="flex gap-0.5 mb-2">
                {[...Array(r.rating)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-[var(--brand-yellow)] text-[var(--brand-yellow)]" />)}
              </div>
              <p className="text-sm leading-relaxed text-white/90">"{r.text}"</p>
              <p className="text-xs font-bold mt-3 text-white/80">— {r.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// avoid lint warnings for unused imports
void Sparkles; void CheckCircle2; void AlertCircle;

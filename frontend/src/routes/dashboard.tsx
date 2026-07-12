import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, BookOpen, Video, PlayCircle, FileText, ClipboardCheck,
  Users, ShoppingBag, Package, Bell, Trophy, Settings, LogOut,
  Search, Calendar, ChevronLeft, ChevronRight, Play, Clock, Star,
  Flame, Award, TrendingUp, ShoppingCart, Heart, Plus, MessageCircle,
  CheckCircle2, AlertCircle, Sparkles, Zap, Target, Crown, Loader2
} from "lucide-react";
import logo from "@/assets/lead-learnhub-logo.png";
import { useStudentDashboard } from "@/hooks/useDashboard";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Student Dashboard — LEAD LearnHub" },
      { name: "description", content: "Your personalized learning hub — classes, tutors, assignments, and achievements." },
      { property: "og:title", content: "Student Dashboard — LEAD LearnHub" },
      { property: "og:description", content: "Your personalized learning hub for Nigerian primary and secondary students." },
    ],
  }),
  component: DashboardPage,
});

const menu = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: BookOpen, label: "My Classes" },
  { icon: Video, label: "Live Lessons", badge: "2" },
  { icon: PlayCircle, label: "Recorded Videos" },
  { icon: FileText, label: "Homework", badge: "3" },
  { icon: ClipboardCheck, label: "Assessments" },
  { icon: Users, label: "Tutors" },
  { icon: ShoppingBag, label: "Marketplace" },
  { icon: Package, label: "My Orders" },
  { icon: Bell, label: "Notifications", badge: "5" },
  { icon: Trophy, label: "Achievements" },
  { icon: Settings, label: "Profile Settings" },
];

const courses = [
  { subject: "Mathematics", tutor: "Mr. Adeyemi", progress: 72, remaining: 6, color: "var(--brand-blue)", emoji: "📐" },
  { subject: "English Language", tutor: "Mrs. Okafor", progress: 58, remaining: 9, color: "var(--brand-pink)", emoji: "📚" },
  { subject: "Basic Science", tutor: "Dr. Bello", progress: 84, remaining: 3, color: "var(--brand-green)", emoji: "🔬" },
  { subject: "Civic Education", tutor: "Mr. Eze", progress: 41, remaining: 12, color: "var(--brand-orange)", emoji: "🏛️" },
  { subject: "Computer Studies", tutor: "Ms. Lawal", progress: 66, remaining: 7, color: "var(--brand-yellow)", emoji: "💻" },
  { subject: "Biology", tutor: "Mrs. Ibrahim", progress: 29, remaining: 14, color: "var(--brand-red)", emoji: "🧬" },
];

const liveClasses = [
  { subject: "Physics — Waves & Sound", teacher: "Engr. Okonkwo", time: "Today · 2:00 PM", live: true, mins: 18 },
  { subject: "Chemistry — The Mole", teacher: "Dr. Yusuf", time: "Today · 4:30 PM", live: false, mins: 165 },
  { subject: "Government — Democracy", teacher: "Barr. Nnamdi", time: "Tomorrow · 10:00 AM", live: false, mins: 1080 },
];

const recorded = [
  { title: "Quadratic Equations", subject: "Math", duration: "24 min", progress: 60, hue: 220 },
  { title: "Photosynthesis Explained", subject: "Biology", duration: "18 min", progress: 35, hue: 145 },
  { title: "Parts of Speech", subject: "English", duration: "32 min", progress: 80, hue: 8 },
  { title: "Newton's Laws", subject: "Physics", duration: "27 min", progress: 15, hue: 264 },
  { title: "Periodic Table", subject: "Chemistry", duration: "22 min", progress: 0, hue: 50 },
  { title: "Demand & Supply", subject: "Economics", duration: "29 min", progress: 50, hue: 92 },
];

const homework = [
  { subject: "Mathematics", title: "Algebra Worksheet 3", due: "Tomorrow", status: "pending" },
  { subject: "English Language", title: "Essay: My Hero", due: "In 3 days", status: "completed" },
  { subject: "Basic Science", title: "Lab Report — Plants", due: "Yesterday", status: "overdue" },
  { subject: "Computer Studies", title: "HTML Project", due: "In 5 days", status: "pending" },
];

const tutors = [
  { name: "Mrs. Adaeze O.", subject: "Mathematics", rating: 4.9, online: true },
  { name: "Mr. Tunde A.", subject: "English Language", rating: 4.8, online: true },
  { name: "Dr. Fatima B.", subject: "Biology", rating: 5.0, online: false },
  { name: "Mr. Chinedu E.", subject: "Physics", rating: 4.7, online: true },
];

const products = [
  { name: "JSS2 Mathematics Textbook", price: "₦3,500", emoji: "📕" },
  { name: "WAEC Past Questions", price: "₦2,200", emoji: "📗" },
  { name: "Science Lab Kit", price: "₦12,000", emoji: "🧪" },
  { name: "AR Biology Atlas", price: "₦5,800", emoji: "🧠" },
];

const achievements = [
  { icon: Flame, label: "7-Day Streak", color: "var(--brand-orange)" },
  { icon: Trophy, label: "Math Champion", color: "var(--brand-yellow)" },
  { icon: Star, label: "Top 10 Class", color: "var(--brand-pink)" },
  { icon: Crown, label: "Quiz Master", color: "var(--brand-blue)" },
  { icon: Zap, label: "Fast Learner", color: "var(--brand-green)" },
  { icon: Target, label: "Goal Crusher", color: "var(--brand-red)" },
];

function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: dashboardData, isLoading, error } = useStudentDashboard();

  if (isLoading) {
    return <div className="min-h-screen bg-[oklch(0.98_0.01_250)] flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  }

  if (error) {
    return <div className="min-h-screen bg-[oklch(0.98_0.01_250)] flex items-center justify-center"><p className="text-red-500">Failed to load dashboard data.</p></div>;
  }

  const { state } = dashboardData || {};

  return (
    <div className="min-h-screen bg-[oklch(0.98_0.01_250)] flex">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main */}
      <div className={`flex-1 min-w-0 transition-all duration-300 ${collapsed ? "lg:ml-20" : "lg:ml-72"}`}>
        <TopBar onMenu={() => setMobileOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8 space-y-8 pb-32">
          {state === 'empty' ? (
            <div className="text-center py-20">
              <h2 className="text-3xl font-bold mb-4">Welcome to LEAD LearnHub!</h2>
              <p className="text-muted-foreground mb-8">You haven't enrolled in any courses yet. Let's get started.</p>
              <Link to="/courses" className="btn-primary">Browse Courses</Link>
            </div>
          ) : (
            <>
              <HeroWelcome />
              <ContinueLearning />
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2"><LiveClasses /></div>
                <NotificationsPanel />
              </div>
              <RecordedLessons />
              <div className="grid lg:grid-cols-2 gap-6">
                <Homework />
                <PerformanceAnalytics />
              </div>
              <PersonalTutors />
              <Marketplace />
              <Achievements />
            </>
          )}
        </main>
      </div>

      {/* Floating quick action */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full text-white grid place-items-center shadow-[var(--shadow-glow)]"
        style={{ background: "var(--gradient-vibrant)" }}
        aria-label="Quick actions"
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

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menu.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative group
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

        <div className="p-3 border-t border-border">
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
          <h1 className="text-xl font-bold">Good Afternoon, David <motion.span animate={{ rotate: [0, 20, -10, 20, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }} className="inline-block">👋</motion.span></h1>
          <p className="text-xs text-muted-foreground">JSS 2 · Greenfield Academy, Lagos</p>
        </div>

        <div className="flex-1 max-w-md mx-auto hidden sm:block">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search courses, tutors, lessons…"
              className="w-full rounded-2xl border border-border bg-secondary/60 pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-primary/15 focus:border-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button className="h-10 w-10 grid place-items-center rounded-xl bg-secondary hover:bg-secondary/80">
            <Calendar className="h-5 w-5 text-foreground/70" />
          </button>
          <button className="relative h-10 w-10 grid place-items-center rounded-xl bg-secondary hover:bg-secondary/80">
            <Bell className="h-5 w-5 text-foreground/70" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[var(--brand-red)] animate-pulse" />
          </button>
          <span className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold text-white" style={{ background: "var(--gradient-warm)" }}>
            <Crown className="h-3 w-3" /> PREMIUM
          </span>
          <div className="h-10 w-10 rounded-xl grid place-items-center text-white font-bold text-sm" style={{ background: "var(--gradient-vibrant)" }}>D</div>
        </div>
      </div>
    </header>
  );
}

/* ---------------- Hero Welcome ---------------- */
function HeroWelcome() {
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

      <div className="relative grid lg:grid-cols-3 gap-8 items-center">
        <div className="lg:col-span-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-semibold">
            <Sparkles className="h-3 w-3" /> Keep up the great work!
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Ready for another <span className="text-gradient-rainbow">brilliant</span> day, David?
          </h2>
          <p className="mt-3 text-white/80 max-w-xl">
            You're 28% closer to finishing your JSS 2 syllabus. One small lesson today keeps the streak alive 🔥
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="btn-primary !bg-white !text-[var(--brand-blue)] hover:!brightness-100" style={{ background: "white" }}>
              <Play className="h-4 w-4" /> Continue Learning
            </button>
            <button className="btn-ghost">View Timetable</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={BookOpen} value="6" label="Active Courses" tint="var(--brand-blue)" />
          <StatCard icon={Flame} value="7" label="Day Streak" tint="var(--brand-orange)" />
          <StatCard icon={Video} value="2" label="Live Today" tint="var(--brand-pink)" />
          <StatCard icon={Award} value="14" label="Badges" tint="var(--brand-yellow)" />
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

/* ---------------- Continue Learning ---------------- */
function SectionHeader({ title, subtitle, action = "See all" }: { title: string; subtitle?: string; action?: string }) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <h3 className="text-xl sm:text-2xl font-bold">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      <button className="text-sm font-semibold text-primary hover:underline">{action}</button>
    </div>
  );
}

function ContinueLearning() {
  const { data } = useStudentDashboard();
  const currentCourses = data?.courses || [];

  return (
    <section>
      <SectionHeader title="Continue Learning" subtitle="Pick up where you left off" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {currentCourses.map((c: any) => (
          <motion.div
            key={c.subject}
            whileHover={{ y: -6 }}
            className="bg-white rounded-3xl p-5 border border-border shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-shadow"
          >
            <div
              className="h-32 rounded-2xl grid place-items-center text-5xl mb-4 relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${c.color}, color-mix(in oklab, ${c.color} 50%, white))` }}
            >
              <span className="relative z-10">{c.emoji}</span>
              <div className="absolute inset-0 bg-white/10" />
            </div>
            <div className="flex items-center justify-between">
              <h4 className="font-bold">{c.subject}</h4>
              <span className="text-xs text-muted-foreground">{c.remaining} lessons left</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-7 w-7 rounded-full grid place-items-center text-[10px] font-bold text-white" style={{ background: c.color }}>
                {c.tutor.split(" ").slice(-1)[0][0]}
              </div>
              <span className="text-xs text-muted-foreground">{c.tutor}</span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-bold" style={{ color: c.color }}>{c.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${c.progress}%` }} transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: c.color }}
                />
              </div>
            </div>
            <button className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110" style={{ background: c.color }}>
              Continue
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Live Classes ---------------- */
function LiveClasses() {
  const { data } = useStudentDashboard();
  const currentLiveClasses = data?.liveClasses || [];

  return (
    <section>
      <SectionHeader title="Live Classes" subtitle="Don't miss your scheduled sessions" />
      <div className="space-y-3">
        {currentLiveClasses.map((c: any) => (
          <motion.div
            whileHover={{ x: 4 }}
            key={c.subject}
            className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-border shadow-[var(--shadow-soft)]"
          >
            <div className="relative h-16 w-24 sm:w-32 rounded-xl grid place-items-center shrink-0" style={{ background: "var(--gradient-brand)" }}>
              <Video className="h-6 w-6 text-white" />
              {c.live && (
                <span className="absolute top-1.5 right-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[var(--brand-red)] text-white text-[9px] font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> LIVE
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold truncate">{c.subject}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">with {c.teacher}</p>
              <p className="text-xs text-primary font-semibold mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3" /> {c.time}
                {c.live && <span className="ml-2 text-[var(--brand-red)]">starts in {c.mins}m</span>}
              </p>
            </div>
            <button
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap ${
                c.live ? "text-white shadow-[var(--shadow-glow)]" : "bg-secondary text-foreground hover:bg-secondary/70"
              }`}
              style={c.live ? { background: "var(--gradient-vibrant)" } : undefined}
            >
              {c.live ? "Join Now" : "Remind Me"}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Notifications Panel ---------------- */
function NotificationsPanel() {
  const items = [
    { icon: FileText, color: "var(--brand-orange)", title: "Algebra worksheet due tomorrow", time: "2h ago" },
    { icon: Video, color: "var(--brand-pink)", title: "Physics live class in 18 minutes", time: "Just now" },
    { icon: MessageCircle, color: "var(--brand-blue)", title: "Mrs. Adaeze sent you a message", time: "1h ago" },
    { icon: ShoppingBag, color: "var(--brand-green)", title: "Your textbook order has shipped", time: "Yesterday" },
  ];
  return (
    <section className="bg-white rounded-3xl p-5 border border-border shadow-[var(--shadow-soft)] h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" /> Notifications
        </h3>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--brand-red)] text-white">5 NEW</span>
      </div>
      <div className="space-y-3">
        {items.map((n, i) => (
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
  const { data } = useStudentDashboard();
  const currentRecorded = data?.recorded || [];

  return (
    <section>
      <SectionHeader title="Recorded Lessons" subtitle="Watch anytime, anywhere" />
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
        {currentRecorded.map((r: any) => (
          <motion.div
            key={r.title}
            whileHover={{ scale: 1.04, y: -4 }}
            className="snap-start shrink-0 w-64 bg-white rounded-2xl overflow-hidden border border-border shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)]"
          >
            <div className="relative h-36" style={{ background: `linear-gradient(135deg, oklch(0.6 0.2 ${r.hue}), oklch(0.45 0.21 ${(r.hue + 60) % 360}))` }}>
              <button className="absolute inset-0 grid place-items-center group">
                <span className="h-12 w-12 rounded-full bg-white/90 grid place-items-center group-hover:scale-110 transition-transform">
                  <Play className="h-5 w-5 text-foreground translate-x-0.5" fill="currentColor" />
                </span>
              </button>
              <span className="absolute bottom-2 right-2 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">{r.duration}</span>
              {r.progress > 0 && (
                <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20">
                  <div className="h-full bg-[var(--brand-red)]" style={{ width: `${r.progress}%` }} />
                </div>
              )}
            </div>
            <div className="p-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{r.subject}</span>
              <h4 className="font-semibold text-sm mt-1 leading-tight">{r.title}</h4>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Homework ---------------- */
function Homework() {
  const { data } = useStudentDashboard();
  const currentHomework = data?.homework || [];
  const styles: Record<string, { bg: string; text: string; icon: any; label: string }> = {
    completed: { bg: "var(--brand-green)", text: "white", icon: CheckCircle2, label: "Completed" },
    pending: { bg: "var(--brand-orange)", text: "white", icon: Clock, label: "Pending" },
    overdue: { bg: "var(--brand-red)", text: "white", icon: AlertCircle, label: "Overdue" },
  };
  return (
    <section className="bg-white rounded-3xl p-6 border border-border shadow-[var(--shadow-soft)]">
      <SectionHeader title="Homework" subtitle="Stay on top of your assignments" />
      <div className="space-y-3">
        {currentHomework.map((h: any) => {
          const s = styles[h.status];
          return (
            <div key={h.title} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 transition-colors">
              <div className="h-10 w-10 rounded-xl grid place-items-center shrink-0" style={{ background: s.bg, color: s.text }}>
                <s.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{h.subject}</p>
                <p className="font-semibold text-sm truncate">{h.title}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: s.bg }}>{s.label}</span>
                <p className="text-[11px] text-muted-foreground mt-1">{h.due}</p>
              </div>
            </div>
          );
        })}
      </div>
      <button className="mt-4 w-full py-3 rounded-xl text-sm font-semibold text-white" style={{ background: "var(--gradient-brand)" }}>
        Upload Assignment
      </button>
    </section>
  );
}

/* ---------------- Performance Analytics ---------------- */
function PerformanceAnalytics() {
  const hours = [3, 5, 4, 6, 5, 7, 4];
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <section className="bg-white rounded-3xl p-6 border border-border shadow-[var(--shadow-soft)]">
      <SectionHeader title="Performance" subtitle="This week's learning insights" />
      <div className="grid grid-cols-3 gap-3 mb-5">
        <RingStat label="Avg Score" value={84} color="var(--brand-blue)" />
        <RingStat label="Attendance" value={96} color="var(--brand-green)" />
        <RingStat label="Goals" value={68} color="var(--brand-pink)" />
      </div>
      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
          <TrendingUp className="h-3 w-3" /> Study hours this week
        </p>
        <div className="flex items-end gap-2 h-32">
          {hours.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <motion.div
                initial={{ height: 0 }} animate={{ height: `${h * 14}px` }} transition={{ duration: 0.8, delay: i * 0.05 }}
                className="w-full rounded-t-lg"
                style={{ background: "var(--gradient-rainbow)" }}
              />
              <span className="text-[10px] text-muted-foreground font-semibold">{days[i]}</span>
            </div>
          ))}
        </div>
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

/* ---------------- Tutors ---------------- */
function PersonalTutors() {
  const { data } = useStudentDashboard();
  const currentTutors = data?.tutors || [];

  return (
    <section>
      <SectionHeader title="Personal Tutors" subtitle="Get one-on-one help from top teachers" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentTutors.map((t: any) => (
          <motion.div
            key={t.name}
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-5 text-center border border-border shadow-[var(--shadow-soft)]"
          >
            <div className="relative inline-block">
              <div className="h-16 w-16 mx-auto rounded-full grid place-items-center text-white text-xl font-bold" style={{ background: "var(--gradient-vibrant)" }}>
                {t.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
              </div>
              {t.online && <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-[var(--brand-green)] border-2 border-white" />}
            </div>
            <h4 className="mt-3 font-bold text-sm">{t.name}</h4>
            <p className="text-xs text-muted-foreground">{t.subject}</p>
            <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold">
              <Star className="h-3 w-3 fill-[var(--brand-yellow)] text-[var(--brand-yellow)]" />
              {t.rating}
            </div>
            <button className="mt-3 w-full py-2 rounded-xl text-xs font-bold text-white" style={{ background: "var(--gradient-brand)" }}>
              Book Tutor
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Marketplace ---------------- */
function Marketplace() {
  return (
    <section>
      <SectionHeader title="Educational Marketplace" subtitle="Books, kits and learning materials" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <motion.div
            key={p.name}
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-4 border border-border shadow-[var(--shadow-soft)] group"
          >
            <div className="relative h-32 rounded-xl grid place-items-center text-5xl mb-3" style={{ background: "linear-gradient(135deg, var(--secondary), color-mix(in oklab, var(--brand-yellow) 20%, white))" }}>
              {p.emoji}
              <button className="absolute top-2 right-2 h-8 w-8 grid place-items-center rounded-full bg-white shadow-md hover:scale-110 transition-transform">
                <Heart className="h-4 w-4 text-[var(--brand-red)]" />
              </button>
            </div>
            <h4 className="font-semibold text-sm leading-tight">{p.name}</h4>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-bold text-primary">{p.price}</span>
              <button className="h-9 w-9 grid place-items-center rounded-xl text-white shadow-[var(--shadow-soft)]" style={{ background: "var(--gradient-brand)" }}>
                <ShoppingCart className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Achievements ---------------- */
function Achievements() {
  const { data } = useStudentDashboard();
  const currentAchievements = data?.achievements || [];

  return (
    <section className="rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      <motion.div
        className="absolute -top-20 right-10 h-72 w-72 rounded-full blur-3xl opacity-40"
        style={{ background: "var(--gradient-warm)" }}
        animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity }}
      />
      <div className="relative">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-2"><Trophy className="h-6 w-6 text-[var(--brand-yellow)]" /> Achievements</h3>
            <p className="text-sm text-white/70 mt-1">You've earned 14 badges this term — keep shining!</p>
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-3xl font-bold text-gradient-rainbow">2,840 XP</div>
            <p className="text-xs text-white/60">Rank #4 in your class</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {currentAchievements.map((a: any) => (
            <motion.div
              key={a.label}
              whileHover={{ y: -4, rotate: -2 }}
              className="glass rounded-2xl p-4 text-center"
            >
              <div className="h-12 w-12 mx-auto rounded-2xl grid place-items-center mb-2" style={{ background: a.color }}>
                <a.icon className="h-6 w-6 text-white" />
              </div>
              <p className="text-[11px] font-semibold">{a.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

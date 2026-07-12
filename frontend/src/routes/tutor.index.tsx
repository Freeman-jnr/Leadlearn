import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, BookOpen, Video, PlayCircle, GraduationCap, FileText,
  ClipboardCheck, Wallet, ShoppingBag, MessageSquare, Calendar as CalIcon,
  Star, Bell, Settings, LogOut, Search, ChevronLeft, ChevronRight,
  Plus, Upload, Play, Users, TrendingUp, DollarSign, Clock,
  CheckCircle2, AlertCircle, MoreVertical, Send, FileUp, Eye,
  PenTool, MessageCircle, Mic, ScreenShare, Sparkles, Award, Sun, Loader2,
  X, Video as VideoIcon, BookOpenCheck
} from "lucide-react";
import logo from "@/assets/lead-learnhub-logo.png";
import { useTutorDashboard } from "@/hooks/useDashboard";
import { useAuthStore } from "@/stores/auth.store";
import { useCreateCourse, useCourses, useCreateLesson, useDeleteLesson } from "@/hooks/useCourses";
import { useCreateLiveClass, useStartLiveClass, useLiveClasses } from "@/hooks/useLiveClass";
import { useCreateAssignment, useAssignments, useDeleteAssignment, useAssessments, useCreateAssessment } from "@/hooks/useTutorData";
import { useCreateMarketplaceItem } from "@/hooks/useTutorData";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/hooks/useNotifications";
import { FilePickerField } from "@/components/FilePickerField";

export const Route = createFileRoute("/tutor/")({
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
  { icon: LayoutDashboard, label: "Dashboard", href: "/tutor-dashboard", active: true },
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

// Static fallback data (used only when API data not yet available)
const FALLBACK_CLASSES = [
  { subject: "Mathematics", level: "JSS 2", students: 48, next: null, progress: 72, color: "var(--brand-blue)", emoji: "📐" },
  { subject: "Physics", level: "SSS 1", students: 36, next: null, progress: 64, color: "var(--brand-pink)", emoji: "⚛️" },
];
const FALLBACK_NOTIFICATIONS = [
  { icon: Users, color: "var(--brand-green)", title: "5 new students enrolled in Physics SSS 1", time: "10m ago" },
  { icon: FileText, color: "var(--brand-blue)", title: "12 new assignment submissions to review", time: "1h ago" },
];

const FALLBACK_REVIEWS = [
  { name: "Mrs. Okonkwo (Parent)", text: "Mr. Adewale's teaching style transformed my daughter's grades. Outstanding!", rating: 5 },
  { name: "Tunde B. (SSS 1)", text: "He explains physics in a way that just clicks. Best tutor on the platform.", rating: 5 },
];
const FALLBACK_LESSONS = [
  { name: "Quadratic Equations Masterclass", subject: "Mathematics", duration: "24:18", views: 1240, hue: 220 },
  { name: "Newton's Laws Visual Guide", subject: "Physics", duration: "18:42", views: 890, hue: 264 },
];
const FALLBACK_ASSIGNMENTS = [
  { title: "Algebra Test — Chapter 5", course: "Mathematics · JSS 2", dueDate: null, submitted: 36, total: 48, status: "active" },
];
const FALLBACK_MATERIALS = [
  { name: "JSS 2 Math Workbook (PDF)", type: "PDF", sales: 142, price: "₦2,500", emoji: "📕" },
];
function TutorDashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLiveClassModalOpen, setIsLiveClassModalOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const { data: dashboardData, isLoading, error } = useTutorDashboard();
  const { user } = useAuthStore();

  if (isLoading) {
    return <div className="min-h-screen bg-[oklch(0.98_0.01_250)] flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  }

  if (error) {
    return <div className="min-h-screen bg-[oklch(0.98_0.01_250)] flex items-center justify-center"><p className="text-red-500">Failed to load dashboard data.</p></div>;
  }

  const { state } = dashboardData || {};

  return (
    <>
      <div className="relative">
        <main className="p-4 sm:p-6 lg:p-8 space-y-8 pb-32">
          {state === 'empty' ? (
            <div className="text-center py-20">
              <h2 className="text-3xl font-bold mb-4">Welcome to LEAD LearnHub!</h2>
              <p className="text-muted-foreground mb-8">You haven't created any courses yet. Let's build your first class.</p>
              <button className="btn-primary" onClick={() => setIsCreateModalOpen(true)}>Create Course</button>
            </div>
          ) : (
            <>
              <HeroOverview 
                onStartLiveClass={() => setIsLiveClassModalOpen(true)}
                onUploadLesson={() => setIsLessonModalOpen(true)}
                onCreateAssignment={() => setIsAssignmentModalOpen(true)}
              />
              <ClassManagement />
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col gap-6">
                  <LiveClassroom />
                  <RecordedLessons onUploadLesson={() => setIsLessonModalOpen(true)} />
                </div>
                <NotificationsPanel />
              </div>
              <div className="grid lg:grid-cols-2 gap-6">
                <Assignments />
                <StudentPerformance />
              </div>
              <Earnings />
              <div className="grid lg:grid-cols-1 gap-6">
                <Schedule />
              </div>
              <Marketplace />
              <Reviews />
            </>
          )}
        </main>
      </div>

      <motion.div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        <AnimatePresence>
          {fabOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex flex-col items-end gap-2 mb-1"
            >
              {[
                { label: "New Course", icon: BookOpen, action: () => { setIsCreateModalOpen(true); setFabOpen(false); }},
                { label: "Start Live Class", icon: Video, action: () => { setIsLiveClassModalOpen(true); setFabOpen(false); }},
                { label: "Upload Lesson", icon: PlayCircle, action: () => { setIsLessonModalOpen(true); setFabOpen(false); }},
                { label: "Create Assignment", icon: FileText, action: () => { setIsAssignmentModalOpen(true); setFabOpen(false); }},
              ].map(item => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onClick={item.action}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-foreground shadow-lg border border-border font-semibold text-sm hover:bg-secondary transition-colors"
                >
                  <item.icon className="h-4 w-4 text-primary" />
                  {item.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          onClick={() => setFabOpen(v => !v)}
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
          className="h-14 w-14 rounded-full text-white grid place-items-center shadow-[var(--shadow-glow)] transition-transform"
          style={{ background: "var(--gradient-vibrant)" }}
          aria-label="Quick actions"
        >
          <motion.div animate={{ rotate: fabOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
            <Plus className="h-6 w-6" />
          </motion.div>
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {isCreateModalOpen && <CourseCreationModal onClose={() => setIsCreateModalOpen(false)} />}
        {isLiveClassModalOpen && <StartLiveClassModal courses={dashboardData?.classes || []} onClose={() => setIsLiveClassModalOpen(false)} />}
        {isAssignmentModalOpen && <CreateAssignmentModal courses={dashboardData?.classes || []} onClose={() => setIsAssignmentModalOpen(false)} />}
        {isLessonModalOpen && <UploadLessonModal courses={dashboardData?.classes || []} onClose={() => setIsLessonModalOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

function CourseCreationModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const createCourseMutation = useCreateCourse();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCourseMutation.mutate(
      { title, description },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 grid place-items-center rounded-full hover:bg-secondary text-muted-foreground transition-colors"
        >
          ✕
        </button>
        <h3 className="text-2xl font-bold mb-1">Create New Course</h3>
        <p className="text-sm text-muted-foreground mb-6">Set up your class space for students.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Course Title</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Physics for SSS 1"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Description</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will students learn in this course?"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={createCourseMutation.isPending}
            className="w-full py-3 rounded-xl font-bold text-white mt-6 disabled:opacity-70 transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "var(--gradient-brand)" }}
          >
            {createCourseMutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Creating...
              </span>
            ) : (
              "Create Course"
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>
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
            <Link
              to={item.href}
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

/* ---------------- Top Bar ---------------- */
function TopBar({ onMenu, user }: { onMenu: () => void, user: any }) {
  const tutorName = user ? `${user.firstName} ${user.lastName}` : "Tutor";
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-border">
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
function HeroOverview({ onStartLiveClass, onUploadLesson, onCreateAssignment }: { onStartLiveClass?: () => void, onUploadLesson?: () => void, onCreateAssignment?: () => void }) {
  const { data } = useTutorDashboard();
  const { user } = useAuthStore();
  const stats = data?.stats || {};
  const tutorName = user ? `${user.firstName} ${user.lastName}` : 'Tutor';
  const totalStudents = stats.totalStudents ?? '—';
  const activeCourses = stats.activeCourses ?? '—';
  const totalEarnings = stats.totalEarnings != null
    ? (stats.totalEarnings >= 1000000
        ? `₦${(stats.totalEarnings / 1000000).toFixed(1)}M`
        : `₦${(stats.totalEarnings / 1000).toFixed(0)}K`)
    : '₦—';
  const rating = stats.rating != null ? stats.rating.toFixed(1) : '—';

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
            Empowering{' '}
            <span className="text-gradient-rainbow">{totalStudents} student{typeof totalStudents === 'number' && totalStudents !== 1 ? 's' : ''}</span>{' '}
            across Nigeria
          </h2>
          <p className="mt-3 text-white/80 max-w-xl italic">
            "A teacher affects eternity; he can never tell where his influence stops." — Henry Adams
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={onStartLiveClass} className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-[var(--brand-blue)] bg-white shadow-lg hover:scale-105 transition-transform">
              <Video className="h-4 w-4" /> Start Live Class
            </button>
            <button onClick={onUploadLesson} className="btn-ghost"><Upload className="h-4 w-4" /> Upload Lesson</button>
            <button onClick={onCreateAssignment} className="btn-ghost"><FileText className="h-4 w-4" /> Create Assignment</button>
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 gap-3">
          <StatCard icon={Users} value={String(totalStudents)} label="Total Students" tint="var(--brand-blue)" />
          <StatCard icon={BookOpen} value={String(activeCourses)} label="Active Classes" tint="var(--brand-pink)" />
          <StatCard icon={DollarSign} value={totalEarnings} label="This Month" tint="var(--brand-green)" />
          <StatCard icon={Star} value={rating} label="Avg Rating" tint="var(--brand-yellow)" />
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
  const { data } = useTutorDashboard();
  const currentClasses = data?.classes || classes;

  return (
    <section>
      <SectionHeader title="My Classes" subtitle="Manage your subjects and student groups" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {currentClasses.map((c: any) => (
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
  const { data: sessions } = useLiveClasses();
  const { user } = useAuthStore();
  const navigate = useNavigate({ from: "/tutor/" });

  const activeSession = sessions?.find((s: any) => s.isLive || new Date(s.scheduledAt).getTime() > Date.now() - 3600000);

  if (!activeSession) return null;

  const sessionId = activeSession.id;
  const jitsiRoom = activeSession.meetingUrl || `leadlearnhub-${sessionId}`;
  const jitsiUrl = `https://meet.jit.si/${jitsiRoom}#userInfo.displayName="${encodeURIComponent(user ? `${user.firstName} ${user.lastName}` : 'User')}"&config.startWithAudioMuted=true&config.startWithVideoMuted=true&config.prejoinPageEnabled=false&interfaceConfig.SHOW_JITSI_WATERMARK=false`;

  return (
    <section>
      <div className="flex items-end justify-between mb-5 gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            Live Classroom
            {activeSession.isLive && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--brand-red)] text-white text-[10px] font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> LIVE
              </span>
            )}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{activeSession.title || 'Live Session'}</p>
        </div>
        <button 
          onClick={() => navigate({ to: `/tutor/live-sessions/${sessionId}` })} 
          className="text-sm font-semibold text-primary hover:underline whitespace-nowrap"
        >
          Open Full Studio
        </button>
      </div>
      <div className="rounded-3xl overflow-hidden border border-border shadow-[var(--shadow-soft)] bg-gray-900 h-[450px]">
        <iframe
          src={jitsiUrl}
          allow="camera; microphone; display-capture; autoplay; clipboard-write"
          allowFullScreen
          className="w-full h-full border-0"
          title="Jitsi Meet"
        />
      </div>
    </section>
  );
}

/* ---------------- Notifications ---------------- */
function NotificationsPanel() {
  const { data } = useNotifications(5);
  const currentNotifications = data?.notifications || [];

  return (
    <section className="bg-white rounded-3xl p-5 border border-border shadow-[var(--shadow-soft)] h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" /> Notifications
        </h3>
        {data?.unreadCount > 0 && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--brand-red)] text-white">{data.unreadCount} NEW</span>
        )}
      </div>
      <div className="space-y-3 flex-1 overflow-y-auto">
        {currentNotifications.length > 0 ? currentNotifications.map((n: any) => (
          <div key={n.id} className={`flex items-start gap-3 p-3 rounded-xl hover:bg-secondary/60 transition-colors ${!n.isRead ? "bg-primary/5" : ""}`}>
            <div className="h-9 w-9 rounded-xl grid place-items-center shrink-0 text-white bg-[var(--brand-blue)]">
              <Bell className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm leading-tight ${!n.isRead ? "font-bold text-foreground" : "font-medium text-muted-foreground"}`}>{n.title}</p>
              <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">{n.message}</p>
              <p className="text-[10px] text-muted-foreground opacity-70 mt-0.5">{new Date(n.createdAt).toLocaleTimeString()}</p>
            </div>
          </div>
        )) : (
          <div className="text-center py-6 text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No notifications yet</p>
          </div>
        )}
      </div>
      <Link to="/tutor/notifications" className="block text-center mt-3 w-full py-2 rounded-xl text-xs font-semibold text-primary hover:bg-primary/5 shrink-0">
        View all notifications
      </Link>
    </section>
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

/* ---------------- Recorded Lessons ---------------- */
function RecordedLessons({ onUploadLesson }: { onUploadLesson: () => void }) {
  const { data } = useTutorDashboard();
  const deleteMutation = useDeleteLesson();
  const HUE_LIST = [220, 264, 145, 92, 30, 0, 180, 300];
  const lessons = data?.recordedLessons || [];

  return (
    <section>
      <div className="flex items-end justify-between mb-5 gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold">Recorded Lessons</h3>
          <p className="text-sm text-muted-foreground mt-1">Manage your video library</p>
        </div>
        <button onClick={onUploadLesson} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: "var(--gradient-brand)" }}>
          <Upload className="h-4 w-4" /> Upload New
        </button>
      </div>
      {lessons.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-border shadow-[var(--shadow-soft)] text-center py-12">
          <PlayCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
          <p className="text-sm text-muted-foreground mb-4">No recorded lessons yet.</p>
          <button onClick={onUploadLesson} className="btn-primary py-2 px-4 text-xs font-semibold">Upload First Lesson</button>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
          {lessons.map((lesson: any, idx: number) => {
            const hue = lesson.hue ?? HUE_LIST[idx % HUE_LIST.length];
            const title = lesson.name || lesson.title || 'Untitled';
            const views = lesson.views ?? 0;
            const duration = lesson.duration || '—';
            const subject = lesson.subject || '';
            return (
              <motion.div
                key={lesson.id || title} whileHover={{ scale: 1.04, y: -4 }}
                className="snap-start shrink-0 w-72 bg-white rounded-2xl overflow-hidden border border-border shadow-[var(--shadow-soft)]"
              >
                <div className="relative h-40" style={{ background: `linear-gradient(135deg, oklch(0.6 0.2 ${hue}), oklch(0.45 0.21 ${(hue + 60) % 360}))` }}>
                  {lesson.videoUrl ? (
                    <a href={lesson.videoUrl} target="_blank" rel="noreferrer" className="absolute inset-0 grid place-items-center group">
                      <span className="h-12 w-12 rounded-full bg-white/90 grid place-items-center group-hover:scale-110 transition-transform">
                        <Play className="h-5 w-5 text-foreground translate-x-0.5" fill="currentColor" />
                      </span>
                    </a>
                  ) : (
                    <button className="absolute inset-0 grid place-items-center group">
                      <span className="h-12 w-12 rounded-full bg-white/90 grid place-items-center group-hover:scale-110 transition-transform">
                        <Play className="h-5 w-5 text-foreground translate-x-0.5" fill="currentColor" />
                      </span>
                    </button>
                  )}
                  <span className="absolute bottom-2 right-2 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded">{duration}m</span>
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-foreground">
                    <Eye className="h-3 w-3" /> {views.toLocaleString()}
                  </span>
                </div>
                <div className="p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{subject}</span>
                  <h4 className="font-semibold text-sm mt-1 leading-tight line-clamp-2">{title}</h4>
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold bg-secondary hover:bg-secondary/70">Edit</button>
                    <button onClick={() => deleteMutation.mutate(lesson.id)} className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold text-[var(--brand-red)] bg-[var(--brand-red)]/10 hover:bg-[var(--brand-red)]/20">Delete</button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* ---------------- Assignments & Assessments ---------------- */
function Assignments() {
  const { data: dashboardData } = useTutorDashboard();
  const { data: assignmentsData, isLoading: loadingA } = useAssignments();
  const { data: assessmentsData, isLoading: loadingB } = useAssessments();
  const deleteAssignmentMutation = useDeleteAssignment();
  const [tab, setTab] = useState<'assignments' | 'assessments'>('assignments');
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);

  const assignments: any[] = assignmentsData || [];
  const assessments: any[] = assessmentsData || [];

  return (
    <section className="bg-white rounded-3xl p-6 border border-border shadow-[var(--shadow-soft)]">
      <SectionHeader title="Assignments & Assessments" subtitle="Review submissions and create new tests" />

      {/* Tab Toggle */}
      <div className="flex gap-2 mb-4 p-1 bg-secondary/60 rounded-xl">
        <button
          onClick={() => setTab('assignments')}
          className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${
            tab === 'assignments' ? 'bg-white shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Assignments {assignments.length > 0 && <span className="ml-1 text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{assignments.length}</span>}
        </button>
        <button
          onClick={() => setTab('assessments')}
          className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${
            tab === 'assessments' ? 'bg-white shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          CBT Tests {assessments.length > 0 && <span className="ml-1 text-[10px] font-bold bg-[var(--brand-orange)]/10 text-[var(--brand-orange)] px-1.5 py-0.5 rounded-full">{assessments.length}</span>}
        </button>
      </div>

      {/* Assignments Tab */}
      {tab === 'assignments' && (
        <div className="space-y-3">
          {loadingA ? (
            <div className="py-6 text-center"><Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" /></div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto mb-2 opacity-20" />
              <p className="text-sm">No assignments yet.</p>
            </div>
          ) : assignments.map((a: any) => {
            const submitted = a.submitted ?? 0;
            const total = a.total ?? 1;
            const pct = Math.round((submitted / Math.max(total, 1)) * 100);
            return (
              <div key={a.id} className="p-4 rounded-2xl border border-border hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{a.course}</p>
                    <h4 className="font-bold text-sm mt-0.5 leading-tight">{a.title}</h4>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--brand-blue)] text-white">
                      ACTIVE
                    </span>
                    <button
                      onClick={() => deleteAssignmentMutation.mutate(a.id)}
                      className="h-6 w-6 grid place-items-center rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs">
                  <span className="text-muted-foreground"><Clock className="h-3 w-3 inline" /> Due {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : 'TBD'}</span>
                  <span className="font-semibold">{submitted}/{total} submitted</span>
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
      )}

      {/* Assessments Tab */}
      {tab === 'assessments' && (
        <div className="space-y-3">
          {loadingB ? (
            <div className="py-6 text-center"><Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" /></div>
          ) : assessments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ClipboardCheck className="h-10 w-10 mx-auto mb-2 opacity-20" />
              <p className="text-sm">No CBT tests yet.</p>
            </div>
          ) : assessments.map((a: any) => (
            <div key={a.id} className="p-4 rounded-2xl border border-border hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{a.course}</p>
                  <h4 className="font-bold text-sm mt-0.5 leading-tight">{a.title}</h4>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--brand-orange)] text-white shrink-0">CBT</span>
              </div>
              <div className="mt-2 flex items-center gap-3 text-xs">
                {a.dueDate && <span className="text-muted-foreground"><Clock className="h-3 w-3 inline" /> Due {new Date(a.dueDate).toLocaleDateString()}</span>}
                <span className="font-semibold">{a.submissions ?? 0} submissions</span>
                {a.avgScore != null && <span className="text-[var(--brand-green)] font-bold">Avg {a.avgScore}%</span>}
              </div>
              <button className="mt-3 text-xs font-bold text-primary hover:underline">View results →</button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={() => setIsAssignmentModalOpen(true)}
          className="py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "var(--gradient-brand)" }}
        >
          + New Assignment
        </button>
        <button
          onClick={() => setIsAssessmentModalOpen(true)}
          className="py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "var(--gradient-warm)" }}
        >
          Create CBT Test
        </button>
      </div>

      <AnimatePresence>
        {isAssignmentModalOpen && <CreateAssignmentModal courses={dashboardData?.classes || []} onClose={() => setIsAssignmentModalOpen(false)} />}
        {isAssessmentModalOpen && <CreateAssessmentInlineModal courses={dashboardData?.classes || []} onClose={() => setIsAssessmentModalOpen(false)} />}
      </AnimatePresence>
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
  const { data } = useTutorDashboard();
  const stats = data?.stats || {};
  const transactions: any[] = data?.transactions || [];
  const totalEarnings = stats.totalEarnings || 0;
  const pending = transactions.filter((t: any) => t.status === 'pending').reduce((acc: number, t: any) => acc + t.amount, 0);
  const now = new Date();
  const thisMonth = transactions
    .filter((t: any) => { const d = new Date(t.date || t.createdAt); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); })
    .reduce((acc: number, t: any) => acc + t.amount, 0);

  const formatNGN = (v: number) => v >= 1_000_000 ? `₦${(v/1_000_000).toFixed(1)}M` : v >= 1000 ? `₦${(v/1000).toFixed(0)}K` : `₦${v.toLocaleString()}`;

  // Monthly chart data (last 7 months)
  const months = (() => {
    const buckets: { m: string; v: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString('default', { month: 'short' });
      const amount = transactions
        .filter((t: any) => { const td = new Date(t.date || t.createdAt); return td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear(); })
        .reduce((acc: number, t: any) => acc + t.amount, 0);
      buckets.push({ m: label, v: amount });
    }
    return buckets;
  })();
  const maxV = Math.max(...months.map(m => m.v), 1);

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
          <EarnCard label="Total Earnings" value={formatNGN(totalEarnings)} tint="var(--brand-green)" trend="+18%" />
          <EarnCard label="This Month" value={formatNGN(thisMonth)} tint="var(--brand-blue)" trend="+24%" />
          <EarnCard label="Pending Payout" value={formatNGN(pending)} tint="var(--brand-orange)" trend="3 days" />
          <EarnCard label="Transactions" value={String(transactions.length)} tint="var(--brand-pink)" trend="" />
        </div>

        <div className="rounded-2xl p-5 bg-white/5 backdrop-blur border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">Revenue trend</p>
          </div>
          <div className="flex items-end gap-3 h-40">
            {months.map((bar, i) => (
              <div key={bar.m} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }} animate={{ height: `${(bar.v / maxV) * 140}px` }} transition={{ duration: 0.9, delay: i * 0.05 }}
                  className="w-full rounded-t-xl relative group" style={{ minHeight: '4px', background: i === months.length - 1 ? "var(--gradient-rainbow)" : "linear-gradient(180deg, color-mix(in oklab, var(--brand-blue) 80%, white) 0%, var(--brand-blue) 100%)" }}
                >
                  {bar.v > 0 && (
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-white text-foreground px-1.5 py-0.5 rounded whitespace-nowrap">
                      {formatNGN(bar.v)}
                    </span>
                  )}
                </motion.div>
                <span className="text-[10px] text-white/60 font-semibold">{bar.m}</span>
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


/* ---------------- Schedule / Calendar ---------------- */
function Schedule() {
  const { data } = useTutorDashboard();
  const schedule: any[] = data?.schedule || [];
  const now = new Date();

  // Build actual week days
  const todayDate = new Date();
  const startOfWeek = new Date(todayDate);
  startOfWeek.setDate(todayDate.getDate() - todayDate.getDay() + 1); // Monday
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return { label: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i], date: d.getDate(), isToday: d.toDateString() === todayDate.toDateString() };
  });

  // Get events for today
  const todayEvents = schedule
    .filter(s => new Date(s.time).toDateString() === todayDate.toDateString())
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  // If no events today, show next 4 upcoming
  const displayEvents = todayEvents.length > 0
    ? todayEvents
    : schedule.filter(s => new Date(s.time) > now).slice(0, 4);

  return (
    <section className="bg-white rounded-3xl p-6 border border-border shadow-[var(--shadow-soft)]">
      <SectionHeader title="Schedule" subtitle="This week's teaching timeline" action="Full calendar" />
      <div className="grid grid-cols-7 gap-1.5 mb-5">
        {week.map((d) => (
          <div key={d.label} className={`text-center py-2 rounded-xl text-xs font-semibold ${
            d.isToday ? "text-white shadow-[var(--shadow-glow)]" : "bg-secondary/60 text-foreground/70"
          }`} style={d.isToday ? { background: "var(--gradient-brand)" } : undefined}>
            <div className="text-[10px] opacity-80">{d.label}</div>
            <div className="text-base font-bold mt-0.5">{d.date}</div>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {displayEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No upcoming events this week</p>
        ) : (
          displayEvents.map((e: any) => {
            const color = e.type === 'live' ? 'var(--brand-blue)' : e.type === 'assignment' ? 'var(--brand-orange)' : 'var(--brand-pink)';
            const timeStr = new Date(e.time).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
            return (
              <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl border-l-4 bg-secondary/40" style={{ borderColor: color }}>
                <div className="text-xs font-bold text-muted-foreground w-12">{timeStr}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{e.title}</p>
                  <p className="text-[11px] text-muted-foreground">{e.courseTitle}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

/* ---------------- Marketplace ---------------- */
function Marketplace() {
  const { data } = useTutorDashboard();
  const currentMaterials = data?.materials?.length ? data.materials : FALLBACK_MATERIALS;

  return (
    <section>
      <div className="flex items-end justify-between mb-5 gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold">Marketplace</h3>
          <p className="text-sm text-muted-foreground mt-1">Browse and buy educational materials for your classes</p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {currentMaterials.map((mat: any, idx: number) => (
          <motion.div
            key={mat.id || mat.name || idx} whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-4 border border-border shadow-[var(--shadow-soft)]"
          >
            <div className="relative h-32 rounded-xl grid place-items-center text-5xl mb-3" style={{ background: "linear-gradient(135deg, var(--secondary), color-mix(in oklab, var(--brand-blue) 15%, white))" }}>
              <span>{mat.emoji || '📄'}</span>
              <span className="absolute top-2 left-2 text-[9px] font-bold bg-white px-1.5 py-0.5 rounded">{mat.type}</span>
            </div>
            <h4 className="font-semibold text-sm leading-tight line-clamp-2">{mat.name || mat.title}</h4>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{mat.sales || 0} sold</span>
              <span className="font-bold text-primary">{mat.price}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold text-white" style={{ background: "var(--gradient-brand)" }}>Buy Material</button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Reviews ---------------- */
function Reviews() {
  const { data } = useTutorDashboard();
  const currentReviews = data?.reviews?.length ? data.reviews : FALLBACK_REVIEWS;
  const avgRating = data?.stats?.rating || 0;
  const totalReviews = data?.stats?.totalReviews || currentReviews.length;

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
            <div className="text-3xl font-bold mt-1 text-gradient-rainbow">{avgRating.toFixed(1)} / 5.0</div>
            <p className="text-xs text-white/60">Based on {totalReviews} reviews</p>
          </div>
        </div>

        {currentReviews.length === 0 ? (
          <p className="text-white/60 text-center py-8">No reviews yet. Complete courses to receive ratings!</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {currentReviews.map((r: any) => (
              <motion.div key={r.id || r.name} whileHover={{ y: -4 }} className="glass rounded-2xl p-5">
                <div className="flex gap-0.5 mb-2">
                  {[...Array(r.rating)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-[var(--brand-yellow)] text-[var(--brand-yellow)]" />)}
                </div>
                <p className="text-sm leading-relaxed text-white/90">"{r.comment || r.text}"</p>
                <p className="text-xs font-bold mt-3 text-white/80">— {r.student || r.name}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// avoid lint warnings for unused imports
void Sparkles; void CheckCircle2; void AlertCircle; void useNavigate;

/* ====== Additional Modals ====== */

function ModalShell({ title, subtitle, onClose, children }: {
  title: string; subtitle?: string; onClose: () => void; children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-4 right-4 h-8 w-8 grid place-items-center rounded-full hover:bg-secondary text-muted-foreground transition-colors">✕</button>
        <h3 className="text-2xl font-bold mb-1">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground mb-6">{subtitle}</p>}
        {children}
      </motion.div>
    </motion.div>
  );
}

function StartLiveClassModal({ courses, onClose }: { courses: any[]; onClose: () => void }) {
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [title, setTitle] = useState('');
  const [scheduledAt, setScheduledAt] = useState(new Date().toISOString().slice(0, 16));
  const [durationMins, setDurationMins] = useState(60);
  const createMutation = useCreateLiveClass();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { courseId, title, scheduledAt: new Date(scheduledAt).toISOString(), durationMins },
      { onSuccess: (data) => { onClose(); navigate({ to: `/tutor/live-sessions/${data.id}` }); } }
    );
  };

  return (
    <ModalShell title="Start Live Class" subtitle="Schedule or start a new live session with Jitsi Meet." onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <div>
          <label className="block text-sm font-semibold mb-1.5">Course</label>
          <select value={courseId} onChange={e => setCourseId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary">
            {courses.map((c: any) => <option key={c.id} value={c.id}>{c.subject}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Session Title</label>
          <input required value={title} onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Chapter 5 – Introduction" className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Scheduled Time</label>
          <input type="datetime-local" required value={scheduledAt} onChange={e => setScheduledAt(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Duration (minutes)</label>
          <input type="number" min={15} max={240} value={durationMins} onChange={e => setDurationMins(Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary" />
        </div>
        <button type="submit" disabled={createMutation.isPending}
          className="w-full py-3 rounded-xl font-bold text-white mt-6 disabled:opacity-70 transition-all hover:scale-[1.02]"
          style={{ background: 'var(--gradient-brand)' }}>
          {createMutation.isPending ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Starting...</span> : '🎥 Start Live Class'}
        </button>
      </form>
    </ModalShell>
  );
}

function CreateAssignmentModal({ courses, onClose }: { courses: any[]; onClose: () => void }) {
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [childUploading, setChildUploading] = useState(false);
  const createMutation = useCreateAssignment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { courseId, title, description, dueDate: new Date(dueDate).toISOString(), fileUrl: fileUrl || undefined },
      { onSuccess: onClose }
    );
  };

  return (
    <ModalShell title="Create Assignment" subtitle="Post a new assignment for your students." onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <div>
          <label className="block text-sm font-semibold mb-1.5">Course</label>
          <select value={courseId} onChange={e => setCourseId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary">
            {courses.map((c: any) => <option key={c.id} value={c.id}>{c.subject}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Assignment Title</label>
          <input required value={title} onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Chapter 3 Worksheet" className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Description</label>
          <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)}
            placeholder="Instructions for students…" className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary resize-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Due Date</label>
          <input type="datetime-local" required value={dueDate} onChange={e => setDueDate(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary" />
        </div>
        <FilePickerField
          label="Attachment"
          bucket="assignments"
          accept="application/pdf,image/*,.doc,.docx,.ppt,.pptx"
          value={fileUrl}
          onChange={setFileUrl}
          onUploadStateChange={setChildUploading}
          optional
          hint="PDF, Word, PowerPoint, or image — optional"
        />
        <button type="submit" disabled={createMutation.isPending || childUploading}
          className="w-full py-3 rounded-xl font-bold text-white mt-6 disabled:opacity-70 transition-all hover:scale-[1.02]"
          style={{ background: 'var(--gradient-brand)' }}>
          {createMutation.isPending ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Creating...</span> : '📝 Create Assignment'}
        </button>
      </form>
    </ModalShell>
  );
}



function UploadLessonModal({ courses, onClose }: { courses: any[]; onClose: () => void }) {
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(15);
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [videoMode, setVideoMode] = useState<'upload' | 'url'>('upload');
  const [childUploading, setChildUploading] = useState(false);
  const createMutation = useCreateLesson();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      {
        courseId,
        payload: {
          title,
          videoUrl: videoUrl || null,
          thumbnailUrl: thumbnailUrl || null,
          duration: parseInt(String(duration)),
        },
      },
      { onSuccess: onClose }
    );
  };

  return (
    <ModalShell title="Upload Lesson" subtitle="Add a new recorded video lesson to one of your courses." onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <div>
          <label className="block text-sm font-semibold mb-1.5">Course</label>
          <select value={courseId} onChange={e => setCourseId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary">
            {courses.map((c: any) => <option key={c.id} value={c.id}>{c.subject}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Lesson Title</label>
          <input required value={title} onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Chapter 4 – Trigonometry Fundamentals" className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Duration (minutes)</label>
          <input type="number" min={1} value={duration} onChange={e => setDuration(Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary" />
        </div>

        {/* Video — toggle between file upload and URL */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-semibold">Video</label>
            <div className="flex gap-1 p-0.5 bg-secondary rounded-lg">
              <button type="button" onClick={() => setVideoMode('upload')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${ videoMode === 'upload' ? 'bg-white shadow text-foreground' : 'text-muted-foreground' }`}>
                Upload
              </button>
              <button type="button" onClick={() => setVideoMode('url')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${ videoMode === 'url' ? 'bg-white shadow text-foreground' : 'text-muted-foreground' }`}>
                Paste URL
              </button>
            </div>
          </div>
          {videoMode === 'upload' ? (
            <FilePickerField
              label=""
              bucket="videos"
              accept="video/*"
              value={videoUrl}
              onChange={setVideoUrl}
              onUploadStateChange={setChildUploading}
              optional
              hint="MP4, WebM, MOV — uploaded to cloud storage"
            />
          ) : (
            <input
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/embed/... or direct video URL"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary"
            />
          )}
        </div>

        <FilePickerField
          label="Thumbnail"
          bucket="thumbnails"
          accept="image/*"
          value={thumbnailUrl}
          onChange={setThumbnailUrl}
          onUploadStateChange={setChildUploading}
          optional
          hint="JPG, PNG, WebP — cover image for this lesson"
        />

        <button type="submit" disabled={createMutation.isPending || childUploading}
          className="w-full py-3 rounded-xl font-bold text-white mt-6 disabled:opacity-70 transition-all hover:scale-[1.02]"
          style={{ background: 'var(--gradient-brand)' }}>
          {createMutation.isPending ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</span> : '📤 Upload Lesson'}
        </button>
      </form>
    </ModalShell>
  );
}

function CreateAssessmentInlineModal({ courses, onClose }: { courses: any[]; onClose: () => void }) {
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const createMutation = useCreateAssessment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { courseId, title, description, questions: [], dueDate: dueDate ? new Date(dueDate).toISOString() : undefined },
      { onSuccess: onClose }
    );
  };

  return (
    <ModalShell title="Create CBT Test" subtitle="Schedule a new computer-based test for your students." onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <div>
          <label className="block text-sm font-semibold mb-1.5">Course</label>
          <select value={courseId} onChange={e => setCourseId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary">
            {courses.length === 0 ? <option>No courses yet</option> : courses.map((c: any) => <option key={c.id} value={c.id}>{c.subject || c.title}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Test Title</label>
          <input required value={title} onChange={e => setTitle(e.target.value)}
            placeholder="e.g. End of Term Examination"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Description</label>
          <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)}
            placeholder="Topics covered, instructions…"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary resize-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Due Date (optional)</label>
          <input type="datetime-local" value={dueDate} onChange={e => setDueDate(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary" />
        </div>
        <button type="submit" disabled={createMutation.isPending || courses.length === 0}
          className="w-full py-3 rounded-xl font-bold text-white mt-6 disabled:opacity-70 transition-all hover:scale-[1.02]"
          style={{ background: 'var(--gradient-warm)' }}>
          {createMutation.isPending ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Creating…</span> : '✅ Create Assessment'}
        </button>
      </form>
    </ModalShell>
  );
}

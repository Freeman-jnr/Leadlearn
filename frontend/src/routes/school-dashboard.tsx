import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, Video, PlayCircle,
  ClipboardCheck, ShoppingBag, Package, BarChart3, Megaphone, Calendar as CalIcon,
  Bell, CreditCard, Settings, LogOut, Search, ChevronLeft, ChevronRight,
  Plus, Upload, Play, TrendingUp, Sparkles, CheckCircle2, AlertCircle,
  Mic, ScreenShare, PenTool, MessageCircle, Send, Eye, MoreVertical,
  School, UserCheck, Wallet, FileText, Truck, Award, Filter,
} from "lucide-react";
import logo from "@/assets/lead-learnhub-logo.png";

export const Route = createFileRoute("/school-dashboard")({
  head: () => ({
    meta: [
      { title: "School Dashboard — LEAD LearnHub" },
      { name: "description", content: "Manage students, teachers, classes, assessments and resources for your institution on LEAD LearnHub." },
      { property: "og:title", content: "School Dashboard — LEAD LearnHub" },
      { property: "og:description", content: "Premium institutional command center for Nigerian schools." },
    ],
  }),
  component: SchoolDashboardPage,
});

const menu = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: GraduationCap, label: "Students", badge: "1.2K" },
  { icon: Users, label: "Teachers" },
  { icon: BookOpen, label: "Classes" },
  { icon: FileText, label: "Subjects" },
  { icon: Video, label: "Live Sessions", badge: "3" },
  { icon: PlayCircle, label: "Recorded Lessons" },
  { icon: ClipboardCheck, label: "Assessments & Exams" },
  { icon: ShoppingBag, label: "Marketplace Resources" },
  { icon: Package, label: "Orders & Inventory" },
  { icon: BarChart3, label: "School Analytics" },
  { icon: Megaphone, label: "Announcements", badge: "2" },
  { icon: CalIcon, label: "Calendar & Events" },
  { icon: Bell, label: "Notifications", badge: "9" },
  { icon: CreditCard, label: "Subscription Plan" },
  { icon: Settings, label: "Settings" },
];

const students = [
  { name: "Chioma Adeyemi", id: "GFC/2024/0142", class: "JSS 2A", attendance: 96, grade: "A", color: "var(--brand-pink)" },
  { name: "Tunde Bakare", id: "GFC/2024/0231", class: "SSS 1B", attendance: 88, grade: "B+", color: "var(--brand-blue)" },
  { name: "Aisha Mohammed", id: "GFC/2024/0388", class: "JSS 3C", attendance: 92, grade: "A-", color: "var(--brand-orange)" },
  { name: "David Okafor", id: "GFC/2024/0419", class: "SSS 2A", attendance: 79, grade: "B", color: "var(--brand-green)" },
  { name: "Fatima Ibrahim", id: "GFC/2024/0502", class: "JSS 1B", attendance: 94, grade: "A", color: "var(--brand-yellow)" },
];

const teachers = [
  { name: "Mr. Adewale O.", subject: "Mathematics", classes: 6, rating: 4.9, status: "online", color: "var(--brand-blue)" },
  { name: "Mrs. Okafor N.", subject: "English Language", classes: 5, rating: 4.8, status: "online", color: "var(--brand-pink)" },
  { name: "Dr. Bello K.", subject: "Physics & Chemistry", classes: 4, rating: 4.7, status: "away", color: "var(--brand-green)" },
  { name: "Mr. Eze C.", subject: "Computer Studies", classes: 5, rating: 4.9, status: "online", color: "var(--brand-orange)" },
];

const classes = [
  { name: "Mathematics", level: "JSS 2A", students: 42, teacher: "Mr. Adewale", next: "Today · 10:00", emoji: "📐", color: "var(--brand-blue)" },
  { name: "English Language", level: "JSS 3B", students: 38, teacher: "Mrs. Okafor", next: "Today · 11:30", emoji: "📖", color: "var(--brand-pink)" },
  { name: "Physics", level: "SSS 1A", students: 31, teacher: "Dr. Bello", next: "Today · 14:00", emoji: "⚛️", color: "var(--brand-green)" },
  { name: "Civic Education", level: "JSS 1C", students: 45, teacher: "Mrs. Adamu", next: "Tomorrow · 9:00", emoji: "🏛️", color: "var(--brand-orange)" },
  { name: "Computer Studies", level: "SSS 2B", students: 29, teacher: "Mr. Eze", next: "Tomorrow · 13:00", emoji: "💻", color: "var(--brand-yellow)" },
  { name: "Biology", level: "SSS 3A", students: 33, teacher: "Mrs. Yusuf", next: "Wed · 10:30", emoji: "🧬", color: "var(--brand-red)" },
];

const recordedLessons = [
  { title: "Algebra Foundations — JSS 2", subject: "Mathematics", duration: "28:14", views: 412, hue: 220 },
  { title: "Photosynthesis Explained", subject: "Biology", duration: "22:08", views: 386, hue: 145 },
  { title: "The Nigerian Constitution", subject: "Civic Ed.", duration: "31:45", views: 524, hue: 30 },
  { title: "Intro to HTML & CSS", subject: "Computer", duration: "45:02", views: 698, hue: 264 },
];

const assessments = [
  { title: "Mid-Term Mathematics Exam", class: "JSS 2 · All sections", submitted: 124, total: 132, status: "active" },
  { title: "English Comprehension Quiz", class: "JSS 3B", submitted: 36, total: 38, status: "review" },
  { title: "Physics CBT — Chapter 4", class: "SSS 1A", submitted: 18, total: 31, status: "active" },
];

const resources = [
  { name: "JSS Mathematics Textbook", type: "Textbook", stock: 248, sold: 412, price: "₦3,500", emoji: "📕" },
  { name: "SSS Physics QR Book", type: "QR Book", stock: 86, sold: 198, price: "₦4,800", emoji: "📘" },
  { name: "Civic Ed. VR Edition", type: "VR Book", stock: 52, sold: 144, price: "₦6,200", emoji: "🥽" },
  { name: "JSS English Workbook", type: "Workbook", stock: 312, sold: 521, price: "₦2,100", emoji: "📙" },
];

const announcements = [
  { title: "Mid-term break starts next Friday", from: "Principal's Office", time: "1h", color: "var(--brand-blue)", priority: "high" },
  { title: "PTA meeting rescheduled to Saturday", from: "Admin", time: "4h", color: "var(--brand-orange)", priority: "med" },
  { title: "New STEM lab equipment delivered", from: "Facilities", time: "1d", color: "var(--brand-green)", priority: "low" },
];

const events = [
  { day: "Mon", date: 12, title: "Inter-house Sports Heats", time: "08:00", color: "var(--brand-orange)" },
  { day: "Tue", date: 13, title: "JSS 3 Mock WAEC begins", time: "09:00", color: "var(--brand-blue)" },
  { day: "Wed", date: 14, title: "Science Fair Setup", time: "13:00", color: "var(--brand-green)" },
  { day: "Thu", date: 15, title: "PTA General Meeting", time: "10:00", color: "var(--brand-pink)" },
  { day: "Fri", date: 16, title: "Cultural Day Celebration", time: "All day", color: "var(--brand-yellow)" },
];

const orders = [
  { id: "#ORD-2841", item: "JSS Math Textbook × 120", buyer: "Bright Future Academy", amount: "₦420,000", status: "Delivered", color: "var(--brand-green)" },
  { id: "#ORD-2840", item: "Physics QR Book × 45", buyer: "Hope Secondary School", amount: "₦216,000", status: "In transit", color: "var(--brand-orange)" },
  { id: "#ORD-2839", item: "English Workbook × 200", buyer: "Greenfield College", amount: "₦420,000", status: "Processing", color: "var(--brand-blue)" },
];

function SchoolDashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[hsl(220_30%_97%)]">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className={`flex-1 min-w-0 transition-all duration-300 ${collapsed ? "lg:ml-20" : "lg:ml-72"}`}>
        <TopBar onMenu={() => setMobileOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8 space-y-8 pb-32">
          <HeroOverview />
          <StudentManagement />
          <TeacherManagement />
          <ClassroomManagement />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2"><LiveSessionManagement /></div>
            <AnnouncementsPanel />
          </div>
          <RecordedLessonsLibrary />
          <div className="grid lg:grid-cols-2 gap-6">
            <AssessmentSection />
            <SchoolAnalytics />
          </div>
          <MarketplaceResources />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2"><OrdersInventory /></div>
            <CalendarEvents />
          </div>
          <SubscriptionBilling />
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
            Institution Workspace
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
              <p className="text-[10px] font-bold uppercase opacity-80">Premium Plan</p>
              <p className="text-xl font-bold mt-0.5">1,500 seats</p>
              <p className="text-[11px] opacity-90">Renews March 24, 2026</p>
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

        <div className="hidden md:flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl grid place-items-center text-white shadow-md" style={{ background: "var(--gradient-brand)" }}>
            <School className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold flex items-center gap-1">
              Welcome Back, Greenfield College
              <motion.span animate={{ rotate: [0, 20, -10, 20, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}>👋</motion.span>
            </h1>
            <p className="text-xs text-muted-foreground">Lagos · 1,248 students · Premium institution</p>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-auto hidden lg:block">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search students, teachers, classes…"
              className="w-full rounded-2xl border border-border bg-secondary/60 pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-4 focus:ring-primary/15 focus:border-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white" style={{ background: "var(--gradient-brand)" }}>
            <Sparkles className="h-3.5 w-3.5" /> Premium
          </span>
          <button className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white" style={{ background: "var(--gradient-vibrant)" }}>
            <Plus className="h-3.5 w-3.5" /> Quick Action
          </button>
          <button className="relative h-10 w-10 grid place-items-center rounded-xl bg-secondary hover:bg-secondary/80">
            <Bell className="h-5 w-5 text-foreground/70" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[var(--brand-red)] animate-pulse" />
          </button>
          <button className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl bg-secondary hover:bg-secondary/80">
            <span className="h-8 w-8 rounded-lg grid place-items-center text-white font-bold text-sm" style={{ background: "var(--gradient-vibrant)" }}>GC</span>
            <span className="hidden xl:block text-xs font-semibold">Greenfield</span>
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

/* ---------------- 1. Hero Overview ---------------- */
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
            <Award className="h-3 w-3" /> Top-Performing Institution · Q1 2026
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Your school is shaping <span className="text-gradient-rainbow">1,248 futures</span>
          </h2>
          <p className="mt-3 text-white/80 max-w-xl">
            Engagement is up 18% this term. Keep building Nigeria's next generation of innovators with LEAD LearnHub.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-[var(--brand-blue)] bg-white shadow-lg hover:scale-105 transition-transform">
              <BookOpen className="h-4 w-4" /> Create Class
            </button>
            <button className="btn-ghost"><Upload className="h-4 w-4" /> Upload Materials</button>
            <button className="btn-ghost"><Video className="h-4 w-4" /> Schedule Live Session</button>
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 gap-3">
          <StatCard icon={GraduationCap} value="1,248" label="Total Students" tint="var(--brand-blue)" />
          <StatCard icon={Users} value="86" label="Teachers" tint="var(--brand-pink)" />
          <StatCard icon={BookOpen} value="142" label="Active Classes" tint="var(--brand-green)" />
          <StatCard icon={Video} value="3" label="Live Today" tint="var(--brand-orange)" />
          <StatCard icon={TrendingUp} value="92%" label="Engagement" tint="var(--brand-yellow)" />
          <StatCard icon={ShoppingBag} value="184" label="Orders" tint="var(--brand-red)" />
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
      <p className="text-xl font-bold leading-tight">{value}</p>
      <p className="text-[11px] text-white/80">{label}</p>
    </motion.div>
  );
}

/* ---------------- 2. Student Management ---------------- */
function StudentManagement() {
  return (
    <section>
      <SectionHeader title="Student Management" subtitle="Profiles, attendance, and academic performance" action="Manage all" />
      <div className="rounded-3xl bg-white border border-border shadow-[var(--shadow-soft)] overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 p-4 border-b border-border">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input placeholder="Search students…" className="w-full rounded-xl bg-secondary/60 border border-border pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary" />
          </div>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary text-xs font-semibold"><Filter className="h-3.5 w-3.5" /> Filter</button>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white ml-auto" style={{ background: "var(--gradient-brand)" }}>
            <Plus className="h-3.5 w-3.5" /> Add Student
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="text-left font-semibold px-5 py-3">Student</th>
                <th className="text-left font-semibold px-5 py-3">Class</th>
                <th className="text-left font-semibold px-5 py-3">Attendance</th>
                <th className="text-left font-semibold px-5 py-3">Grade</th>
                <th className="text-right font-semibold px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <motion.tr key={s.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="border-t border-border hover:bg-secondary/30">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full grid place-items-center text-white font-bold text-sm" style={{ background: s.color }}>
                        {s.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-semibold leading-tight">{s.name}</p>
                        <p className="text-[11px] text-muted-foreground">{s.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3"><span className="inline-flex px-2 py-1 rounded-md bg-secondary text-xs font-semibold">{s.class}</span></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${s.attendance}%`, background: "var(--gradient-brand)" }} />
                      </div>
                      <span className="text-xs font-semibold">{s.attendance}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3"><span className="font-bold text-[var(--brand-green)]">{s.grade}</span></td>
                  <td className="px-5 py-3 text-right"><button className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary inline-grid"><MoreVertical className="h-4 w-4" /></button></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 3. Teacher Management ---------------- */
function TeacherManagement() {
  return (
    <section>
      <SectionHeader title="Teachers & Tutors" subtitle="Manage your teaching staff and assignments" action="Manage Staff" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {teachers.map((t, i) => (
          <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            className="rounded-2xl bg-white border border-border p-5 shadow-[var(--shadow-soft)]">
            <div className="flex items-start justify-between">
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl grid place-items-center text-white font-bold" style={{ background: t.color }}>
                  {t.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <span className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${t.status === "online" ? "bg-[var(--brand-green)]" : "bg-[var(--brand-yellow)]"}`} />
              </div>
              <button className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary"><MoreVertical className="h-4 w-4" /></button>
            </div>
            <h4 className="mt-3 font-bold leading-tight">{t.name}</h4>
            <p className="text-xs text-muted-foreground">{t.subject}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-xl bg-secondary/60 py-2">
                <p className="text-sm font-bold">{t.classes}</p>
                <p className="text-[10px] text-muted-foreground">Classes</p>
              </div>
              <div className="rounded-xl bg-secondary/60 py-2">
                <p className="text-sm font-bold flex items-center justify-center gap-0.5">{t.rating}<Award className="h-3 w-3 text-[var(--brand-yellow)]" /></p>
                <p className="text-[10px] text-muted-foreground">Rating</p>
              </div>
            </div>
            <button className="mt-3 w-full rounded-xl text-xs font-bold py-2 text-white" style={{ background: "var(--gradient-brand)" }}>Assign Tutor</button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- 4. Classroom Management ---------------- */
function ClassroomManagement() {
  return (
    <section>
      <SectionHeader title="Classroom Management" subtitle="All active virtual & physical classrooms" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((c, i) => (
          <motion.div key={c.name + c.level} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            whileHover={{ y: -6 }}
            className="rounded-2xl bg-white border border-border overflow-hidden shadow-[var(--shadow-soft)] group">
            <div className="h-24 relative" style={{ background: `linear-gradient(135deg, ${c.color}, color-mix(in oklab, ${c.color} 50%, white))` }}>
              <div className="absolute inset-0 grid place-items-center text-5xl">{c.emoji}</div>
              <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full bg-white/30 backdrop-blur text-white">{c.level}</span>
            </div>
            <div className="p-4">
              <h4 className="font-bold">{c.name}</h4>
              <p className="text-xs text-muted-foreground">{c.teacher}</p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 text-muted-foreground"><Users className="h-3 w-3" /> {c.students} students</span>
                <span className="inline-flex items-center gap-1 text-muted-foreground"><CalIcon className="h-3 w-3" /> {c.next}</span>
              </div>
              <button className="mt-3 w-full rounded-xl text-xs font-bold py-2 text-white" style={{ background: c.color }}>Open Classroom</button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- 5. Live Session Management ---------------- */
function LiveSessionManagement() {
  return (
    <section>
      <SectionHeader title="Live Session Management" subtitle="Stream, monitor, and moderate" action="Open studio" />
      <div className="rounded-3xl bg-[#0F172A] text-white overflow-hidden border border-border shadow-[var(--shadow-soft)]">
        <div className="relative aspect-video bg-gradient-to-br from-slate-800 via-slate-900 to-black">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-red)] text-xs font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> LIVE · 142 viewers
          </motion.div>
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-xs font-semibold">Mathematics · JSS 2A</div>
          <div className="absolute inset-0 grid place-items-center">
            <button className="h-20 w-20 rounded-full bg-white/15 backdrop-blur grid place-items-center hover:scale-110 transition-transform">
              <Play className="h-8 w-8 ml-1" />
            </button>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2 rounded-2xl bg-black/60 backdrop-blur">
            {[Mic, Video, ScreenShare, PenTool, MessageCircle].map((Icon, idx) => (
              <button key={idx} className="h-9 w-9 grid place-items-center rounded-xl hover:bg-white/15"><Icon className="h-4 w-4" /></button>
            ))}
            <button className="ml-2 px-3 py-1.5 rounded-xl bg-[var(--brand-red)] text-xs font-bold">End</button>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          <div className="p-4">
            <p className="text-[10px] uppercase tracking-wider text-white/60 font-bold">Next Session</p>
            <p className="mt-1 text-sm font-bold">Physics · SSS 1A</p>
            <p className="text-xs text-white/70">Starts in 1h 24m</p>
          </div>
          <div className="p-4">
            <p className="text-[10px] uppercase tracking-wider text-white/60 font-bold">Attendance</p>
            <p className="mt-1 text-sm font-bold">142 / 156 students</p>
            <p className="text-xs text-[var(--brand-green)]">91% present</p>
          </div>
          <div className="p-4">
            <p className="text-[10px] uppercase tracking-wider text-white/60 font-bold">Whiteboard</p>
            <p className="mt-1 text-sm font-bold">Quadratic Equations</p>
            <p className="text-xs text-white/70">Slide 12 of 24</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function AnnouncementsPanel() {
  return (
    <section>
      <SectionHeader title="Announcements" action="New post" />
      <div className="rounded-3xl bg-white border border-border p-4 shadow-[var(--shadow-soft)] space-y-3 h-full">
        {announcements.map((a, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
            className="flex gap-3 p-3 rounded-2xl hover:bg-secondary/40 cursor-pointer">
            <div className="h-10 w-10 shrink-0 rounded-xl grid place-items-center text-white" style={{ background: a.color }}>
              <Megaphone className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight">{a.title}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{a.from} · {a.time} ago</p>
            </div>
            {a.priority === "high" && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[var(--brand-red)]/15 text-[var(--brand-red)] h-fit">HIGH</span>}
          </motion.div>
        ))}
        <button className="w-full mt-2 rounded-xl text-xs font-bold py-2.5 text-white" style={{ background: "var(--gradient-vibrant)" }}>
          <Send className="h-3.5 w-3.5 inline mr-1.5" /> Broadcast Message
        </button>
      </div>
    </section>
  );
}

/* ---------------- 6. Recorded Lessons Library ---------------- */
function RecordedLessonsLibrary() {
  return (
    <section>
      <SectionHeader title="Recorded Lessons Library" subtitle="Manage your school's video archive" action="Upload Lesson" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recordedLessons.map((l, i) => (
          <motion.div key={l.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.03 }}
            className="rounded-2xl bg-white border border-border overflow-hidden shadow-[var(--shadow-soft)] group">
            <div className="aspect-video relative" style={{ background: `linear-gradient(135deg, hsl(${l.hue} 80% 60%), hsl(${l.hue + 30} 70% 45%))` }}>
              <div className="absolute inset-0 grid place-items-center">
                <div className="h-12 w-12 rounded-full bg-white/30 backdrop-blur grid place-items-center group-hover:scale-110 transition-transform">
                  <Play className="h-5 w-5 text-white ml-0.5" />
                </div>
              </div>
              <span className="absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 text-white">{l.duration}</span>
            </div>
            <div className="p-3">
              <p className="text-sm font-bold leading-tight line-clamp-1">{l.title}</p>
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{l.subject}</span>
                <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" /> {l.views}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- 7. Assessments & CBT ---------------- */
function AssessmentSection() {
  return (
    <section>
      <SectionHeader title="Assessments & Exams" subtitle="CBT, quizzes & grading" action="Quiz Builder" />
      <div className="rounded-3xl bg-white border border-border p-5 shadow-[var(--shadow-soft)] space-y-3">
        {assessments.map((a, i) => {
          const pct = Math.round((a.submitted / a.total) * 100);
          return (
            <motion.div key={a.title} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="p-4 rounded-2xl border border-border hover:border-primary/40 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold leading-tight">{a.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{a.class}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${a.status === "review" ? "bg-[var(--brand-orange)]/15 text-[var(--brand-orange)]" : "bg-[var(--brand-green)]/15 text-[var(--brand-green)]"}`}>
                  {a.status === "review" ? "Needs Review" : "Active"}
                </span>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-muted-foreground">{a.submitted}/{a.total} submitted</span>
                  <span className="font-bold">{pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 0.8 }}
                    className="h-full rounded-full" style={{ background: "var(--gradient-brand)" }} />
                </div>
              </div>
            </motion.div>
          );
        })}
        <button className="w-full mt-1 rounded-xl text-xs font-bold py-2.5 border-2 border-dashed border-border hover:border-primary hover:text-primary transition-colors">
          <Plus className="h-3.5 w-3.5 inline mr-1" /> Create Assessment
        </button>
      </div>
    </section>
  );
}

/* ---------------- 9. School Analytics ---------------- */
function SchoolAnalytics() {
  const bars = [62, 78, 84, 71, 92, 88, 95];
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <section>
      <SectionHeader title="School Analytics" subtitle="Engagement & performance trends" action="Full report" />
      <div className="rounded-3xl bg-white border border-border p-5 shadow-[var(--shadow-soft)]">
        <div className="grid grid-cols-3 gap-3 mb-5">
          <Ring label="Engagement" value={92} color="var(--brand-blue)" />
          <Ring label="Attendance" value={87} color="var(--brand-green)" />
          <Ring label="Completion" value={78} color="var(--brand-orange)" />
        </div>
        <p className="text-xs font-semibold text-muted-foreground mb-2">Weekly engagement</p>
        <div className="flex items-end gap-2 h-32">
          {bars.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <motion.div initial={{ height: 0 }} whileInView={{ height: `${h}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.06 }}
                className="w-full rounded-t-lg" style={{ background: "var(--gradient-brand)" }} />
              <span className="text-[10px] font-bold text-muted-foreground">{days[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Ring({ label, value, color }: { label: string; value: number; color: string }) {
  const r = 28, c = 2 * Math.PI * r, off = c - (value / 100) * c;
  return (
    <div className="text-center">
      <div className="relative inline-block">
        <svg width="72" height="72" className="-rotate-90">
          <circle cx="36" cy="36" r={r} stroke="hsl(var(--secondary))" strokeWidth="6" fill="none" />
          <motion.circle cx="36" cy="36" r={r} stroke={color} strokeWidth="6" fill="none" strokeLinecap="round"
            strokeDasharray={c} initial={{ strokeDashoffset: c }} whileInView={{ strokeDashoffset: off }} viewport={{ once: true }} transition={{ duration: 1.2 }} />
        </svg>
        <span className="absolute inset-0 grid place-items-center text-sm font-bold">{value}%</span>
      </div>
      <p className="text-[11px] mt-1 font-semibold text-muted-foreground">{label}</p>
    </div>
  );
}

/* ---------------- 8. Marketplace Resources ---------------- */
function MarketplaceResources() {
  return (
    <section>
      <SectionHeader title="Marketplace & Educational Resources" subtitle="Textbooks, VR/QR books, worksheets" action="Upload Resource" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {resources.map((r, i) => (
          <motion.div key={r.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            className="rounded-2xl bg-white border border-border p-4 shadow-[var(--shadow-soft)]">
            <div className="text-4xl mb-2">{r.emoji}</div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-secondary uppercase">{r.type}</span>
            <h4 className="font-bold mt-2 leading-tight">{r.name}</h4>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div><p className="text-muted-foreground text-[10px]">Stock</p><p className="font-bold">{r.stock}</p></div>
              <div><p className="text-muted-foreground text-[10px]">Sold</p><p className="font-bold">{r.sold}</p></div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-bold text-[var(--brand-green)]">{r.price}</span>
              <button className="text-[11px] font-bold px-3 py-1.5 rounded-lg text-white" style={{ background: "var(--gradient-brand)" }}>Manage</button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- 12. Orders & Inventory ---------------- */
function OrdersInventory() {
  return (
    <section>
      <SectionHeader title="Orders & Inventory" subtitle="Bulk orders and delivery tracking" action="All orders" />
      <div className="rounded-3xl bg-white border border-border overflow-hidden shadow-[var(--shadow-soft)]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="text-left font-semibold px-5 py-3">Order</th>
                <th className="text-left font-semibold px-5 py-3">Buyer</th>
                <th className="text-left font-semibold px-5 py-3">Amount</th>
                <th className="text-left font-semibold px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <motion.tr key={o.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="border-t border-border hover:bg-secondary/30">
                  <td className="px-5 py-3">
                    <p className="font-bold text-xs">{o.id}</p>
                    <p className="text-[11px] text-muted-foreground">{o.item}</p>
                  </td>
                  <td className="px-5 py-3 text-xs">{o.buyer}</td>
                  <td className="px-5 py-3 font-bold text-[var(--brand-green)] text-xs">{o.amount}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: `color-mix(in oklab, ${o.color} 15%, white)`, color: o.color }}>
                      <Truck className="h-3 w-3" /> {o.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 11. Calendar & Events ---------------- */
function CalendarEvents() {
  return (
    <section>
      <SectionHeader title="Calendar & Events" action="Full calendar" />
      <div className="rounded-3xl bg-white border border-border p-4 shadow-[var(--shadow-soft)] space-y-2 h-full">
        {events.map((e, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/40 cursor-pointer">
            <div className="h-12 w-12 shrink-0 rounded-xl grid place-items-center text-white text-center" style={{ background: e.color }}>
              <div>
                <p className="text-[9px] uppercase font-bold leading-none">{e.day}</p>
                <p className="text-base font-bold leading-tight">{e.date}</p>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight truncate">{e.title}</p>
              <p className="text-[11px] text-muted-foreground">{e.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- 13. Subscription & Billing ---------------- */
function SubscriptionBilling() {
  return (
    <section>
      <SectionHeader title="Subscription & Billing" subtitle="Manage your school plan and seats" action="Billing history" />
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-3xl p-6 text-white relative overflow-hidden shadow-[var(--shadow-glow)]" style={{ background: "var(--gradient-hero)" }}>
          <motion.div className="absolute -top-10 -right-10 h-48 w-48 rounded-full blur-3xl opacity-50" style={{ background: "var(--gradient-vibrant)" }}
            animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity }} />
          <div className="relative">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 text-[10px] font-bold uppercase">
              <Sparkles className="h-3 w-3" /> Premium Institution
            </span>
            <h4 className="mt-3 text-3xl font-bold">₦1.2M <span className="text-base font-normal opacity-80">/term</span></h4>
            <p className="text-sm opacity-90 mt-1">1,500 student seats · 100 teacher accounts · Unlimited classes</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-white/10 backdrop-blur p-3">
                <p className="text-[10px] uppercase opacity-80 font-bold">Used</p>
                <p className="text-lg font-bold">1,248</p>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur p-3">
                <p className="text-[10px] uppercase opacity-80 font-bold">Remaining</p>
                <p className="text-lg font-bold">252</p>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur p-3">
                <p className="text-[10px] uppercase opacity-80 font-bold">Renews</p>
                <p className="text-lg font-bold">Mar 24</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button className="rounded-full px-4 py-2 text-xs font-bold bg-white text-[var(--brand-blue)]">Upgrade Plan</button>
              <button className="rounded-full px-4 py-2 text-xs font-bold bg-white/15 backdrop-blur">Manage Seats</button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-border p-5 shadow-[var(--shadow-soft)]">
          <p className="text-xs font-bold uppercase text-muted-foreground">Payment Method</p>
          <div className="mt-3 rounded-2xl p-4 text-white" style={{ background: "var(--gradient-warm)" }}>
            <div className="flex items-center justify-between">
              <CreditCard className="h-5 w-5" />
              <span className="text-[10px] font-bold">VISA</span>
            </div>
            <p className="mt-4 font-mono text-sm tracking-widest">•••• •••• •••• 4821</p>
            <div className="mt-2 flex justify-between text-[10px]">
              <span>Greenfield College</span>
              <span>Exp 09/28</span>
            </div>
          </div>
          <button className="mt-3 w-full rounded-xl text-xs font-bold py-2.5 bg-secondary hover:bg-secondary/70">
            <Plus className="h-3.5 w-3.5 inline mr-1" /> Add Payment Method
          </button>
          <div className="mt-4 pt-4 border-t border-border space-y-2">
            <div className="flex justify-between text-xs"><span className="text-muted-foreground">Last invoice</span><span className="font-semibold">₦1,200,000</span></div>
            <div className="flex justify-between text-xs"><span className="text-muted-foreground">Next billing</span><span className="font-semibold">Mar 24, 2026</span></div>
            <div className="flex justify-between text-xs"><span className="text-muted-foreground">Status</span><span className="font-bold text-[var(--brand-green)] inline-flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Active</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

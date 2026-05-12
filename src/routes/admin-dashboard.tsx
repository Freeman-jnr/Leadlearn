import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, GraduationCap, School, BookOpen, Video, PlayCircle,
  ShoppingBag, Package, ClipboardCheck, CreditCard, Wallet, BarChart3,
  Megaphone, Bell, FileText, Shield, Settings, LogOut, Search, ChevronLeft,
  ChevronRight, Plus, TrendingUp, TrendingDown, Sparkles, CheckCircle2,
  AlertCircle, MoreVertical, Eye, Filter, Download, UserCheck, Star, Send,
  Globe, Activity, Zap, Mail, MessageCircle, Sun, Moon, ChevronDown,
  Edit3, Trash2, Image as ImageIcon, Lock, Server, Calendar as CalIcon,
} from "lucide-react";
import logo from "@/assets/lead-learnhub-logo.png";

export const Route = createFileRoute("/admin-dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — LEAD LearnHub" },
      { name: "description", content: "Enterprise-grade admin command center for managing students, tutors, schools, courses, marketplace, payments and analytics on LEAD LearnHub." },
      { property: "og:title", content: "Admin Dashboard — LEAD LearnHub" },
      { property: "og:description", content: "Premium SaaS admin dashboard for Nigeria's leading EdTech platform." },
    ],
  }),
  component: AdminDashboardPage,
});

const menu = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: GraduationCap, label: "Students", badge: "24.8K" },
  { icon: UserCheck, label: "Tutors", badge: "1.2K" },
  { icon: School, label: "Schools" },
  { icon: BookOpen, label: "Courses" },
  { icon: Video, label: "Live Classes", badge: "12" },
  { icon: PlayCircle, label: "Recorded Lessons" },
  { icon: ShoppingBag, label: "Marketplace" },
  { icon: Package, label: "Orders & Inventory" },
  { icon: ClipboardCheck, label: "Assessments & CBT" },
  { icon: CreditCard, label: "Subscriptions" },
  { icon: Wallet, label: "Payments & Revenue" },
  { icon: BarChart3, label: "Analytics & Reports" },
  { icon: Megaphone, label: "Announcements", badge: "3" },
  { icon: Bell, label: "Notifications", badge: "18" },
  { icon: FileText, label: "CMS / Content" },
  { icon: Shield, label: "Roles & Permissions" },
  { icon: Settings, label: "Settings" },
];

const stats = [
  { label: "Total Students", value: "24,812", change: "+12.4%", up: true, icon: GraduationCap, color: "var(--brand-pink)" },
  { label: "Total Tutors", value: "1,248", change: "+6.2%", up: true, icon: UserCheck, color: "var(--brand-blue)" },
  { label: "Registered Schools", value: "342", change: "+9.8%", up: true, icon: School, color: "var(--brand-orange)" },
  { label: "Active Live Sessions", value: "12", change: "Live now", up: true, icon: Video, color: "var(--brand-green)" },
  { label: "Monthly Revenue", value: "₦48.2M", change: "+18.6%", up: true, icon: Wallet, color: "var(--brand-yellow)" },
  { label: "Marketplace Orders", value: "3,421", change: "+4.1%", up: true, icon: ShoppingBag, color: "var(--brand-purple)" },
  { label: "Active Subscriptions", value: "8,914", change: "+11.2%", up: true, icon: CreditCard, color: "var(--brand-teal)" },
  { label: "Platform Growth", value: "+24.6%", change: "vs last quarter", up: true, icon: TrendingUp, color: "var(--brand-pink)" },
];

const revenueWeek = [42, 58, 49, 72, 65, 88, 94];
const studentsBars = [60, 72, 65, 80, 78, 90, 95, 88];

const studentsList = [
  { name: "Chioma Adeyemi", id: "LH-24812", school: "Greenfield College", plan: "Premium", status: "Active", color: "var(--brand-pink)" },
  { name: "Tunde Bakare", id: "LH-24813", school: "Lagos Model", plan: "Standard", status: "Active", color: "var(--brand-blue)" },
  { name: "Aisha Mohammed", id: "LH-24814", school: "Kaduna Int'l", plan: "Premium", status: "Suspended", color: "var(--brand-orange)" },
  { name: "David Okafor", id: "LH-24815", school: "Enugu Grammar", plan: "Free", status: "Active", color: "var(--brand-green)" },
  { name: "Fatima Ibrahim", id: "LH-24816", school: "Abuja Capital", plan: "Premium", status: "Active", color: "var(--brand-yellow)" },
];

const tutorsList = [
  { name: "Dr. Adebayo Samuel", subject: "Mathematics", rating: 4.9, students: 1240, earnings: "₦1.2M", verified: true, color: "var(--brand-blue)" },
  { name: "Mrs. Ngozi Eze", subject: "English Lang.", rating: 4.8, students: 980, earnings: "₦890K", verified: true, color: "var(--brand-pink)" },
  { name: "Mr. Ibrahim Yusuf", subject: "Physics", rating: 4.7, students: 720, earnings: "₦640K", verified: false, color: "var(--brand-orange)" },
  { name: "Ms. Funmi Olatunji", subject: "Biology", rating: 4.9, students: 1100, earnings: "₦1.05M", verified: true, color: "var(--brand-green)" },
];

const schoolsList = [
  { name: "Greenfield College", students: 1240, classes: 32, plan: "Enterprise", growth: "+12%", color: "var(--brand-green)" },
  { name: "Lagos Model Academy", students: 890, classes: 24, plan: "Pro", growth: "+8%", color: "var(--brand-blue)" },
  { name: "Abuja Capital School", students: 1560, classes: 41, plan: "Enterprise", growth: "+15%", color: "var(--brand-orange)" },
  { name: "Kaduna International", students: 720, classes: 19, plan: "Pro", growth: "+6%", color: "var(--brand-pink)" },
];

const courses = [
  { title: "JSS Mathematics Mastery", tutor: "Dr. Adebayo S.", students: 2412, status: "Approved", color: "var(--brand-blue)" },
  { title: "WAEC English Prep", tutor: "Mrs. Ngozi E.", students: 1890, status: "Pending", color: "var(--brand-pink)" },
  { title: "Physics for SSS", tutor: "Mr. Ibrahim Y.", students: 1320, status: "Approved", color: "var(--brand-orange)" },
  { title: "Biology Foundations", tutor: "Ms. Funmi O.", students: 1640, status: "Featured", color: "var(--brand-green)" },
];

const liveSessions = [
  { title: "Algebra Live • JSS 2", tutor: "Dr. Adebayo", attendance: 248, color: "var(--brand-blue)" },
  { title: "Essay Writing • SSS 3", tutor: "Mrs. Ngozi", attendance: 189, color: "var(--brand-pink)" },
  { title: "Newton's Laws • SSS 1", tutor: "Mr. Ibrahim", attendance: 156, color: "var(--brand-orange)" },
];

const lessons = [
  { title: "Quadratic Equations", views: "12.4K", duration: "42m", color: "var(--brand-blue)" },
  { title: "Photosynthesis Explained", views: "9.8K", duration: "38m", color: "var(--brand-green)" },
  { title: "Civic Rights & Duties", views: "7.2K", duration: "29m", color: "var(--brand-orange)" },
  { title: "Shakespeare's Macbeth", views: "11.1K", duration: "51m", color: "var(--brand-pink)" },
  { title: "Geometry Basics", views: "6.5K", duration: "34m", color: "var(--brand-purple)" },
];

const products = [
  { name: "JSS Mathematics Textbook", type: "Textbook", price: "₦4,500", stock: 240, sales: 1820, color: "var(--brand-blue)" },
  { name: "WAEC Past Questions", type: "Assessment", price: "₦3,200", stock: 180, sales: 2410, color: "var(--brand-pink)" },
  { name: "VR Biology Lab", type: "VR/QR Book", price: "₦12,000", stock: 64, sales: 320, color: "var(--brand-green)" },
  { name: "Physics Workbook", type: "Workbook", price: "₦2,800", stock: 320, sales: 980, color: "var(--brand-orange)" },
];

const orders = [
  { id: "#ORD-9241", school: "Greenfield College", items: 120, total: "₦540K", status: "Delivered", color: "var(--brand-green)" },
  { id: "#ORD-9242", school: "Lagos Model", items: 80, total: "₦360K", status: "Shipped", color: "var(--brand-blue)" },
  { id: "#ORD-9243", school: "Abuja Capital", items: 240, total: "₦1.08M", status: "Processing", color: "var(--brand-orange)" },
  { id: "#ORD-9244", school: "Kaduna Int'l", items: 60, total: "₦270K", status: "Pending", color: "var(--brand-yellow)" },
];

const plans = [
  { name: "Free", price: "₦0", subs: 12480, color: "var(--brand-blue)" },
  { name: "Standard", price: "₦2,500/mo", subs: 4810, color: "var(--brand-orange)" },
  { name: "Premium", price: "₦6,500/mo", subs: 1880, color: "var(--brand-pink)" },
  { name: "Enterprise", price: "Custom", subs: 342, color: "var(--brand-green)" },
];

const announcements = [
  { title: "Mid-Term Break Notice", channel: "Push + Email", reach: "24.8K", date: "Today" },
  { title: "New Tutor Onboarding Webinar", channel: "Email", reach: "1.2K", date: "Yesterday" },
  { title: "Marketplace Flash Sale", channel: "SMS + Push", reach: "18.4K", date: "2 days ago" },
];

const roles = [
  { role: "Super Admin", users: 3, perms: "Full access", color: "var(--brand-pink)" },
  { role: "Content Manager", users: 8, perms: "CMS, Courses", color: "var(--brand-blue)" },
  { role: "Finance Officer", users: 4, perms: "Payments, Payouts", color: "var(--brand-green)" },
  { role: "Support Agent", users: 24, perms: "Tickets, Users", color: "var(--brand-orange)" },
];

function AdminDashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Overview");
  const [dark, setDark] = useState(false);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/30">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 280 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-screen z-40 backdrop-blur-2xl bg-background/80 border-r border-border/50 flex flex-col"
      >
        <div className="flex items-center gap-3 p-4 border-b border-border/50">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="LEAD LearnHub" className="h-9 w-9 rounded-lg" />
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex flex-col"
                >
                  <span className="font-bold text-sm leading-tight">LEAD LearnHub</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Admin Console</span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto p-1.5 rounded-md hover:bg-muted/60 transition"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setActiveMenu(item.label)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative group ${
                  isActive
                    ? "text-white shadow-lg"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
                style={
                  isActive
                    ? {
                        background: "linear-gradient(135deg, var(--brand-blue), var(--brand-purple))",
                        boxShadow: "0 8px 24px -8px var(--brand-blue)",
                      }
                    : undefined
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          isActive ? "bg-white/20" : "bg-muted text-foreground"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {isActive && (
                  <motion.span
                    layoutId="active-glow"
                    className="absolute -left-0.5 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border/50">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition">
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main */}
      <div
        style={{ marginLeft: collapsed ? 80 : 280 }}
        className="transition-[margin] duration-300 min-h-screen"
      >
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 backdrop-blur-2xl bg-background/70 border-b border-border/50">
          <div className="flex items-center gap-4 px-6 py-3">
            <div>
              <h1 className="text-base font-bold flex items-center gap-2">
                Welcome Back, Administrator <span>👋</span>
              </h1>
              <p className="text-xs text-muted-foreground">Here's what's happening on LEAD LearnHub today</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/60 border border-border/50 w-72">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"
                  placeholder="Search students, tutors, courses..."
                />
                <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-background border border-border/50">⌘K</kbd>
              </div>
              <button onClick={() => setDark(!dark)} className="p-2 rounded-xl hover:bg-muted/60 transition" aria-label="Toggle theme">
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button className="relative p-2 rounded-xl hover:bg-muted/60 transition" aria-label="Messages">
                <MessageCircle className="h-4 w-4" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[color:var(--brand-green)]" />
              </button>
              <button className="relative p-2 rounded-xl hover:bg-muted/60 transition" aria-label="Notifications">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full text-[9px] font-bold flex items-center justify-center bg-[color:var(--brand-pink)] text-white">9</span>
              </button>
              <button className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white" style={{ background: "linear-gradient(135deg, var(--brand-orange), var(--brand-pink))" }}>
                <Plus className="h-3.5 w-3.5" /> Quick Action
                <ChevronDown className="h-3 w-3" />
              </button>
              <div className="flex items-center gap-2 pl-2 border-l border-border/50">
                <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: "linear-gradient(135deg, var(--brand-blue), var(--brand-purple))" }}>
                  AD
                </div>
                <div className="hidden md:block">
                  <div className="text-xs font-semibold leading-tight">Admin User</div>
                  <div className="text-[10px] text-muted-foreground">Super Admin</div>
                </div>
                <ChevronDown className="h-3 w-3 text-muted-foreground hidden md:block" />
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 space-y-8 max-w-[1600px] mx-auto">
          {/* Hero Overview Stats */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  Platform Overview
                  <Sparkles className="h-5 w-5 text-[color:var(--brand-yellow)]" />
                </h2>
                <p className="text-sm text-muted-foreground">Real-time metrics across LEAD LearnHub</p>
              </div>
              <div className="flex gap-2">
                <button className="text-xs px-3 py-2 rounded-lg border border-border/50 hover:bg-muted/60 flex items-center gap-1.5">
                  <Filter className="h-3 w-3" /> Filter
                </button>
                <button className="text-xs px-3 py-2 rounded-lg border border-border/50 hover:bg-muted/60 flex items-center gap-1.5">
                  <Download className="h-3 w-3" /> Export
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="relative p-5 rounded-2xl backdrop-blur-xl bg-card/70 border border-border/50 overflow-hidden group"
                  >
                    <div
                      className="absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-20 group-hover:opacity-40 transition"
                      style={{ background: `radial-gradient(circle, ${s.color}, transparent 70%)` }}
                    />
                    <div className="flex items-center justify-between mb-3 relative">
                      <div
                        className="h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-lg"
                        style={{ background: s.color, boxShadow: `0 8px 20px -6px ${s.color}` }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className={`text-[10px] font-bold flex items-center gap-0.5 ${s.up ? "text-[color:var(--brand-green)]" : "text-[color:var(--brand-pink)]"}`}>
                        {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {s.change}
                      </span>
                    </div>
                    <div className="text-2xl font-bold">{s.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Charts row */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Revenue chart */}
            <div className="lg:col-span-2 p-6 rounded-2xl backdrop-blur-xl bg-card/70 border border-border/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold">Revenue Trend</h3>
                  <p className="text-xs text-muted-foreground">Last 7 days • All channels</p>
                </div>
                <div className="flex gap-1.5">
                  {["7D", "30D", "90D", "1Y"].map((p, i) => (
                    <button
                      key={p}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition ${
                        i === 0 ? "bg-[color:var(--brand-blue)] text-white" : "bg-muted/60 hover:bg-muted"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-end gap-3 h-48">
                {revenueWeek.map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${v}%` }}
                      transition={{ delay: i * 0.08, duration: 0.6, ease: "easeOut" }}
                      className="w-full rounded-t-lg relative group"
                      style={{ background: "linear-gradient(to top, var(--brand-blue), var(--brand-purple))" }}
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition">
                        ₦{v}K
                      </span>
                    </motion.div>
                    <span className="text-[10px] text-muted-foreground">{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Growth ring */}
            <div className="p-6 rounded-2xl backdrop-blur-xl bg-card/70 border border-border/50 flex flex-col">
              <div>
                <h3 className="font-bold">Platform Growth</h3>
                <p className="text-xs text-muted-foreground">Monthly active users</p>
              </div>
              <div className="flex-1 flex items-center justify-center my-4">
                <div className="relative h-44 w-44">
                  <svg viewBox="0 0 100 100" className="-rotate-90 h-full w-full">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
                    <motion.circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke="url(#growthGrad)" strokeWidth="10" strokeLinecap="round"
                      strokeDasharray="263.89"
                      initial={{ strokeDashoffset: 263.89 }}
                      animate={{ strokeDashoffset: 263.89 * (1 - 0.78) }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="growthGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="var(--brand-pink)" />
                        <stop offset="100%" stopColor="var(--brand-orange)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">78%</span>
                    <span className="text-[10px] text-muted-foreground">growth target</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 rounded-lg bg-muted/40">
                  <div className="text-sm font-bold">24.8K</div>
                  <div className="text-[10px] text-muted-foreground">Active</div>
                </div>
                <div className="p-2 rounded-lg bg-muted/40">
                  <div className="text-sm font-bold">+3.2K</div>
                  <div className="text-[10px] text-muted-foreground">New</div>
                </div>
              </div>
            </div>
          </section>

          {/* Students Management */}
          <Section title="Students Management" subtitle="Manage learner accounts, subscriptions and performance" action="Add Student">
            <div className="overflow-x-auto rounded-2xl backdrop-blur-xl bg-card/70 border border-border/50">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 text-xs text-muted-foreground">
                    <th className="text-left p-4 font-medium">Student</th>
                    <th className="text-left p-4 font-medium">School</th>
                    <th className="text-left p-4 font-medium">Plan</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsList.map((s) => (
                    <tr key={s.id} className="border-b border-border/30 hover:bg-muted/40 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white font-bold text-xs" style={{ background: s.color }}>
                            {s.name.split(" ").map(n=>n[0]).join("")}
                          </div>
                          <div>
                            <div className="font-semibold">{s.name}</div>
                            <div className="text-[10px] text-muted-foreground">{s.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{s.school}</td>
                      <td className="p-4"><span className="text-[10px] px-2 py-1 rounded-full bg-muted font-semibold">{s.plan}</span></td>
                      <td className="p-4">
                        <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${s.status === "Active" ? "bg-[color:var(--brand-green)]/10 text-[color:var(--brand-green)]" : "bg-[color:var(--brand-pink)]/10 text-[color:var(--brand-pink)]"}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-muted/60"><Eye className="h-3.5 w-3.5" /></button>
                          <button className="p-1.5 rounded-lg hover:bg-muted/60"><Edit3 className="h-3.5 w-3.5" /></button>
                          <button className="p-1.5 rounded-lg hover:bg-muted/60"><MoreVertical className="h-3.5 w-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* Tutors Management */}
          <Section title="Tutors Management" subtitle="Verify, monitor and reward your educators" action="Verify Tutor">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {tutorsList.map((t) => (
                <div key={t.name} className="p-5 rounded-2xl backdrop-blur-xl bg-card/70 border border-border/50 hover:-translate-y-1 transition">
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: t.color }}>
                      {t.name.split(" ").map(n=>n[0]).slice(0,2).join("")}
                    </div>
                    {t.verified ? (
                      <span className="text-[10px] px-2 py-1 rounded-full bg-[color:var(--brand-green)]/10 text-[color:var(--brand-green)] font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Verified
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-1 rounded-full bg-[color:var(--brand-yellow)]/10 text-[color:var(--brand-yellow)] font-semibold flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> Pending
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground mb-3">{t.subject}</div>
                  <div className="flex items-center gap-1 text-xs mb-3">
                    <Star className="h-3 w-3 fill-[color:var(--brand-yellow)] text-[color:var(--brand-yellow)]" />
                    <span className="font-semibold">{t.rating}</span>
                    <span className="text-muted-foreground">• {t.students} students</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div>
                      <div className="text-[10px] text-muted-foreground">Earnings</div>
                      <div className="text-sm font-bold">{t.earnings}</div>
                    </div>
                    {!t.verified && (
                      <button className="text-[10px] px-2.5 py-1.5 rounded-lg text-white font-semibold" style={{ background: "linear-gradient(135deg, var(--brand-green), var(--brand-blue))" }}>
                        Verify
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Schools */}
          <Section title="Schools & Institutions" subtitle="Enterprise institutional accounts" action="Add School">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {schoolsList.map((s) => (
                <div key={s.name} className="p-5 rounded-2xl backdrop-blur-xl bg-card/70 border border-border/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-20 w-20 rounded-full opacity-20" style={{ background: `radial-gradient(circle, ${s.color}, transparent 70%)` }} />
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white mb-3" style={{ background: s.color }}>
                    <School className="h-5 w-5" />
                  </div>
                  <div className="font-bold text-sm">{s.name}</div>
                  <div className="text-[10px] text-muted-foreground mb-3">{s.plan} Plan</div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-muted/40">
                      <div className="text-sm font-bold">{s.students}</div>
                      <div className="text-[9px] text-muted-foreground">Students</div>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/40">
                      <div className="text-sm font-bold">{s.classes}</div>
                      <div className="text-[9px] text-muted-foreground">Classes</div>
                    </div>
                  </div>
                  <div className="mt-3 text-[10px] flex items-center gap-1 text-[color:var(--brand-green)] font-semibold">
                    <TrendingUp className="h-3 w-3" /> {s.growth} growth
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Courses + Live */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <Section title="Courses Management" subtitle="Approve, feature and monitor courses" action="Add Course" inner>
                <div className="space-y-2">
                  {courses.map((c) => (
                    <div key={c.title} className="flex items-center gap-3 p-4 rounded-xl bg-card/70 border border-border/50 backdrop-blur-xl hover:bg-muted/40 transition">
                      <div className="h-11 w-11 rounded-xl flex items-center justify-center text-white" style={{ background: c.color }}>
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{c.title}</div>
                        <div className="text-[10px] text-muted-foreground">By {c.tutor} • {c.students.toLocaleString()} students</div>
                      </div>
                      <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${
                        c.status === "Approved" ? "bg-[color:var(--brand-green)]/10 text-[color:var(--brand-green)]" :
                        c.status === "Featured" ? "bg-[color:var(--brand-orange)]/10 text-[color:var(--brand-orange)]" :
                        "bg-[color:var(--brand-yellow)]/10 text-[color:var(--brand-yellow)]"
                      }`}>{c.status}</span>
                      <button className="p-1.5 rounded-lg hover:bg-muted/60"><MoreVertical className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                </div>
              </Section>
            </div>

            <div>
              <Section title="Live Classes" subtitle="Active sessions monitor" inner>
                <div className="space-y-2">
                  {liveSessions.map((l) => (
                    <div key={l.title} className="p-4 rounded-xl bg-card/70 border border-border/50 backdrop-blur-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[color:var(--brand-pink)] opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[color:var(--brand-pink)]" />
                        </span>
                        <span className="text-[10px] font-bold text-[color:var(--brand-pink)]">LIVE</span>
                        <span className="ml-auto text-[10px] text-muted-foreground">{l.attendance} watching</span>
                      </div>
                      <div className="font-semibold text-sm">{l.title}</div>
                      <div className="text-[10px] text-muted-foreground">By {l.tutor}</div>
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          </section>

          {/* Recorded Lessons */}
          <Section title="Recorded Lessons" subtitle="Cinematic media library" action="Upload Lesson">
            <div className="flex gap-4 overflow-x-auto pb-2">
              {lessons.map((l) => (
                <div key={l.title} className="min-w-[240px] rounded-2xl overflow-hidden bg-card/70 border border-border/50 backdrop-blur-xl group cursor-pointer">
                  <div className="aspect-video relative flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${l.color}, var(--brand-purple))` }}>
                    <PlayCircle className="h-12 w-12 text-white/90 group-hover:scale-110 transition" />
                    <span className="absolute bottom-2 right-2 text-[10px] px-2 py-0.5 rounded bg-black/60 text-white">{l.duration}</span>
                  </div>
                  <div className="p-3">
                    <div className="font-semibold text-sm truncate">{l.title}</div>
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                      <Eye className="h-3 w-3" /> {l.views} views
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Marketplace */}
          <Section title="Marketplace Management" subtitle="Textbooks, assessment books, VR/QR books and digital materials" action="Add Product">
            <div className="overflow-x-auto rounded-2xl backdrop-blur-xl bg-card/70 border border-border/50">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 text-xs text-muted-foreground">
                    <th className="text-left p-4">Product</th>
                    <th className="text-left p-4">Type</th>
                    <th className="text-left p-4">Price</th>
                    <th className="text-left p-4">Stock</th>
                    <th className="text-left p-4">Sales</th>
                    <th className="text-right p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.name} className="border-b border-border/30 hover:bg-muted/40">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg flex items-center justify-center text-white" style={{ background: p.color }}>
                            <ShoppingBag className="h-4 w-4" />
                          </div>
                          <div className="font-semibold">{p.name}</div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground text-xs">{p.type}</td>
                      <td className="p-4 font-semibold">{p.price}</td>
                      <td className="p-4">{p.stock}</td>
                      <td className="p-4 font-semibold text-[color:var(--brand-green)]">{p.sales}</td>
                      <td className="p-4 text-right">
                        <button className="p-1.5 rounded-lg hover:bg-muted/60 inline-block"><Edit3 className="h-3.5 w-3.5" /></button>
                        <button className="p-1.5 rounded-lg hover:bg-muted/60 inline-block"><Trash2 className="h-3.5 w-3.5" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* Orders + CBT */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <Section title="Orders & Inventory" subtitle="Logistics & delivery tracking" inner>
                <div className="overflow-x-auto rounded-2xl bg-card/70 border border-border/50 backdrop-blur-xl">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 text-xs text-muted-foreground">
                        <th className="text-left p-4">Order</th>
                        <th className="text-left p-4">School</th>
                        <th className="text-left p-4">Items</th>
                        <th className="text-left p-4">Total</th>
                        <th className="text-left p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.id} className="border-b border-border/30">
                          <td className="p-4 font-mono text-xs">{o.id}</td>
                          <td className="p-4 text-xs">{o.school}</td>
                          <td className="p-4 text-xs">{o.items}</td>
                          <td className="p-4 font-semibold">{o.total}</td>
                          <td className="p-4">
                            <span className="text-[10px] px-2 py-1 rounded-full font-semibold text-white" style={{ background: o.color }}>{o.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Section>
            </div>

            <div>
              <Section title="Assessments & CBT" subtitle="Examination overview" inner>
                <div className="p-5 rounded-2xl bg-card/70 border border-border/50 backdrop-blur-xl space-y-4">
                  {[
                    { label: "Active Quizzes", value: "142", color: "var(--brand-blue)" },
                    { label: "Submissions Today", value: "3,421", color: "var(--brand-green)" },
                    { label: "Pending Review", value: "28", color: "var(--brand-orange)" },
                  ].map((m) => (
                    <div key={m.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white" style={{ background: m.color }}>
                          <ClipboardCheck className="h-4 w-4" />
                        </div>
                        <span className="text-sm">{m.label}</span>
                      </div>
                      <span className="font-bold">{m.value}</span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-border/50">
                    <div className="text-[10px] text-muted-foreground mb-2">Submissions this week</div>
                    <div className="flex items-end gap-1.5 h-16">
                      {studentsBars.map((v, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${v}%` }}
                          transition={{ delay: i * 0.05 }}
                          className="flex-1 rounded-t"
                          style={{ background: "linear-gradient(to top, var(--brand-green), var(--brand-blue))" }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Section>
            </div>
          </section>

          {/* Subscriptions */}
          <Section title="Subscription Plans" subtitle="Active subscribers across tiers" action="New Plan">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {plans.map((p) => (
                <div key={p.name} className="p-5 rounded-2xl backdrop-blur-xl bg-card/70 border border-border/50 relative overflow-hidden">
                  <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full opacity-20" style={{ background: `radial-gradient(circle, ${p.color}, transparent 70%)` }} />
                  <div className="text-xs text-muted-foreground">{p.name}</div>
                  <div className="text-2xl font-bold mt-1">{p.price}</div>
                  <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">Subscribers</span>
                    <span className="text-lg font-bold" style={{ color: p.color }}>{p.subs.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Payments & Revenue */}
          <Section title="Payments & Revenue" subtitle="Financial analytics across all channels">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 p-6 rounded-2xl backdrop-blur-xl bg-card/70 border border-border/50">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-xs text-muted-foreground">Total Revenue (YTD)</div>
                    <div className="text-3xl font-bold">₦482.4M</div>
                  </div>
                  <span className="text-xs font-bold text-[color:var(--brand-green)] flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> +28.4%
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Subscriptions", val: "₦248M", color: "var(--brand-blue)" },
                    { label: "Marketplace", val: "₦142M", color: "var(--brand-orange)" },
                    { label: "Schools", val: "₦92M", color: "var(--brand-green)" },
                  ].map((r) => (
                    <div key={r.label} className="p-3 rounded-xl bg-muted/40">
                      <div className="text-[10px] text-muted-foreground">{r.label}</div>
                      <div className="text-lg font-bold mt-1" style={{ color: r.color }}>{r.val}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 rounded-2xl backdrop-blur-xl bg-card/70 border border-border/50">
                <div className="text-xs text-muted-foreground">Tutor Payouts</div>
                <div className="text-2xl font-bold mt-1">₦18.4M</div>
                <div className="text-[10px] text-muted-foreground">Pending this cycle</div>
                <button className="mt-4 w-full py-2.5 rounded-xl text-white text-sm font-semibold" style={{ background: "linear-gradient(135deg, var(--brand-green), var(--brand-blue))" }}>
                  Process Payouts
                </button>
                <div className="mt-4 pt-4 border-t border-border/50 space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-muted-foreground">Paystack</span><span className="font-semibold">₦284M</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Flutterwave</span><span className="font-semibold">₦142M</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Bank Transfer</span><span className="font-semibold">₦56M</span></div>
                </div>
              </div>
            </div>
          </Section>

          {/* Announcements + Roles */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Section title="Announcements" subtitle="Broadcast center" action="New Broadcast" inner>
              <div className="space-y-2">
                {announcements.map((a) => (
                  <div key={a.title} className="p-4 rounded-xl bg-card/70 border border-border/50 backdrop-blur-xl flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg flex items-center justify-center text-white shrink-0" style={{ background: "linear-gradient(135deg, var(--brand-orange), var(--brand-pink))" }}>
                      <Megaphone className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{a.title}</div>
                      <div className="text-[10px] text-muted-foreground">{a.channel} • {a.reach} reached</div>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{a.date}</span>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Roles & Permissions" subtitle="Team access matrix" action="Add Role" inner>
              <div className="space-y-2">
                {roles.map((r) => (
                  <div key={r.role} className="flex items-center gap-3 p-4 rounded-xl bg-card/70 border border-border/50 backdrop-blur-xl">
                    <div className="h-9 w-9 rounded-lg flex items-center justify-center text-white" style={{ background: r.color }}>
                      <Shield className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{r.role}</div>
                      <div className="text-[10px] text-muted-foreground">{r.perms}</div>
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-muted font-semibold">{r.users} users</span>
                  </div>
                ))}
              </div>
            </Section>
          </section>

          {/* CMS + Settings */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Section title="CMS / Content Management" subtitle="Manage homepage, blog, FAQ and landing pages" inner>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Homepage Banners", icon: ImageIcon, count: "8", color: "var(--brand-blue)" },
                  { label: "Blog Posts", icon: FileText, count: "142", color: "var(--brand-pink)" },
                  { label: "FAQ Entries", icon: MessageCircle, count: "64", color: "var(--brand-orange)" },
                  { label: "Landing Pages", icon: Globe, count: "12", color: "var(--brand-green)" },
                ].map((c) => {
                  const I = c.icon;
                  return (
                    <div key={c.label} className="p-4 rounded-xl bg-card/70 border border-border/50 backdrop-blur-xl hover:-translate-y-0.5 transition">
                      <div className="h-9 w-9 rounded-lg flex items-center justify-center text-white mb-3" style={{ background: c.color }}>
                        <I className="h-4 w-4" />
                      </div>
                      <div className="text-xs text-muted-foreground">{c.label}</div>
                      <div className="text-xl font-bold">{c.count}</div>
                    </div>
                  );
                })}
              </div>
            </Section>

            <Section title="Settings" subtitle="Platform configuration" inner>
              <div className="rounded-2xl bg-card/70 border border-border/50 backdrop-blur-xl divide-y divide-border/50">
                {[
                  { icon: Settings, label: "Platform Settings", desc: "General preferences" },
                  { icon: ImageIcon, label: "Branding", desc: "Logo, colors, theme" },
                  { icon: CreditCard, label: "Payment Gateways", desc: "Paystack, Flutterwave" },
                  { icon: Mail, label: "Email Configuration", desc: "SMTP, templates" },
                  { icon: Lock, label: "Security & 2FA", desc: "Authentication policies" },
                  { icon: Server, label: "API Management", desc: "Keys & webhooks" },
                ].map((row) => {
                  const I = row.icon;
                  return (
                    <div key={row.label} className="flex items-center gap-3 p-4 hover:bg-muted/40 transition cursor-pointer">
                      <div className="h-9 w-9 rounded-lg flex items-center justify-center bg-muted">
                        <I className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{row.label}</div>
                        <div className="text-[10px] text-muted-foreground">{row.desc}</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  );
                })}
              </div>
            </Section>
          </section>

          <footer className="text-center text-xs text-muted-foreground py-6">
            © 2026 LEAD LearnHub Admin Console • Built for Nigerian EdTech Excellence
          </footer>
        </main>
      </div>
    </div>
  );
}

function Section({
  title, subtitle, action, children, inner = false,
}: {
  title: string; subtitle?: string; action?: string; children: React.ReactNode; inner?: boolean;
}) {
  return (
    <section>
      <div className={`flex items-center justify-between ${inner ? "mb-3" : "mb-4"}`}>
        <div>
          <h2 className={`${inner ? "text-base" : "text-xl"} font-bold`}>{title}</h2>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {action && (
          <button className="text-xs px-3 py-2 rounded-lg text-white font-semibold flex items-center gap-1.5" style={{ background: "linear-gradient(135deg, var(--brand-blue), var(--brand-purple))" }}>
            <Plus className="h-3 w-3" /> {action}
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

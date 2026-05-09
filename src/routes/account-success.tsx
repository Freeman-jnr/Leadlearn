import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, BookOpen, Users, ShoppingBag, Video, ArrowRight, Sparkles } from "lucide-react";
import logo from "@/assets/lead-learnhub-logo.png";

export const Route = createFileRoute("/account-success")({
  head: () => ({
    meta: [
      { title: "Welcome to LEAD LearnHub" },
      { name: "description", content: "Your LEAD LearnHub account is ready. Start exploring." },
    ],
  }),
  component: AccountSuccessPage,
});

const cards = [
  { Icon: BookOpen, title: "Explore Courses", desc: "Browse 1,200+ expert-led courses.", gradient: "var(--gradient-brand)" },
  { Icon: Users, title: "Find Tutors", desc: "Book 1:1 sessions with mentors.", gradient: "var(--gradient-warm)" },
  { Icon: ShoppingBag, title: "Visit Marketplace", desc: "Templates, ebooks & resources.", gradient: "var(--gradient-vibrant)" },
  { Icon: Video, title: "Join Live Classes", desc: "Interactive virtual classrooms.", gradient: "var(--gradient-rainbow)" },
];

function AccountSuccessPage() {
  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      {/* floating orbs */}
      <motion.div
        className="absolute -top-40 -left-32 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-50"
        style={{ background: "var(--gradient-vibrant)" }}
        animate={{ y: [0, 30, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -right-32 h-[32rem] w-[32rem] rounded-full blur-3xl opacity-50"
        style={{ background: "var(--gradient-warm)" }}
        animate={{ y: [0, -30, 0] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-12 lg:py-20 text-white">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="bg-white rounded-2xl p-2 shadow-[var(--shadow-soft)]">
            <img src={logo} alt="LEAD LearnHub" className="h-9 w-auto" />
          </div>
        </Link>

        <div className="mt-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 14 }}
            className="relative mx-auto h-24 w-24 rounded-full grid place-items-center bg-white text-emerald-500 shadow-[var(--shadow-glow)]"
          >
            <Check className="h-12 w-12" strokeWidth={3} />
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ boxShadow: ["0 0 0 0 rgba(16,185,129,0.6)", "0 0 0 24px rgba(16,185,129,0)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mt-8 text-4xl md:text-5xl font-bold"
          >
            Welcome aboard! <Sparkles className="inline h-8 w-8 text-yellow-300" />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="mt-4 text-lg text-white/80 max-w-xl mx-auto"
          >
            Your LEAD LearnHub account is ready. Pick a path below to start your journey.
          </motion.p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 gap-4">
          {cards.map((c, i) => (
            <motion.a
              key={c.title}
              href="#"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              whileHover={{ y: -4 }}
              className="glass rounded-3xl p-5 flex items-start gap-4 group"
            >
              <div className="h-12 w-12 rounded-2xl grid place-items-center text-white flex-shrink-0"
                style={{ background: c.gradient }}>
                <c.Icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="font-semibold flex items-center justify-between">
                  {c.title}
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition" />
                </div>
                <div className="text-sm text-white/70 mt-1">{c.desc}</div>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary">Go to Dashboard <ArrowRight className="h-4 w-4" /></Link>
          <Link to="/" className="btn-ghost">Explore Platform</Link>
        </div>
      </div>
    </div>
  );
}

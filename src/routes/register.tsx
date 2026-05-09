import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, Globe, GraduationCap, BookOpen, Building2, ArrowRight, Check } from "lucide-react";
import { AuthLayout, FloatingField } from "@/components/AuthLayout";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your account — LEAD LearnHub" },
      { name: "description", content: "Join LEAD LearnHub as a student, tutor, or institution." },
      { property: "og:title", content: "Create your account — LEAD LearnHub" },
      { property: "og:description", content: "Join LEAD LearnHub as a student, tutor, or institution." },
    ],
  }),
  component: RegisterPage,
});

const roles = [
  { id: "student", title: "Student", desc: "Learn from world-class courses & tutors.", Icon: GraduationCap, gradient: "var(--gradient-brand)" },
  { id: "tutor", title: "Tutor", desc: "Teach, host live classes & earn.", Icon: BookOpen, gradient: "var(--gradient-warm)" },
  { id: "school", title: "Institution", desc: "Manage cohorts and curricula.", Icon: Building2, gradient: "var(--gradient-vibrant)" },
];

function RegisterPage() {
  const [role, setRole] = useState("student");
  return (
    <AuthLayout
      title="Create your learning account"
      subtitle="Join over 120,000 learners advancing the SDGs through education, advocacy, and opportunity."
    >
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Get started</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Already a member?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
        </p>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {roles.map((r) => {
          const active = role === r.id;
          return (
            <motion.button
              key={r.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setRole(r.id)}
              className={`relative rounded-2xl border p-3 text-left transition-all ${active ? "border-transparent shadow-[var(--shadow-soft)]" : "border-border bg-white hover:border-primary/30"}`}
              style={active ? { background: r.gradient, color: "white" } : undefined}
            >
              <r.Icon className="h-5 w-5" />
              <div className="mt-2 text-sm font-semibold">{r.title}</div>
              <div className={`mt-0.5 text-[11px] leading-tight ${active ? "text-white/80" : "text-muted-foreground"}`}>{r.desc}</div>
              {active && (
                <div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-white text-primary grid place-items-center shadow">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
        <FloatingField id="name" label="Full name" icon={<User className="h-4 w-4" />} />
        <FloatingField id="email" label="Email address" type="email" icon={<Mail className="h-4 w-4" />} />
        <div className="grid grid-cols-2 gap-3">
          <FloatingField id="phone" label="Phone" icon={<Phone className="h-4 w-4" />} />
          <FloatingField id="country" label="Country" icon={<Globe className="h-4 w-4" />} />
        </div>
        <FloatingField id="pwd" label="Password" type="password" icon={<Lock className="h-4 w-4" />} />
        <FloatingField id="cpwd" label="Confirm password" type="password" icon={<Lock className="h-4 w-4" />} />

        <label className="flex items-start gap-2 text-xs text-muted-foreground pt-1">
          <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-border accent-[var(--primary)]" />
          <span>I agree to the <a className="text-primary font-medium hover:underline" href="#">Terms</a> and <a className="text-primary font-medium hover:underline" href="#">Privacy Policy</a>.</span>
        </label>

        <motion.button whileTap={{ scale: 0.98 }} className="btn-primary w-full !py-3.5 mt-2">
          Create account <ArrowRight className="h-4 w-4" />
        </motion.button>

        <button type="button" className="w-full flex items-center justify-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold hover:border-primary/40 transition-all">
          <svg className="h-4 w-4" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4c-7.5 0-14 4.1-17.7 10.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.5 2.4-7.2 2.4-5.3 0-9.7-3.4-11.3-8L6.3 33C9.9 39.9 16.4 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2c-.4.4 6.6-4.8 6.6-14.8 0-1.3-.1-2.4-.4-3.5z"/></svg>
          Continue with Google
        </button>
      </form>
    </AuthLayout>
  );
}

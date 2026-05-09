import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/lead-learnhub-logo.png";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  side?: "left" | "right";
  illustration?: ReactNode;
}

export function AuthLayout({ title, subtitle, children, illustration }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-background overflow-hidden">
      {/* Brand / Visual side */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 text-white overflow-hidden"
        style={{ background: "var(--gradient-hero)" }}>
        {/* Floating gradient orbs */}
        <motion.div
          className="absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl opacity-50"
          style={{ background: "var(--gradient-vibrant)" }}
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -right-20 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-40"
          style={{ background: "var(--gradient-warm)" }}
          animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 right-10 h-40 w-40 rounded-full blur-2xl opacity-50"
          style={{ background: "var(--gradient-brand)" }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="bg-white rounded-2xl p-2 shadow-[var(--shadow-soft)]">
              <img src={logo} alt="LEAD LearnHub" className="h-10 w-auto" />
            </div>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl xl:text-5xl font-bold leading-tight"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-5 text-lg text-white/80"
          >
            {subtitle}
          </motion.p>

          {illustration && <div className="mt-10">{illustration}</div>}

          <div className="mt-12 grid grid-cols-3 gap-4">
            {[
              { v: "120K+", l: "Learners" },
              { v: "8K+", l: "Tutors" },
              { v: "1.2K+", l: "Courses" },
            ].map((s) => (
              <div key={s.l} className="glass rounded-2xl p-4">
                <div className="text-2xl font-bold text-gradient-rainbow">{s.v}</div>
                <div className="text-xs text-white/70 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/60">
          © {new Date().getFullYear()} LEAD LearnHub · Education for the SDGs
        </div>
      </div>

      {/* Form side */}
      <div className="relative flex items-center justify-center p-6 sm:p-10 bg-background">
        <div className="absolute top-6 left-6 lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="LEAD LearnHub" className="h-9 w-auto" />
          </Link>
        </div>

        {/* subtle decorative blobs on light side */}
        <div className="absolute top-0 right-0 h-72 w-72 rounded-full blur-3xl opacity-30 -z-0"
          style={{ background: "var(--gradient-warm)" }} />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full blur-3xl opacity-25 -z-0"
          style={{ background: "var(--gradient-brand)" }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  icon?: ReactNode;
  trailing?: ReactNode;
  id: string;
}

export function FloatingField({ label, type = "text", placeholder, icon, trailing, id }: FieldProps) {
  return (
    <div className="relative group">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</div>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder ?? " "}
        className={`peer w-full rounded-2xl border border-border bg-white/70 backdrop-blur px-4 ${icon ? "pl-11" : ""} ${trailing ? "pr-12" : ""} pt-5 pb-2 text-sm text-foreground placeholder:text-transparent focus:placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all`}
      />
      <label
        htmlFor={id}
        className={`pointer-events-none absolute ${icon ? "left-11" : "left-4"} top-1.5 text-[11px] uppercase tracking-wide text-muted-foreground transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-focus:top-1.5 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:uppercase peer-focus:text-primary`}
      >
        {label}
      </label>
      {trailing && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{trailing}</div>
      )}
    </div>
  );
}

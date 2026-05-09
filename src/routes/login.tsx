import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, BookOpen, Users, Award } from "lucide-react";
import { AuthLayout, FloatingField } from "@/components/AuthLayout";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — LEAD LearnHub" },
      { name: "description", content: "Sign in to LEAD LearnHub and continue your learning journey." },
      { property: "og:title", content: "Login — LEAD LearnHub" },
      { property: "og:description", content: "Sign in to LEAD LearnHub and continue your learning journey." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [show, setShow] = useState(false);
  return (
    <AuthLayout
      title="Welcome back to LEAD LearnHub"
      subtitle="Continue transforming education through technology — pick up exactly where you left off."
      illustration={
        <div className="grid grid-cols-3 gap-3">
          {[
            { Icon: BookOpen, label: "Courses" },
            { Icon: Users, label: "Mentors" },
            { Icon: Award, label: "Certificates" },
          ].map(({ Icon, label }) => (
            <motion.div
              key={label}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-4 flex flex-col items-start gap-2"
            >
              <div className="h-9 w-9 rounded-xl grid place-items-center text-white"
                style={{ background: "var(--gradient-brand)" }}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="text-sm font-medium">{label}</div>
            </motion.div>
          ))}
        </div>
      }
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Sign in</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          New here?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <FloatingField id="email" label="Email address" type="email" icon={<Mail className="h-4 w-4" />} />
        <FloatingField
          id="password"
          label="Password"
          type={show ? "text" : "password"}
          icon={<Lock className="h-4 w-4" />}
          trailing={
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="h-8 w-8 grid place-items-center rounded-lg hover:bg-secondary text-muted-foreground"
              aria-label="Toggle password"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" className="h-4 w-4 rounded border-border accent-[var(--primary)]" />
            <span className="text-muted-foreground">Remember me</span>
          </label>
          <Link to="/forgot-password" className="font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="btn-primary w-full !py-3.5"
        >
          Sign in <ArrowRight className="h-4 w-4" />
        </motion.button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center"><span className="bg-background px-3 text-xs uppercase tracking-wider text-muted-foreground">or continue with</span></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <SocialButton provider="Google" />
          <SocialButton provider="Facebook" />
        </div>
      </form>
    </AuthLayout>
  );
}

function SocialButton({ provider }: { provider: "Google" | "Facebook" }) {
  return (
    <button
      type="button"
      className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold hover:border-primary/40 hover:shadow-[var(--shadow-soft)] transition-all"
    >
      {provider === "Google" ? <GoogleIcon /> : <FacebookIcon />}
      {provider}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4c-7.5 0-14 4.1-17.7 10.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.5 2.4-7.2 2.4-5.3 0-9.7-3.4-11.3-8L6.3 33C9.9 39.9 16.4 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2c-.4.4 6.6-4.8 6.6-14.8 0-1.3-.1-2.4-.4-3.5z"/></svg>
  );
}
function FacebookIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12a12 12 0 10-13.9 11.9v-8.4H7v-3.5h3.1V9.4c0-3.1 1.8-4.8 4.6-4.8 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9v2.3h3.4l-.6 3.5h-2.9v8.4A12 12 0 0024 12z"/></svg>
  );
}

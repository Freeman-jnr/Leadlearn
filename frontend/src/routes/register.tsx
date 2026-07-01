import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, Globe, GraduationCap, BookOpen, Building2, ArrowRight, Check, Loader2, AlertCircle } from "lucide-react";
import { AuthLayout, FloatingField } from "@/components/AuthLayout";
import { useAuth } from "@/hooks/useAuth";
import type { RegisterCredentials } from "@/types/auth.types";

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
  { id: "STUDENT", title: "Student", desc: "Learn from world-class courses & tutors.", Icon: GraduationCap, gradient: "var(--gradient-brand)" },
  { id: "TUTOR", title: "Tutor", desc: "Teach, host live classes & earn.", Icon: BookOpen, gradient: "var(--gradient-warm)" },
  { id: "SCHOOL", title: "Institution", desc: "Manage cohorts and curricula.", Icon: Building2, gradient: "var(--gradient-vibrant)" },
];

function RegisterPage() {
  const [role, setRole] = useState<"STUDENT" | "TUTOR" | "SCHOOL">("STUDENT");
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);

  const { register, isLoading, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const firstName = firstNameRef.current?.value;
    const lastName = lastNameRef.current?.value;
    const email = emailRef.current?.value;
    const phone = phoneRef.current?.value;
    const country = countryRef.current?.value;
    const password = passwordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;
    const terms = termsRef.current?.checked;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      alert("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!terms) {
      alert("Please agree to the terms and privacy policy");
      return;
    }

    try {
      clearError();
      await register({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        role,
      } as RegisterCredentials);
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

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

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3"
        >
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">{error}</p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-3 gap-2 mb-5">
        {roles.map((r) => {
          const active = role === r.id;
          return (
            <motion.button
              key={r.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setRole(r.id as "STUDENT" | "TUTOR" | "SCHOOL")}
              disabled={isLoading}
              className={`relative rounded-2xl border p-3 text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed ${active ? "border-transparent shadow-[var(--shadow-soft)]" : "border-border bg-white hover:border-primary/30"}`}
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

      <form className="space-y-3" onSubmit={handleSubmit}>
        <FloatingField 
          ref={firstNameRef}
          id="firstName" 
          label="First name" 
          icon={<User className="h-4 w-4" />}
          disabled={isLoading}
          required
        />
        <FloatingField 
          ref={lastNameRef}
          id="lastName" 
          label="Last name" 
          icon={<User className="h-4 w-4" />}
          disabled={isLoading}
          required
        />
        <FloatingField 
          ref={emailRef}
          id="email" 
          label="Email address" 
          type="email" 
          icon={<Mail className="h-4 w-4" />}
          disabled={isLoading}
          required
        />
        <div className="grid grid-cols-2 gap-3">
          <FloatingField 
            ref={phoneRef}
            id="phone" 
            label="Phone" 
            icon={<Phone className="h-4 w-4" />}
            disabled={isLoading}
          />
          <FloatingField 
            ref={countryRef}
            id="country" 
            label="Country" 
            icon={<Globe className="h-4 w-4" />}
            disabled={isLoading}
          />
        </div>
        <FloatingField 
          ref={passwordRef}
          id="password" 
          label="Password" 
          type="password" 
          icon={<Lock className="h-4 w-4" />}
          disabled={isLoading}
          required
        />
        <FloatingField 
          ref={confirmPasswordRef}
          id="confirmPassword" 
          label="Confirm password" 
          type="password" 
          icon={<Lock className="h-4 w-4" />}
          disabled={isLoading}
          required
        />

        <label className="flex items-start gap-2 text-xs text-muted-foreground pt-1">
          <input 
            ref={termsRef}
            type="checkbox" 
            className="mt-0.5 h-4 w-4 rounded border-border accent-[var(--primary)]"
            disabled={isLoading}
          />
          <span>I agree to the <a className="text-primary font-medium hover:underline" href="#">Terms</a> and <a className="text-primary font-medium hover:underline" href="#">Privacy Policy</a>.</span>
        </label>

        <motion.button 
          whileTap={{ scale: 0.98 }} 
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full !py-3.5 mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Create account <ArrowRight className="h-4 w-4" />
            </>
          )}
        </motion.button>

        <button 
          type="button" 
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold hover:border-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="h-4 w-4" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.95 4 4 12.95 4 24s8.95 20 20 20c11.05 0 20-8.95 20-20 0-1.3-.1-2.6-.4-3.5z" /></svg>
          Continue with Google
        </button>
      </form>
    </AuthLayout>
  );
}

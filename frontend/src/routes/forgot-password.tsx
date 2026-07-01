import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, ShieldCheck } from "lucide-react";
import { AuthLayout, FloatingField } from "@/components/AuthLayout";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot password — LEAD LearnHub" },
      { name: "description", content: "Reset your LEAD LearnHub password securely." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Account recovery, made simple"
      subtitle="We'll email you a secure link to reset your password and get you back to learning."
      illustration={
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="glass rounded-3xl p-6 inline-flex items-center gap-3"
        >
          <div className="h-12 w-12 rounded-2xl grid place-items-center text-white"
            style={{ background: "var(--gradient-vibrant)" }}>
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="text-sm font-semibold">Bank-grade security</div>
            <div className="text-xs text-white/70">Encrypted reset links</div>
          </div>
        </motion.div>
      }
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Forgot password?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <FloatingField id="email" label="Email address" type="email" icon={<Mail className="h-4 w-4" />} />
        <motion.button whileTap={{ scale: 0.98 }} className="btn-primary w-full !py-3.5">
          Send reset link
        </motion.button>
      </form>

      <Link to="/login" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to sign in
      </Link>
    </AuthLayout>
  );
}

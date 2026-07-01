import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MailCheck } from "lucide-react";
import { AuthLayout } from "@/components/AuthLayout";

export const Route = createFileRoute("/verify-email")({
  head: () => ({
    meta: [
      { title: "Verify your email — LEAD LearnHub" },
      { name: "description", content: "Confirm your email address to activate your LEAD LearnHub account." },
    ],
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [seconds, setSeconds] = useState(45);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const setDigit = (i: number, v: string) => {
    const val = v.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[i] = val;
    setCode(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  return (
    <AuthLayout
      title="One last step"
      subtitle="We sent a 6-digit code to your inbox. Enter it below to confirm your email."
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 14 }}
          className="mx-auto h-20 w-20 rounded-3xl grid place-items-center text-white shadow-[var(--shadow-glow)]"
          style={{ background: "var(--gradient-brand)" }}
        >
          <MailCheck className="h-10 w-10" />
        </motion.div>
        <h2 className="mt-6 text-3xl font-bold tracking-tight">Verify your email</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the verification code sent to your email.
        </p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="flex justify-center gap-2 sm:gap-3">
          {code.map((d, i) => (
            <input
              key={i}
              ref={(el) => { inputs.current[i] = el; }}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !code[i] && i > 0) inputs.current[i - 1]?.focus();
              }}
              inputMode="numeric"
              maxLength={1}
              className="h-14 w-12 sm:h-16 sm:w-14 rounded-2xl border border-border bg-white text-center text-2xl font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all"
            />
          ))}
        </div>

        <motion.button whileTap={{ scale: 0.98 }} className="btn-primary w-full !py-3.5">
          Verify email
        </motion.button>

        <div className="text-center text-sm text-muted-foreground">
          Didn't receive it?{" "}
          {seconds > 0 ? (
            <span>Resend in <span className="font-semibold text-foreground">{seconds}s</span></span>
          ) : (
            <button type="button" onClick={() => setSeconds(45)} className="font-semibold text-primary hover:underline">
              Resend code
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 text-center">
        <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
          Back to sign in
        </Link>
      </div>
    </AuthLayout>
  );
}

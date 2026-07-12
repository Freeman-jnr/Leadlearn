import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MailCheck, Loader2, AlertCircle } from "lucide-react";
import { AuthLayout } from "@/components/AuthLayout";
import { useAuth } from "@/hooks/useAuth";

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
  const navigate = useNavigate();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [seconds, setSeconds] = useState(45);
  const [localError, setLocalError] = useState<string | null>(null);
  const { verify, isLoading, user, error, clearError } = useAuth();

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

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...code];
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setCode(next);
    const lastFilled = Math.min(pasted.length, 5);
    inputs.current[lastFilled]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = code.join("");
    if (otp.length < 6) {
      setLocalError("Please enter the full 6-digit code.");
      return;
    }
    if (!user?.email) {
      setLocalError("No account email found. Please register or log in again.");
      return;
    }

    setLocalError(null);
    clearError();

    try {
      const data = await verify({ email: user.email, otp });
      const role = data.user.role.toLowerCase();
      if (role === "admin") navigate({ to: "/admin-dashboard" });
      else if (role === "tutor") navigate({ to: "/tutor" });
      else if (role === "school") navigate({ to: "/school-dashboard" });
      else navigate({ to: "/dashboard" });
    } catch {
      // error is set in the store via useAuth
    }
  };

  const displayError = localError || error;

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
        {user?.email && (
          <p className="mt-1 text-sm font-medium text-primary">{user.email}</p>
        )}
      </div>

      {displayError && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3"
        >
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-red-900">{displayError}</p>
        </motion.div>
      )}

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
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
              onPaste={i === 0 ? handlePaste : undefined}
              inputMode="numeric"
              maxLength={1}
              disabled={isLoading}
              className="h-14 w-12 sm:h-16 sm:w-14 rounded-2xl border border-border bg-white text-center text-2xl font-bold focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all disabled:opacity-50"
            />
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading || code.join("").length < 6}
          className="btn-primary w-full !py-3.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify email"
          )}
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


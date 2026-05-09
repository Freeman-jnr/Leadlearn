import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Check } from "lucide-react";
import { AuthLayout, FloatingField } from "@/components/AuthLayout";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — LEAD LearnHub" },
      { name: "description", content: "Set a new password for your LEAD LearnHub account." },
    ],
  }),
  component: ResetPasswordPage,
});

function strengthOf(pwd: string) {
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
}

function ResetPasswordPage() {
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);

  const score = useMemo(() => strengthOf(pwd), [pwd]);
  const labels = ["Too weak", "Weak", "Okay", "Strong", "Excellent"];
  const colors = ["#ef4444", "#f59e0b", "#eab308", "#22c55e", "#10b981"];

  return (
    <AuthLayout
      title="Choose a new password"
      subtitle="Make it strong, memorable, and unique to your account."
    >
      {!done ? (
        <>
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Reset password</h2>
            <p className="mt-2 text-sm text-muted-foreground">Pick something only you would know.</p>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
            <div>
              <div className="relative">
                <input
                  id="np"
                  type="password"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  placeholder=" "
                  className="peer w-full rounded-2xl border border-border bg-white/70 backdrop-blur pl-11 pr-4 pt-5 pb-2 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
                />
                <Lock className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <label htmlFor="np" className="pointer-events-none absolute left-11 top-1.5 text-[11px] uppercase tracking-wide text-muted-foreground peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-focus:top-1.5 peer-focus:translate-y-0 peer-focus:text-[11px] peer-focus:uppercase">New password</label>
              </div>
              {/* strength bar */}
              <div className="mt-2 flex gap-1">
                {[0,1,2,3].map((i) => (
                  <div key={i} className="h-1.5 flex-1 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      initial={false}
                      animate={{ width: i < score ? "100%" : "0%" }}
                      className="h-full rounded-full"
                      style={{ background: colors[Math.min(score, 4) - 1] || "transparent" }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {pwd ? labels[Math.min(score, 4)] : "Use 8+ chars with a number, capital & symbol."}
              </div>
            </div>

            <FloatingField id="cp" label="Confirm password" type="password" icon={<Lock className="h-4 w-4" />} />

            <motion.button whileTap={{ scale: 0.98 }} className="btn-primary w-full !py-3.5">
              Reset password
            </motion.button>
          </form>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mx-auto h-20 w-20 rounded-full grid place-items-center text-white"
            style={{ background: "var(--gradient-brand)" }}
          >
            <Check className="h-10 w-10" />
          </motion.div>
          <h2 className="mt-6 text-2xl font-bold">Password reset!</h2>
          <p className="mt-2 text-sm text-muted-foreground">You can now sign in with your new password.</p>
          <Link to="/login" className="btn-primary inline-flex mt-6">Continue to sign in</Link>
        </motion.div>
      )}
    </AuthLayout>
  );
}

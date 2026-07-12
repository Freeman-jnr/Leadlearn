import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight,
  Loader2, BarChart3, CreditCard, Clock, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useTutorDashboard } from '@/hooks/useDashboard';

export const Route = createFileRoute('/tutor/earnings')({
  head: () => ({ meta: [{ title: 'Earnings & Payouts — LEAD LearnHub' }] }),
  component: EarningsPage,
});

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function EarningsPage() {
  const { data, isLoading } = useTutorDashboard();
  const [period, setPeriod] = useState<'1M' | '3M' | '6M' | '1Y'>('6M');

  const transactions: any[] = data?.transactions || [];
  const totalEarnings = data?.stats?.totalEarnings || 0;
  const pending = transactions.filter((t: any) => t.status === 'pending').reduce((acc: number, t: any) => acc + t.amount, 0);
  const thisMonth = (() => {
    const now = new Date();
    return transactions
      .filter((t: any) => {
        const d = new Date(t.date || t.createdAt);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((acc: number, t: any) => acc + t.amount, 0);
  })();

  // Build monthly chart data from transactions
  const chartData = (() => {
    const now = new Date();
    const months = period === '1M' ? 1 : period === '3M' ? 3 : period === '6M' ? 6 : 12;
    const buckets: Record<string, number> = {};
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets[`${d.getFullYear()}-${d.getMonth()}`] = 0;
    }
    transactions.forEach((t: any) => {
      const d = new Date(t.date || t.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (key in buckets) buckets[key] += t.amount;
    });
    return Object.entries(buckets).map(([key, amount]) => {
      const [year, month] = key.split('-').map(Number);
      return { label: MONTH_LABELS[month], amount };
    });
  })();

  const maxAmount = Math.max(...chartData.map(d => d.amount), 1);

  const formatNGN = (amount: number) =>
    amount >= 1_000_000
      ? `₦${(amount / 1_000_000).toFixed(1)}M`
      : amount >= 1_000
      ? `₦${(amount / 1_000).toFixed(0)}K`
      : `₦${amount.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-[oklch(0.98_0.01_250)] p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Earnings & Payouts</h1>
        <p className="text-muted-foreground mt-1">Your revenue command center</p>
      </div>

      {/* Stats cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Earnings', value: formatNGN(totalEarnings), tint: 'var(--brand-green)', icon: DollarSign, trend: '+18%', up: true },
          { label: 'This Month', value: formatNGN(thisMonth), tint: 'var(--brand-blue)', icon: TrendingUp, trend: '+24%', up: true },
          { label: 'Pending Payout', value: formatNGN(pending), tint: 'var(--brand-orange)', icon: Clock, trend: '3 days', up: null },
          { label: 'Transactions', value: transactions.length.toString(), tint: 'var(--brand-pink)', icon: CreditCard, trend: '', up: null },
        ].map(card => (
          <motion.div
            key={card.label}
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-5 border border-border shadow-[var(--shadow-soft)]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl grid place-items-center" style={{ background: card.tint }}>
                <card.icon className="h-5 w-5 text-white" />
              </div>
              {card.trend && (
                <span className={`text-xs font-bold flex items-center gap-0.5 ${card.up ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {card.up != null && (card.up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />)}
                  {card.trend}
                </span>
              )}
            </div>
            <div className="text-2xl font-bold">{isLoading ? '—' : card.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{card.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-3xl p-6 border border-border shadow-[var(--shadow-soft)] mb-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-bold">Revenue Trend</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Monthly earnings breakdown</p>
          </div>
          <div className="flex gap-1.5">
            {(['1M', '3M', '6M', '1Y'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  period === p ? 'text-white' : 'bg-secondary hover:bg-secondary/70'
                }`}
                style={period === p ? { background: 'var(--gradient-brand)' } : {}}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="h-48 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <div className="flex items-end gap-2 h-48">
            {chartData.map((bar, i) => {
              const pct = (bar.amount / maxAmount) * 100;
              const isLast = i === chartData.length - 1;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full group" style={{ height: `${Math.max(pct, 4)}%`, minHeight: '4px' }}>
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.7, delay: i * 0.05, origin: 'bottom' }}
                      className="w-full rounded-t-xl h-full"
                      style={{
                        background: isLast
                          ? 'var(--gradient-rainbow)'
                          : `linear-gradient(180deg, oklch(0.55 0.18 264) 0%, oklch(0.45 0.2 264) 100%)`,
                        transformOrigin: 'bottom',
                      }}
                    />
                    {bar.amount > 0 && (
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-foreground text-white px-1.5 py-0.5 rounded whitespace-nowrap z-10">
                        {formatNGN(bar.amount)}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground font-semibold">{bar.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-3xl border border-border shadow-[var(--shadow-soft)] overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Transaction History</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{transactions.length} transactions</p>
          </div>
          <button
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ background: 'var(--gradient-brand)' }}
          >
            <Wallet className="h-4 w-4" /> Request Payout
          </button>
        </div>

        {isLoading ? (
          <div className="p-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center">
            <DollarSign className="h-14 w-14 mx-auto mb-3 text-muted-foreground/30" />
            <p className="font-semibold">No transactions yet</p>
            <p className="text-sm text-muted-foreground mt-1">Earnings appear here when students enroll or buy materials.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {transactions.map((tx: any, i: number) => (
              <motion.div
                key={tx.id || i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-4 px-6 py-4 hover:bg-secondary/40 transition-colors"
              >
                <div className={`h-10 w-10 rounded-xl grid place-items-center shrink-0 ${
                  tx.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {tx.type === 'credit'
                    ? <ArrowUpRight className="h-5 w-5 text-green-600" />
                    : <ArrowDownRight className="h-5 w-5 text-red-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{tx.description || 'Transaction'}</p>
                  <p className="text-xs text-muted-foreground">
                    {tx.date ? new Date(tx.date).toLocaleDateString('en-NG', { dateStyle: 'medium' }) : ''}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-500'}`}>
                    {tx.type === 'credit' ? '+' : '-'}₦{Number(tx.amount).toLocaleString()}
                  </p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    tx.status === 'completed' ? 'bg-green-100 text-green-700' :
                    tx.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {tx.status?.toUpperCase() || 'DONE'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

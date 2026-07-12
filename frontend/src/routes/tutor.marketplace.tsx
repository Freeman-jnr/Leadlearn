import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag, Search, Eye, TrendingUp, BarChart3, DollarSign, Loader2, ShoppingCart
} from 'lucide-react';
import { useMyMarketplaceItems } from '@/hooks/useTutorData';

export const Route = createFileRoute('/tutor/marketplace')({
  head: () => ({ meta: [{ title: 'Marketplace — LEAD LearnHub' }] }),
  component: MarketplacePage,
});

const MATERIAL_TYPES = ['PDF', 'Video', 'Workbook', 'Worksheet', 'Past Questions', 'Audio', 'VR/AR'];
const EMOJI_OPTIONS = ['📄', '📕', '📘', '📗', '🎥', '📝', '🧬', '🎓', '📊', '📋', '🔬', '🎨'];

function MarketplacePage() {
  const { data: items, isLoading } = useMyMarketplaceItems();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const materials: any[] = items || [];
  const types = ['All', ...Array.from(new Set(materials.map((m: any) => m.type)))];

  const filtered = materials.filter((m: any) =>
    (typeFilter === 'All' || m.type === typeFilter) &&
    (m.name || m.title || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalSales = materials.reduce((acc: number, m: any) => acc + (m.sales || 0), 0);
  const totalRevenue = materials.reduce((acc: number, m: any) => acc + ((m.priceRaw || m.price || 0) * (m.sales || 0)), 0);

  return (
    <div className="min-h-screen bg-[oklch(0.98_0.01_250)] p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground mt-1">Browse and buy educational resources for your classes</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Available Materials', value: materials.length, icon: ShoppingBag, tint: 'var(--brand-pink)' },
        ].map(s => (
          <motion.div key={s.label} whileHover={{ y: -3 }} className="bg-white rounded-2xl p-5 border border-border shadow-[var(--shadow-soft)]">
            <div className="h-10 w-10 rounded-xl grid place-items-center mb-3" style={{ background: s.tint }}>
              <s.icon className="h-5 w-5 text-white" />
            </div>
            <div className="text-3xl font-bold">{isLoading ? '—' : s.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search materials…"
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                typeFilter === t ? 'text-white' : 'bg-white border border-border hover:bg-secondary'
              }`}
              style={typeFilter === t ? { background: 'var(--gradient-warm)' } : {}}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
          <h2 className="text-xl font-bold mb-2">{search ? 'No matching materials' : 'No materials available'}</h2>
          <p className="text-muted-foreground mb-6">Browse and purchase educational resources from other educators.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((m: any, i: number) => (
            <MaterialCard key={m.id || i} material={m} />
          ))}
        </div>
      )}
    </div>
  );
}

function MaterialCard({ material: m }: { material: any }) {
  const name = m.name || m.title || 'Untitled';
  const price = m.price || (m.priceRaw ? `₦${Number(m.priceRaw).toLocaleString()}` : '₦0');

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl overflow-hidden border border-border shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-shadow"
    >
      {/* Banner */}
      <div
        className="h-36 grid place-items-center text-5xl relative"
        style={{ background: 'linear-gradient(135deg, var(--secondary), color-mix(in oklab, var(--brand-blue) 12%, white))' }}
      >
        <span>{m.emoji || '📄'}</span>
        <span className="absolute top-2 left-2 text-[10px] font-bold bg-white px-2 py-0.5 rounded-lg shadow-sm">
          {m.type}
        </span>
        {m.fileUrl && (
          <a
            href={m.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="absolute top-2 right-2 h-7 w-7 bg-white rounded-lg grid place-items-center text-primary shadow-sm hover:shadow-md transition-shadow"
          >
            <Eye className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      <div className="p-4">
        <h4 className="font-bold text-sm leading-tight line-clamp-2 mb-2">{name}</h4>
        <div className="flex items-center justify-between text-xs mb-3">
          <span className="text-muted-foreground">{m.sales || 0} sold</span>
          <span className="font-bold text-primary">{price}</span>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-white" style={{ background: "var(--gradient-brand)" }}>
            <ShoppingCart className="h-3.5 w-3.5" /> Buy Material
          </button>
        </div>
      </div>
    </motion.div>
  );
}



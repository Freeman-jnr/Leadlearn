import { createFileRoute } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Star, Award, TrendingUp, Users, BarChart3, Loader2 } from 'lucide-react';
import { useMyReviews } from '@/hooks/useTutorData';
import { useTutorDashboard } from '@/hooks/useDashboard';

export const Route = createFileRoute('/tutor/reviews')({
  head: () => ({ meta: [{ title: 'Reviews & Ratings — LEAD LearnHub' }] }),
  component: ReviewsPage,
});

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const cls = size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`${cls} ${i <= rating ? 'fill-[var(--brand-yellow)] text-[var(--brand-yellow)]' : 'text-border'}`}
        />
      ))}
    </div>
  );
}

function ReviewsPage() {
  const { data: reviewsData, isLoading: reviewsLoading } = useMyReviews();
  const { data: dashData, isLoading: dashLoading } = useTutorDashboard();

  const isLoading = reviewsLoading || dashLoading;
  const reviews: any[] = reviewsData?.length
    ? reviewsData
    : (dashData?.reviews || []);

  const avgRating = dashData?.stats?.rating || 0;
  const totalReviews = dashData?.stats?.totalReviews || reviews.length;

  // Rating distribution
  const distribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter((r: any) => Math.round(r.rating) === star).length,
    pct: reviews.length > 0
      ? Math.round((reviews.filter((r: any) => Math.round(r.rating) === star).length / reviews.length) * 100)
      : 0,
  }));

  const avatarColor = (name: string) => {
    const colors = ['var(--brand-blue)', 'var(--brand-pink)', 'var(--brand-green)', 'var(--brand-orange)'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="min-h-screen bg-[oklch(0.98_0.01_250)] p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Award className="h-8 w-8 text-[var(--brand-yellow)]" />
          Reviews & Ratings
        </h1>
        <p className="text-muted-foreground mt-1">What students and parents are saying about you</p>
      </div>

      {/* Summary + Distribution */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Big rating */}
        <div className="bg-white rounded-3xl p-8 border border-border shadow-[var(--shadow-soft)] flex flex-col items-center justify-center text-center">
          <div className="text-7xl font-bold mb-2" style={{ background: 'var(--gradient-rainbow)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {isLoading ? '—' : avgRating.toFixed(1)}
          </div>
          <StarRating rating={Math.round(avgRating)} size="lg" />
          <p className="text-sm text-muted-foreground mt-3">Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
        </div>

        {/* Distribution */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-border shadow-[var(--shadow-soft)]">
          <h3 className="font-bold mb-5 text-lg">Rating Distribution</h3>
          <div className="space-y-3">
            {distribution.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16 shrink-0">
                  <Star className="h-4 w-4 fill-[var(--brand-yellow)] text-[var(--brand-yellow)]" />
                  <span className="text-sm font-semibold">{star}</span>
                </div>
                <div className="flex-1 h-3 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, delay: (5 - star) * 0.1 }}
                    className="h-full rounded-full"
                    style={{ background: pct >= 60 ? 'var(--brand-green)' : pct >= 30 ? 'var(--brand-yellow)' : 'var(--brand-orange)' }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-10 text-right shrink-0">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20">
          <Star className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
          <h2 className="text-xl font-bold mb-2">No reviews yet</h2>
          <p className="text-muted-foreground">Complete courses and delight your students to receive ratings!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r: any, i: number) => {
            const name = r.student || r.name || 'Anonymous';
            return (
              <motion.div
                key={r.id || i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-5 border border-border shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-shadow"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="h-11 w-11 rounded-xl grid place-items-center text-white font-bold shrink-0"
                    style={r.avatar
                      ? { background: `url(${r.avatar}) center/cover` }
                      : { background: avatarColor(name) }
                    }
                  >
                    {!r.avatar && name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">{name}</p>
                    {r.course && <p className="text-xs text-muted-foreground truncate">{r.course}</p>}
                    {r.date && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {new Date(r.date).toLocaleDateString('en-NG', { dateStyle: 'medium' })}
                      </p>
                    )}
                  </div>
                  <StarRating rating={r.rating} />
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">"{r.comment || r.text}"</p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

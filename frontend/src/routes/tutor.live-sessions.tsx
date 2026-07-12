import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video, Plus, Clock, Users, Play, Radio, Loader2, X,
  Calendar, BookOpen, BarChart3, Eye
} from 'lucide-react';
import { useTutorDashboard } from '@/hooks/useDashboard';
import { useCreateLiveClass, useStartLiveClass } from '@/hooks/useLiveClass';

export const Route = createFileRoute('/tutor/live-sessions')({
  head: () => ({ meta: [{ title: 'Live Sessions — LEAD LearnHub' }] }),
  component: LiveSessionsPage,
});

function LiveSessionsPage() {
  const { data, isLoading } = useTutorDashboard();
  const navigate = useNavigate();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const schedule: any[] = (data?.schedule || []).filter((s: any) => s.type === 'live');

  const live = schedule.filter((s: any) => s.isLive);
  const upcoming = schedule.filter((s: any) => !s.isLive && new Date(s.time) >= new Date());
  const past = schedule.filter((s: any) => !s.isLive && new Date(s.time) < new Date());

  const startMutation = useStartLiveClass();

  const handleJoin = (id: string) => {
    startMutation.mutate(id, {
      onSuccess: () => navigate({ to: `/tutor/live-sessions/${id}` }),
    });
  };

  return (
    <div className="min-h-screen bg-[oklch(0.98_0.01_250)] p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Live Sessions</h1>
          <p className="text-muted-foreground mt-1">Schedule and manage your virtual classes</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold text-white shadow-[var(--shadow-glow)]"
          style={{ background: 'var(--gradient-brand)' }}
        >
          <Plus className="h-4 w-4" /> Schedule Session
        </button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Live Now', value: live.length, icon: Radio, tint: 'var(--brand-red)' },
          { label: 'Upcoming', value: upcoming.length, icon: Calendar, tint: 'var(--brand-blue)' },
          { label: 'Total Sessions', value: schedule.length, icon: BarChart3, tint: 'var(--brand-green)' },
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

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
      ) : schedule.length === 0 ? (
        <div className="text-center py-20">
          <Video className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
          <h2 className="text-xl font-bold mb-2">No sessions scheduled</h2>
          <p className="text-muted-foreground mb-6">Schedule your first live class to start teaching virtually.</p>
          <button onClick={() => setIsCreateOpen(true)} className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white" style={{ background: 'var(--gradient-brand)' }}>
            <Plus className="h-4 w-4" /> Schedule First Session
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Live now */}
          {live.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[var(--brand-red)] animate-pulse" />
                Live Now
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {live.map((s: any, i: number) => (
                  <SessionCard key={s.id || i} session={s} isLive onJoin={() => handleJoin(s.id)} />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming */}
          {upcoming.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Upcoming Sessions</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {upcoming.map((s: any, i: number) => (
                  <SessionCard key={s.id || i} session={s} isLive={false} onJoin={() => handleJoin(s.id)} />
                ))}
              </div>
            </div>
          )}

          {/* Past */}
          {past.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4 text-muted-foreground">Past Sessions</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {past.slice(0, 6).map((s: any, i: number) => (
                  <SessionCard key={s.id || i} session={s} isLive={false} past onJoin={() => {}} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {isCreateOpen && (
          <ScheduleSessionModal
            courses={data?.classes || []}
            onClose={() => setIsCreateOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function SessionCard({ session: s, isLive, past = false, onJoin }: {
  session: any;
  isLive: boolean;
  past?: boolean;
  onJoin: () => void;
}) {
  const startMutation = useStartLiveClass();
  const sessionTime = new Date(s.time);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`bg-white rounded-2xl overflow-hidden border shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-glow)] ${
        isLive ? 'border-[var(--brand-red)]/50' : 'border-border'
      }`}
    >
      {/* Top gradient */}
      <div
        className="h-24 flex items-center justify-between px-5 relative overflow-hidden"
        style={{
          background: isLive
            ? 'linear-gradient(135deg, var(--brand-red), var(--brand-orange))'
            : past
            ? 'linear-gradient(135deg, oklch(0.7 0.01 264), oklch(0.8 0.01 264))'
            : 'var(--gradient-brand)',
        }}
      >
        <div>
          {isLive && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> LIVE
            </span>
          )}
          <p className="text-white font-bold text-sm truncate">{s.title}</p>
          <p className="text-white/70 text-xs">{s.courseTitle}</p>
        </div>
        <div className="h-10 w-10 rounded-xl grid place-items-center bg-white/20">
          <Video className="h-5 w-5 text-white" />
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {sessionTime.toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}
          </div>
          {s.durationMins && (
            <div className="flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5" /> {s.durationMins} minutes
            </div>
          )}
        </div>

        {past ? (
          <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-secondary text-muted-foreground">
            <Eye className="h-3.5 w-3.5" /> View Recording
          </button>
        ) : (
          <button
            onClick={onJoin}
            disabled={startMutation.isPending}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:brightness-110 disabled:opacity-70"
            style={{ background: isLive ? 'var(--brand-red)' : 'var(--gradient-brand)' }}
          >
            {startMutation.isPending
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <><Play className="h-3.5 w-3.5" /> {isLive ? 'Join Live' : 'Start Session'}</>}
          </button>
        )}
      </div>
    </motion.div>
  );
}

function ScheduleSessionModal({ courses, onClose }: { courses: any[]; onClose: () => void }) {
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [title, setTitle] = useState('');
  const [scheduledAt, setScheduledAt] = useState(new Date().toISOString().slice(0, 16));
  const [durationMins, setDurationMins] = useState(60);
  const createMutation = useCreateLiveClass();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { courseId, title, scheduledAt: new Date(scheduledAt).toISOString(), durationMins },
      {
        onSuccess: (data: any) => {
          onClose();
          navigate({ to: `/tutor/live-sessions/${data.id}` });
        },
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-4 right-4 h-8 w-8 grid place-items-center rounded-full hover:bg-secondary text-muted-foreground"><X className="h-4 w-4" /></button>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl grid place-items-center text-white" style={{ background: 'var(--gradient-brand)' }}>
            <Video className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Schedule Live Class</h3>
            <p className="text-sm text-muted-foreground">Using Jitsi Meet</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Course</label>
            <select value={courseId} onChange={e => setCourseId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary">
              {courses.length === 0 ? <option>No courses yet</option> : courses.map((c: any) => <option key={c.id} value={c.id}>{c.subject || c.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Session Title</label>
            <input required value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Chapter 5 — Introduction to Waves"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Scheduled Date & Time</label>
            <input type="datetime-local" required value={scheduledAt} onChange={e => setScheduledAt(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Duration (minutes)</label>
            <input type="number" min={15} max={240} value={durationMins} onChange={e => setDurationMins(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary" />
          </div>
          <button type="submit" disabled={createMutation.isPending || courses.length === 0}
            className="w-full py-3 rounded-xl font-bold text-white disabled:opacity-70 hover:scale-[1.02] transition-transform"
            style={{ background: 'var(--gradient-brand)' }}>
            {createMutation.isPending
              ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Scheduling…</span>
              : '🎥 Schedule Session'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

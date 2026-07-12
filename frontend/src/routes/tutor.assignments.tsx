import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Plus, Clock, CheckCircle2, AlertCircle, Search,
  Users, Loader2, X, BookOpen, Trash2, Eye
} from 'lucide-react';
import { useAssignments, useCreateAssignment, useDeleteAssignment } from '@/hooks/useTutorData';
import { useTutorDashboard } from '@/hooks/useDashboard';

export const Route = createFileRoute('/tutor/assignments')({
  head: () => ({ meta: [{ title: 'Assignments — LEAD LearnHub' }] }),
  component: AssignmentsPage,
});

function AssignmentsPage() {
  const { data: assignments, isLoading } = useAssignments();
  const { data: dashData } = useTutorDashboard();
  const deleteMutation = useDeleteAssignment();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'past'>('all');

  const now = new Date();
  const filtered = (assignments || []).filter((a: any) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.course.toLowerCase().includes(search.toLowerCase());
    const isPast = a.dueDate && new Date(a.dueDate) < now;
    if (filter === 'active') return matchSearch && !isPast;
    if (filter === 'past') return matchSearch && isPast;
    return matchSearch;
  });

  const stats = {
    total: (assignments || []).length,
    active: (assignments || []).filter((a: any) => !a.dueDate || new Date(a.dueDate) >= now).length,
    totalSubmissions: (assignments || []).reduce((acc: number, a: any) => acc + (a.submitted || 0), 0),
  };

  return (
    <div className="min-h-screen bg-[oklch(0.98_0.01_250)] p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Assignments</h1>
          <p className="text-muted-foreground mt-1">Create and manage student assignments</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold text-white"
          style={{ background: 'var(--gradient-brand)' }}
        >
          <Plus className="h-4 w-4" /> New Assignment
        </button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Assignments', value: stats.total, icon: FileText, tint: 'var(--brand-blue)' },
          { label: 'Active', value: stats.active, icon: AlertCircle, tint: 'var(--brand-orange)' },
          { label: 'Total Submissions', value: stats.totalSubmissions, icon: CheckCircle2, tint: 'var(--brand-green)' },
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
            placeholder="Search assignments…"
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        {(['all', 'active', 'past'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2.5 rounded-2xl text-sm font-semibold capitalize transition-all ${
              filter === f ? 'text-white' : 'bg-white border border-border hover:bg-secondary'
            }`}
            style={filter === f ? { background: 'var(--gradient-brand)' } : {}}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
          <h2 className="text-xl font-bold mb-2">{search ? 'No matching assignments' : 'No assignments yet'}</h2>
          <p className="text-muted-foreground mb-6">Create your first assignment to track student submissions.</p>
          {!search && (
            <button onClick={() => setIsCreateOpen(true)} className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white" style={{ background: 'var(--gradient-brand)' }}>
              <Plus className="h-4 w-4" /> Create Assignment
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((a: any, i: number) => {
            const pct = a.total > 0 ? Math.round((a.submitted / a.total) * 100) : 0;
            const isPast = a.dueDate && new Date(a.dueDate) < now;
            const dueLabel = a.dueDate
              ? new Date(a.dueDate).toLocaleDateString('en-NG', { dateStyle: 'medium' })
              : 'No due date';

            return (
              <motion.div
                key={a.id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl p-5 border border-border shadow-[var(--shadow-soft)] hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isPast
                            ? 'bg-[var(--brand-red)]/10 text-[var(--brand-red)]'
                            : 'bg-[var(--brand-blue)]/10 text-[var(--brand-blue)]'
                        }`}
                      >
                        {isPast ? 'PAST DUE' : 'ACTIVE'}
                      </span>
                      <span className="text-xs text-muted-foreground">{a.course}</span>
                    </div>
                    <h3 className="font-bold text-lg">{a.title}</h3>
                    {a.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{a.description}</p>}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button className="h-9 w-9 grid place-items-center rounded-xl bg-secondary hover:bg-secondary/70 text-muted-foreground">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(a.id)}
                      className="h-9 w-9 grid place-items-center rounded-xl bg-red-50 hover:bg-red-100 text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Due: {dueLabel}</span>
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {a.submitted}/{a.total} submitted</span>
                </div>

                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-muted-foreground">Submission rate</span>
                  <span className="font-bold" style={{ color: pct >= 75 ? 'var(--brand-green)' : pct >= 40 ? 'var(--brand-orange)' : 'var(--brand-red)' }}>
                    {pct}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1 }}
                    className="h-full rounded-full"
                    style={{ background: pct >= 75 ? 'var(--brand-green)' : pct >= 40 ? 'var(--brand-orange)' : 'var(--brand-red)' }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {isCreateOpen && <CreateAssignmentModal courses={dashData?.classes || []} onClose={() => setIsCreateOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

function CreateAssignmentModal({ courses, onClose }: { courses: any[]; onClose: () => void }) {
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const createMutation = useCreateAssignment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { courseId, title, description, dueDate: new Date(dueDate).toISOString() },
      { onSuccess: onClose }
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
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Create Assignment</h3>
            <p className="text-sm text-muted-foreground">Post a new task for students</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Course</label>
            <select value={courseId} onChange={e => setCourseId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary">
              {courses.length === 0
                ? <option value="">No courses yet</option>
                : courses.map((c: any) => <option key={c.id} value={c.id}>{c.subject || c.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Title</label>
            <input required value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Chapter 3 Worksheet"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Instructions</label>
            <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Instructions for students…"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary resize-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Due Date</label>
            <input type="datetime-local" required value={dueDate} onChange={e => setDueDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary" />
          </div>
          <button type="submit" disabled={createMutation.isPending || courses.length === 0}
            className="w-full py-3 rounded-xl font-bold text-white disabled:opacity-70 hover:scale-[1.02] transition-transform mt-2"
            style={{ background: 'var(--gradient-brand)' }}>
            {createMutation.isPending
              ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Creating…</span>
              : '📝 Create Assignment'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

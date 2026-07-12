import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardCheck, Plus, Search, Loader2, X, BookOpen,
  Users, BarChart3, Clock, Eye, Trash2, HelpCircle
} from 'lucide-react';
import { useAssessments, useCreateAssessment } from '@/hooks/useTutorData';
import { useTutorDashboard } from '@/hooks/useDashboard';

export const Route = createFileRoute('/tutor/assessments')({
  head: () => ({ meta: [{ title: 'Assessments — LEAD LearnHub' }] }),
  component: AssessmentsPage,
});

function AssessmentsPage() {
  const { data: assessments, isLoading } = useAssessments();
  const { data: dashData } = useTutorDashboard();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = (assessments || []).filter((a: any) =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.course.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[oklch(0.98_0.01_250)] p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Assessments</h1>
          <p className="text-muted-foreground mt-1">CBT-style tests and quizzes</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold text-white"
          style={{ background: 'var(--gradient-warm)' }}
        >
          <Plus className="h-4 w-4" /> Create CBT Test
        </button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Tests', value: (assessments || []).length, icon: ClipboardCheck, tint: 'var(--brand-orange)' },
          { label: 'Total Submissions', value: (assessments || []).reduce((acc: number, a: any) => acc + (a.submissions || 0), 0), icon: Users, tint: 'var(--brand-blue)' },
          { label: 'Avg Score', value: (() => {
            const all = (assessments || []).filter((a: any) => a.avgScore != null);
            return all.length ? `${Math.round(all.reduce((acc: number, a: any) => acc + a.avgScore, 0) / all.length)}%` : '—';
          })(), icon: BarChart3, tint: 'var(--brand-green)' },
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

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search assessments…"
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <ClipboardCheck className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
          <h2 className="text-xl font-bold mb-2">{search ? 'No matching assessments' : 'No assessments yet'}</h2>
          <p className="text-muted-foreground mb-6">Create CBT tests to evaluate student knowledge.</p>
          {!search && (
            <button onClick={() => setIsCreateOpen(true)} className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white" style={{ background: 'var(--gradient-warm)' }}>
              <Plus className="h-4 w-4" /> Create First Assessment
            </button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((a: any, i: number) => (
            <motion.div
              key={a.id || i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-5 border border-border shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="h-11 w-11 rounded-2xl grid place-items-center text-white shrink-0" style={{ background: 'var(--gradient-warm)' }}>
                  <ClipboardCheck className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--brand-orange)]/10 text-[var(--brand-orange)]">
                  CBT
                </span>
              </div>

              <h3 className="font-bold mb-1">{a.title}</h3>
              <p className="text-xs text-muted-foreground mb-3">{a.course}</p>

              <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
                {a.dueDate && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    Due: {new Date(a.dueDate).toLocaleDateString('en-NG', { dateStyle: 'medium' })}
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" /> {a.submissions || 0} submissions
                </div>
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5" />
                  {Array.isArray(a.questions) ? a.questions.length : 0} questions
                </div>
                {a.avgScore != null && (
                  <div className="flex items-center gap-1.5">
                    <BarChart3 className="h-3.5 w-3.5" /> Avg score: {a.avgScore}%
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-secondary hover:bg-secondary/70 transition-colors">
                  <Eye className="h-3.5 w-3.5" /> View
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-white transition-colors" style={{ background: 'var(--gradient-warm)' }}>
                  <BarChart3 className="h-3.5 w-3.5" /> Results
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {isCreateOpen && <CreateAssessmentModal courses={dashData?.classes || []} onClose={() => setIsCreateOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

export function CreateAssessmentModal({ courses, onClose }: { courses: any[]; onClose: () => void }) {
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const createMutation = useCreateAssessment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { courseId, title, description, questions: [], dueDate: dueDate ? new Date(dueDate).toISOString() : undefined },
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
          <div className="h-12 w-12 rounded-2xl grid place-items-center text-white" style={{ background: 'var(--gradient-warm)' }}>
            <ClipboardCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Create Assessment</h3>
            <p className="text-sm text-muted-foreground">CBT test for your students</p>
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
            <label className="block text-sm font-semibold mb-1.5">Test Title</label>
            <input required value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. End of Term Examination"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Description</label>
            <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Topics covered, instructions…"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary resize-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Due Date (optional)</label>
            <input type="datetime-local" value={dueDate} onChange={e => setDueDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary" />
          </div>
          <button type="submit" disabled={createMutation.isPending || courses.length === 0}
            className="w-full py-3 rounded-xl font-bold text-white disabled:opacity-70 hover:scale-[1.02] transition-transform mt-2"
            style={{ background: 'var(--gradient-warm)' }}>
            {createMutation.isPending
              ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Creating…</span>
              : '✅ Create Assessment'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

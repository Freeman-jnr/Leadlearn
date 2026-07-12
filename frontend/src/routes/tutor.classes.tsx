import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Users, Clock, Video, Plus, MoreVertical,
  Play, FileText, X, Loader2, ChevronRight, GraduationCap, BarChart3
} from 'lucide-react';
import { useTutorDashboard } from '@/hooks/useDashboard';
import { useCreateCourse } from '@/hooks/useCourses';

export const Route = createFileRoute('/tutor/classes')({
  head: () => ({ meta: [{ title: 'My Classes — LEAD LearnHub' }] }),
  component: MyClassesPage,
});

const COLORS = [
  'var(--brand-blue)', 'var(--brand-pink)', 'var(--brand-green)',
  'var(--brand-orange)', 'var(--brand-yellow)', 'var(--brand-red)',
];
const EMOJIS = ['📐', '⚛️', '🧪', '💻', '📊', '🏛️', '📚', '🔬', '🌍', '🎨'];

function MyClassesPage() {
  const { data, isLoading } = useTutorDashboard();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [search, setSearch] = useState('');

  const classes = (data?.classes || []).map((c: any, i: number) => ({
    ...c,
    color: c.color || COLORS[i % COLORS.length],
    emoji: c.emoji || EMOJIS[i % EMOJIS.length],
  }));

  const filtered = classes.filter((c: any) =>
    c.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[oklch(0.98_0.01_250)] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Classes</h1>
          <p className="text-muted-foreground mt-1">
            {isLoading ? 'Loading…' : `${classes.length} active course${classes.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold text-white shadow-[var(--shadow-glow)]"
          style={{ background: 'var(--gradient-brand)' }}
        >
          <Plus className="h-4 w-4" /> New Course
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search courses…"
          className="w-full max-w-md px-4 py-2.5 rounded-2xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-5 border border-border h-64 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
          <h2 className="text-xl font-bold mb-2">
            {search ? 'No courses match your search' : "You haven't created any courses yet"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {search ? 'Try a different keyword.' : 'Start building your teaching library.'}
          </p>
          {!search && (
            <button
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white"
              style={{ background: 'var(--gradient-brand)' }}
            >
              <Plus className="h-4 w-4" /> Create your first course
            </button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c: any, i: number) => (
            <ClassCard key={c.id || i} course={c} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {isCreateOpen && <CreateCourseModal onClose={() => setIsCreateOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

function ClassCard({ course }: { course: any }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const nextTime = course.next
    ? new Date(course.next).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })
    : 'No upcoming session';

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="bg-white rounded-3xl overflow-hidden border border-border shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-shadow"
    >
      {/* Card banner */}
      <div
        className="h-36 flex items-center justify-between p-5 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${course.color}, color-mix(in oklab, ${course.color} 50%, white))` }}
      >
        <motion.div
          className="absolute -top-8 -right-8 h-32 w-32 rounded-full opacity-30"
          style={{ background: 'white' }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <span className="text-5xl relative">{course.emoji}</span>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/30 text-white backdrop-blur relative">
          {course.level || 'All Levels'}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-lg">{course.subject}</h3>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="h-8 w-8 grid place-items-center rounded-xl hover:bg-secondary text-muted-foreground"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  className="absolute right-0 top-9 w-40 bg-white rounded-xl shadow-xl border border-border z-10 overflow-hidden"
                >
                  {['Edit Course', 'View Students', 'Delete Course'].map(item => (
                    <button
                      key={item}
                      onClick={() => setMenuOpen(false)}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-secondary transition-colors ${
                        item === 'Delete Course' ? 'text-red-500' : ''
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> {course.students} students
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" /> {course.lessons || 0} lessons
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4 bg-secondary/50 px-3 py-2 rounded-xl">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{nextTime}</span>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">Syllabus progress</span>
            <span className="font-bold" style={{ color: course.color }}>{course.progress || 0}%</span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${course.progress || 0}%` }}
              transition={{ duration: 1 }}
              className="h-full rounded-full"
              style={{ background: course.color }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Link
            to="/tutor/live-sessions"
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white"
            style={{ background: course.color }}
          >
            <Play className="h-3.5 w-3.5" /> Start Live
          </Link>
          <Link
            to="/tutor/assignments"
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-secondary hover:bg-secondary/70"
          >
            <FileText className="h-3.5 w-3.5" /> Assignments
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function CreateCourseModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const createMutation = useCreateCourse();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ title, description }, { onSuccess: onClose });
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
        <button onClick={onClose} className="absolute top-4 right-4 h-8 w-8 grid place-items-center rounded-full hover:bg-secondary text-muted-foreground">
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl grid place-items-center text-white" style={{ background: 'var(--gradient-brand)' }}>
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Create New Course</h3>
            <p className="text-sm text-muted-foreground">Set up your class space</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Course Title</label>
            <input
              required value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Physics for SSS 1"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Description</label>
            <textarea
              required rows={3} value={description} onChange={e => setDescription(e.target.value)}
              placeholder="What will students learn?"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            />
          </div>
          <button
            type="submit" disabled={createMutation.isPending}
            className="w-full py-3 rounded-xl font-bold text-white disabled:opacity-70 hover:scale-[1.02] transition-transform"
            style={{ background: 'var(--gradient-brand)' }}
          >
            {createMutation.isPending
              ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Creating…</span>
              : '🎓 Create Course'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

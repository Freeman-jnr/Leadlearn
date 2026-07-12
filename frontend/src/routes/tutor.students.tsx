import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Search, GraduationCap, BookOpen, TrendingUp,
  Mail, BarChart3, ChevronDown, Loader2, Trophy
} from 'lucide-react';
import { useTutorDashboard } from '@/hooks/useDashboard';

export const Route = createFileRoute('/tutor/students')({
  head: () => ({ meta: [{ title: 'Students — LEAD LearnHub' }] }),
  component: StudentsPage,
});

function StudentsPage() {
  const { data, isLoading } = useTutorDashboard();
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'course' | 'enrolled'>('enrolled');

  const students: any[] = data?.students || [];
  const courses = ['All', ...Array.from(new Set(students.map((s: any) => s.course)))];

  const filtered = students
    .filter((s: any) =>
      (courseFilter === 'All' || s.course === courseFilter) &&
      s.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a: any, b: any) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'course') return a.course.localeCompare(b.course);
      return new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime();
    });

  const stats = [
    { label: 'Total Students', value: students.length, icon: Users, tint: 'var(--brand-blue)' },
    { label: 'Courses', value: courses.length - 1, icon: BookOpen, tint: 'var(--brand-pink)' },
    { label: 'Avg per Course', value: courses.length > 1 ? Math.round(students.length / (courses.length - 1)) : 0, icon: BarChart3, tint: 'var(--brand-green)' },
  ];

  const avatarColor = (name: string) => {
    const colors = ['var(--brand-blue)', 'var(--brand-pink)', 'var(--brand-green)', 'var(--brand-orange)', 'var(--brand-yellow)', 'var(--brand-red)'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="min-h-screen bg-[oklch(0.98_0.01_250)] p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Students</h1>
        <p className="text-muted-foreground mt-1">All enrolled students across your courses</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {stats.map(stat => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-5 border border-border shadow-[var(--shadow-soft)]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="h-10 w-10 rounded-xl grid place-items-center" style={{ background: stat.tint }}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-3xl font-bold">{isLoading ? '—' : stat.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
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
            placeholder="Search students by name…"
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          value={courseFilter}
          onChange={e => setCourseFilter(e.target.value)}
          className="px-4 py-2.5 rounded-2xl border border-border bg-white text-sm font-semibold focus:outline-none"
        >
          {courses.map(c => <option key={c}>{c}</option>)}
        </select>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as any)}
          className="px-4 py-2.5 rounded-2xl border border-border bg-white text-sm font-semibold focus:outline-none"
        >
          <option value="enrolled">Sort: Recently Enrolled</option>
          <option value="name">Sort: Name A–Z</option>
          <option value="course">Sort: Course</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <GraduationCap className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
          <h2 className="text-xl font-bold mb-2">No students found</h2>
          <p className="text-muted-foreground">Create a course and share the enrollment link to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-border shadow-[var(--shadow-soft)] overflow-hidden">
          <div className="p-4 border-b border-border bg-secondary/30">
            <p className="text-sm font-semibold text-muted-foreground">
              Showing {filtered.length} of {students.length} students
            </p>
          </div>
          <div className="divide-y divide-border">
            {filtered.map((student: any, i: number) => (
              <motion.div
                key={student.id || i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-4 p-4 hover:bg-secondary/40 transition-colors"
              >
                <div
                  className="h-11 w-11 rounded-xl grid place-items-center text-white font-bold text-sm shrink-0"
                  style={{
                    background: student.avatar ? `url(${student.avatar}) center/cover` : avatarColor(student.name)
                  }}
                >
                  {!student.avatar && student.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{student.name}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" /> {student.course}
                    </span>
                    <span className="flex items-center gap-1">
                      <GraduationCap className="h-3 w-3" />
                      Enrolled {new Date(student.enrolledAt).toLocaleDateString('en-NG', { dateStyle: 'medium' })}
                    </span>
                  </div>
                </div>
                <button className="h-9 w-9 grid place-items-center rounded-xl bg-secondary hover:bg-secondary/70 text-muted-foreground transition-colors shrink-0">
                  <Mail className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

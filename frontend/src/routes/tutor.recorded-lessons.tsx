import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlayCircle, Upload, Search, Eye, Edit2, Trash2, Clock, Video,
  Loader2, X, BookOpen, BarChart3
} from 'lucide-react';
import { useTutorDashboard } from '@/hooks/useDashboard';
import { useDeleteLesson, useCreateLesson } from '@/hooks/useCourses';
import { Loader2 as SpinLoader } from 'lucide-react';
import { FilePickerField } from '@/components/FilePickerField';

export const Route = createFileRoute('/tutor/recorded-lessons')({
  head: () => ({ meta: [{ title: 'Recorded Lessons — LEAD LearnHub' }] }),
  component: RecordedLessonsPage,
});

const COLORS = [220, 264, 145, 92, 30, 0, 180, 300];

function RecordedLessonsPage() {
  const { data, isLoading } = useTutorDashboard();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const lessons: any[] = (data?.recordedLessons || []).map((l: any, i: number) => ({
    ...l,
    hue: COLORS[i % COLORS.length],
    views: l.views ?? Math.floor(Math.random() * 2000 + 100),
    duration: l.duration || '—',
  }));

  const subjects = ['All', ...Array.from(new Set(lessons.map((l: any) => l.subject)))];
  const filtered = lessons.filter((l: any) =>
    (filter === 'All' || l.subject === filter) &&
    (l.name || l.title || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[oklch(0.98_0.01_250)] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Recorded Lessons</h1>
          <p className="text-muted-foreground mt-1">
            {isLoading ? 'Loading…' : `${lessons.length} lesson${lessons.length !== 1 ? 's' : ''} in your library`}
          </p>
        </div>
        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold text-white shadow-[var(--shadow-glow)]"
          style={{ background: 'var(--gradient-brand)' }}
        >
          <Upload className="h-4 w-4" /> Upload New Lesson
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search lessons…"
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {subjects.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                filter === s
                  ? 'text-white shadow-md'
                  : 'bg-white border border-border hover:bg-secondary'
              }`}
              style={filter === s ? { background: 'var(--gradient-brand)' } : {}}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <PlayCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
          <h2 className="text-xl font-bold mb-2">No recorded lessons yet</h2>
          <p className="text-muted-foreground mb-6">Upload your first lesson video to build your library.</p>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white"
            style={{ background: 'var(--gradient-brand)' }}
          >
            <Upload className="h-4 w-4" /> Upload First Lesson
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((lesson: any, i: number) => (
            <LessonCard key={lesson.id || i} lesson={lesson} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {isUploadOpen && <UploadLessonModal courses={data?.classes || []} onClose={() => setIsUploadOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

function LessonCard({ lesson }: { lesson: any }) {
  const deleteMutation = useDeleteLesson();
  const title = lesson.name || lesson.title || 'Untitled Lesson';
  const hasThumbnail = !!lesson.thumbnailUrl;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl overflow-hidden border border-border shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-shadow group"
    >
      {/* Thumbnail */}
      <div
        className="relative h-44 flex items-center justify-center"
        style={hasThumbnail
          ? { background: `url(${lesson.thumbnailUrl}) center/cover` }
          : { background: `linear-gradient(135deg, oklch(0.6 0.2 ${lesson.hue}), oklch(0.45 0.21 ${(lesson.hue + 60) % 360}))` }
        }
      >
        {lesson.videoUrl ? (
          <a
            href={lesson.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="h-14 w-14 rounded-full bg-white/90 grid place-items-center group-hover:scale-110 transition-transform shadow-lg"
          >
            <PlayCircle className="h-7 w-7 text-foreground" fill="currentColor" />
          </a>
        ) : (
          <div className="h-14 w-14 rounded-full bg-white/50 grid place-items-center">
            <Video className="h-6 w-6 text-white" />
          </div>
        )}
        {lesson.duration && (
          <span className="absolute bottom-2 right-2 text-[11px] bg-black/70 text-white px-2 py-0.5 rounded font-medium">
            {lesson.duration}
          </span>
        )}
        <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-foreground">
          <Eye className="h-3 w-3" /> {(lesson.views || 0).toLocaleString()}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{lesson.subject}</span>
        <h4 className="font-semibold text-sm mt-1 leading-tight line-clamp-2 mb-3">{title}</h4>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
          <Clock className="h-3.5 w-3.5" />
          <span>{lesson.duration || 'Duration unknown'}</span>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-secondary hover:bg-secondary/70 transition-colors">
            <Edit2 className="h-3.5 w-3.5" /> Edit
          </button>
          <button onClick={() => deleteMutation.mutate(lesson.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 transition-colors">
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ModalShell({ title, subtitle, onClose, children }: {
  title: string; subtitle?: string; onClose: () => void; children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-4 right-4 h-8 w-8 grid place-items-center rounded-full hover:bg-secondary text-muted-foreground transition-colors">✕</button>
        <h3 className="text-2xl font-bold mb-1">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground mb-6">{subtitle}</p>}
        {children}
      </motion.div>
    </motion.div>
  );
}

function UploadLessonModal({ courses, onClose }: { courses: any[]; onClose: () => void }) {
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(15);
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [videoMode, setVideoMode] = useState<'upload' | 'url'>('upload');
  const [childUploading, setChildUploading] = useState(false);
  const createMutation = useCreateLesson();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      {
        courseId,
        payload: {
          title,
          videoUrl: videoUrl || null,
          thumbnailUrl: thumbnailUrl || null,
          duration: parseInt(String(duration)),
        },
      },
      { onSuccess: onClose }
    );
  };

  return (
    <ModalShell title="Upload Lesson" subtitle="Add a new recorded video lesson to one of your courses." onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <div>
          <label className="block text-sm font-semibold mb-1.5">Course</label>
          <select value={courseId} onChange={e => setCourseId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary">
            {courses.map((c: any) => <option key={c.id} value={c.id}>{c.subject}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Lesson Title</label>
          <input required value={title} onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Chapter 4 – Trigonometry Fundamentals" className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Duration (minutes)</label>
          <input type="number" min={1} value={duration} onChange={e => setDuration(Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary" />
        </div>

        {/* Video — toggle upload vs URL */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-semibold">Video</label>
            <div className="flex gap-1 p-0.5 bg-secondary rounded-lg">
              <button type="button" onClick={() => setVideoMode('upload')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${ videoMode === 'upload' ? 'bg-white shadow text-foreground' : 'text-muted-foreground' }`}>
                Upload File
              </button>
              <button type="button" onClick={() => setVideoMode('url')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${ videoMode === 'url' ? 'bg-white shadow text-foreground' : 'text-muted-foreground' }`}>
                Paste URL
              </button>
            </div>
          </div>
          {videoMode === 'upload' ? (
            <FilePickerField
              label=""
              bucket="videos"
              accept="video/*"
              value={videoUrl}
              onChange={setVideoUrl}
              onUploadStateChange={setChildUploading}
              optional
              hint="MP4, WebM, MOV — uploaded to cloud storage"
            />
          ) : (
            <input
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/embed/... or direct video URL"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/50 focus:bg-white focus:outline-none focus:border-primary"
            />
          )}
        </div>

        <FilePickerField
          label="Thumbnail"
          bucket="thumbnails"
          accept="image/*"
          value={thumbnailUrl}
          onChange={setThumbnailUrl}
          onUploadStateChange={setChildUploading}
          optional
          hint="JPG, PNG, WebP — cover image for this lesson"
        />

        <button type="submit" disabled={createMutation.isPending || childUploading}
          className="w-full py-3 rounded-xl font-bold text-white mt-6 disabled:opacity-70 transition-all hover:scale-[1.02]"
          style={{ background: 'var(--gradient-brand)' }}>
          {createMutation.isPending ? <span className="flex items-center justify-center gap-2"><SpinLoader className="h-4 w-4 animate-spin" /> Uploading...</span> : '📤 Upload Lesson'}
        </button>
      </form>
    </ModalShell>
  );
}

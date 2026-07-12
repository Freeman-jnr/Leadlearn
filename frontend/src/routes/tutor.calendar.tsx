import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Calendar, Video, FileText,
  Clock, Users, Loader2, Plus, X
} from 'lucide-react';
import { useTutorDashboard } from '@/hooks/useDashboard';

export const Route = createFileRoute('/tutor/calendar')({
  head: () => ({ meta: [{ title: 'Calendar — LEAD LearnHub' }] }),
  component: CalendarPage,
});

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

type CalEvent = {
  id: string;
  type: 'live' | 'assignment' | 'assessment';
  title: string;
  courseTitle?: string;
  time: Date;
  durationMins?: number;
  color: string;
};

function CalendarPage() {
  const { data, isLoading } = useTutorDashboard();
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<Date | null>(today);

  const events: CalEvent[] = useMemo(() => {
    const result: CalEvent[] = [];
    if (!data?.schedule) return result;

    data.schedule.forEach((s: any) => {
      result.push({
        id: s.id,
        type: s.type,
        title: s.title,
        courseTitle: s.courseTitle,
        time: new Date(s.time),
        durationMins: s.durationMins,
        color: s.type === 'live' ? 'var(--brand-blue)' : s.type === 'assignment' ? 'var(--brand-orange)' : 'var(--brand-pink)',
      });
    });
    return result;
  }, [data]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));
  const goToday = () => { setViewDate(new Date(today.getFullYear(), today.getMonth(), 1)); setSelectedDay(today); };

  const getEventsForDay = (day: number) => {
    return events.filter(e =>
      e.time.getFullYear() === year &&
      e.time.getMonth() === month &&
      e.time.getDate() === day
    );
  };

  const selectedEvents = selectedDay
    ? getEventsForDay(selectedDay.getDate()).filter(e =>
        e.time.getFullYear() === selectedDay.getFullYear() &&
        e.time.getMonth() === selectedDay.getMonth()
      )
    : [];

  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const isSelected = (day: number) =>
    selectedDay &&
    day === selectedDay.getDate() &&
    month === selectedDay.getMonth() &&
    year === selectedDay.getFullYear();

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-[oklch(0.98_0.01_250)] p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <p className="text-muted-foreground mt-1">Your teaching schedule at a glance</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar grid */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-border shadow-[var(--shadow-soft)] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div className="flex items-center gap-4">
              <button onClick={prevMonth} className="h-9 w-9 grid place-items-center rounded-xl bg-secondary hover:bg-secondary/70 transition-colors">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-bold w-48 text-center">
                {MONTHS[month]} {year}
              </h2>
              <button onClick={nextMonth} className="h-9 w-9 grid place-items-center rounded-xl bg-secondary hover:bg-secondary/70 transition-colors">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={goToday}
              className="px-4 py-2 rounded-xl text-sm font-bold text-white"
              style={{ background: 'var(--gradient-brand)' }}
            >
              Today
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-border">
            {DAYS.map(d => (
              <div key={d} className="py-3 text-center text-xs font-bold text-muted-foreground">{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7">
            {/* Blank cells */}
            {[...Array(firstDay)].map((_, i) => (
              <div key={`blank-${i}`} className="h-24 border-b border-r border-border bg-secondary/20" />
            ))}

            {/* Day cells */}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDay(day);
              const today_ = isToday(day);
              const selected_ = isSelected(day);

              return (
                <motion.div
                  key={day}
                  whileHover={{ backgroundColor: 'oklch(0.97 0.01 250)' }}
                  onClick={() => setSelectedDay(new Date(year, month, day))}
                  className={`h-24 border-b border-r border-border p-2 cursor-pointer transition-colors ${
                    selected_ ? 'bg-primary/5 border-primary/30' : ''
                  }`}
                >
                  <div className={`h-7 w-7 rounded-full grid place-items-center text-sm font-bold mb-1 ${
                    today_
                      ? 'text-white'
                      : selected_
                      ? 'text-primary'
                      : 'text-foreground'
                  }`} style={today_ ? { background: 'var(--gradient-brand)' } : {}}>
                    {day}
                  </div>
                  <div className="space-y-0.5 overflow-hidden">
                    {dayEvents.slice(0, 2).map(e => (
                      <div
                        key={e.id}
                        className="text-[9px] font-semibold px-1.5 py-0.5 rounded text-white truncate"
                        style={{ background: e.color }}
                      >
                        {e.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[9px] text-muted-foreground font-semibold px-1">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="px-6 py-4 border-t border-border flex gap-5">
            {[
              { color: 'var(--brand-blue)', label: 'Live Class' },
              { color: 'var(--brand-orange)', label: 'Assignment Due' },
              { color: 'var(--brand-pink)', label: 'Assessment' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                <span className="h-3 w-3 rounded-full shrink-0" style={{ background: item.color }} />
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Day detail panel */}
        <div className="bg-white rounded-3xl border border-border shadow-[var(--shadow-soft)] overflow-hidden flex flex-col">
          <div className="p-5 border-b border-border">
            <h3 className="font-bold text-lg">
              {selectedDay
                ? selectedDay.toLocaleDateString('en-NG', { weekday: 'long', month: 'long', day: 'numeric' })
                : 'Select a day'}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {selectedEvents.length} event{selectedEvents.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : selectedEvents.length === 0 ? (
              <div className="text-center py-10">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">No events on this day</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedEvents.map(e => (
                  <motion.div
                    key={e.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 rounded-2xl border-l-4"
                    style={{ borderColor: e.color, background: `${e.color}10` }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-sm">{e.title}</p>
                        {e.courseTitle && <p className="text-xs text-muted-foreground">{e.courseTitle}</p>}
                      </div>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white shrink-0"
                        style={{ background: e.color }}
                      >
                        {e.type === 'live' ? 'LIVE' : e.type === 'assignment' ? 'DEADLINE' : 'TEST'}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatTime(e.time)}
                      </span>
                      {e.durationMins && (
                        <span className="flex items-center gap-1">
                          <Video className="h-3.5 w-3.5" />
                          {e.durationMins} min
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming events */}
          {events.filter(e => e.time > today).length > 0 && (
            <div className="p-4 border-t border-border">
              <p className="text-xs font-bold uppercase text-muted-foreground mb-3">Upcoming</p>
              <div className="space-y-2">
                {events
                  .filter(e => e.time > today)
                  .sort((a, b) => a.time.getTime() - b.time.getTime())
                  .slice(0, 3)
                  .map(e => (
                    <div
                      key={e.id}
                      className="flex items-center gap-2 text-xs cursor-pointer hover:bg-secondary/50 p-2 rounded-xl transition-colors"
                      onClick={() => {
                        setSelectedDay(new Date(e.time.getFullYear(), e.time.getMonth(), e.time.getDate()));
                        setViewDate(new Date(e.time.getFullYear(), e.time.getMonth(), 1));
                      }}
                    >
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: e.color }} />
                      <span className="font-semibold flex-1 truncate">{e.title}</span>
                      <span className="text-muted-foreground shrink-0">
                        {e.time.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

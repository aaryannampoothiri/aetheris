"use client";

import { useMemo, useRef, useState } from "react";
import { GlassCard } from "@/components/glass-card";
import { useAppStore } from "@/lib/app-store";
import { CalendarCheck2, CalendarDays, Clock3, Trash2 } from "lucide-react";
import { TimeDialPicker } from "@/components/time-dial-picker";

type ActivityCategory = "meeting" | "task" | "personal" | "other";

const categoryLabel: Record<ActivityCategory, string> = {
  meeting: "Meeting",
  task: "Task",
  personal: "Personal",
  other: "Other",
};

export default function CalendarPage() {
  const calendarActivities = useAppStore((state) => state.calendarActivities);
  const addCalendarActivity = useAppStore((state) => state.addCalendarActivity);
  const removeCalendarActivity = useAppStore((state) => state.removeCalendarActivity);
  const toggleCalendarActivityCompleted = useAppStore((state) => state.toggleCalendarActivityCompleted);

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState<ActivityCategory>("meeting");
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const openNativePicker = (input: HTMLInputElement | null) => {
    if (!input) return;
    input.focus({ preventScroll: true });
    try {
      if (typeof input.showPicker === "function") {
        input.showPicker();
        return;
      }
    } catch {
      // Fallback below for browsers that block or don't support showPicker.
    }
    input.click();
  };

  const sortedActivities = useMemo(() => {
    return [...calendarActivities].sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
    );
  }, [calendarActivities]);

  const handleAddActivity = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle || !date || !time) return;

    addCalendarActivity(trimmedTitle, notes.trim(), date, time, category);
    setTitle("");
    setNotes("");
    setDate("");
    setTime("");
    setCategory("meeting");
  };

  return (
    <div className="space-y-4">
      <header className="rounded-3xl border border-white/20 bg-black/30 p-6">
        <p className="text-xs tracking-[0.22em] text-cyan-200/90">MY CALENDAR</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-100 md:text-4xl">Plan Meetings & Daily Activities</h1>
      </header>

      <GlassCard className="relative z-20 space-y-3 overflow-visible" glow="cyan">
        <h2 className="text-base font-medium text-slate-100">Schedule Activity</h2>
        <div className="grid gap-2 md:grid-cols-2">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Activity title"
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-cyan-300/40"
          />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as ActivityCategory)}
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-300/40"
          >
            <option value="meeting">Meeting</option>
            <option value="task">Task</option>
            <option value="personal">Personal</option>
            <option value="other">Other</option>
          </select>
          <div className="relative">
            <input
              ref={dateInputRef}
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="picker-input w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 pr-10 text-sm text-slate-200 outline-none focus:border-cyan-300/40"
            />
            <button
              type="button"
              onClick={() => openNativePicker(dateInputRef.current)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-white/10"
              aria-label="Open date picker"
            >
              <CalendarDays className="picker-icon h-4 w-4" />
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={time}
              readOnly
              placeholder="Select time"
              className="picker-input w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 pr-10 text-sm text-slate-200 outline-none focus:border-cyan-300/40"
            />
            <button
              type="button"
              onClick={() => setShowTimePicker((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 hover:bg-white/10"
              aria-label="Open time picker"
            >
              <Clock3 className="picker-icon h-4 w-4" />
            </button>
            <TimeDialPicker
              value={time}
              onChange={setTime}
              isOpen={showTimePicker}
              onClose={() => setShowTimePicker(false)}
            />
          </div>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Notes (optional)"
            rows={2}
            className="md:col-span-2 resize-none rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-cyan-300/40"
          />
        </div>
        <button
          type="button"
          onClick={handleAddActivity}
          className="rounded-lg border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-200 transition hover:bg-cyan-300/20"
        >
          Add to Calendar
        </button>
      </GlassCard>

      <GlassCard className="relative z-0 space-y-3" glow="teal">
        <h2 className="text-base font-medium text-slate-100">Upcoming Activities</h2>
        <div className="space-y-2">
          {sortedActivities.length === 0 && (
            <p className="rounded-xl border border-dashed border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-500">
              No calendar activities yet.
            </p>
          )}

          {sortedActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className={`truncate text-sm font-medium ${activity.completed ? "text-slate-500 line-through" : "text-slate-100"}`}>
                    {activity.title}
                  </p>
                  <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] text-slate-300">
                    {categoryLabel[activity.category]}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">{new Date(activity.startsAt).toLocaleString()}</p>
                {activity.notes && <p className="mt-1 text-xs text-slate-300">{activity.notes}</p>}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleCalendarActivityCompleted(activity.id, !activity.completed)}
                  className={`rounded-md p-1 transition ${
                    activity.completed
                      ? "text-teal-300 hover:bg-teal-300/10"
                      : "text-slate-400 hover:bg-white/10 hover:text-teal-300"
                  }`}
                  aria-label="Toggle completed"
                >
                  <CalendarCheck2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeCalendarActivity(activity.id)}
                  className="rounded-md p-1 text-slate-500 transition hover:bg-white/10 hover:text-red-300"
                  aria-label="Remove activity"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <style jsx>{`
        .picker-input::-webkit-calendar-picker-indicator {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .picker-icon {
          color: #ffffff !important;
        }
      `}</style>
    </div>
  );
}

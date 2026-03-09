"use client";

import { useEffect, useMemo, useState } from "react";
import { Briefcase, Focus, Timer, Trash2, X, Heart } from "lucide-react";
import { GlassCard } from "@/components/glass-card";
import { useAppStore } from "@/lib/app-store";
import { FlashCardViewer, type FlashCardData } from "@/components/flashcard-viewer";

function formatFocusDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

function formatDeadlineDate(isoDate: string) {
  const date = new Date(isoDate);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getCountdownParts(isoDate: string) {
  const delta = new Date(isoDate).getTime() - Date.now();
  const safe = Math.max(0, delta);
  const days = Math.floor(safe / (1000 * 60 * 60 * 24));
  const hours = Math.floor((safe % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((safe % (1000 * 60 * 60)) / (1000 * 60));
  return { days, hours, minutes, expired: delta <= 0 };
}

function getTimeRemaining(isoDate: string): number {
  return new Date(isoDate).getTime() - Date.now();
}

export default function Home() {
  const tasks = useAppStore((state) => state.dailyTasks);
  const deadlines = useAppStore((state) => state.deadlines);
  const calendarActivities = useAppStore((state) => state.calendarActivities);
  const wellnessActivities = useAppStore((state) => state.wellnessActivities);
  const isFocusMode = useAppStore((state) => state.isFocusMode);
  const setFocusMode = useAppStore((state) => state.setFocusMode);
  const focusModeStartedAt = useAppStore((state) => state.focusModeStartedAt);
  const focusModeTotalSeconds = useAppStore((state) => state.focusModeTotalSeconds);
  const isWorkModeActive = useAppStore((state) => state.isWorkModeActive);
  const setWorkModeActive = useAppStore((state) => state.setWorkModeActive);
  const removeCalendarActivity = useAppStore((state) => state.removeCalendarActivity);
  const toggleCalendarActivityCompleted = useAppStore((state) => state.toggleCalendarActivityCompleted);

  const [activeActivityId, setActiveActivityId] = useState<string | null>(null);
  const [clockNow, setClockNow] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setClockNow(Date.now()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const totalFocusSeconds = useMemo(() => {
    if (!isFocusMode || !focusModeStartedAt) return focusModeTotalSeconds;
    const running = Math.max(0, Math.floor((clockNow - focusModeStartedAt) / 1000));
    return focusModeTotalSeconds + running;
  }, [clockNow, focusModeStartedAt, focusModeTotalSeconds, isFocusMode]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((task) => task.column === "Done").length;
    const inProgress = tasks.filter((task) => task.column === "Working On").length;
    const focused = total === 0 ? 0 : Math.round((inProgress / total) * 100);
    return {
      focused: `${focused}%`,
      done: `${done}/${total || 0}`,
      worked: formatFocusDuration(totalFocusSeconds),
    };
  }, [tasks, totalFocusSeconds]);

  const todoTasks = useMemo(() => tasks.filter((task) => task.column === "To Do"), [tasks]);
  const ongoingTasks = useMemo(() => tasks.filter((task) => task.column === "Working On"), [tasks]);

  const activeDeadlineFlashCards: FlashCardData[] = useMemo(() => {
    return deadlines
      .filter((deadline) => !deadline.completed)
      .sort((a, b) => getTimeRemaining(a.dueAt) - getTimeRemaining(b.dueAt))
      .map((deadline) => {
        const countdown = getCountdownParts(deadline.dueAt);
        const timeText = countdown.expired
          ? "⏰ DUE / PASSED"
          : `⏰ Due in ${countdown.days}d ${countdown.hours}h ${countdown.minutes}m`;

        return {
          id: deadline.id,
          front: deadline.title,
          back: `${deadline.description || "No details"}\n\n📅 ${formatDeadlineDate(deadline.dueAt)}\n${timeText}`,
        };
      });
  }, [deadlines, clockNow]);

  const todayKey = useMemo(() => new Date(clockNow).toISOString().slice(0, 10), [clockNow]);

  // Calculate wellness score from today's activities
  const wellnessScore = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todayWellnessActivities = wellnessActivities.filter((a) => a.timestamp.startsWith(today));

    const waterCount = todayWellnessActivities.filter((a) => a.type === "water").length;
    const breakCount = todayWellnessActivities.filter((a) => a.type === "break").length;
    const exerciseCount = todayWellnessActivities.filter((a) => a.type === "exercise").length;
    const moodLoggedToday = todayWellnessActivities.some((a) => a.type === "mood");

    // Scoring: Each metric out of 25 points
    const hydrationScore = Math.min(25, (waterCount / 8) * 25); // 8 glasses = 25 points
    const breakScore = Math.min(25, (breakCount / 6) * 25); // 6 breaks = 25 points
    const exerciseScore = Math.min(25, (exerciseCount / 4) * 25); // 4 exercises = 25 points
    const moodScore = moodLoggedToday ? 25 : 0; // Full 25 if mood logged

    const total = Math.round(hydrationScore + breakScore + exerciseScore + moodScore);
    return Math.min(100, total);
  }, [wellnessActivities]);

  const todaysActivities = useMemo(
    () =>
      calendarActivities
        .filter((activity) => activity.startsAt.slice(0, 10) === todayKey)
        .sort((a, b) => getTimeRemaining(a.startsAt) - getTimeRemaining(b.startsAt)),
    [calendarActivities, todayKey]
  );

  const activeActivity = useMemo(
    () => todaysActivities.find((item) => item.id === activeActivityId) ?? null,
    [activeActivityId, todaysActivities]
  );

  const handleToggleFocusMode = async () => {
    if (!isFocusMode) {
      try {
        await document.documentElement.requestFullscreen();
      } catch {
        // If fullscreen request is blocked, still enable focus mode in-app.
      }
      setFocusMode(true);
      return;
    }

    setFocusMode(false);
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  };

  // Convert today's activities to flashcards sorted by start time urgency
  const todayActivityFlashCards: FlashCardData[] = useMemo(() => {
    return todaysActivities
      .filter((activity) => !activity.completed)
      .map((activity) => {
        const countdown = getCountdownParts(activity.startsAt);
        let timeText = "";
        if (countdown.expired) {
          timeText = "⏰ STARTED / PASSED";
        } else {
          timeText = `⏰ Starts in ${countdown.days}d ${countdown.hours}h ${countdown.minutes}m`;
        }
        
        return {
          id: activity.id,
          front: activity.title,
          back: `${activity.notes || "No details"}\n\n📅 ${formatDeadlineDate(activity.startsAt)}\n${timeText}`,
        };
      });
  }, [todaysActivities, clockNow]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-white/20 bg-linear-to-r from-cyan-500/20 via-slate-900/30 to-orange-400/20 p-6 md:p-8">
        <p className="text-xs tracking-[0.24em] text-cyan-100/90">YOUR DASHBOARD</p>
        <h1 className="mt-3 max-w-3xl text-3xl leading-tight font-semibold text-slate-100 md:text-5xl">
          Your personal AI workspace for focused work.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-300 md:text-base">
          See your daily priorities and current task flow in one place. Track what to start now and what is already in progress.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <GlassCard glow="cyan" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-slate-50">Your Focus Stats</h2>
              <Timer className="h-4 w-4 text-cyan-300" />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Focused", value: stats.focused },
                { label: "Done", value: stats.done },
                { label: "Worked", value: stats.worked },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-white/10 p-3">
                  <p className="text-xs text-slate-300">{item.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-cyan-100">{item.value}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard glow="orange" className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-slate-50">Active Deadlines</h2>
            </div>
            <p className="text-sm text-slate-400">
              Showing upcoming deadlines from <span className="text-orange-200">Tasks</span>, sorted by urgency.
            </p>

            {activeDeadlineFlashCards.length > 0 ? (
              <div className="rounded-xl border border-white/10 bg-white/10 p-4">
                <FlashCardViewer
                  key={activeDeadlineFlashCards[0]?.id ?? "no-deadline"}
                  cards={activeDeadlineFlashCards}
                  variant="deadline"
                />
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-white/10 bg-white/10 px-3 py-3 text-sm text-slate-500">
                No active deadlines. Add one from Tasks.
              </p>
            )}
          </GlassCard>

        </div>

        <div className="space-y-4">
          <GlassCard glow="teal" className="space-y-3">
            <h2 className="text-lg font-medium text-slate-50">To Do Tasks</h2>
            {todoTasks.length === 0 ? (
              <p className="rounded-xl border border-dashed border-white/10 bg-white/10 px-3 py-3 text-sm text-slate-500">
                No tasks in To Do.
              </p>
            ) : (
              <div className="space-y-2">
                {todoTasks.slice(0, 6).map((task) => (
                  <div key={task.id} className="rounded-xl border border-white/10 bg-white/10 px-3 py-2">
                    <p className="text-sm text-slate-200">{task.title}</p>
                    {task.description ? <p className="mt-1 text-xs text-slate-400">{task.description}</p> : null}
                  </div>
                ))}
                {todoTasks.length > 6 ? (
                  <p className="text-xs text-slate-400">+{todoTasks.length - 6} more in Tasks</p>
                ) : null}
              </div>
            )}
          </GlassCard>

          <GlassCard glow="orange" className="space-y-3">
            <h2 className="text-lg font-medium text-slate-50">Ongoing Tasks</h2>
            {ongoingTasks.length === 0 ? (
              <p className="rounded-xl border border-dashed border-white/10 bg-white/10 px-3 py-3 text-sm text-slate-500">
                No tasks in Working On.
              </p>
            ) : (
              <div className="space-y-2">
                {ongoingTasks.slice(0, 6).map((task) => (
                  <div key={task.id} className="rounded-xl border border-white/10 bg-white/10 px-3 py-2">
                    <p className="text-sm text-slate-200">{task.title}</p>
                    {task.description ? <p className="mt-1 text-xs text-slate-400">{task.description}</p> : null}
                  </div>
                ))}
                {ongoingTasks.length > 6 ? (
                  <p className="text-xs text-slate-400">+{ongoingTasks.length - 6} more in Tasks</p>
                ) : null}
              </div>
            )}
          </GlassCard>

          <GlassCard glow="orange" className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-slate-50">Today's Activities</h2>
            </div>
            <p className="text-sm text-slate-400">
              Showing only today's scheduled activities from <span className="text-orange-200">My Calendar</span>.
            </p>

            {/* Today's Activity Flashcards */}
            {todayActivityFlashCards.length > 0 ? (
              <div className="rounded-xl border border-white/10 bg-white/10 p-4">
                <FlashCardViewer
                  key={todayActivityFlashCards[0]?.id ?? "no-activity"}
                  cards={todayActivityFlashCards}
                  variant="deadline"
                />
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-white/10 bg-white/10 px-3 py-3 text-sm text-slate-500">
                No activities scheduled for today. Add one from My Calendar.
              </p>
            )}

            {/* Manage Today's Activities */}
            {todaysActivities.length > 0 && (
              <details className="rounded-lg border border-white/10 bg-white/10">
                <summary className="cursor-pointer px-3 py-2 text-sm text-slate-300 hover:text-slate-100">
                  Manage Today's Activities ({todaysActivities.length})
                </summary>
                <div className="space-y-2 border-t border-white/10 p-3">
                  {todaysActivities.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border border-white/10 bg-white/10 px-3 py-2"
                    >
                      <button type="button" onClick={() => setActiveActivityId(item.id)} className="flex-1 text-left">
                        <span className={`text-sm ${item.completed ? "text-slate-500 line-through" : "text-slate-200"}`}>
                          {item.title}
                        </span>
                        <p className="text-xs text-slate-400">{formatDeadlineDate(item.startsAt)}</p>
                      </button>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1.5 text-xs text-slate-300">
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={(event) =>
                              toggleCalendarActivityCompleted(item.id, event.target.checked)
                            }
                            className="h-3.5 w-3.5 accent-teal-400"
                          />
                          <span className="text-xs">Done</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => removeCalendarActivity(item.id)}
                          className="rounded-md p-1 text-slate-500 transition hover:bg-white/10 hover:text-red-300"
                          aria-label="Remove activity"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </GlassCard>

          <GlassCard glow="teal" className="space-y-3">
            <h2 className="text-lg font-medium text-slate-50">Modes</h2>
            <p className="text-sm text-slate-400">Quick access to Work and Focus mode controls.</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setWorkModeActive(!isWorkModeActive)}
                className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                  isWorkModeActive
                    ? "border-amber-300/40 bg-amber-300/10 text-amber-200"
                    : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
                aria-label="Toggle work mode"
              >
                <Briefcase className="h-4 w-4" />
                <span>{isWorkModeActive ? "Stop Work" : "Work Mode"}</span>
              </button>

              <button
                type="button"
                onClick={() => void handleToggleFocusMode()}
                className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                  isFocusMode
                    ? "border-teal-300/40 bg-teal-300/10 text-teal-200"
                    : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
                aria-label="Toggle focus mode"
              >
                <Focus className="h-4 w-4" />
                <span>{isFocusMode ? "Exit Focus" : "Focus Mode"}</span>
              </button>
            </div>
          </GlassCard>

          <GlassCard glow="teal" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-slate-50">Wellness Score</h2>
              <Heart className="h-5 w-5 text-pink-300" />
            </div>
            <div className="flex items-center justify-center py-4">
              <svg width="200" height="110" viewBox="0 0 200 110" className="drop-shadow-lg">
                {/* Background semicircle */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Progress semicircle */}
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="url(#scoreGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(wellnessScore / 100) * 251.2} 251.2`}
                  strokeDashoffset="0"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                {/* Center text */}
                <text x="100" y="60" textAnchor="middle" className="fill-cyan-200 text-2xl font-bold">
                  {wellnessScore}
                </text>
                <text x="100" y="80" textAnchor="middle" className="fill-slate-400 text-xs">
                  out of 100
                </text>
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-cyan-300/10 border border-cyan-300/20 px-2 py-2">
                <p className="text-slate-400">Water</p>
                <p className="text-cyan-200 font-medium">Hydration</p>
              </div>
              <div className="rounded-lg bg-teal-300/10 border border-teal-300/20 px-2 py-2">
                <p className="text-slate-400">Breaks</p>
                <p className="text-teal-200 font-medium">Rest Days</p>
              </div>
              <div className="rounded-lg bg-blue-300/10 border border-blue-300/20 px-2 py-2">
                <p className="text-slate-400">Exercise</p>
                <p className="text-blue-200 font-medium">Movement</p>
              </div>
              <div className="rounded-lg bg-pink-300/10 border border-pink-300/20 px-2 py-2">
                <p className="text-slate-400">Mood</p>
                <p className="text-pink-200 font-medium">Check-in</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {activeActivity && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 px-4"
          onClick={() => setActiveActivityId(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-white/15 bg-slate-950/95 p-5 backdrop-blur-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-slate-100">{activeActivity.title}</h3>
                <p className="mt-1 text-sm text-slate-400">{activeActivity.notes || "No details"}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveActivityId(null)}
                className="rounded-md p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Close activity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 rounded-xl border border-white/10 bg-white/10 p-4">
              <p className="text-sm text-slate-300">
                <span className="text-slate-400">Date & Time:</span> {formatDeadlineDate(activeActivity.startsAt)}
              </p>
              {(() => {
                const countdown = getCountdownParts(activeActivity.startsAt);
                if (countdown.expired) {
                  return <p className="text-sm text-red-300">Countdown: Started / Passed</p>;
                }
                return (
                  <p className="text-sm text-cyan-200">
                    Starts in: {countdown.days} days, {countdown.hours} hours, {countdown.minutes} minutes
                  </p>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

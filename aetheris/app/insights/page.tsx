"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { useAppStore } from "@/lib/app-store";
import { TrendingDown, TrendingUp } from "lucide-react";

function formatHours(seconds: number) {
  return `${(seconds / 3600).toFixed(1)}h`;
}

function formatDayLabel(isoDate: string) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
  });
}

function dateKeyFromOffset(offset: number) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

export default function InsightsPage() {
  const timeLogs = useAppStore((state) => state.timeLogs);
  const isFocusMode = useAppStore((state) => state.isFocusMode);
  const focusModeStartedAt = useAppStore((state) => state.focusModeStartedAt);
  const isWorkModeActive = useAppStore((state) => state.isWorkModeActive);
  const workModeStartedAt = useAppStore((state) => state.workModeStartedAt);
  const deadlines = useAppStore((state) => state.deadlines);
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => setNowMs(Date.now()), 60000);
    return () => window.clearInterval(intervalId);
  }, []);

  const weeklyWork = useMemo(() => {
    const todayKey = dateKeyFromOffset(0);
    const runningWorkSeconds =
      isWorkModeActive && workModeStartedAt
        ? Math.max(0, Math.floor((nowMs - workModeStartedAt) / 1000))
        : 0;

    const days = Array.from({ length: 7 }, (_, idx) => {
      const key = dateKeyFromOffset(-(6 - idx));
      const base = timeLogs.find((entry) => entry.date === key)?.workSeconds ?? 0;
      const withRunning = key === todayKey ? base + runningWorkSeconds : base;
      return { key, seconds: withRunning };
    });

    const currentWeekTotal = days.reduce((sum, day) => sum + day.seconds, 0);

    const previousWeekTotal = Array.from({ length: 7 }, (_, idx) => {
      const key = dateKeyFromOffset(-(13 - idx));
      return timeLogs.find((entry) => entry.date === key)?.workSeconds ?? 0;
    }).reduce((sum, seconds) => sum + seconds, 0);

    const delta = currentWeekTotal - previousWeekTotal;

    return {
      days,
      currentWeekTotal,
      previousWeekTotal,
      delta,
    };
  }, [isWorkModeActive, nowMs, timeLogs, workModeStartedAt]);

  const weeklyFocus = useMemo(() => {
    const todayKey = dateKeyFromOffset(0);
    const runningFocusSeconds =
      isFocusMode && focusModeStartedAt
        ? Math.max(0, Math.floor((nowMs - focusModeStartedAt) / 1000))
        : 0;

    const days = Array.from({ length: 7 }, (_, idx) => {
      const key = dateKeyFromOffset(-(6 - idx));
      const base = timeLogs.find((entry) => entry.date === key)?.focusSeconds ?? 0;
      const withRunning = key === todayKey ? base + runningFocusSeconds : base;
      return { key, seconds: withRunning };
    });

    const total = days.reduce((sum, day) => sum + day.seconds, 0);
    const avg = Math.floor(total / 7);
    const best = days.reduce((max, day) => (day.seconds > max.seconds ? day : max), days[0]);

    return { total, avg, best };
  }, [focusModeStartedAt, isFocusMode, nowMs, timeLogs]);

  const deadlineStats = useMemo(() => {
    const completed = deadlines.filter((item) => item.completed === true).length;
    const missed = deadlines.filter(
      (item) => item.completed !== true && new Date(item.dueAt).getTime() < nowMs
    ).length;
    const upcoming = deadlines.filter(
      (item) => item.completed !== true && new Date(item.dueAt).getTime() >= nowMs
    ).length;

    return { completed, missed, upcoming };
  }, [deadlines, nowMs]);

  const maxWorkSeconds = Math.max(1, ...weeklyWork.days.map((day) => day.seconds));

  return (
    <div className="space-y-4">
      <header className="rounded-3xl border border-white/20 bg-black/30 p-6">
        <p className="text-xs tracking-[0.22em] text-cyan-200/90">YOUR STATS</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-100 md:text-4xl">Track Your Productivity</h1>
      </header>

      <section className="grid gap-4 xl:grid-cols-3">
        <GlassCard glow="teal" className="space-y-4 xl:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-slate-100">Weekly Work Time</h2>
            <div
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-1 text-sm ${
                weeklyWork.delta >= 0
                  ? "border border-emerald-300/30 bg-emerald-300/10 text-emerald-200"
                  : "border border-rose-300/30 bg-rose-300/10 text-rose-200"
              }`}
            >
              {weeklyWork.delta >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {weeklyWork.delta >= 0 ? "+" : ""}
              {formatHours(Math.abs(weeklyWork.delta))} vs last week
            </div>
          </div>

          <div className="flex h-56 items-end justify-between gap-3 rounded-2xl bg-black/20 p-4">
            {weeklyWork.days.map((day, index) => {
              const barHeight = Math.max(8, (day.seconds / maxWorkSeconds) * 100);
              return (
              <motion.div
                key={`${day.key}-${index}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: `${barHeight}%`, opacity: 1 }}
                transition={{ delay: index * 0.06, type: "spring", stiffness: 180, damping: 18 }}
                className="relative w-full rounded-md bg-linear-to-t from-amber-400/35 to-cyan-300/70"
              >
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-300">
                  {formatHours(day.seconds)}
                </span>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-400">
                  {formatDayLabel(day.key)}
                </span>
              </motion.div>
              );
            })}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-black/25 p-3">
              <p className="text-xs text-slate-300">This Week</p>
              <p className="mt-1 text-2xl font-semibold text-cyan-100">{formatHours(weeklyWork.currentWeekTotal)}</p>
            </div>
            <div className="rounded-xl bg-black/25 p-3">
              <p className="text-xs text-slate-300">Last Week</p>
              <p className="mt-1 text-2xl font-semibold text-slate-100">{formatHours(weeklyWork.previousWeekTotal)}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard glow="orange" className="space-y-3">
          <h2 className="text-lg font-medium text-slate-100">Weekly Focus Time</h2>
          <div className="grid gap-3">
            <div className="rounded-xl bg-black/25 p-3">
              <p className="text-xs text-slate-300">Total Focus</p>
              <p className="mt-1 text-2xl font-semibold text-orange-100">{formatHours(weeklyFocus.total)}</p>
            </div>
            <div className="rounded-xl bg-black/25 p-3">
              <p className="text-xs text-slate-300">Average / Day</p>
              <p className="mt-1 text-2xl font-semibold text-slate-100">{formatHours(weeklyFocus.avg)}</p>
            </div>
            <div className="rounded-xl bg-black/25 p-3">
              <p className="text-xs text-slate-300">Best Focus Day</p>
              <p className="mt-1 text-2xl font-semibold text-slate-100">
                {formatDayLabel(weeklyFocus.best.key)} • {formatHours(weeklyFocus.best.seconds)}
              </p>
            </div>
          </div>
        </GlassCard>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <GlassCard glow="teal" className="space-y-2">
          <h3 className="text-sm font-medium text-slate-200">Completed Deadlines</h3>
          <p className="text-3xl font-semibold text-emerald-200">{deadlineStats.completed}</p>
        </GlassCard>
        <GlassCard glow="orange" className="space-y-2">
          <h3 className="text-sm font-medium text-slate-200">Missed Deadlines</h3>
          <p className="text-3xl font-semibold text-rose-200">{deadlineStats.missed}</p>
        </GlassCard>
        <GlassCard glow="cyan" className="space-y-2">
          <h3 className="text-sm font-medium text-slate-200">Upcoming Deadlines</h3>
          <p className="text-3xl font-semibold text-cyan-200">{deadlineStats.upcoming}</p>
        </GlassCard>
      </section>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { GlassCard } from "@/components/glass-card";
import { useAppStore } from "@/lib/app-store";
import { 
  Heart, 
  Coffee, 
  Eye, 
  Wind, 
  Smile, 
  Frown, 
  Meh, 
  Activity,
  Clock,
  Droplets,
  Moon,
  Sun,
  Timer,
  CheckCircle,
  Play,
  Pause,
  Bell,
} from "lucide-react";

type MoodType = "great" | "good" | "okay" | "tired" | "stressed";

const BREAK_INTERVAL = 25 * 60 * 1000; // 25 minutes
const HYDRATION_REMINDER = 60 * 60 * 1000; // 60 minutes

export default function WellnessPage() {
  const user = useAppStore((state) => state.user);
  const wellnessActivities = useAppStore((state) => state.wellnessActivities);
  const logWellnessActivity = useAppStore((state) => state.logWellnessActivity);
  const removeWellnessActivity = useAppStore((state) => state.removeWellnessActivity);
  const checkWellnessReminders = useAppStore((state) => state.checkWellnessReminders);
  const updateWellnessReminders = useAppStore((state) => state.updateWellnessReminders);
  const wellnessRemindersEnabled = useAppStore((state) => state.wellnessRemindersEnabled);
  const toggleWellnessReminders = useAppStore((state) => state.toggleWellnessReminders);
  const showWellnessReminder = useAppStore((state) => state.showWellnessReminder);

  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [breathingTimer, setBreathingTimer] = useState(4);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [clockNow, setClockNow] = useState(Date.now());
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => setClockNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        setNotificationsEnabled(true);
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            setNotificationsEnabled(true);
          }
        });
      }
    }
  }, []);

  // Check wellness reminders and display via mascot
  useEffect(() => {
    const reminderInterval = setInterval(() => {
      if (!wellnessRemindersEnabled) return;

      const { shouldRemindHydration, shouldRemindBreak } = checkWellnessReminders();

      if (shouldRemindHydration) {
        showWellnessReminder("water", "Time to drink some water! Stay hydrated and maintain your wellness streak. 💧");
        updateWellnessReminders(Date.now(), undefined as any);
      }

      if (shouldRemindBreak) {
        showWellnessReminder("break", "Time for a break! Take 5 minutes to rest your eyes and recharge. ☕");
        updateWellnessReminders(undefined as any, Date.now());
      }
    }, 60000); // Check every minute

    return () => clearInterval(reminderInterval);
  }, [wellnessRemindersEnabled, checkWellnessReminders, updateWellnessReminders, showWellnessReminder]);

  // Breathing exercise timer
  useEffect(() => {
    if (!isBreathingActive) return;

    const interval = setInterval(() => {
      setBreathingTimer((prev) => {
        if (prev <= 1) {
          if (breathingPhase === "inhale") {
            setBreathingPhase("hold");
            return 4;
          } else if (breathingPhase === "hold") {
            setBreathingPhase("exhale");
            return 6;
          } else {
            setBreathingPhase("inhale");
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathingActive, breathingPhase]);

  // Today's activities
  const todayActivities = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return wellnessActivities.filter((a) => a.timestamp.startsWith(today));
  }, [wellnessActivities]);

  // Today's counts
  const waterCount = todayActivities.filter((a) => a.type === "water").length;
  const breakCount = todayActivities.filter((a) => a.type === "break").length;
  const currentMood = todayActivities.filter((a) => a.type === "mood").pop()?.value as MoodType | undefined;

  // Wellness streak calculation
  const streakDays = useMemo(() => {
    const uniqueDates = [...new Set(wellnessActivities.map((a) => a.timestamp.slice(0, 10)))];
    uniqueDates.sort().reverse();

    let streak = 0;
    const today = new Date();

    for (let i = 0; i < uniqueDates.length; i++) {
      const expected = new Date(today);
      expected.setDate(today.getDate() - i);
      const expectedStr = expected.toISOString().slice(0, 10);

      if (uniqueDates[i] === expectedStr) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }, [wellnessActivities]);

  // Time calculations
  const { shouldRemindHydration, shouldRemindBreak } = checkWellnessReminders();

  const lastWater = todayActivities.filter((a) => a.type === "water").pop();
  const timeUntilHydration = lastWater
    ? Math.max(0, HYDRATION_REMINDER - (clockNow - new Date(lastWater.timestamp).getTime()))
    : HYDRATION_REMINDER;

  const lastBreak = todayActivities.filter((a) => a.type === "break").pop();
  const timeUntilBreak = lastBreak
    ? Math.max(0, BREAK_INTERVAL - (clockNow - new Date(lastBreak.timestamp).getTime()))
    : BREAK_INTERVAL;

  const formatTimeRemaining = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const moodOptions: { value: MoodType; icon: typeof Smile; label: string; color: string }[] = [
    { value: "great", icon: Smile, label: "Great", color: "text-green-300" },
    { value: "good", icon: Smile, label: "Good", color: "text-teal-300" },
    { value: "okay", icon: Meh, label: "Okay", color: "text-yellow-300" },
    { value: "tired", icon: Moon, label: "Tired", color: "text-blue-300" },
    { value: "stressed", icon: Frown, label: "Stressed", color: "text-orange-300" },
  ];

  const handleLogActivity = (type: "water" | "break" | "exercise" | "mood", value?: string) => {
    logWellnessActivity(type, value);

    if (type === "water") {
      updateWellnessReminders(clockNow, undefined as any);
      if (notificationsEnabled) {
        new Notification("✅ Water Logged", {
          body: `Great! You've logged ${waterCount + 1} glasses today.`,
        });
      }
    } else if (type === "break") {
      updateWellnessReminders(undefined as any, clockNow);
      if (notificationsEnabled) {
        new Notification("✅ Break Logged", {
          body: `You're doing great! ${breakCount + 1} breaks taken today.`,
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      <header className="rounded-3xl border border-white/20 bg-gradient-to-r from-green-500/20 via-slate-900/30 to-blue-400/20 p-6">
        <p className="text-xs tracking-[0.22em] text-green-200/90">WELLNESS & CARE</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-100 md:text-4xl">
          Take Care of Yourself, {user?.name || "Friend"}
        </h1>
        <p className="mt-2 text-sm text-slate-300">
          Your well-being matters. Track your wellness activities and receive gentle reminders.
        </p>
      </header>

      {/* Notification & Reminder Status */}
      <GlassCard glow="cyan" className="space-y-3">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className={`h-4 w-4 ${notificationsEnabled ? "text-green-300" : "text-slate-500"}`} />
              <p className="text-sm text-slate-200">
                Reminders: <span className={wellnessRemindersEnabled ? "text-green-300 font-medium" : "text-slate-500"}>
                  {wellnessRemindersEnabled ? "Enabled" : "Disabled"}
                </span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleWellnessReminders()}
              className={`text-xs rounded-lg border px-2 py-1 transition ${
                wellnessRemindersEnabled
                  ? "border-green-300/40 bg-green-300/10 text-green-100 hover:bg-green-300/20"
                  : "border-slate-400/40 bg-slate-400/10 text-slate-300 hover:bg-slate-400/20"
              }`}
            >
              {wellnessRemindersEnabled ? "Disable" : "Enable"}
            </button>
          </div>
          <p className="text-xs text-slate-400">
            {wellnessRemindersEnabled
              ? "You'll receive mascot reminders for hydration (every 60 min) and breaks (every 25 min)"
              : "Mascot reminders are currently off"}
          </p>
        </div>
      </GlassCard>

      <section className="grid gap-4 lg:grid-cols-3">
        <GlassCard glow="green" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-slate-50">Wellness Streak</h2>
            <Activity className="h-5 w-5 text-green-300" />
          </div>
          <div className="rounded-xl bg-black/25 p-4 text-center">
            <p className="text-4xl font-bold text-green-300">{streakDays}</p>
            <p className="mt-1 text-sm text-slate-400">days active</p>
          </div>
        </GlassCard>

        <GlassCard glow="cyan" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-slate-50">Hydration</h2>
            <Droplets className="h-5 w-5 text-cyan-300" />
          </div>
          <div className="rounded-xl bg-black/25 p-4 text-center">
            <p className="text-4xl font-bold text-cyan-300">{waterCount}</p>
            <p className="mt-1 text-sm text-slate-400">glasses today</p>
          </div>
          <div className={`text-xs ${shouldRemindHydration ? "text-green-400 font-medium" : "text-slate-500"}`}>
            {shouldRemindHydration ? "⏰ Time to hydrate!" : `Next: ${formatTimeRemaining(timeUntilHydration)}`}
          </div>
        </GlassCard>

        <GlassCard glow="orange" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-slate-50">Breaks Taken</h2>
            <Coffee className="h-5 w-5 text-orange-300" />
          </div>
          <div className="rounded-xl bg-black/25 p-4 text-center">
            <p className="text-4xl font-bold text-orange-300">{breakCount}</p>
            <p className="mt-1 text-sm text-slate-400">breaks today</p>
          </div>
          <div className={`text-xs ${shouldRemindBreak ? "text-orange-400 font-medium" : "text-slate-500"}`}>
            {shouldRemindBreak ? "⏰ Time for a break!" : `Next: ${formatTimeRemaining(timeUntilBreak)}`}
          </div>
        </GlassCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <GlassCard glow="teal" className="space-y-4">
          <h2 className="text-lg font-medium text-slate-50">Quick Actions</h2>

          <button
            type="button"
            onClick={() => handleLogActivity("water")}
            className="flex w-full items-center gap-3 rounded-lg border border-blue-300/40 bg-blue-300/10 px-4 py-3 text-left cursor-pointer transition-all duration-300 hover:border-blue-300/80 hover:bg-blue-300/30 hover:shadow-lg hover:shadow-blue-300/40"
          >
            <Droplets className="h-5 w-5 text-blue-300" />
            <div>
              <p className="text-sm font-medium text-blue-100">Log Water Intake</p>
              <p className="text-xs text-slate-400">Stay hydrated</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleLogActivity("break")}
            className="flex w-full items-center gap-3 rounded-lg border border-blue-300/40 bg-blue-300/10 px-4 py-3 text-left cursor-pointer transition-all duration-300 hover:border-blue-300/80 hover:bg-blue-300/30 hover:shadow-lg hover:shadow-blue-300/40"
          >
            <Coffee className="h-5 w-5 text-blue-300" />
            <div>
              <p className="text-sm font-medium text-blue-100">Take a Break</p>
              <p className="text-xs text-slate-400">Rest and recharge</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setShowBreathingExercise(true)}
            className="flex w-full items-center gap-3 rounded-lg border border-blue-300/40 bg-blue-300/10 px-4 py-3 text-left cursor-pointer transition-all duration-300 hover:border-blue-300/80 hover:bg-blue-300/30 hover:shadow-lg hover:shadow-blue-300/40"
          >
            <Wind className="h-5 w-5 text-blue-300" />
            <div>
              <p className="text-sm font-medium text-blue-100">Breathing Exercise</p>
              <p className="text-xs text-slate-400">Calm your mind (4-4-6)</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleLogActivity("exercise")}
            className="flex w-full items-center gap-3 rounded-lg border border-blue-300/40 bg-blue-300/10 px-4 py-3 text-left cursor-pointer transition-all duration-300 hover:border-blue-300/80 hover:bg-blue-300/30 hover:shadow-lg hover:shadow-blue-300/40"
          >
            <Activity className="h-5 w-5 text-blue-300" />
            <div>
              <p className="text-sm font-medium text-blue-100">Quick Stretch</p>
              <p className="text-xs text-slate-400">Energize yourself</p>
            </div>
          </button>
        </GlassCard>

        <GlassCard glow="purple" className="space-y-4">
          <h2 className="text-lg font-medium text-slate-50">How Are You Feeling?</h2>

          <div className="grid grid-cols-3 gap-2">
            {moodOptions.map((mood) => {
              const Icon = mood.icon;
              const isActive = currentMood === mood.value;
              return (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => handleLogActivity("mood", mood.value)}
                  className={`flex flex-col items-center gap-2 rounded-lg border px-3 py-3 transition ${
                    isActive
                      ? "border-white/30 bg-white/15"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <Icon className={`h-6 w-6 ${mood.color}`} />
                  <span className="text-xs text-slate-200">{mood.label}</span>
                </button>
              );
            })}
          </div>

          {currentMood && (
            <div className="rounded-lg border border-white/10 bg-black/25 px-3 py-2">
              <p className="text-sm text-slate-300">
                Current mood: <span className="font-medium text-slate-100 capitalize">{currentMood}</span>
              </p>
            </div>
          )}

          <div className="space-y-2 border-t border-white/10 pt-3">
            <h3 className="text-sm font-medium text-slate-200">Wellness Tips</h3>
            <ul className="space-y-1 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-3 w-3 mt-0.5 shrink-0 text-green-400" />
                <span>Take regular breaks every 25-30 minutes</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-3 w-3 mt-0.5 shrink-0 text-cyan-400" />
                <span>Drink at least 8 glasses of water daily</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-3 w-3 mt-0.5 shrink-0 text-orange-400" />
                <span>Practice the 20-20-20 rule for eye health</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-3 w-3 mt-0.5 shrink-0 text-purple-400" />
                <span>Maintain good posture while working</span>
              </li>
            </ul>
          </div>
        </GlassCard>
      </section>

      <GlassCard glow="cyan" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-slate-50">Eye Care Reminder</h2>
          <Eye className="h-5 w-5 text-cyan-300" />
        </div>
        <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-4">
          <h3 className="text-sm font-semibold text-cyan-200">20-20-20 Rule</h3>
          <p className="mt-2 text-sm text-slate-300">
            Every 20 minutes, look at something 20 feet away for 20 seconds to reduce eye strain.
          </p>
          <div className="mt-3 flex gap-2">
            <Timer className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-400">
              Use your focus sessions to remember to rest your eyes regularly.
            </p>
          </div>
        </div>
      </GlassCard>

      {todayActivities.length > 0 && (
        <GlassCard glow="teal" className="space-y-3">
          <h2 className="text-lg font-medium text-slate-50">Today's Activity Log</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {todayActivities
              .slice()
              .reverse()
              .slice(0, 15)
              .map((activity) => {
                const time = new Date(activity.timestamp).toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                let icon = Activity;
                let label = "Activity";
                let color = "text-slate-400";

                if (activity.type === "water") {
                  icon = Droplets;
                  label = "Logged water";
                  color = "text-cyan-300";
                } else if (activity.type === "break") {
                  icon = Coffee;
                  label = "Took a break";
                  color = "text-orange-300";
                } else if (activity.type === "mood") {
                  icon = Heart;
                  label = `Feeling ${activity.value}`;
                  color = "text-pink-300";
                } else if (activity.type === "exercise") {
                  icon = Activity;
                  label = "Did a stretch";
                  color = "text-green-300";
                }

                const Icon = icon;

                return (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/20 px-3 py-2 group"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Icon className={`h-4 w-4 ${color}`} />
                      <span className="text-sm text-slate-200">{label}</span>
                    </div>
                    <span className="text-xs text-slate-500">{time}</span>
                    <button
                      type="button"
                      onClick={() => removeWellnessActivity(activity.id)}
                      className="text-xs text-slate-500 hover:text-red-300 opacity-0 group-hover:opacity-100 transition"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
          </div>
        </GlassCard>
      )}

      {/* Breathing Exercise Modal */}
      {showBreathingExercise && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onClick={() => {
            setShowBreathingExercise(false);
            setIsBreathingActive(false);
            setBreathingPhase("inhale");
            setBreathingTimer(4);
          }}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/15 bg-slate-950/95 p-6 backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 text-center">
              <h3 className="text-2xl font-semibold text-slate-100">Breathing Exercise</h3>
              <p className="mt-2 text-sm text-slate-400">4-4-6 Breathing Technique</p>
            </div>

            <div className="mb-6 flex items-center justify-center">
              <div
                className={`flex h-48 w-48 items-center justify-center rounded-full transition-all duration-1000 ${
                  isBreathingActive && breathingPhase === "inhale"
                    ? "scale-150 bg-green-400/20"
                    : isBreathingActive && breathingPhase === "hold"
                    ? "scale-150 bg-cyan-400/20"
                    : isBreathingActive && breathingPhase === "exhale"
                    ? "scale-100 bg-blue-400/20"
                    : "bg-slate-400/10"
                }`}
              >
                <div className="text-center">
                  <p className="text-5xl font-bold text-slate-100">{breathingTimer}</p>
                  {isBreathingActive && (
                    <p className="mt-2 text-sm font-medium capitalize text-slate-300">
                      {breathingPhase}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {!isBreathingActive ? (
                <button
                  type="button"
                  onClick={() => setIsBreathingActive(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-green-300/40 bg-green-300/10 px-4 py-3 text-green-100 transition hover:bg-green-300/20"
                >
                  <Play className="h-4 w-4" />
                  <span>Start Exercise</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsBreathingActive(false);
                    setBreathingPhase("inhale");
                    setBreathingTimer(4);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-300/40 bg-red-300/10 px-4 py-3 text-red-100 transition hover:bg-red-300/20"
                >
                  <Pause className="h-4 w-4" />
                  <span>Stop</span>
                </button>
              )}

              <div className="rounded-lg border border-white/10 bg-black/25 p-3 text-xs text-slate-400">
                <p><strong className="text-slate-300">Inhale</strong> for 4 seconds</p>
                <p className="mt-1"><strong className="text-slate-300">Hold</strong> for 4 seconds</p>
                <p className="mt-1"><strong className="text-slate-300">Exhale</strong> for 6 seconds</p>
                <p className="mt-2 text-slate-500">Repeat this cycle to reduce stress and anxiety.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

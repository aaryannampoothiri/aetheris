"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/app-store";
import { X, Droplets, Coffee } from "lucide-react";

const mascotVisuals = {
  "optimus-prime": { name: "Optimus Prime", image: "/mascots/optimus-prime.png" },
  bumblebee: { name: "Bumblebee", image: "/mascots/bumblebee.png" },
  "wall-e": { name: "Wall-E", image: "/mascots/wall-e.png" },
  aetheris: { name: "Aetheris", image: "/mascots/aetheris.png" },
} as const;

const HYDRATION_INTERVAL = 60 * 60 * 1000;
const BREAK_INTERVAL = 25 * 60 * 1000;
const SNOOZE_MINUTES = 10;
const SNOOZE_MS = SNOOZE_MINUTES * 60 * 1000;

export function WellnessReminderModal() {
  const activeReminder = useAppStore((state) => state.activeReminder);
  const wellnessRemindersEnabled = useAppStore((state) => state.wellnessRemindersEnabled);
  const clearWellnessReminder = useAppStore((state) => state.clearWellnessReminder);
  const updateWellnessReminders = useAppStore((state) => state.updateWellnessReminders);
  const selectedMascot = useAppStore((state) => state.selectedMascot);
  const [isVisible, setIsVisible] = useState(false);

  const activeMascot = selectedMascot === "none" ? "aetheris" : selectedMascot;
  const mascotInfo = mascotVisuals[activeMascot];

  useEffect(() => {
    if (activeReminder && wellnessRemindersEnabled) {
      setIsVisible(true);
      return;
    }
  }, [activeReminder, wellnessRemindersEnabled, clearWellnessReminder]);

  if (!activeReminder || !wellnessRemindersEnabled) return null;

  const icon = activeReminder.type === "water" ? Droplets : Coffee;
  const Icon = icon;
  const bgColor = activeReminder.type === "water" ? "from-cyan-500/20" : "from-orange-500/20";
  const borderColor = activeReminder.type === "water" ? "border-cyan-400/40" : "border-orange-400/40";
  const textColor = activeReminder.type === "water" ? "text-cyan-100" : "text-orange-100";

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center px-4 transition-all duration-300 ${
        isVisible ? "bg-black/50 backdrop-blur-sm" : "bg-black/0 pointer-events-none"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-3xl border ${borderColor} bg-gradient-to-br ${bgColor} via-slate-900/80 to-slate-900/60 p-6 backdrop-blur-xl transform transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-4 flex items-center gap-3">
              <Icon className={`h-6 w-6 ${textColor}`} />
              <h3 className={`text-2xl font-bold ${textColor}`}>
                {activeReminder.type === "water" ? "💧 Hydration Time" : "☕ Break Time"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(() => clearWellnessReminder(), 200);
                }}
                className="ml-auto rounded p-1 text-slate-300 hover:bg-white/10 hover:text-white"
                aria-label="Close reminder"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-base text-slate-200 mb-4">{activeReminder.message}</p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(() => clearWellnessReminder(), 200);
                  if (activeReminder.type === "water") {
                    updateWellnessReminders(Date.now(), Date.now());
                  } else {
                    updateWellnessReminders(Date.now(), Date.now());
                  }
                }}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                  activeReminder.type === "water"
                    ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20"
                    : "border-orange-400/40 bg-orange-400/10 text-orange-200 hover:bg-orange-400/20"
                }`}
              >
                Dismiss
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(() => clearWellnessReminder(), 200);
                  const now = Date.now();
                  if (activeReminder.type === "water") {
                    updateWellnessReminders(now - HYDRATION_INTERVAL + SNOOZE_MS, now);
                  } else {
                    updateWellnessReminders(now, now - BREAK_INTERVAL + SNOOZE_MS);
                  }
                }}
                className="rounded-lg border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/20"
              >
                Snooze {SNOOZE_MINUTES} min
              </button>
            </div>
          </div>
          {mascotInfo && (
            <div className="shrink-0 text-center">
              <img
                src={mascotInfo.image}
                alt={mascotInfo.name}
                className="h-36 w-36 object-contain drop-shadow-lg"
              />
              <p className="mt-1 text-xs text-slate-300">{mascotInfo.name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppStore } from "@/lib/app-store";
import { mascotPersonalities, getRandomMessage } from "@/lib/mascot-personalities";
import Image from "next/image";

const mascotInfo = {
  "optimus-prime": {
    name: "Optimus Prime",
    image: "/mascots/optimus-prime.png",
  },
  "bumblebee": {
    name: "Bumblebee",
    image: "/mascots/bumblebee.png",
  },
  "wall-e": {
    name: "Wall-E",
    image: "/mascots/wall-e.png",
  },
  aetheris: {
    name: "Aetheris",
    image: "/mascots/aetheris.png",
  },
} as const;

type FocusScreensaverProps = {
  message: string;
  color: string;
  elapsedSeconds: number;
};

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function formatCountdown(msRemaining: number) {
  if (msRemaining <= 0) return "Due now";
  const totalSeconds = Math.floor(msRemaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
}

export function FocusScreensaver({ message, color, elapsedSeconds }: FocusScreensaverProps) {
  const dailyTasks = useAppStore((state) => state.dailyTasks);
  const deadlines = useAppStore((state) => state.deadlines);
  const moveDailyTask = useAppStore((state) => state.moveDailyTask);
  const setFocusMode = useAppStore((state) => state.setFocusMode);
  const selectedMascot = useAppStore((state) => state.selectedMascot);
  const visualThemePreset = useAppStore((state) => state.visualThemePreset);
  const user = useAppStore((state) => state.user);
  const [now, setNow] = useState(() => Date.now());
  const [motivationLine, setMotivationLine] = useState("");

  const activeMascot = selectedMascot === "none" ? "aetheris" : selectedMascot;
  const mascotProfile = mascotInfo[activeMascot];
  const mascotPersonality = mascotPersonalities[activeMascot];
  const addressName =
    visualThemePreset === "batman"
      ? "Batman"
      : user?.nickname?.trim() || user?.username || user?.name || "there";

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const nextLine = `${addressName}, ${getRandomMessage(mascotPersonality.actionReactions.focusMode)}`;
    setMotivationLine(nextLine);

    const intervalId = window.setInterval(() => {
      setMotivationLine(`${addressName}, ${getRandomMessage(mascotPersonality.actionReactions.focusMode)}`);
    }, 12000);

    return () => window.clearInterval(intervalId);
  }, [addressName, mascotPersonality]);

  const handleEndFocusMode = async () => {
    setFocusMode(false);
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  };

  const orderedTasks = useMemo(() => {
    return [...dailyTasks].sort((a, b) => {
      if (a.column === "Done" && b.column !== "Done") return 1;
      if (a.column !== "Done" && b.column === "Done") return -1;
      return a.title.localeCompare(b.title);
    });
  }, [dailyTasks]);

  const orderedDeadlines = useMemo(() => {
    return [...deadlines].sort(
      (a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()
    );
  }, [deadlines]);

  return (
    <div className="fixed inset-0 z-[95] overflow-auto bg-black/65 backdrop-blur-sm">
      <div className="mx-auto mt-16 w-[min(960px,92vw)] rounded-2xl border border-white/20 bg-black/60 p-6 shadow-[0_0_40px_rgba(0,0,0,0.45)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-300">Focus Mode</p>
            <p className="mt-2 text-2xl font-semibold" style={{ color }}>
              {formatDuration(elapsedSeconds)}
            </p>
            <p className="mt-2 text-sm text-slate-200">{message}</p>
          </div>

          <button
            type="button"
            onClick={() => void handleEndFocusMode()}
            className="rounded-lg border border-red-300/40 bg-red-300/10 px-3 py-2 text-sm text-red-100 transition hover:bg-red-300/20"
          >
            End Focus Mode
          </button>
        </div>

        <section className="mt-4 rounded-xl border border-white/15 bg-black/25 p-4">
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0">
              <Image
                src={mascotProfile.image}
                alt={mascotProfile.name}
                fill
                className="object-contain drop-shadow-xl"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-cyan-200">{mascotProfile.name}</p>
              <p className="mt-1 text-sm text-slate-200">{motivationLine}</p>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <section className="rounded-xl border border-white/10 bg-black/25 p-4">
            <h3 className="text-sm font-semibold tracking-wide text-slate-200">Tasks To Do</h3>
            <div className="mt-3 space-y-2">
              {orderedTasks.length === 0 && (
                <p className="text-sm text-slate-400">No tasks yet. Add tasks from your board.</p>
              )}

              {orderedTasks.map((task) => {
                const isDone = task.column === "Done";
                return (
                  <label
                    key={task.id}
                    className={`flex items-start gap-3 rounded-lg border px-3 py-2 text-sm ${
                      isDone
                        ? "border-white/10 bg-white/5 text-slate-500"
                        : "border-cyan-300/20 bg-cyan-300/5 text-slate-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={(event) =>
                        moveDailyTask(task.id, event.target.checked ? "Done" : "To Do")
                      }
                      className="mt-0.5 h-4 w-4 accent-cyan-400"
                    />
                    <span className={isDone ? "line-through" : ""}>{task.title}</span>
                  </label>
                );
              })}
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-black/25 p-4">
            <h3 className="text-sm font-semibold tracking-wide text-slate-200">Deadline Countdowns</h3>
            <div className="mt-3 space-y-2">
              {orderedDeadlines.length === 0 && (
                <p className="text-sm text-slate-400">No deadlines yet.</p>
              )}

              {orderedDeadlines.map((item) => {
                const dueAt = new Date(item.dueAt).getTime();
                const msRemaining = dueAt - now;
                const overdue = msRemaining <= 0;
                return (
                  <div
                    key={item.id}
                    className={`rounded-lg border px-3 py-2 text-sm ${
                      overdue
                        ? "border-red-300/30 bg-red-300/10"
                        : "border-amber-300/30 bg-amber-300/10"
                    }`}
                  >
                    <p className="font-medium text-slate-100">{item.title}</p>
                    <p className="text-xs text-slate-300">
                      {new Date(item.dueAt).toLocaleString()} • {formatCountdown(msRemaining)}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

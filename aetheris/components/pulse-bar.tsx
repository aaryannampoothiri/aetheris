"use client";

import { motion } from "framer-motion";
import { Brain, Sparkles, Target, TrendingUp } from "lucide-react";
import { useAppStore } from "@/lib/app-store";

export function PulseBar() {
  const showBottomBar = useAppStore((state) => state.showBottomBar);
  const workMode = useAppStore((state) => state.workMode);
  const focusScore = useAppStore((state) => state.focusScore);
  const tasks = useAppStore((state) => state.dailyTasks);
  const suggestions = useAppStore((state) => state.suggestions);

  const doneTasks = tasks.filter((task) => task.column === "Done").length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);
  const velocity = totalTasks === 0 ? "0%" : `${completionRate}%`;

  const insights = [
    { icon: Brain, label: "Focus Score", value: `${focusScore}%`, color: "text-cyan-300" },
    { icon: Target, label: "On Track", value: `${doneTasks}/${totalTasks}`, color: "text-teal-300" },
    { icon: TrendingUp, label: "Velocity", value: velocity, color: "text-orange-300" },
  ];

  if (!showBottomBar) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-black/60 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Left: Real-time insights */}
        <div className="flex items-center gap-6">
          {insights.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${item.color}`} />
                <span className="text-xs text-slate-400">{item.label}</span>
                <span className="text-sm font-medium text-slate-200">{item.value}</span>
              </div>
            );
          })}
        </div>

        {/* Center: Work mode indicator */}
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
          <Sparkles className="h-3 w-3 text-cyan-300" />
          <span className="text-xs capitalize text-slate-300">{workMode.replace("-", " ")} Mode</span>
        </div>

        {/* Right: AI suggestion */}
        <div className="max-w-xs truncate text-xs text-slate-400">
          Next: {suggestions[0]?.text ?? "Add a suggestion on Home dashboard"}
        </div>
      </div>
    </motion.div>
  );
}

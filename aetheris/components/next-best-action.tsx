"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/app-store";
import { Brain, Zap, Target, Trash2 } from "lucide-react";
import { GlassCard } from "@/components/glass-card";

export function NextBestAction() {
  const activeModel = useAppStore((state) => state.activeModel);
  const actionCards = useAppStore((state) => state.actionCards);
  const addActionCard = useAppStore((state) => state.addActionCard);
  const removeActionCard = useAppStore((state) => state.removeActionCard);

  const [title, setTitle] = useState("");
  const [reason, setReason] = useState("");
  const [energy, setEnergy] = useState<"low" | "medium" | "high">("medium");
  const [impact, setImpact] = useState(5);

  const handleAdd = () => {
    if (!title.trim() || !reason.trim()) return;
    addActionCard(title.trim(), reason.trim(), energy, impact);
    setTitle("");
    setReason("");
    setEnergy("medium");
    setImpact(5);
  };

  return (
    <GlassCard className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-200">
          Smart Recommendations
        </h2>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Brain className="h-3 w-3" />
          <span className="capitalize">{activeModel}</span>
        </div>
      </div>

      <div className="mb-4 grid gap-2">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Recommendation title"
          className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-cyan-300/40"
        />
        <input
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Why this matters"
          className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-cyan-300/40"
        />
        <div className="grid grid-cols-[1fr_120px_auto] gap-2">
          <select
            value={energy}
            onChange={(event) => setEnergy(event.target.value as "low" | "medium" | "high")}
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-300/40"
          >
            <option value="low">Low energy</option>
            <option value="medium">Medium energy</option>
            <option value="high">High energy</option>
          </select>
          <input
            type="number"
            min={1}
            max={10}
            value={impact}
            onChange={(event) => setImpact(Number(event.target.value) || 1)}
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-300/40"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-lg border border-cyan-300/40 bg-cyan-300/10 px-3 py-2 text-sm text-cyan-200 transition hover:bg-cyan-300/20"
          >
            Add
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {actionCards.length === 0 && (
          <p className="rounded-lg border border-dashed border-white/10 bg-black/20 p-3 text-sm text-slate-500">
            No recommendations yet. Add one above.
          </p>
        )}
        {actionCards.map((item, idx) => {
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex w-full items-start gap-4 rounded-lg border border-white/10 bg-white/5 p-4 text-left transition hover:border-cyan-300/40 hover:bg-white/10"
            >
              <div className="rounded-lg bg-cyan-300/10 p-2">
                <Brain className="h-5 w-5 text-cyan-300" />
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <h3 className="font-medium text-slate-200">{item.title}</h3>
                  <span className="rounded-full bg-orange-400/20 px-2 py-0.5 text-xs text-orange-300">
                    {item.impact}/10 impact
                  </span>
                </div>
                <p className="text-sm text-slate-400">{item.reason}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    {item.energy} energy
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeActionCard(item.id)}
                className="rounded-md p-1 text-slate-500 transition hover:bg-white/10 hover:text-red-300"
                aria-label="Remove recommendation"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 rounded-lg border border-cyan-300/20 bg-cyan-300/5 p-3 text-xs text-slate-300">
        <Target className="mb-1 inline h-3 w-3 text-cyan-300" /> Add your own recommendations
        based on priorities, deadlines, and energy level.
      </div>
    </GlassCard>
  );
}

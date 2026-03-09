"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";

type LabMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

export default function LabPage() {
  const [messages, setMessages] = useState<LabMessage[]>([]);
  const [input, setInput] = useState("");

  const addMessage = () => {
    const text = input.trim();
    if (!text) return;
    const userMessage: LabMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      text,
    };
    const assistantMessage: LabMessage = {
      id: `${Date.now()}-assistant`,
      role: "assistant",
      text: "Message saved. You can continue in the AI chat panel for full assistant responses.",
    };
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");
  };

  return (
    <div className="space-y-4">
      <header className="rounded-3xl border border-white/20 bg-black/30 p-6">
        <p className="text-xs tracking-[0.22em] text-cyan-200/90">AI CHAT</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-100 md:text-4xl">Chat With Your AI Assistant</h1>
      </header>

      <GlassCard className="space-y-4" glow="cyan">
        <div className="grid gap-2 md:grid-cols-[1fr_auto]">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") addMessage();
            }}
            placeholder="Type anything you want to add"
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-cyan-300/40"
          />
          <button
            type="button"
            onClick={addMessage}
            className="rounded-lg border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-200 transition hover:bg-cyan-300/20"
          >
            Add
          </button>
        </div>

        {messages.length === 0 && (
          <p className="rounded-xl border border-dashed border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-500">
            No messages yet. Start with your first message.
          </p>
        )}

        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, x: message.role === "assistant" ? -15 : 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.06 * index }}
            className={`max-w-[85%] rounded-2xl border px-4 py-3 text-sm backdrop-blur-lg ${
              message.role === "assistant"
                ? "border-cyan-300/30 bg-cyan-200/10 text-slate-100"
                : "ml-auto border-orange-300/30 bg-orange-200/10 text-orange-100"
            }`}
          >
            {message.text}
          </motion.div>
        ))}

        <motion.div
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-slate-300"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="h-2 w-2 rounded-full bg-cyan-300" />
          <span className="h-2 w-2 rounded-full bg-cyan-300/80" />
          <span className="h-2 w-2 rounded-full bg-cyan-300/60" />
          AI is synthesizing your context...
        </motion.div>
      </GlassCard>
    </div>
  );
}

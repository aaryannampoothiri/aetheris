"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { navItems } from "@/lib/navigation";

type SearchEntry = {
  href: string;
  label: string;
  icon: (typeof navItems)[number]["icon"];
  keywords: string[];
};

const searchEntries: SearchEntry[] = [
  ...navItems.map((item) => ({
    href: item.href,
    label: item.label,
    icon: item.icon,
    keywords: [item.label.toLowerCase()],
  })),
  {
    href: "/wellness",
    label: "Mascot Reminders",
    icon: navItems.find((item) => item.href === "/wellness")!.icon,
    keywords: ["mascot", "reminder", "hydration", "break", "water"],
  },
  {
    href: "/vault",
    label: "Flashcards",
    icon: navItems.find((item) => item.href === "/vault")!.icon,
    keywords: ["flashcard", "flashcards", "study", "revision", "cards"],
  },
  {
    href: "/forge",
    label: "Deadlines and Tasks",
    icon: navItems.find((item) => item.href === "/forge")!.icon,
    keywords: ["deadline", "deadlines", "task", "tasks", "todo"],
  },
  {
    href: "/calendar",
    label: "Today Activities",
    icon: navItems.find((item) => item.href === "/calendar")!.icon,
    keywords: ["activity", "activities", "schedule", "calendar", "plan"],
  },
  {
    href: "/terminal",
    label: "Mascot and Theme Settings",
    icon: navItems.find((item) => item.href === "/terminal")!.icon,
    keywords: ["settings", "theme", "themes", "mascot", "customization"],
  },
  {
    href: "/",
    label: "Focus and Work Modes",
    icon: navItems.find((item) => item.href === "/")!.icon,
    keywords: ["focus", "work mode", "modes", "dashboard"],
  },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    const openHandler = () => setOpen(true);
    window.addEventListener("aetheris:open-command-palette", openHandler);
    return () => window.removeEventListener("aetheris:open-command-palette", openHandler);
  }, []);

  const filtered = useMemo(() => {
    const lowered = query.toLowerCase().trim();
    if (!lowered) {
      return searchEntries.slice(0, 3);
    }

    return searchEntries.filter((item) => {
      const haystack = [item.label.toLowerCase(), ...item.keywords].join(" ");
      return haystack.includes(lowered);
    });
  }, [query]);

  const visit = (href: string) => {
    router.push(href);
    setOpen(false);
    setQuery("");
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-20 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            setOpen(false);
            setQuery("");
          }}
        >
          <motion.div
            className="w-full max-w-xl rounded-2xl border border-white/20 bg-slate-950/95 p-3 shadow-[0_0_80px_rgba(56,189,248,0.2)]"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
              <Search className="h-4 w-4 text-cyan-300" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search features like mascot, flashcards, tasks..."
                className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-400"
                autoFocus
              />
            </div>
            <div className="mt-3 space-y-1">
              {filtered.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={`${item.href}-${item.label}`}
                    type="button"
                    onClick={() => visit(item.href)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-slate-100 transition hover:bg-white/10"
                  >
                    <Icon className="h-4 w-4 text-cyan-300" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              {filtered.length === 0 ? (
                <p className="rounded-xl px-3 py-2 text-sm text-slate-400">No matching feature found.</p>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

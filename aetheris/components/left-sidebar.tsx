"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, Folder, Network, Sun, Moon, Monitor } from "lucide-react";
import { useAppStore } from "@/lib/app-store";
import { navItems } from "@/lib/navigation";

export function LeftSidebar() {
  const pathname = usePathname();
  const showLeftSidebar = useAppStore((state) => state.showLeftSidebar);
  const toggleLeftSidebar = useAppStore((state) => state.toggleLeftSidebar);
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);
  const tasks = useAppStore((state) => state.dailyTasks);
  const notes = useAppStore((state) => state.notes);
  const deadlines = useAppStore((state) => state.deadlines);

  const folders = [
    { name: "Tasks", count: tasks.length },
    { name: "Notes", count: notes.length },
    { name: "Deadlines", count: deadlines.length },
  ];

  const themeOptions = [
    { value: "light" as const, icon: Sun, label: "Light" },
    { value: "dark" as const, icon: Moon, label: "Dark" },
    { value: "system" as const, icon: Monitor, label: "System" },
  ];

  return (
    <>
      <AnimatePresence>
        {showLeftSidebar && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed left-0 top-0 z-30 h-screen w-64 border-r border-white/10 bg-black/40 backdrop-blur-xl"
          >
            <div className="flex h-full flex-col p-4">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-wide text-slate-200">AETHERIS</h2>
                <button
                  onClick={toggleLeftSidebar}
                  className="rounded-lg p-1 hover:bg-white/10"
                  aria-label="Close sidebar"
                >
                  <ChevronLeft className="h-4 w-4 text-slate-400" />
                </button>
              </div>

              {/* Folders */}
              <div className="mb-6">
                <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
                  <Folder className="h-3 w-3" />
                  <span>MY FOLDERS</span>
                </div>
                <div className="space-y-1">
                  {folders.map((folder) => (
                    <button
                      key={folder.name}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/10"
                    >
                      <span>{folder.name}</span>
                      <span className="text-xs text-slate-500">{folder.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Menu */}
              <div className="mb-6">
                <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
                  <span>MENU</span>
                </div>
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                          isActive
                            ? "bg-cyan-300/15 text-cyan-200 border border-cyan-300/30"
                            : "text-slate-300 hover:bg-white/10"
                        }`}
                        onClick={toggleLeftSidebar}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Theme Switcher */}
              <div className="mb-4 mt-auto">
                <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
                  <span>THEME</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {themeOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setTheme(option.value)}
                        className={`flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-xs transition ${
                          theme === option.value
                            ? "bg-cyan-300/20 text-cyan-300 border border-cyan-300/40"
                            : "bg-white/5 text-slate-400 hover:bg-white/10 border border-transparent"
                        }`}
                        title={option.label}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-[10px]">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Shared Knowledge */}
              <div>
                <button className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 hover:bg-white/10">
                  <Network className="h-4 w-4" />
                  <span>Resources</span>
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

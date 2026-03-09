"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "oled";

type WorkspaceState = {
  theme: ThemeMode;
  aiPersonality: "Strategist" | "Mentor" | "Builder";
  setTheme: (theme: ThemeMode) => void;
  setAiPersonality: (value: "Strategist" | "Mentor" | "Builder") => void;
};

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      theme: "dark",
      aiPersonality: "Strategist",
      setTheme: (theme) => set({ theme }),
      setAiPersonality: (aiPersonality) => set({ aiPersonality }),
    }),
    {
      name: "aetheris-workspace",
    }
  )
);

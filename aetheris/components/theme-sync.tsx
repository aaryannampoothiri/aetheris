"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/app-store";

const presetThemeVars: Record<string, Record<string, string>> = {
  aetheris: {
    "--background-start": "#020617",
    "--background-end": "#0f172a",
    "--accent": "#67e8f9",
    "--foreground": "#e6eef9",
    "--theme-panel-bg": "rgba(2, 6, 23, 0.45)",
    "--theme-panel-border": "rgba(255, 255, 255, 0.14)",
    "--theme-icon-filter": "hue-rotate(0deg) saturate(1.05)",
  },
  diwali: {
    "--background-start": "#1f0a00",
    "--background-end": "#3b0909",
    "--accent": "#f59e0b",
    "--foreground": "#fff7e6",
    "--theme-panel-bg": "rgba(53, 18, 4, 0.58)",
    "--theme-panel-border": "rgba(251, 191, 36, 0.35)",
    "--theme-icon-filter": "hue-rotate(330deg) saturate(1.35)",
  },
  holi: {
    "--background-start": "#3b0764",
    "--background-end": "#0f172a",
    "--accent": "#f43f5e",
    "--foreground": "#fff7ff",
    "--theme-panel-bg": "rgba(42, 10, 74, 0.55)",
    "--theme-panel-border": "rgba(236, 72, 153, 0.38)",
    "--theme-icon-filter": "hue-rotate(260deg) saturate(1.8)",
  },
  forest: {
    "--background-start": "#052e16",
    "--background-end": "#14532d",
    "--accent": "#34d399",
    "--foreground": "#ecfdf5",
    "--theme-panel-bg": "rgba(6, 36, 19, 0.55)",
    "--theme-panel-border": "rgba(52, 211, 153, 0.28)",
    "--theme-icon-filter": "hue-rotate(90deg) saturate(1.25)",
  },
  sunset: {
    "--background-start": "#2a1802",
    "--background-end": "#5b3306",
    "--accent": "#f59e0b",
    "--foreground": "#fff7e6",
    "--theme-panel-bg": "rgba(61, 35, 6, 0.58)",
    "--theme-panel-border": "rgba(251, 191, 36, 0.3)",
    "--theme-icon-filter": "hue-rotate(340deg) saturate(1.15)",
  },
  valentine: {
    "--background-start": "#3a081e",
    "--background-end": "#6b1237",
    "--accent": "#f43f5e",
    "--foreground": "#fff1f5",
    "--theme-panel-bg": "rgba(70, 12, 40, 0.58)",
    "--theme-panel-border": "rgba(251, 113, 133, 0.34)",
    "--theme-icon-filter": "hue-rotate(305deg) saturate(1.45)",
  },
  batman: {
    "--background-start": "#030712",
    "--background-end": "#0f172a",
    "--accent": "#facc15",
    "--foreground": "#f8fafc",
    "--theme-panel-bg": "rgba(2, 6, 23, 0.66)",
    "--theme-panel-border": "rgba(250, 204, 21, 0.28)",
    "--theme-icon-filter": "hue-rotate(0deg) saturate(1.05)",
  },
};

const fontFamilyMap: Record<string, string> = {
  "space-grotesk": 'var(--font-body), "Space Grotesk", sans-serif',
  "sora": 'var(--font-display), "Sora", sans-serif',
  "inter": '"Inter", sans-serif',
  "roboto": '"Roboto", sans-serif',
  "open-sans": '"Open Sans", sans-serif',
  "lato": '"Lato", sans-serif',
  "poppins": '"Poppins", sans-serif',
  "montserrat": '"Montserrat", sans-serif',
  "raleway": '"Raleway", sans-serif',
  "playfair-display": '"Playfair Display", serif',
  "merriweather": '"Merriweather", serif',
  "lora": '"Lora", serif',
  "georgia": '"Georgia", serif',
  "times-new-roman": '"Times New Roman", serif',
  "courier-new": '"Courier New", monospace',
  "source-code-pro": '"Source Code Pro", monospace',
  "jetbrains-mono": '"JetBrains Mono", monospace',
  "fira-code": '"Fira Code", monospace',
  "ubuntu-mono": '"Ubuntu Mono", monospace',
};

export function ThemeSync() {
  const theme = useAppStore((state) => state.theme);
  const visualThemePreset = useAppStore((state) => state.visualThemePreset);
  const personalTheme = useAppStore((state) => state.personalTheme);

  useEffect(() => {
    const applyTheme = (actualTheme: "light" | "dark") => {
      document.documentElement.dataset.theme = actualTheme;
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(actualTheme);
    };

    if (theme === "system") {
      // Detect system preference
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const systemTheme = mediaQuery.matches ? "dark" : "light";
      applyTheme(systemTheme);

      // Listen for system theme changes
      const handler = (e: MediaQueryListEvent) => {
        applyTheme(e.matches ? "dark" : "light");
      };
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.visualTheme = visualThemePreset;

    const baseVars = presetThemeVars[visualThemePreset] ?? presetThemeVars.aetheris;
    Object.entries(baseVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    if (personalTheme.enabled) {
      root.style.setProperty("--foreground", personalTheme.textColor);
    }

    root.style.setProperty("--app-font-family", fontFamilyMap[personalTheme.fontFamily]);
    root.style.setProperty("--app-font-size", `${personalTheme.fontSize}px`);
  }, [personalTheme, visualThemePreset]);

  return null;
}

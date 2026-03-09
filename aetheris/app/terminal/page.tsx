"use client";

import { useEffect, useState } from "react";
import { useAppStore, type VisualThemePreset, type Mascot } from "@/lib/app-store";
import { GlassCard } from "@/components/glass-card";
import { Sun, Moon, Monitor, LogOut, User, Edit2, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";

const themes = [
  { value: "light" as const, label: "Light", icon: Sun },
  { value: "dark" as const, label: "Dark", icon: Moon },
  { value: "system" as const, label: "System", icon: Monitor },
];

const visualThemes: Array<{ value: VisualThemePreset; label: string; subtitle: string }> = [
  { value: "aetheris", label: "Aetheris", subtitle: "Classic cyan workspace" },
  { value: "diwali", label: "Diwali", subtitle: "Warm festive glow" },
  { value: "holi", label: "Holi", subtitle: "Bright celebratory tones" },
  { value: "forest", label: "Forest", subtitle: "Calm green focus" },
  { value: "sunset", label: "Sunset", subtitle: "Golden hour warmth" },
  { value: "valentine", label: "Valentine", subtitle: "Romantic rose mood" },
  { value: "batman", label: "Batman", subtitle: "Dark knight contrast" },
];

const themeSplashes: Record<VisualThemePreset, string[]> = {
  aetheris: ["#67e8f9", "#38bdf8", "#22d3ee"],
  diwali: ["#f59e0b", "#f97316", "#facc15"],
  holi: ["#ec4899", "#22d3ee", "#facc15"],
  forest: ["#34d399", "#22c55e", "#86efac"],
  sunset: ["#facc15", "#f59e0b", "#fb923c"],
  valentine: ["#fb7185", "#f43f5e", "#f9a8d4"],
  batman: ["#facc15", "#f8fafc", "#1e293b"],
};

const fontOptions = [
  { value: "space-grotesk", label: "Space Grotesk" },
  { value: "sora", label: "Sora" },
  { value: "inter", label: "Inter" },
  { value: "roboto", label: "Roboto" },
  { value: "open-sans", label: "Open Sans" },
  { value: "lato", label: "Lato" },
  { value: "poppins", label: "Poppins" },
  { value: "montserrat", label: "Montserrat" },
  { value: "raleway", label: "Raleway" },
  { value: "playfair-display", label: "Playfair Display (Serif)" },
  { value: "merriweather", label: "Merriweather (Serif)" },
  { value: "lora", label: "Lora (Serif)" },
  { value: "georgia", label: "Georgia (Serif)" },
  { value: "times-new-roman", label: "Times New Roman (Serif)" },
  { value: "courier-new", label: "Courier New (Mono)" },
  { value: "source-code-pro", label: "Source Code Pro (Mono)" },
  { value: "jetbrains-mono", label: "JetBrains Mono (Mono)" },
  { value: "fira-code", label: "Fira Code (Mono)" },
  { value: "ubuntu-mono", label: "Ubuntu Mono (Mono)" },
];

export default function TerminalPage() {
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);
  const visualThemePreset = useAppStore((state) => state.visualThemePreset);
  const setVisualThemePreset = useAppStore((state) => state.setVisualThemePreset);
  const personalTheme = useAppStore((state) => state.personalTheme);
  const updatePersonalTheme = useAppStore((state) => state.updatePersonalTheme);
  const togglePersonalTheme = useAppStore((state) => state.togglePersonalTheme);
  const user = useAppStore((state) => state.user);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const logout = useAppStore((state) => state.logout);
  const isFocusMode = useAppStore((state) => state.isFocusMode);
  const focusModeStartedAt = useAppStore((state) => state.focusModeStartedAt);
  const focusModeTotalSeconds = useAppStore((state) => state.focusModeTotalSeconds);
  const setFocusMode = useAppStore((state) => state.setFocusMode);
  const isWorkModeActive = useAppStore((state) => state.isWorkModeActive);
  const workModeStartedAt = useAppStore((state) => state.workModeStartedAt);
  const workModeTotalSeconds = useAppStore((state) => state.workModeTotalSeconds);
  const setWorkModeActive = useAppStore((state) => state.setWorkModeActive);
  const screenSaverSettings = useAppStore((state) => state.screenSaverSettings);
  const updateScreenSaverSettings = useAppStore((state) => state.updateScreenSaverSettings);
  const deadlineReminderSettings = useAppStore((state) => state.deadlineReminderSettings);
  const updateDeadlineReminderSettings = useAppStore((state) => state.updateDeadlineReminderSettings);
  const selectedMascot = useAppStore((state) => state.selectedMascot);
  const setMascot = useAppStore((state) => state.setMascot);
  const router = useRouter();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    username: user?.username || "",
    nickname: user?.nickname || user?.username || "",
    bio: user?.bio || "",
  });
  const [clockNow, setClockNow] = useState(() => Date.now());
  const [fontSizeInput, setFontSizeInput] = useState(() => String(personalTheme.fontSize));

  useEffect(() => {
    const interval = window.setInterval(() => setClockNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    setFontSizeInput(String(personalTheme.fontSize));
  }, [personalTheme.fontSize]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleSaveProfile = () => {
    updateProfile(profileForm);
    setIsEditingProfile(false);
  };

  const handleCancelEdit = () => {
    setProfileForm({
      name: user?.name || "",
      username: user?.username || "",
      nickname: user?.nickname || user?.username || "",
      bio: user?.bio || "",
    });
    setIsEditingProfile(false);
  };

  const activeSeconds =
    isFocusMode && focusModeStartedAt
      ? Math.floor((clockNow - focusModeStartedAt) / 1000)
      : 0;
  const totalFocusSeconds = focusModeTotalSeconds + activeSeconds;
  const totalFocusHours = (totalFocusSeconds / 3600).toFixed(2);

  const activeWorkSeconds =
    isWorkModeActive && workModeStartedAt
      ? Math.floor((clockNow - workModeStartedAt) / 1000)
      : 0;
  const totalWorkSeconds = workModeTotalSeconds + activeWorkSeconds;
  const totalWorkHours = (totalWorkSeconds / 3600).toFixed(2);

  const handleFocusToggle = async () => {
    if (!isFocusMode) {
      try {
        await document.documentElement.requestFullscreen();
      } catch {
        // Browser may block fullscreen if not allowed.
      }
      setFocusMode(true);
      return;
    }

    setFocusMode(false);
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  };

  const handleWorkModeToggle = () => {
    setWorkModeActive(!isWorkModeActive);
  };

  return (
    <div className="space-y-4">
      <header className="rounded-3xl border border-white/20 bg-black/30 p-6">
        <p className="text-xs tracking-[0.22em] text-cyan-200/90">SETTINGS</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-100 md:text-4xl">Customize Your Workspace</h1>
      </header>

      {/* User Info Card */}
      <GlassCard glow="teal" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-cyan-300/10 p-2">
              <User className="h-5 w-5 text-cyan-300" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-slate-100">{user?.name || "User"}</h2>
              <p className="text-xs text-slate-400">@{user?.username} • {user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-red-300/40 bg-red-300/10 px-3 py-2 text-sm text-red-200 transition hover:bg-red-300/20"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </GlassCard>

      {/* Profile Customization */}
      <GlassCard glow="cyan" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-slate-100">Your Profile</h2>
          {!isEditingProfile && (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="flex items-center gap-1 rounded-lg border border-purple-300/40 bg-purple-300/10 px-3 py-1.5 text-xs text-purple-200 transition hover:bg-purple-300/20"
            >
              <Edit2 className="h-3 w-3" />
              <span>Edit</span>
            </button>
          )}
        </div>

        {isEditingProfile ? (
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-slate-400">Display Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 focus:border-purple-300/40 focus:outline-none transition"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">Username</label>
              <input
                type="text"
                value={profileForm.username}
                onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 focus:border-purple-300/40 focus:outline-none transition"
                placeholder="your_username"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">Nickname (Mascots use this)</label>
              <input
                type="text"
                value={profileForm.nickname}
                onChange={(e) => setProfileForm({ ...profileForm, nickname: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 focus:border-purple-300/40 focus:outline-none transition"
                placeholder="How mascots should address you"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">Bio</label>
              <textarea
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 focus:border-purple-300/40 focus:outline-none transition resize-none"
                placeholder="Tell us about yourself..."
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-1 rounded-lg border border-teal-300/40 bg-teal-300/10 px-3 py-2 text-sm text-teal-200 transition hover:bg-teal-300/20"
              >
                <Check className="h-4 w-4" />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-1 rounded-lg border border-slate-300/40 bg-slate-300/10 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-300/20"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="rounded-lg bg-black/20 p-3">
              <p className="text-xs text-slate-400">Display Name</p>
              <p className="mt-1 text-sm text-slate-200">{user?.name || "Not set"}</p>
            </div>
            <div className="rounded-lg bg-black/20 p-3">
              <p className="text-xs text-slate-400">Username</p>
              <p className="mt-1 text-sm text-slate-200">@{user?.username || "Not set"}</p>
            </div>
            <div className="rounded-lg bg-black/20 p-3">
              <p className="text-xs text-slate-400">Nickname</p>
              <p className="mt-1 text-sm text-slate-200">{user?.nickname || user?.username || "Not set"}</p>
            </div>
            {user?.bio && (
              <div className="rounded-lg bg-black/20 p-3">
                <p className="text-xs text-slate-400">Bio</p>
                <p className="mt-1 text-sm text-slate-200">{user.bio}</p>
              </div>
            )}
          </div>
        )}
      </GlassCard>

      <GlassCard className="space-y-3" glow="cyan">
        <h2 className="text-lg font-medium text-slate-100">Choose Your Look</h2>
        <div className="grid grid-cols-3 gap-2">
          {themes.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.value}
                type="button"
                onClick={() => setTheme(mode.value)}
                className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-3 text-sm transition ${
                  theme === mode.value
                    ? "border-cyan-300/40 bg-cyan-300/20 text-cyan-100"
                    : "border-white/15 bg-black/20 text-slate-200 hover:bg-white/10"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </GlassCard>

      <GlassCard className="space-y-4" glow="orange">
        <h2 className="text-lg font-medium text-slate-100">Site Theme Presets</h2>
        <p className="text-sm text-slate-300">
          Switch complete color palettes for the entire app, including festive themes.
        </p>
        <div className="grid gap-2 md:grid-cols-2">
          {visualThemes.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => setVisualThemePreset(preset.value)}
              className={`rounded-xl border px-4 py-3 text-left transition ${
                visualThemePreset === preset.value
                  ? "border-orange-300/40 bg-orange-300/20 text-orange-100"
                  : "border-white/15 bg-black/20 text-slate-200 hover:bg-white/10"
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium">{preset.label}</p>
                <div className="flex items-center gap-1">
                  {themeSplashes[preset.value].map((color) => (
                    <span
                      key={`${preset.value}-${color}`}
                      className="h-3 w-3 rounded-full border border-white/30"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-400">{preset.subtitle}</p>
            </button>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="space-y-4" glow="teal">
        <h2 className="text-lg font-medium text-slate-100">Personal Theme Studio</h2>
        <p className="text-sm text-slate-300">Customize your typography to match your style.</p>
        
        <label className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200">
          <span>Enable personal custom theme</span>
          <input
            type="checkbox"
            checked={personalTheme.enabled}
            onChange={(event) => togglePersonalTheme(event.target.checked)}
            className="h-4 w-4 accent-cyan-400"
          />
        </label>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200">
            <label className="mb-1 block text-xs text-slate-400">Theme Name</label>
            <input
              type="text"
              value={personalTheme.name}
              onChange={(event) => updatePersonalTheme({ name: event.target.value })}
              className="w-full rounded-md border border-white/10 bg-black/20 px-2 py-1 text-sm text-slate-100 outline-none focus:border-cyan-300/40"
              placeholder="My Custom Theme"
            />
          </div>

          <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200">
            <label className="mb-1 block text-xs text-slate-400">Font Family</label>
            <select
              value={personalTheme.fontFamily}
              onChange={(event) =>
                updatePersonalTheme({
                  fontFamily: event.target.value as "space-grotesk" | "sora" | "inter" | "roboto" | "open-sans" | "lato" | "poppins" | "montserrat" | "raleway" | "playfair-display" | "merriweather" | "lora" | "georgia" | "times-new-roman" | "courier-new" | "source-code-pro" | "jetbrains-mono" | "fira-code" | "ubuntu-mono",
                })
              }
              className="w-full rounded-md border border-white/10 bg-black/20 px-2 py-1 text-sm text-slate-100 outline-none focus:border-cyan-300/40"
            >
              {fontOptions.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200">
            <label className="mb-1 block text-xs text-slate-400">Font Color</label>
            <input
              type="color"
              value={personalTheme.textColor}
              onChange={(event) => updatePersonalTheme({ textColor: event.target.value })}
              className="h-8 w-full rounded-md border border-white/10 bg-black/20 p-1"
            />
          </div>

          <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200">
            <label className="mb-1 block text-xs text-slate-400">Font Size (px)</label>
            <input
              type="number"
              min={10}
              max={24}
              value={fontSizeInput}
              onChange={(event) => setFontSizeInput(event.target.value)}
              onBlur={() => {
                const parsed = Number(fontSizeInput);
                const next = Number.isFinite(parsed)
                  ? Math.max(10, Math.min(24, parsed))
                  : personalTheme.fontSize;
                updatePersonalTheme({ fontSize: next });
                setFontSizeInput(String(next));
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  (event.currentTarget as HTMLInputElement).blur();
                }
              }}
              className="w-full rounded-md border border-white/10 bg-black/20 px-2 py-1 text-sm text-slate-100 outline-none focus:border-cyan-300/40"
            />
          </div>
        </div>
      </GlassCard>

      <GlassCard className="space-y-4" glow="cyan">
        <h2 className="text-lg font-medium text-slate-100">Choose Your Mascot</h2>
        <p className="text-sm text-slate-300">
          Select a companion to keep you motivated while you work.
        </p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <button
            type="button"
            onClick={() => setMascot("none")}
            className={`rounded-xl border px-4 py-3 text-sm transition ${
              selectedMascot === "none"
                ? "border-purple-300/40 bg-purple-300/20 text-purple-100"
                : "border-white/15 bg-black/20 text-slate-200 hover:bg-white/10"
            }`}
          >
            None
          </button>
          <button
            type="button"
            onClick={() => setMascot("optimus-prime")}
            className={`rounded-xl border px-4 py-3 text-sm transition ${
              selectedMascot === "optimus-prime"
                ? "border-purple-300/40 bg-purple-300/20 text-purple-100"
                : "border-white/15 bg-black/20 text-slate-200 hover:bg-white/10"
            }`}
          >
            Optimus Prime
          </button>
          <button
            type="button"
            onClick={() => setMascot("bumblebee")}
            className={`rounded-xl border px-4 py-3 text-sm transition ${
              selectedMascot === "bumblebee"
                ? "border-purple-300/40 bg-purple-300/20 text-purple-100"
                : "border-white/15 bg-black/20 text-slate-200 hover:bg-white/10"
            }`}
          >
            Bumblebee
          </button>
          <button
            type="button"
            onClick={() => setMascot("wall-e")}
            className={`rounded-xl border px-4 py-3 text-sm transition ${
              selectedMascot === "wall-e"
                ? "border-purple-300/40 bg-purple-300/20 text-purple-100"
                : "border-white/15 bg-black/20 text-slate-200 hover:bg-white/10"
            }`}
          >
            Wall-E
          </button>
          <button
            type="button"
            onClick={() => setMascot("aetheris")}
            className={`rounded-xl border px-4 py-3 text-sm transition ${
              selectedMascot === "aetheris"
                ? "border-purple-300/40 bg-purple-300/20 text-purple-100"
                : "border-white/15 bg-black/20 text-slate-200 hover:bg-white/10"
            }`}
          >
            Aetheris
          </button>
        </div>
      </GlassCard>

      <GlassCard className="space-y-4" glow="orange">
        <h2 className="text-lg font-medium text-slate-100">Deadline Reminders</h2>
        <p className="text-sm text-slate-300">
          Configure how your mascot reminds you about upcoming deadlines.
        </p>
        
        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200">
            <span>Enable deadline reminders</span>
            <input
              type="checkbox"
              checked={deadlineReminderSettings.enabled}
              onChange={(event) => updateDeadlineReminderSettings({ enabled: event.target.checked })}
              className="h-4 w-4 accent-orange-400"
            />
          </label>

          <label className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200">
            <span>Show reminders on login</span>
            <input
              type="checkbox"
              checked={deadlineReminderSettings.showOnLogin}
              onChange={(event) => updateDeadlineReminderSettings({ showOnLogin: event.target.checked })}
              className="h-4 w-4 accent-orange-400"
            />
          </label>

          <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200">
            <label className="mb-1 block text-xs text-slate-400">Remind me (minutes before deadline)</label>
            <input
              type="number"
              min={5}
              max={1440}
              step={5}
              value={deadlineReminderSettings.minutesBefore}
              onChange={(event) =>
                updateDeadlineReminderSettings({
                  minutesBefore: Math.max(5, Math.min(1440, Number(event.target.value) || 60)),
                })
              }
              className="w-full rounded-md border border-white/10 bg-black/20 px-2 py-1 text-sm text-slate-100 outline-none focus:border-orange-300/40"
            />
          </div>
        </div>
      </GlassCard>

      <GlassCard className="space-y-4" glow="teal">
        <h2 className="text-lg font-medium text-slate-100">Focus Mode, Work Mode & Screen Saver</h2>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void handleFocusToggle()}
            className={`rounded-lg border px-4 py-2 text-sm transition ${
              isFocusMode
                ? "border-teal-300/40 bg-teal-300/10 text-teal-100"
                : "border-white/15 bg-black/20 text-slate-200 hover:bg-white/10"
            }`}
          >
            {isFocusMode ? "Exit Focus Mode" : "Start Focus Mode"}
          </button>

          <span className="text-sm text-slate-300">Total Focus Time: {totalFocusHours}h</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleWorkModeToggle}
            className={`rounded-lg border px-4 py-2 text-sm transition ${
              isWorkModeActive
                ? "border-amber-300/40 bg-amber-300/10 text-amber-100"
                : "border-white/15 bg-black/20 text-slate-200 hover:bg-white/10"
            }`}
          >
            {isWorkModeActive ? "Stop Work Mode" : "Start Work Mode"}
          </button>

          <span className="text-sm text-slate-300">Total Work Time: {totalWorkHours}h</span>
          <span className="text-xs text-slate-400">
            Work Mode tracks time without fullscreen or screensaver.
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200">
            <span>Enable screen saver in focus mode</span>
            <input
              type="checkbox"
              checked={screenSaverSettings.enabled}
              onChange={(event) => updateScreenSaverSettings({ enabled: event.target.checked })}
              className="h-4 w-4 accent-cyan-400"
            />
          </label>

          <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200">
            <label className="mb-1 block text-xs text-slate-400">Animation speed (seconds)</label>
            <input
              type="number"
              min={8}
              max={60}
              value={screenSaverSettings.speedSeconds}
              onChange={(event) =>
                updateScreenSaverSettings({
                  speedSeconds: Math.max(8, Math.min(60, Number(event.target.value) || 8)),
                })
              }
              className="w-full rounded-md border border-white/10 bg-black/20 px-2 py-1 text-sm text-slate-100 outline-none focus:border-cyan-300/40"
            />
          </div>

          <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200">
            <label className="mb-1 block text-xs text-slate-400">Screen saver message</label>
            <input
              type="text"
              value={screenSaverSettings.message}
              onChange={(event) => updateScreenSaverSettings({ message: event.target.value })}
              className="w-full rounded-md border border-white/10 bg-black/20 px-2 py-1 text-sm text-slate-100 outline-none focus:border-cyan-300/40"
            />
          </div>

          <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200">
            <label className="mb-1 block text-xs text-slate-400">Message color</label>
            <input
              type="color"
              value={screenSaverSettings.color}
              onChange={(event) => updateScreenSaverSettings({ color: event.target.value })}
              className="h-8 w-full rounded-md border border-white/10 bg-black/20 p-1"
            />
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

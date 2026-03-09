"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { navItems } from "@/lib/navigation";
import { CommandPalette } from "./command-palette";
import { useAppStore } from "@/lib/app-store";
import { AetherisLogo } from "./aetheris-logo";
import { User, LogOut, Settings, Sun, Moon, Monitor, Search } from "lucide-react";
import { FocusScreensaver } from "./focus-screensaver";
import { mascotPersonalities, getRandomMessage } from "@/lib/mascot-personalities";
import { ContactFooter } from "./contact-footer";

const mascotInfo = {
  "optimus-prime": {
    name: "Optimus Prime",
    image: "/mascots/optimus-prime.png",
  },
  bumblebee: {
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

function formatFocusDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const showLeftSidebar = useAppStore((state) => state.showLeftSidebar);
  const toggleLeftSidebar = useAppStore((state) => state.toggleLeftSidebar);
  const showRightSidebar = useAppStore((state) => state.showRightSidebar);
  const isFocusMode = useAppStore((state) => state.isFocusMode);
  const setFocusMode = useAppStore((state) => state.setFocusMode);
  const selectedMascot = useAppStore((state) => state.selectedMascot);
  const focusModeStartedAt = useAppStore((state) => state.focusModeStartedAt);
  const focusModeTotalSeconds = useAppStore((state) => state.focusModeTotalSeconds);
  const isWorkModeActive = useAppStore((state) => state.isWorkModeActive);
  const workModeStartedAt = useAppStore((state) => state.workModeStartedAt);
  const workModeTotalSeconds = useAppStore((state) => state.workModeTotalSeconds);
  const screenSaverSettings = useAppStore((state) => state.screenSaverSettings);
  const visualThemePreset = useAppStore((state) => state.visualThemePreset);
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);
  const [clockNow, setClockNow] = useState(() => Date.now());
  const [focusMotivationLine, setFocusMotivationLine] = useState("");

  const activeMascot = selectedMascot === "none" ? "aetheris" : selectedMascot;
  const mascotProfile = mascotInfo[activeMascot];
  const mascotPersonality = mascotPersonalities[activeMascot];
  const addressName =
    visualThemePreset === "batman"
      ? "Batman"
      : user?.nickname?.trim() || user?.username || user?.name || "there";

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    router.push("/login");
  };

  useEffect(() => {
    const interval = window.setInterval(() => setClockNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isFocusMode) {
        setFocusMode(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [isFocusMode, setFocusMode]);

  useEffect(() => {
    if (!isFocusMode) return;

    const nextLine = `${addressName}, ${getRandomMessage(mascotPersonality.actionReactions.focusMode)}`;
    setFocusMotivationLine(nextLine);

    const intervalId = window.setInterval(() => {
      setFocusMotivationLine(`${addressName}, ${getRandomMessage(mascotPersonality.actionReactions.focusMode)}`);
    }, 12000);

    return () => window.clearInterval(intervalId);
  }, [addressName, isFocusMode, mascotPersonality]);

  const handleEndFocusMode = async () => {
    setFocusMode(false);
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  };

  const elapsedFocusSeconds = useMemo(() => {
    if (!focusModeStartedAt) return focusModeTotalSeconds;
    const running = Math.max(0, Math.floor((clockNow - focusModeStartedAt) / 1000));
    return focusModeTotalSeconds + running;
  }, [clockNow, focusModeStartedAt, focusModeTotalSeconds]);

  const elapsedWorkSeconds = useMemo(() => {
    if (!workModeStartedAt) return workModeTotalSeconds;
    const running = Math.max(0, Math.floor((clockNow - workModeStartedAt) / 1000));
    return workModeTotalSeconds + running;
  }, [clockNow, workModeStartedAt, workModeTotalSeconds]);

  const effectiveShowLeftSidebar = isFocusMode ? false : showLeftSidebar;
  const effectiveShowRightSidebar = isFocusMode ? false : showRightSidebar;
  const effectiveShowBottomBar = false;

  return (
    <div className="relative min-h-screen">
      {/* AI Presence Animation */}
      <div className="ai-presence" />

      {/* Top Navigation */}
      <nav
        className="relative z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl transition-all duration-300"
        style={{
          marginLeft: effectiveShowLeftSidebar ? "16rem" : "0",
        }}
      >
        <div className="flex h-20 items-center justify-between pr-4">
          <div className="flex items-center gap-0">
            <button
              onClick={toggleLeftSidebar}
              className="transition hover:opacity-80"
              aria-label="Toggle navigation"
            >
              <AetherisLogo className="h-20 w-auto" />
            </button>

            <div className="ml-8 flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden md:inline">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("aetheris:open-command-palette"))}
              className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white md:flex"
              aria-label="Search features"
              title="Search features"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </button>

            <div className="hidden items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1 md:flex">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`rounded-md p-1.5 transition ${
                  theme === "light"
                    ? "bg-cyan-300/20 text-cyan-200"
                    : "text-slate-300 hover:bg-white/10"
                }`}
                aria-label="Switch to light theme"
                title="Light"
              >
                <Sun className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`rounded-md p-1.5 transition ${
                  theme === "dark"
                    ? "bg-cyan-300/20 text-cyan-200"
                    : "text-slate-300 hover:bg-white/10"
                }`}
                aria-label="Switch to dark theme"
                title="Dark"
              >
                <Moon className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setTheme("system")}
                className={`rounded-md p-1.5 transition ${
                  theme === "system"
                    ? "bg-cyan-300/20 text-cyan-200"
                    : "text-slate-300 hover:bg-white/10"
                }`}
                aria-label="Use system theme"
                title="System"
              >
                <Monitor className="h-4 w-4" />
              </button>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user?.name || "User"}</span>
              </button>

              {showUserMenu && (
                <div className="fixed right-4 top-[88px] w-48 rounded-lg border border-white/10 bg-black/95 backdrop-blur-xl overflow-hidden shadow-2xl z-[9999]">
                  <div className="px-3 py-2 border-b border-white/10">
                    <p className="text-sm font-medium text-slate-100">{user?.name}</p>
                    <p className="text-xs text-slate-400">@{user?.username}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                  <Link
                    href="/terminal"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-white/10 transition"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-200 hover:bg-red-300/10 transition text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Dynamic margins based on sidebar visibility */}
      <main
        className="overflow-y-auto p-4 transition-all duration-300"
        style={{
          marginLeft: effectiveShowLeftSidebar ? "16rem" : "0",
          marginRight: effectiveShowRightSidebar ? "20rem" : "0",
          marginBottom: effectiveShowBottomBar ? "3.5rem" : "0",
          height: `calc(100vh - 80px - ${effectiveShowBottomBar ? "3.5rem" : "0px"})`,
        }}
      >
        {children}
        <ContactFooter />
      </main>

      {isFocusMode && (
        <div className="fixed right-4 top-[88px] z-[96] rounded-lg border border-teal-300/30 bg-black/55 px-3 py-2 text-xs text-teal-100 backdrop-blur-md">
          Focus Time: {formatFocusDuration(elapsedFocusSeconds)}
        </div>
      )}

      {isWorkModeActive && (
        <div className="fixed right-4 top-[124px] z-[96] rounded-lg border border-amber-300/30 bg-black/55 px-3 py-2 text-xs text-amber-100 backdrop-blur-md">
          Work Time: {formatFocusDuration(elapsedWorkSeconds)}
        </div>
      )}

      {isFocusMode && !screenSaverSettings.enabled && (
        <button
          type="button"
          onClick={() => void handleEndFocusMode()}
          className="fixed right-4 top-[160px] z-[96] rounded-lg border border-red-300/40 bg-red-300/10 px-3 py-2 text-xs text-red-100 backdrop-blur-md transition hover:bg-red-300/20"
        >
          End Focus Mode
        </button>
      )}

      {isFocusMode && !screenSaverSettings.enabled && (
        <div className="fixed left-4 top-[88px] z-[96] max-w-md rounded-xl border border-cyan-300/30 bg-black/55 p-3 text-xs text-cyan-100 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="relative h-9 w-9 shrink-0">
              <Image src={mascotProfile.image} alt={mascotProfile.name} fill className="object-contain" />
            </div>
            <div>
              <p className="font-semibold text-cyan-200">{mascotProfile.name}</p>
              <p className="mt-0.5 text-slate-200">{focusMotivationLine}</p>
            </div>
          </div>
        </div>
      )}

      {isFocusMode && screenSaverSettings.enabled && (
        <FocusScreensaver
          message={screenSaverSettings.message}
          color={screenSaverSettings.color}
          elapsedSeconds={elapsedFocusSeconds}
        />
      )}

      {/* Command Palette */}
      <CommandPalette />
    </div>
  );
}

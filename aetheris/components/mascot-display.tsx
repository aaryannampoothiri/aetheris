"use client";

import { useAppStore } from "@/lib/app-store";
import {
  mascotPersonalities,
  getRandomMessage,
  getUpcomingDeadlines,
  type MascotPersonality,
} from "@/lib/mascot-personalities";
import Image from "next/image";
import { useState, useEffect } from "react";
import { X, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";

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
  "aetheris": {
    name: "Aetheris",
    image: "/mascots/aetheris.png",
  },
};

type DialogMode = "idle" | "greeting" | "tutorial" | "deadline" | "action" | "closed";

export function MascotDisplay() {
  const selectedMascot = useAppStore((state) => state.selectedMascot);
  const visualThemePreset = useAppStore((state) => state.visualThemePreset);
  const hasSeenTutorial = useAppStore((state) => state.hasSeenTutorial);
  const setHasSeenTutorial = useAppStore((state) => state.setHasSeenTutorial);
  const user = useAppStore((state) => state.user);
  const deadlines = useAppStore((state) => state.deadlines);
  const deadlineReminderSettings = useAppStore((state) => state.deadlineReminderSettings);
  const mascotReaction = useAppStore((state) => state.mascotReaction);
  const clearMascotReaction = useAppStore((state) => state.clearMascotReaction);

  const [dialogMode, setDialogMode] = useState<DialogMode>("idle");
  const [message, setMessage] = useState("");
  const [tutorialStep, setTutorialStep] = useState(0);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<
    Array<{ id: string; title: string; dueAt: string; minutesUntil: number }>
  >([]);
  const [hasShownGreeting, setHasShownGreeting] = useState(false);

  const actionSpeaker = mascotReaction?.speaker;
  const addressName =
    visualThemePreset === "batman"
      ? "Batman"
      : user?.nickname?.trim() || user?.username || user?.name || "there";

  const personality: MascotPersonality | null =
    selectedMascot !== "none" ? mascotPersonalities[selectedMascot] : null;

  // Listen for action reactions
  useEffect(() => {
    if (mascotReaction) {
      const baseMessage = mascotReaction.message ?? "...";
      setMessage(`${addressName}, ${baseMessage}`);
      setDialogMode("action");
      
      // Auto-close action reaction after 5 seconds
      const timer = setTimeout(() => {
        setDialogMode("closed");
        clearMascotReaction();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [mascotReaction?.id, mascotReaction?.message, addressName, clearMascotReaction]);

  // Theme-based styling configurations
  const themeStyles = {
    aetheris: {
      dialogBg: "from-slate-900/95 to-slate-800/95",
      border: "border-cyan-400/30",
      accent: "text-cyan-300",
      accentBg: "bg-cyan-400/20",
      accentDot: "bg-cyan-400",
      cardBg: "bg-cyan-400/5",
      cardBorder: "border-cyan-400/30",
      cardText: "text-cyan-200",
      buttonBorder: "border-cyan-400/40",
      buttonBg: "bg-cyan-400/10 hover:bg-cyan-400/20",
      buttonText: "text-cyan-200",
      decorClass: "dialog-aetheris",
    },
    diwali: {
      dialogBg: "from-orange-950/95 to-amber-950/95",
      border: "border-amber-500/40",
      accent: "text-amber-300",
      accentBg: "bg-amber-500/20",
      accentDot: "bg-amber-500",
      cardBg: "bg-amber-500/5",
      cardBorder: "border-amber-500/30",
      cardText: "text-amber-200",
      buttonBorder: "border-amber-500/40",
      buttonBg: "bg-amber-500/10 hover:bg-amber-500/20",
      buttonText: "text-amber-200",
      decorClass: "dialog-diwali",
    },
    holi: {
      dialogBg: "from-fuchsia-950/95 to-purple-950/95",
      border: "border-pink-400/40",
      accent: "text-pink-300",
      accentBg: "bg-pink-500/20",
      accentDot: "bg-pink-500",
      cardBg: "bg-pink-500/5",
      cardBorder: "border-pink-500/30",
      cardText: "text-pink-200",
      buttonBorder: "border-pink-500/40",
      buttonBg: "bg-pink-500/10 hover:bg-pink-500/20",
      buttonText: "text-pink-200",
      decorClass: "dialog-holi",
    },
    forest: {
      dialogBg: "from-emerald-950/95 to-green-950/95",
      border: "border-emerald-400/40",
      accent: "text-emerald-300",
      accentBg: "bg-emerald-500/20",
      accentDot: "bg-emerald-500",
      cardBg: "bg-emerald-500/5",
      cardBorder: "border-emerald-500/30",
      cardText: "text-emerald-200",
      buttonBorder: "border-emerald-500/40",
      buttonBg: "bg-emerald-500/10 hover:bg-emerald-500/20",
      buttonText: "text-emerald-200",
      decorClass: "dialog-forest",
    },
    sunset: {
      dialogBg: "from-amber-950/95 to-orange-950/95",
      border: "border-amber-400/40",
      accent: "text-amber-300",
      accentBg: "bg-amber-500/20",
      accentDot: "bg-amber-500",
      cardBg: "bg-amber-500/5",
      cardBorder: "border-amber-500/30",
      cardText: "text-amber-200",
      buttonBorder: "border-amber-500/40",
      buttonBg: "bg-amber-500/10 hover:bg-amber-500/20",
      buttonText: "text-amber-200",
      decorClass: "dialog-sunset",
    },
    valentine: {
      dialogBg: "from-pink-950/95 to-rose-950/95",
      border: "border-pink-400/40",
      accent: "text-pink-300",
      accentBg: "bg-pink-500/20",
      accentDot: "bg-pink-500",
      cardBg: "bg-pink-500/5",
      cardBorder: "border-pink-500/30",
      cardText: "text-pink-200",
      buttonBorder: "border-pink-500/40",
      buttonBg: "bg-pink-500/10 hover:bg-pink-500/20",
      buttonText: "text-pink-200",
      decorClass: "dialog-valentine",
    },
    batman: {
      dialogBg: "from-slate-950/95 to-slate-900/95",
      border: "border-amber-400/35",
      accent: "text-amber-300",
      accentBg: "bg-amber-500/20",
      accentDot: "bg-amber-500",
      cardBg: "bg-amber-500/5",
      cardBorder: "border-amber-500/30",
      cardText: "text-amber-200",
      buttonBorder: "border-amber-500/40",
      buttonBg: "bg-amber-500/10 hover:bg-amber-500/20",
      buttonText: "text-amber-200",
      decorClass: "dialog-batman",
    },
  };

  const currentTheme =
    themeStyles[visualThemePreset as keyof typeof themeStyles] ?? themeStyles.aetheris;

  // Check for upcoming deadlines periodically
  useEffect(() => {
    if (!deadlineReminderSettings.enabled || !personality) return;

    const checkDeadlines = () => {
      const upcoming = getUpcomingDeadlines(deadlines, deadlineReminderSettings.minutesBefore);
      setUpcomingDeadlines(upcoming);

      if (upcoming.length > 0 && dialogMode === "idle") {
        setDialogMode("deadline");
        setMessage(getRandomMessage(personality.deadlineReminders));
      }
    };

    checkDeadlines();
    const interval = setInterval(checkDeadlines, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [deadlines, deadlineReminderSettings, personality, dialogMode]);

  // Show greeting or tutorial on mount
  useEffect(() => {
    if (!personality || hasShownGreeting) return;

    const timer = setTimeout(() => {
      if (!hasSeenTutorial) {
        // First time user - show tutorial
        setDialogMode("tutorial");
        setMessage(personality.tutorialIntro);
        setTutorialStep(0);
      } else if (deadlineReminderSettings.showOnLogin && upcomingDeadlines.length > 0) {
        // Existing user with deadlines
        setDialogMode("deadline");
        setMessage(getRandomMessage(personality.deadlineReminders));
      } else {
        // Existing user - just greeting
        setDialogMode("greeting");
        setMessage(getRandomMessage(personality.greetings));
      }
      setHasShownGreeting(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [personality, hasSeenTutorial, hasShownGreeting, deadlineReminderSettings, upcomingDeadlines]);

  if (selectedMascot === "none") {
    return null;
  }

  const displayMascot =
    dialogMode === "action" && actionSpeaker ? mascotInfo[actionSpeaker] : mascotInfo[selectedMascot];
  const displayPersonality =
    dialogMode === "action" && actionSpeaker
      ? mascotPersonalities[actionSpeaker]
      : personality;

  const handleMascotClick = () => {
    if (!personality) return;

    if (dialogMode === "idle" || dialogMode === "closed") {
      setMessage(`${addressName}, ${getRandomMessage(personality.greetings)}`);
      setDialogMode("greeting");
    }
  };

  const handleCloseDialog = () => {
    setDialogMode("closed");
  };

  const handleNextTutorialStep = () => {
    if (!personality) return;

    if (tutorialStep < personality.tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      // Tutorial complete
      setHasSeenTutorial(true);
      setDialogMode("greeting");
      setMessage(`${addressName}, ${getRandomMessage(personality.greetings)}`);
    }
  };

  const handlePrevTutorialStep = () => {
    if (tutorialStep > 0) {
      setTutorialStep(tutorialStep - 1);
    }
  };

  const showDialog = dialogMode !== "idle" && dialogMode !== "closed";

  return (
    <>
      {/* Mascot */}
      <div
        className="fixed bottom-6 right-6 z-40 cursor-pointer animate-bounce-subtle"
        onClick={handleMascotClick}
      >
        <div className="relative h-32 w-32 transition-transform hover:scale-110 duration-300">
          <Image
            src={displayMascot.image}
            alt={displayMascot.name}
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </div>

      {/* Dialog Box */}
      {showDialog && personality && (
        <div className="fixed bottom-44 right-6 z-50 animate-slide-up">
          <div className={`mascot-dialog ${currentTheme.decorClass} relative w-80 rounded-2xl border ${currentTheme.border} bg-gradient-to-br ${currentTheme.dialogBg} p-5 shadow-2xl backdrop-blur-xl`}>
            {/* Close Button */}
            {dialogMode !== "tutorial" && (
              <button
                onClick={handleCloseDialog}
                className="absolute right-3 top-3 rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Mascot Name */}
            <div className="mb-2 flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full ${currentTheme.accentBg} p-1.5`}>
                <div className={`h-full w-full rounded-full ${currentTheme.accentDot}`}></div>
              </div>
              <h3 className={`text-sm font-semibold ${currentTheme.accent}`}>{displayPersonality?.name}</h3>
            </div>

            {(visualThemePreset === "valentine" || visualThemePreset === "batman") && (
              <div className="mb-2 text-xs tracking-wide text-slate-300">
                {visualThemePreset === "valentine" ? "❤️ 💖 ❤️" : "🦇 🦇 🦇"}
              </div>
            )}

            {/* Tutorial Mode */}
            {dialogMode === "tutorial" && (
              <div className="space-y-3">
                <p className="text-sm text-slate-300">{message}</p>
                
                {tutorialStep < personality.tutorialSteps.length && (
                  <div className={`rounded-lg border ${currentTheme.cardBorder} ${currentTheme.cardBg} p-3`}>
                    <h4 className={`mb-1 text-sm font-semibold ${currentTheme.cardText}`}>
                      {personality.tutorialSteps[tutorialStep].title}
                    </h4>
                    <p className="text-xs text-slate-300">
                      {personality.tutorialSteps[tutorialStep].description}
                    </p>
                  </div>
                )}

                {/* Tutorial Navigation */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePrevTutorialStep}
                    disabled={tutorialStep === 0}
                    className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10 disabled:opacity-40"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    <span>Back</span>
                  </button>

                  <span className="text-xs text-slate-400">
                    {tutorialStep + 1} / {personality.tutorialSteps.length}
                  </span>

                  <button
                    onClick={handleNextTutorialStep}
                    className={`flex items-center gap-1 rounded-lg border ${currentTheme.buttonBorder} ${currentTheme.buttonBg} px-3 py-1.5 text-xs ${currentTheme.buttonText} transition`}
                  >
                    <span>{tutorialStep === personality.tutorialSteps.length - 1 ? "Finish" : "Next"}</span>
                    {tutorialStep === personality.tutorialSteps.length - 1 ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <ArrowRight className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Deadline Mode */}
            {dialogMode === "deadline" && (
              <div className="space-y-3">
                <p className="text-sm text-slate-300">{message}</p>
                
                {upcomingDeadlines.length > 0 && (
                  <div className="space-y-2">
                    {upcomingDeadlines.slice(0, 3).map((deadline) => (
                      <div
                        key={deadline.id}
                        className="rounded-lg border border-orange-400/30 bg-orange-400/5 p-3"
                      >
                        <h4 className="mb-1 text-sm font-semibold text-orange-200">
                          {deadline.title}
                        </h4>
                        <p className="text-xs text-slate-400">
                          Due in {deadline.minutesUntil} minutes
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Greeting Mode */}
            {dialogMode === "greeting" && (
              <div>
                <p className="text-sm text-slate-300">{message}</p>
                {user && (
                  <p className="mt-2 text-xs text-slate-400">Welcome back, {addressName}!</p>
                )}
              </div>
            )}

            {/* Action Reaction Mode */}
            {dialogMode === "action" && (
              <div>
                <p className="text-sm text-slate-300">{message}</p>
              </div>
            )}

            {/* Speech bubble pointer */}
            <div className={`absolute -bottom-2 right-12 h-4 w-4 rotate-45 border-b border-r ${currentTheme.border} bg-gradient-to-br ${currentTheme.dialogBg}`}></div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        /* Aetheris theme - Tech circuit patterns */
        .dialog-aetheris::before {
          content: "";
          position: absolute;
          top: 10px;
          right: 10px;
          width: 60px;
          height: 60px;
          background: radial-gradient(circle, rgba(103, 232, 249, 0.15), transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          animation: pulse-cyan 2s ease-in-out infinite;
        }

        @keyframes pulse-cyan {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }

        /* Diwali theme - Diya lamps on corners */
        .dialog-diwali::before,
        .dialog-diwali::after {
          content: "🪔";
          position: absolute;
          font-size: 20px;
          opacity: 0.8;
          animation: flicker 1.5s ease-in-out infinite;
        }
        .dialog-diwali::before {
          top: -8px;
          left: 10px;
        }
        .dialog-diwali::after {
          bottom: -8px;
          right: 10px;
        }

        @keyframes flicker {
          0%, 100% { opacity: 0.6; filter: brightness(1); }
          50% { opacity: 1; filter: brightness(1.3); }
        }

        /* Holi theme - Colorful splashes */
        .dialog-holi::before,
        .dialog-holi::after {
          content: "";
          position: absolute;
          pointer-events: none;
          border-radius: 50%;
          animation: splash-float 3s ease-in-out infinite;
        }
        .dialog-holi::before {
          top: 15px;
          left: -15px;
          width: 40px;
          height: 40px;
          background: radial-gradient(circle, rgba(236, 72, 153, 0.5), rgba(139, 92, 246, 0.3));
          animation-delay: 0s;
        }
        .dialog-holi::after {
          bottom: 20px;
          right: -10px;
          width: 35px;
          height: 35px;
          background: radial-gradient(circle, rgba(34, 211, 238, 0.5), rgba(250, 204, 21, 0.3));
          animation-delay: 1s;
        }

        .mascot-dialog.dialog-holi {
          box-shadow: 
            0 0 30px rgba(236, 72, 153, 0.3),
            0 0 50px rgba(139, 92, 246, 0.2),
            0 0 70px rgba(34, 211, 238, 0.2);
        }

        @keyframes splash-float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
          50% { transform: translateY(-10px) scale(1.15); opacity: 0.8; }
        }

        /* Forest theme - Leaves on edges */
        .dialog-forest::before,
        .dialog-forest::after {
          content: "🍃";
          position: absolute;
          font-size: 18px;
          opacity: 0.7;
          animation: leaf-sway 3s ease-in-out infinite;
        }
        .dialog-forest::before {
          top: 10px;
          right: -5px;
          animation-delay: 0s;
        }
        .dialog-forest::after {
          bottom: 15px;
          left: -5px;
          animation-delay: 1.5s;
        }

        @keyframes leaf-sway {
          0%, 100% { transform: rotate(-5deg) translateX(0); }
          50% { transform: rotate(5deg) translateX(3px); }
        }

        .mascot-dialog.dialog-forest {
          box-shadow: 0 0 40px rgba(52, 211, 153, 0.3);
        }

        /* Sunset theme - Warm glow */
        .dialog-sunset::before {
          content: "";
          position: absolute;
          top: -20px;
          right: 20px;
          width: 80px;
          height: 80px;
          background: radial-gradient(circle, rgba(251, 113, 133, 0.3), rgba(251, 146, 60, 0.2), transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          animation: sunset-glow 4s ease-in-out infinite;
        }

        @keyframes sunset-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.2); }
        }

        .mascot-dialog.dialog-sunset {
          box-shadow: 0 0 40px rgba(251, 113, 133, 0.4);
        }

        /* Valentine theme - hearts */
        .dialog-valentine::before,
        .dialog-valentine::after {
          content: "❤";
          position: absolute;
          font-size: 16px;
          color: rgba(244, 63, 94, 0.78);
          animation: heart-float 2.8s ease-in-out infinite;
        }
        .dialog-valentine::before {
          top: 8px;
          right: 16px;
        }
        .dialog-valentine::after {
          bottom: 10px;
          left: 14px;
          animation-delay: 1.2s;
        }

        .mascot-dialog.dialog-valentine {
          box-shadow: 0 0 42px rgba(244, 63, 94, 0.35);
        }

        @keyframes heart-float {
          0%,
          100% {
            transform: translateY(0) scale(1);
            opacity: 0.72;
          }
          50% {
            transform: translateY(-6px) scale(1.12);
            opacity: 1;
          }
        }

        /* Batman theme - bat marks */
        .dialog-batman::before,
        .dialog-batman::after {
          content: "🦇";
          position: absolute;
          font-size: 16px;
          color: rgba(250, 204, 21, 0.85);
          animation: bat-float 3.2s ease-in-out infinite;
        }
        .dialog-batman::before {
          top: 8px;
          right: 16px;
        }
        .dialog-batman::after {
          bottom: 12px;
          left: 14px;
          animation-delay: 1.4s;
        }

        .mascot-dialog.dialog-batman {
          box-shadow: 0 0 42px rgba(250, 204, 21, 0.28);
        }

        @keyframes bat-float {
          0%,
          100% {
            transform: translateY(0) scale(1);
            opacity: 0.66;
          }
          50% {
            transform: translateY(-8px) scale(1.15);
            opacity: 1;
          }
        }

        /* Additional color splashes for Holi (more decorations) */
        .mascot-dialog.dialog-holi {
          position: relative;
          overflow: visible;
        }
        
        .mascot-dialog.dialog-holi .space-y-3,
        .mascot-dialog.dialog-holi > div {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </>
  );
}

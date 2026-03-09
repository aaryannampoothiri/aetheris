"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useAppStore } from "@/lib/app-store";
import { X, ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";

type TutorialStep = {
  title: string;
  message: string;
  highlight?: string;
};

const tutorialSteps: TutorialStep[] = [
  {
    title: "Welcome to Aetheris! 🎉",
    message: "Hi there! I'm your Aetheris companion. Let me show you around and help you get the most out of your productivity workspace. Ready to begin?",
  },
  {
    title: "Navigation & Pages",
    message: "Use the top navigation bar to explore different sections: Home for your dashboard, Forge for task management, Notes for capturing ideas, and Terminal for customizing your experience.",
  },
  {
    title: "Focus & Work Modes",
    message: "Activate Focus Mode for distraction-free work or Work Mode to track your productivity time. Both help you stay in the flow state!",
  },
  {
    title: "Calendar & Deadlines",
    message: "Schedule meetings and activities in the Calendar page. Set deadlines in Tasks to stay on top of your commitments with timely reminders.",
  },
  {
    title: "AI Assistant Sidebar",
    message: "Toggle the right sidebar to access your AI assistant. Choose between Gemini, Claude, or DeepSeek models to help with planning, coding, and research.",
  },
  {
    title: "Wellness Tracking",
    message: "Visit the Wellness page to log hydration, breaks, exercise, and mood. I'll send gentle reminders to help you maintain healthy habits throughout your day.",
  },
  {
    title: "Flashcards & Learning",
    message: "Create flashcard topics to reinforce your learning. Perfect for studying, memorizing key concepts, or preparing for presentations!",
  },
  {
    title: "Personalization",
    message: "Head to Terminal (Settings) to customize themes, choose your mascot companion, adjust fonts, and configure your workspace to match your style.",
  },
  {
    title: "You're All Set! 🚀",
    message: "That's the tour! Explore at your own pace, and I'll be here if you need guidance. Let's build something amazing together!",
  },
];

export function TutorialOverlay() {
  const isLoggedIn = useAppStore((state) => state.isLoggedIn);
  const hasSeenTutorial = useAppStore((state) => state.hasSeenTutorial);
  const setHasSeenTutorial = useAppStore((state) => state.setHasSeenTutorial);
  const selectedMascot = useAppStore((state) => state.selectedMascot);

  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const mascotImages = {
    "optimus-prime": "/mascots/optimus-prime.png",
    bumblebee: "/mascots/bumblebee.png",
    "wall-e": "/mascots/wall-e.png",
    aetheris: "/mascots/aetheris.png",
  };

  const activeMascot = selectedMascot === "none" ? "aetheris" : selectedMascot;
  const mascotImage = mascotImages[activeMascot];

  const currentTutorialStep = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;

  useEffect(() => {
    // Show tutorial only if user is logged in and hasn't seen it
    if (isLoggedIn && !hasSeenTutorial) {
      // Small delay to let the app load
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, hasSeenTutorial]);

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    setHasSeenTutorial(true);
  };

  const handleComplete = () => {
    setIsVisible(false);
    setHasSeenTutorial(true);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="relative mx-4 w-full max-w-2xl rounded-2xl border border-cyan-300/30 bg-gradient-to-br from-slate-950/95 via-slate-900/95 to-slate-950/95 p-6 shadow-2xl backdrop-blur-xl"
        >
          {/* Skip button */}
          <button
            onClick={handleSkip}
            className="absolute right-4 top-4 rounded-lg border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-slate-200"
            aria-label="Skip tutorial"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Progress indicator */}
          <div className="mb-6 flex items-center justify-center gap-1.5">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 w-8 rounded-full transition-all ${
                  index === currentStep
                    ? "bg-cyan-400"
                    : index < currentStep
                    ? "bg-cyan-400/50"
                    : "bg-white/10"
                }`}
              />
            ))}
          </div>

          <div className="flex flex-col items-center gap-6 md:flex-row">
            {/* Mascot */}
            <div className="relative h-32 w-32 shrink-0">
              <Image
                src={mascotImage}
                alt="Tutorial mascot"
                fill
                className="object-contain drop-shadow-[0_0_20px_rgba(103,232,249,0.4)]"
              />
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="mb-3 text-2xl font-semibold text-cyan-100">
                {currentTutorialStep.title}
              </h2>
              <p className="text-base leading-relaxed text-slate-300">
                {currentTutorialStep.message}
              </p>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <div className="text-xs text-slate-500">
              Step {currentStep + 1} of {tutorialSteps.length}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 rounded-lg border border-cyan-300/40 bg-cyan-300/15 px-4 py-2 text-sm text-cyan-200 transition hover:bg-cyan-300/25"
            >
              {isLastStep ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Finish
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          {/* Skip text hint */}
          <p className="mt-4 text-center text-xs text-slate-500">
            You can skip this tutorial anytime and explore on your own
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

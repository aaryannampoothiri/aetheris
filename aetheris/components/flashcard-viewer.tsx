"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

export type FlashCardData = {
  id: string;
  front: string;
  back: string;
};

type FlashCardViewerProps = {
  cards: FlashCardData[];
  variant?: "study" | "deadline";
  onClose?: () => void;
};

export function FlashCardViewer({ cards, variant = "study", onClose }: FlashCardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<1 | -1>(1);
  const wasSwipedRef = useRef(false);
  const SWIPE_DISTANCE = 55;
  const SWIPE_VELOCITY = 450;

  if (cards.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-white/10 bg-white/10 p-6">
        <p className="text-sm text-slate-400">No cards available</p>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progressPercent = ((currentIndex + 1) / cards.length) * 100;

  const stackCards = useMemo(() => {
    const first = cards[currentIndex + 1] ?? null;
    const second = cards[currentIndex + 2] ?? null;
    return [first, second].filter(Boolean) as FlashCardData[];
  }, [cards, currentIndex]);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setSwipeDirection(1);
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSwipeDirection(-1);
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    if (wasSwipedRef.current) {
      wasSwipedRef.current = false;
      return;
    }
    setIsFlipped(!isFlipped);
  };

  const handleReset = () => {
    setSwipeDirection(1);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const cardMotionVariants = {
    enter: (direction: 1 | -1) => ({
      x: direction > 0 ? 36 : -36,
      y: 12,
      scale: 0.96,
      opacity: 0.65,
      zIndex: 20,
    }),
    center: {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      zIndex: 30,
      transition: {
        duration: 0.34,
        ease: [0.22, 0.61, 0.36, 1],
      },
    },
    exit: (direction: 1 | -1) => ({
      x: direction > 0 ? -70 : 70,
      y: -4,
      scale: 0.98,
      opacity: 0.4,
      zIndex: 10,
      transition: {
        duration: 0.24,
        ease: [0.4, 0, 1, 1],
      },
    }),
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>{variant === "study" ? "Study Deck" : "Deadline Deck"}</span>
            {variant === "deadline" && currentIndex === 0 && (
              <span className="rounded-full border border-orange-300/40 bg-orange-300/15 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-orange-200">
                Most Urgent
              </span>
            )}
          </div>
          <span className="font-medium text-slate-200">
            {currentIndex + 1}/{cards.length}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-cyan-300/80"
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.22 }}
          />
        </div>
      </div>

      <div className="relative h-[360px] w-full overflow-hidden rounded-2xl">
        {stackCards.map((card, idx) => (
          <div
            key={`stack-${card.id}`}
            className="pointer-events-none absolute inset-x-4 top-0 rounded-2xl border border-white/10 bg-white/10 shadow-[0_10px_26px_rgba(15,23,42,0.14)] backdrop-blur-md"
            style={{
              height: "340px",
              transform: `translateY(${(idx + 1) * 8}px) scale(${1 - (idx + 1) * 0.02})`,
              opacity: 0.56 - idx * 0.14,
              zIndex: 1,
            }}
            aria-hidden="true"
          />
        ))}

        <AnimatePresence initial={false} mode="sync" custom={swipeDirection}>
          <motion.div
            key={currentCard.id}
            custom={swipeDirection}
            variants={cardMotionVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.08}
            dragMomentum={false}
            dragSnapToOrigin
            onDragEnd={(_, info) => {
              const distance = info.offset.x;
              const velocity = info.velocity.x;
              const isSwipeLeft = distance < -SWIPE_DISTANCE || velocity < -SWIPE_VELOCITY;
              const isSwipeRight = distance > SWIPE_DISTANCE || velocity > SWIPE_VELOCITY;

              if (isSwipeLeft) {
                wasSwipedRef.current = true;
                handleNext();
              } else if (isSwipeRight) {
                wasSwipedRef.current = true;
                handlePrev();
              }
            }}
            onClick={handleFlip}
            className="absolute inset-0 h-[340px] cursor-grab active:cursor-grabbing"
          >
            <div className="card-3d relative h-full w-full">
              <div className={`card-inner ${isFlipped ? "is-flipped" : ""}`}>
                <div className="card-face card-front rounded-2xl border border-white/15 bg-white/10 p-7 shadow-[0_18px_40px_rgba(15,23,42,0.16)] backdrop-blur-md">
                  <div className="flex h-full flex-col justify-between">
                    <div className="text-xs uppercase tracking-[0.18em] text-cyan-200/90">
                      {variant === "study" ? "Concept" : "Deadline"}
                    </div>
                    <p className="text-balance text-center text-2xl font-medium leading-snug text-slate-100">
                      {currentCard.front}
                    </p>
                    <div className="text-center text-xs text-slate-400">
                      Click to flip • Swipe to navigate
                    </div>
                  </div>
                </div>

                <div className="card-face card-back rounded-2xl border border-white/15 bg-white/10 p-7 shadow-[0_18px_40px_rgba(15,23,42,0.16)] backdrop-blur-md">
                  <div className="flex h-full flex-col justify-between">
                    <div className="text-xs uppercase tracking-[0.18em] text-teal-200/90">
                      {variant === "study" ? "Explanation" : "Details"}
                    </div>
                    <p className="whitespace-pre-wrap text-balance text-center text-base leading-relaxed text-slate-200">
                      {currentCard.back}
                    </p>
                    <div className="text-center text-xs text-slate-400">
                      Click to flip back
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Previous
        </button>

        <div className="flex items-center gap-1.5">
          {cards.map((card, index) => (
            <button
              key={card.id}
              type="button"
              onClick={() => {
                setSwipeDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
                setIsFlipped(false);
              }}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex ? "w-6 bg-cyan-300" : "w-1.5 bg-slate-600"
              }`}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          {variant === "study" && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:bg-white/10"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:bg-white/10"
            >
              Close
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <style jsx>{`
        .card-3d {
          perspective: 1200px;
        }
        .card-inner {
          position: relative;
          height: 100%;
          width: 100%;
          transform-style: preserve-3d;
          transition: transform 520ms cubic-bezier(0.22, 0.61, 0.36, 1);
        }
        .card-inner.is-flipped {
          transform: rotateY(180deg);
        }
        .card-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .card-back {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}

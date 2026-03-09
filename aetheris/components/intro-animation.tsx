"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AetherisLogo } from "./aetheris-logo";

export function IntroAnimation() {
  const [showIntro, setShowIntro] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    const played = Boolean(sessionStorage.getItem("aetheris-intro-played"));
    if (played) {
      setHasPlayed(true);
      setShowIntro(false);
      return;
    }

    setHasPlayed(false);
    setShowIntro(true);
  }, []);

  useEffect(() => {
    if (!showIntro) return;

    // Play intro sequence
    const timer = setTimeout(() => {
      setShowIntro(false);
      sessionStorage.setItem("aetheris-intro-played", "true");
      
      // Delay cleanup until exit animation completes
      setTimeout(() => {
        setHasPlayed(true);
      }, 600); // Wait for exit animation (500ms) + buffer
    }, 3000); // Total intro duration

    return () => clearTimeout(timer);
  }, [showIntro]);

  // Don't render anything if intro has already played
  if (hasPlayed && !showIntro) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {showIntro && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            opacity: { duration: 0.5, ease: "easeInOut" }
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
        >
          {/* Animated background flash - intense burst */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.8, 0.4, 0.4],
              scale: [0.8, 1.5, 1.8, 1.8]
            }}
            exit={{
              opacity: 0,
              scale: 2.5,
              transition: { duration: 0.5, ease: "easeIn" }
            }}
            transition={{
              duration: 1.2,
              times: [0, 0.2, 0.6, 1],
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/40 blur-[150px]" />
          </motion.div>

          {/* Logo container with Netflix-style zoom slam */}
          <motion.div
            initial={{ scale: 2.5, opacity: 0 }}
            animate={{ 
              scale: [2.5, 0.9, 1.05, 1],
              opacity: [0, 1, 1, 1]
            }}
            exit={{
              scale: 1.5,
              opacity: 0,
              filter: "blur(10px)",
              transition: { duration: 0.5, ease: [0.4, 0, 1, 1] }
            }}
            transition={{
              duration: 0.7,
              times: [0, 0.4, 0.7, 1],
              ease: [0.22, 1, 0.36, 1] // Smooth ease-out
            }}
            className="relative z-10"
          >
            <AetherisLogo className="h-48 w-auto drop-shadow-[0_0_50px_rgba(103,232,249,0.8)] md:h-64 lg:h-80" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

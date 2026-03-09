"use client";

import { motion } from "framer-motion";
import { type HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";

type GlassCardProps = Omit<HTMLMotionProps<"section">, "children"> & {
  children: ReactNode;
  glow?: "cyan" | "orange" | "teal";
};

const glowMap = {
  cyan: "from-cyan-300/45",
  orange: "from-orange-300/45",
  teal: "from-teal-300/45",
};

export function GlassCard({ className, glow = "cyan", children, ...rest }: GlassCardProps) {
  return (
    <motion.section
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl ${className ?? ""}`}
      {...rest}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${glowMap[glow]} via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90`}
      />
      <div className="relative z-10">{children}</div>
    </motion.section>
  );
}

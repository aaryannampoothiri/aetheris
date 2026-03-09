"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/glass-card";
import { 
  Brain,
  CalendarDays,
  FolderOpen,
  Heart,
  Layout,
  ListTodo,
  Sparkles,
  Timer,
  SlidersHorizontal,
  ChartNoAxesCombined,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";

type FeatureItem = {
  name: string;
  desc: string;
  href: string;
};

const features: Array<{
  category: string;
  icon: typeof Brain;
  items: FeatureItem[];
}> = [
  {
    category: "Core Workspace",
    icon: Brain,
    items: [
      {
        name: "Home Dashboard",
        desc: "See your tasks, deadlines, today’s activities, modes, and wellness score in one place.",
        href: "/",
      },
      {
        name: "Task Board",
        desc: "Create tasks and deadlines, then move tasks across To Do, Working On, and Done.",
        href: "/forge",
      },
      {
        name: "Calendar Planner",
        desc: "Plan your day with scheduled activities and review what is due today.",
        href: "/calendar",
      },
      {
        name: "Notes and Flashcards",
        desc: "Write notes and review topic flashcards to remember key points faster.",
        href: "/vault",
      },
    ],
  },
  {
    category: "Focus and Wellness",
    icon: Heart,
    items: [
      {
        name: "Work and Focus Modes",
        desc: "Switch modes quickly to reduce distractions and stay in flow.",
        href: "/",
      },
      {
        name: "Wellness Tracker",
        desc: "Track water, breaks, mood, breathing, and stretch activity with reminders.",
        href: "/wellness",
      },
      {
        name: "Mascot Reminders",
        desc: "Your mascot appears with reminder cards to prompt hydration and breaks.",
        href: "/wellness",
      },
      {
        name: "Focus and Productivity Stats",
        desc: "View progress, activity trends, and work insights on the stats page.",
        href: "/insights",
      },
    ],
  },
  {
    category: "Personalization",
    icon: Layout,
    items: [
      {
        name: "Mascot and Theme Settings",
        desc: "Choose mascot style and adjust app look and typography from settings.",
        href: "/terminal",
      },
      {
        name: "Reminder Controls",
        desc: "Turn wellness reminders on or off from the wellness page anytime.",
        href: "/wellness",
      },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/20 bg-gradient-to-r from-cyan-500/20 via-slate-900/30 to-blue-500/20 p-6 md:p-8">
        <p className="text-xs tracking-[0.24em] text-cyan-100/90">WHAT IS INCLUDED</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight text-slate-100 md:text-5xl">
          Features You Can Use Right Now
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-300 md:text-base">
          These are the live features already available in your workspace. Click any feature to open it.
        </p>
      </section>

      <div className="space-y-8">
        {features.map((section, sectionIdx) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIdx * 0.1 }}
            >
              <div className="mb-4 flex items-center gap-3">
                <Icon className="h-6 w-6 text-cyan-300" />
                <h2 className="text-xl font-semibold text-slate-200">{section.category}</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {section.items.map((feature) => (
                  <Link key={feature.name} href={feature.href} className="block">
                    <GlassCard className="p-5 transition-all hover:border-cyan-300/35">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <h3 className="font-medium text-slate-100">{feature.name}</h3>
                        <span className="inline-flex items-center gap-1 rounded-full bg-teal-400/20 px-2 py-0.5 text-xs text-teal-300">
                          <BadgeCheck className="h-3 w-3" />
                          live
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">{feature.desc}</p>
                      <div className="mt-3 inline-flex items-center gap-1 text-xs text-cyan-300">
                        Open feature
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </GlassCard>
                  </Link>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

import { CalendarDays, ChartNoAxesCombined, FolderOpen, Gauge, Heart, ListTodo, SlidersHorizontal, Sparkles } from "lucide-react";
import { type ComponentType } from "react";

export type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: Gauge },
  { label: "Calendar", href: "/calendar", icon: CalendarDays },
  { label: "Notes", href: "/vault", icon: FolderOpen },
  { label: "Tasks", href: "/forge", icon: ListTodo },
  { label: "Wellness", href: "/wellness", icon: Heart },
  { label: "Stats", href: "/insights", icon: ChartNoAxesCombined },
  { label: "Features", href: "/features", icon: Sparkles },
  { label: "Settings", href: "/terminal", icon: SlidersHorizontal },
];

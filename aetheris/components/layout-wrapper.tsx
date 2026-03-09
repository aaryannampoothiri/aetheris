"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/app-store";
import { LeftSidebar } from "./left-sidebar";
import { RightSidebar } from "./right-sidebar";
import { AppShell } from "./app-shell";
import { AnimatedPage } from "./animated-page";
import { WellnessReminderModal } from "./wellness-reminder-modal";
import { MascotDisplay } from "./mascot-display";
import { TutorialOverlay } from "./tutorial-overlay";

export function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoggedIn = useAppStore((state) => state.isLoggedIn);
  const isLoginPage = pathname === "/login";

  // On login page or when not logged in, render only the page content
  if (isLoginPage || !isLoggedIn) {
    return <>{children}</>;
  }

  // On authenticated pages, render with full layout
  return (
    <>
      <LeftSidebar />
      <RightSidebar />
      <WellnessReminderModal />
      <MascotDisplay />
      <TutorialOverlay />
      <AppShell>
        <AnimatedPage>{children}</AnimatedPage>
      </AppShell>
    </>
  );
}

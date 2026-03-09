"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAppStore } from "@/lib/app-store";
import { usePathname } from "next/navigation";

export function AuthWrapper({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const isLoggedIn = useAppStore((state) => state.isLoggedIn);
  const pathname = usePathname();

  useEffect(() => {
    // Use timeout to avoid setState in effect warning
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mounted && pathname !== "/login" && !isLoggedIn) {
      window.location.replace("/login");
    }
  }, [isLoggedIn, pathname, mounted]);

  // Don't render anything until mounted (prevents SSR mismatch)
  if (!mounted) {
    return null;
  }

  // Allow login page without authentication
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // Block protected routes until authenticated
  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}

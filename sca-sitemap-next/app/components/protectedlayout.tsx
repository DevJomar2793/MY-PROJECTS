"use client";

/**
 * components/protectedlayout.tsx
 * ─────────────────────────────────────────────────────────────
 * Wraps authenticated pages: shows the sidebar, redirects
 * unauthenticated users to /login.
 * ─────────────────────────────────────────────────────────────
 */

import { useEffect, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth";
import SideNavBar from "./sidenavbar";

const PUBLIC_PATHS = ["/login"];

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublic = PUBLIC_PATHS.includes(pathname);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isPublic) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, isPublic, router]);

  // Always render public pages directly
  if (isPublic) {
    return <>{children}</>;
  }

  // While resolving auth, show nothing (avoid flash)
  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <SideNavBar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/auth";
import SideNavBar from "./sidenavbar";
import Footer from "./footer";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoggedIn && pathname !== "/login") {
      router.replace("/login");
    }
    // Redirect logged in users away from login page
    if (isLoggedIn && pathname === "/login") {
      router.replace("/");
    }
  }, [isLoggedIn, pathname, router]);

  // Handle loading state or specific routes where navbar should be hidden
  if (!isLoggedIn || pathname === "/login") return <>{children}</>;

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <SideNavBar />
      <main className="flex-1 overflow-y-auto flex flex-col">
        <div className="grow">{children}</div>
        <Footer />
      </main>
    </div>
  );
}

import type { Metadata } from "next";
import SideNavBar from "./components/sidenavbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inventory Dashboard",
  description: "A premium Tailwind CSS Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased font-sans">
        <div className="flex h-screen w-full overflow-hidden">
          <SideNavBar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import SideNavBar from "./components/sidenavbar";
import Footer from "./components/footer";
import "./globals.css";
import { DatabaseProvider } from "./context/database";

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
    <html lang="en" data-scroll-behavior="smooth">
      <body className="bg-slate-50 text-slate-900 antialiased font-sans">
        <DatabaseProvider>
          <div className="flex h-screen w-full overflow-hidden">
            <SideNavBar />
            <main className="flex-1 overflow-y-auto flex flex-col">
              <div className="grow">
                {children}
              </div>
              <Footer />
            </main>
          </div>
        </DatabaseProvider>
      </body>
    </html>
  );
}

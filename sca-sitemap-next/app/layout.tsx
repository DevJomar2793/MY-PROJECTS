import type { Metadata } from "next";
import "./globals.css";
import { DatabaseProvider } from "./context/database";
import { AuthProvider } from "./context/auth";
import ProtectedLayout from "./components/protectedlayout";

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
        <AuthProvider>
          <DatabaseProvider>
            <ProtectedLayout>{children}</ProtectedLayout>
          </DatabaseProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

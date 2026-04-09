import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./context/auth";
import ProtectedLayout from "./components/protectedlayout";

export const metadata: Metadata = {
  title: "SCA Sitemap",
  description: "Screen inventory management for SCA Sitemap",
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
          <ProtectedLayout>{children}</ProtectedLayout>
        </AuthProvider>
      </body>
    </html>
  );
}

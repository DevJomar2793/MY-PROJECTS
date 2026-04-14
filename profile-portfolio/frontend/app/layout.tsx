import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jomar Profile",
  description: "Jomar Profile - QA Tester & Aspiring Full Stack Developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth antialiased`}
    >
      <body className="bg-[#0f111a] text-gray-200 font-sans relative overflow-x-hidden selection:bg-violet-500/30 selection:text-white min-h-screen">
        
        {/* Decorative Background */}
        <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
          {/* Subtle massive </ > element */}
          <div className="text-[40vw] font-mono font-bold text-violet-500/[0.04] select-none tracking-tighter mix-blend-plus-lighter -rotate-6">
            &lt;/&gt;
          </div>
          {/* Subtle Ambient Glowing Orbs */}
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[150px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[150px]" />
        </div>
        
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}

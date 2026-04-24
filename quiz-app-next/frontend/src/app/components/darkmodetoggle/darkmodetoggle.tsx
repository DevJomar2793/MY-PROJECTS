"use client";

import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "quiz-theme";

function applyTheme(isDark: boolean) {
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
}

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    return savedTheme === "dark" || (!savedTheme && prefersDark);
  });

  useEffect(() => {
    applyTheme(isDark);
  }, [isDark]);

  function handleToggle() {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    window.localStorage.setItem(
      THEME_STORAGE_KEY,
      nextTheme ? "dark" : "light",
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label="Toggle theme"
      suppressHydrationWarning
      className="inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-800 sm:w-auto"
    >
      <span className="text-base" aria-hidden="true">
        ◐
      </span>
      <span>Toggle Theme</span>
    </button>
  );
}

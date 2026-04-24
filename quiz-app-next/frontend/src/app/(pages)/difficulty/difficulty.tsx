import Link from "next/link";
import DarkModeToggle from "../../components/darkmodetoggle/darkmodetoggle";

export default function Difficulty() {
  const levels = [
    {
      id: "easy",
      href: "/quizapp/easy",
      title: "Easy",
      description: "Perfect for beginners. Relaxed timer and simpler questions.",
      icon: "🌱",
      colorClass: "text-emerald-700 dark:text-emerald-300",
      bgClass: "bg-emerald-50 dark:bg-emerald-500/10",
      borderClass: "border-emerald-200 dark:border-emerald-500/20",
      hoverClass: "hover:border-emerald-400 dark:hover:border-emerald-400/50 hover:shadow-[0_8px_30px_rgb(16,185,129,0.12)]",
    },
    {
      id: "medium",
      href: "/quizapp/medium",
      title: "Medium",
      description: "A balanced challenge for intermediate players.",
      icon: "🔥",
      colorClass: "text-amber-700 dark:text-amber-300",
      bgClass: "bg-amber-50 dark:bg-amber-500/10",
      borderClass: "border-amber-200 dark:border-amber-500/20",
      hoverClass: "hover:border-amber-400 dark:hover:border-amber-400/50 hover:shadow-[0_8px_30px_rgb(245,158,11,0.12)]",
    },
    {
      id: "hard",
      href: "/quizapp/hard",
      title: "Hard",
      description: "Test your limits. Difficult questions and tight timer.",
      icon: "💀",
      colorClass: "text-rose-700 dark:text-rose-300",
      bgClass: "bg-rose-50 dark:bg-rose-500/10",
      borderClass: "border-rose-200 dark:border-rose-500/20",
      hoverClass: "hover:border-rose-400 dark:hover:border-rose-400/50 hover:shadow-[0_8px_30px_rgb(225,29,72,0.12)]",
    },
  ];

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#e0f2fe_0%,#eef4ff_35%,#ffffff_100%)] px-4 py-8 transition-colors dark:bg-[radial-gradient(circle_at_top,#1e293b_0%,#0f172a_35%,#020617_100%)] sm:px-6 sm:py-12">
      <div className="absolute -left-24 top-16 h-40 w-40 rounded-full bg-cyan-300/30 blur-3xl dark:bg-cyan-500/10" />
      <div className="absolute -right-16 bottom-10 h-56 w-56 rounded-full bg-indigo-300/40 blur-3xl dark:bg-indigo-500/10" />

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-8 sm:gap-12">
        <div className="flex w-full flex-col items-center justify-between gap-6 sm:flex-row sm:items-start">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/50 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            <span aria-hidden="true">←</span> Back
          </Link>
          <div className="text-center sm:text-left">
            <h1 className="text-center text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
              Select Difficulty
            </h1>
            <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400 sm:text-base">
              Choose your preferred challenge level to begin the quiz.
            </p>
          </div>
          <DarkModeToggle />
        </div>

        <div className="grid w-full gap-6 sm:grid-cols-3">
          {levels.map((level) => (
            <Link
              key={level.id}
              href={level.href}
              className={`group flex flex-col items-center rounded-3xl border bg-white/75 p-6 text-center shadow-xl backdrop-blur-xl transition-all duration-300 dark:bg-slate-900/80 sm:p-8 ${level.borderClass} ${level.hoverClass}`}
            >
              <div
                className={`mb-5 flex h-18 w-18 items-center justify-center rounded-2xl text-3xl transition-transform duration-300 group-hover:scale-110 sm:mb-6 sm:h-20 sm:w-20 sm:text-4xl ${level.bgClass}`}
              >
                {level.icon}
              </div>
              <h2
                className={`text-2xl font-bold transition-colors ${level.colorClass}`}
              >
                {level.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {level.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

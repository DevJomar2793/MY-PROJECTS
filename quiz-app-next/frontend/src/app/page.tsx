import Link from "next/link";
import DarkModeToggle from "./components/darkmodetoggle/darkmodetoggle";

export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#e0f2fe_0%,#eef4ff_35%,#ffffff_100%)] px-4 py-8 transition-colors dark:bg-[radial-gradient(circle_at_top,#1e293b_0%,#0f172a_35%,#020617_100%)] sm:px-6 sm:py-12">
      <div className="absolute -left-24 top-16 h-40 w-40 rounded-full bg-cyan-300/30 blur-3xl dark:bg-cyan-500/10" />
      <div className="absolute bottom-10 -right-16 h-56 w-56 rounded-full bg-indigo-300/40 blur-3xl dark:bg-indigo-500/10" />

      <section className="relative z-10 w-full max-w-5xl rounded-4xl border border-white/60 bg-white/75 p-5 shadow-[0_30px_80px_rgba(37,99,235,0.18)] backdrop-blur-xl transition-colors dark:border-slate-800/80 dark:bg-slate-900/80 dark:shadow-[0_30px_80px_rgba(2,6,23,0.55)] sm:rounded-4xl sm:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-200">
              Quick Quiz Challenge
            </div>

            <div className="space-y-4">
              <h1 className="max-w-xl text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
                Welcome to the Quiz App
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
                This Quiz Game is only for Fun and exploring my skills in making
                games.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/difficulty"
                className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-indigo-700"
              >
                Start Quiz
              </Link>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                10 questions • 25 seconds per question
              </p>
            </div>
          </div>

          <div className="flex w-full max-w-sm flex-col gap-5 rounded-[1.75rem] border border-slate-200/70 bg-white/85 p-5 shadow-xl transition-colors dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Theme
                </p>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Choose your mode
                </p>
              </div>
              <DarkModeToggle />
            </div>

            <div className="grid gap-3">
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Timed Rounds
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Every question gives you 25 seconds to answer.
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Instant Scoring
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Each correct answer earns 1 point in the final result.
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Retry Anytime
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Restart the quiz after finishing and try to improve your
                  score.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

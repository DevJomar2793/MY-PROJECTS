"use client";

import { useEffect, useState } from "react";

const INITIAL_SECONDS = 25;

type TimerProps = {
  buttonDisabled: boolean;
  buttonLabel: string;
  onNextQuestion: () => void;
  onTimeUp: () => void;
  paused?: boolean;
};

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

export default function Timer({
  buttonDisabled,
  buttonLabel,
  onNextQuestion,
  onTimeUp,
  paused = false,
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(INITIAL_SECONDS);

  useEffect(() => {
    if (paused) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((currentTime) => {
        if (currentTime <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return currentTime - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [paused]);

  useEffect(() => {
    if (!paused && timeLeft === 0) {
      onTimeUp();
    }
  }, [onTimeUp, paused, timeLeft]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-xl dark:bg-amber-500/20">
          ⏱
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Time Remaining
          </p>
          <p className="font-bold text-slate-800 dark:text-slate-100">
            {formatTime(timeLeft)}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onNextQuestion}
        disabled={buttonDisabled}
        className="w-full rounded-2xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:hover:bg-slate-300 dark:disabled:bg-slate-700 dark:disabled:text-slate-400 sm:w-auto"
      >
        {buttonLabel}
      </button>
    </div>
  );
}

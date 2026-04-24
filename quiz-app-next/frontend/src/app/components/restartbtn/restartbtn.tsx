"use client";

type RestartBtnProps = {
  onRestart: () => void;
};

export default function RestartBtn({ onRestart }: RestartBtnProps) {
  return (
    <button
      type="button"
      onClick={onRestart}
      className="rounded-2xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
    >
      Restart Quiz
    </button>
  );
}

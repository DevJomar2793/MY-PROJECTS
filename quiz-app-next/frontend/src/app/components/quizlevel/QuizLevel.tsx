"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DarkModeToggle from "../darkmodetoggle/darkmodetoggle";
import RestartBtn from "../restartbtn/restartbtn";
import Timer from "../timer/Timer";

const TIMEOUT_ANSWER = "__TIMEOUT__";

export type QuizQuestion = {
  question: string;
  difficulty: "Easy" | "Medium" | "Hard";
  points: number;
  options: string[];
  correctAnswer: string;
};

type QuizLevelProps = {
  heading: string;
  description: string;
  questions: QuizQuestion[];
};

export default function QuizLevel({
  heading,
  description,
  questions,
}: QuizLevelProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>(
    () => questions.map(() => null),
  );
  const [showResults, setShowResults] = useState(false);
  const [showTimeoutNotice, setShowTimeoutNotice] = useState(false);
  const [quizAttempt, setQuizAttempt] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const selectedAnswer = selectedAnswers[currentQuestionIndex];
  const score = selectedAnswers.filter(
    (answer, index) => answer === questions[index].correctAnswer,
  ).length;
  const incorrectAnswers = selectedAnswers.filter(
    (answer, index) =>
      answer !== null && answer !== questions[index].correctAnswer,
  ).length;

  useEffect(() => {
    if (!showTimeoutNotice) {
      return;
    }

    const timeoutNoticeTimer = window.setTimeout(() => {
      setShowTimeoutNotice(false);
    }, 5000);

    return () => window.clearTimeout(timeoutNoticeTimer);
  }, [showTimeoutNotice]);

  function handleNextQuestion() {
    if (!selectedAnswer) {
      return;
    }

    if (isLastQuestion) {
      setShowResults(true);
      return;
    }

    setCurrentQuestionIndex((currentIndex) => currentIndex + 1);
  }

  function handleAnswerSelect(answer: string) {
    setSelectedAnswers((currentAnswers) => {
      const nextAnswers = [...currentAnswers];
      nextAnswers[currentQuestionIndex] = answer;
      return nextAnswers;
    });
  }

  function handleTimeUp() {
    setSelectedAnswers((currentAnswers) => {
      if (currentAnswers[currentQuestionIndex] !== null) {
        return currentAnswers;
      }

      const nextAnswers = [...currentAnswers];
      nextAnswers[currentQuestionIndex] = TIMEOUT_ANSWER;
      return nextAnswers;
    });
    setShowTimeoutNotice(true);

    if (isLastQuestion) {
      setShowResults(true);
      return;
    }

    setCurrentQuestionIndex((currentIndex) => currentIndex + 1);
  }

  function handleRestartQuiz() {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(questions.map(() => null));
    setShowResults(false);
    setShowTimeoutNotice(false);
    setQuizAttempt((currentAttempt) => currentAttempt + 1);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-indigo-100 via-white to-cyan-100 p-6 transition-colors dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="w-full max-w-3xl space-y-6 rounded-3xl bg-white/90 p-8 shadow-2xl backdrop-blur transition-colors dark:bg-slate-900/90 dark:shadow-slate-950/40">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-indigo-600">Quiz App</p>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              {heading}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {description}
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <DarkModeToggle />
            <div className="text-left sm:text-right">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Question
              </p>
              <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {currentQuestionIndex + 1}/{questions.length}
              </p>
            </div>
          </div>
        </div>

        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="h-full rounded-full bg-indigo-600"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 transition-colors dark:border-slate-800 dark:bg-slate-950/60">
          <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
            {currentQuestion.difficulty} • {currentQuestion.points} Points
          </p>
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
            {currentQuestion.question}
          </h2>
        </div>

        <div className="grid gap-4">
          {currentQuestion.options.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleAnswerSelect(item)}
              className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                selectedAnswer === item
                  ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-500/15"
                  : "border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 dark:border-slate-700 dark:hover:border-indigo-400 dark:hover:bg-slate-800"
              }`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="font-medium text-slate-700 dark:text-slate-200">
                {item}
              </span>
            </button>
          ))}
        </div>

        <div className="border-t border-slate-100 pt-6 dark:border-slate-800">
          <Timer
            key={`${quizAttempt}-${currentQuestionIndex}`}
            buttonDisabled={!selectedAnswer}
            buttonLabel={isLastQuestion ? "Finish Quiz" : "Next Question"}
            onNextQuestion={handleNextQuestion}
            onTimeUp={handleTimeUp}
            paused={showResults}
          />
        </div>
      </div>

      {showResults ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-6">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl transition-colors dark:bg-slate-900">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Quiz Complete
            </h2>
            <p className="mt-4 text-lg font-semibold text-indigo-600">
              Total Score: {score}/{questions.length}
            </p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Incorrect Answers: {incorrectAnswers}
            </p>
            {score >= Math.ceil(questions.length * 0.8) ? (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                You passed the quiz!
              </p>
            ) : (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                You failed the quiz.
              </p>
            )}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Close App
              </button>
              <RestartBtn onRestart={handleRestartQuiz} />
            </div>
          </div>
        </div>
      ) : null}

      {showTimeoutNotice ? (
        <div className="fixed right-6 top-6 z-60 w-full max-w-sm rounded-3xl border border-amber-200 bg-white p-5 shadow-2xl transition-colors dark:border-amber-400/40 dark:bg-slate-900">
          <p className="text-sm font-semibold text-amber-600">Time Ran Out</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            You failed to answer the question in the given time.
          </p>
        </div>
      ) : null}
    </div>
  );
}

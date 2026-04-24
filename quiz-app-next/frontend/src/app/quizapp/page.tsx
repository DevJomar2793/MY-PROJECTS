"use client";

import { useEffect, useState } from "react";
import RestartBtn from "../components/restartbtn/restartbtn";
import Timer from "../components/timer/Timer";

const TIMEOUT_ANSWER = "__TIMEOUT__";

const questions = [
  {
    question: "What does HTML stand for?",
    difficulty: "Easy",
    points: 10,
    options: [
      "Hyper Text Markup Language",
      "High Transfer Machine Language",
      "Hyperlinks and Text Markup Language",
      "Home Tool Markup Language",
    ],
    correctAnswer: "Hyper Text Markup Language",
  },
  {
    question: "Which CSS property changes the text color of an element?",
    difficulty: "Easy",
    points: 10,
    options: ["font-style", "color", "background-color", "text-transform"],
    correctAnswer: "color",
  },
  {
    question: "Which HTML tag is used to create a hyperlink?",
    difficulty: "Easy",
    points: 10,
    options: ["<link>", "<a>", "<href>", "<nav>"],
    correctAnswer: "<a>",
  },
  {
    question: "Which JavaScript keyword declares a block-scoped variable?",
    difficulty: "Easy",
    points: 10,
    options: ["var", "const", "function", "import"],
    correctAnswer: "const",
  },
  {
    question:
      "What is the default HTTP method used when submitting a basic HTML form?",
    difficulty: "Medium",
    points: 15,
    options: ["PUT", "PATCH", "GET", "DELETE"],
    correctAnswer: "GET",
  },
  {
    question:
      "Which CSS layout module is best suited for arranging items in a single row or column?",
    difficulty: "Medium",
    points: 15,
    options: ["Grid", "Flexbox", "Float", "Position"],
    correctAnswer: "Flexbox",
  },
  {
    question: "Which React hook is commonly used to manage component state?",
    difficulty: "Easy",
    points: 10,
    options: ["useFetch", "useState", "useServer", "useClass"],
    correctAnswer: "useState",
  },
  {
    question:
      "Which JavaScript array method creates a new array with items transformed by a callback?",
    difficulty: "Medium",
    points: 15,
    options: ["forEach", "find", "map", "filter"],
    correctAnswer: "map",
  },
  {
    question:
      "Which semantic HTML element is intended for the main content of a page?",
    difficulty: "Easy",
    points: 10,
    options: ["<main>", "<section>", "<article>", "<aside>"],
    correctAnswer: "<main>",
  },
  {
    question: "What does API stand for?",
    difficulty: "Easy",
    points: 10,
    options: [
      "Application Programming Interface",
      "Applied Program Internet",
      "Automated Protocol Integration",
      "Advanced Programming Input",
    ],
    correctAnswer: "Application Programming Interface",
  },
];

export default function QuizApp() {
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
    <div className="min-h-screen bg-linear-to-br from-indigo-100 via-white to-cyan-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-600">Quiz App</p>
            <h1 className="text-3xl font-bold text-slate-800">
              Frontend Basics Challenge
            </h1>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Question</p>
            <p className="text-2xl font-bold text-slate-800">
              {currentQuestionIndex + 1}/{questions.length}
            </p>
          </div>
        </div>

        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full bg-indigo-600"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
          <p className="text-sm text-slate-500 mb-2">
            {currentQuestion.difficulty} • {currentQuestion.points} Points
          </p>
          <h2 className="text-2xl font-semibold text-slate-800">
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
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-slate-200 hover:border-indigo-500 hover:bg-indigo-50"
              }`}
            >
              <span className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="font-medium text-slate-700">{item}</span>
            </button>
          ))}
        </div>

        <div className="pt-6 border-t border-slate-100">
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
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-800">Quiz Complete</h2>
            <p className="mt-4 text-lg font-semibold text-indigo-600">
              Total Score: {score}/{questions.length}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Incorrect Answers: {incorrectAnswers}
            </p>
            {score >= 8 ? (
              <p className="mt-2 text-sm text-slate-500">
                You got Passed the Quiz
              </p>
            ) : (
              <p className="mt-2 text-sm text-slate-500">
                You got Failed the Quiz
              </p>
            )}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => setShowResults(false)}
                className="rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>
              <RestartBtn onRestart={handleRestartQuiz} />
            </div>
          </div>
        </div>
      ) : null}

      {showTimeoutNotice ? (
        <div className="fixed right-6 top-6 z-60 w-full max-w-sm rounded-3xl border border-amber-200 bg-white p-5 shadow-2xl">
          <p className="text-sm font-semibold text-amber-600">Time Ran Out</p>
          <p className="mt-2 text-sm text-slate-600">
            You failed to answer the question in the given time.
          </p>
        </div>
      ) : null}
    </div>
  );
}

import { type QuizQuestion } from "../app/components/quizlevel/QuizLevel";

export const easyQuestions: QuizQuestion[] = [
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
    question: "Which React hook is commonly used to manage component state?",
    difficulty: "Easy",
    points: 10,
    options: ["useFetch", "useState", "useServer", "useClass"],
    correctAnswer: "useState",
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

export const mediumQuestions: QuizQuestion[] = [
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
    question:
      "Which JavaScript array method creates a new array with items transformed by a callback?",
    difficulty: "Medium",
    points: 15,
    options: ["forEach", "find", "map", "filter"],
    correctAnswer: "map",
  },
  {
    question: "Which CSS property is used to create space inside an element?",
    difficulty: "Medium",
    points: 15,
    options: ["margin", "padding", "spacing", "border"],
    correctAnswer: "padding",
  },
  {
    question: "Which HTTP status code usually means a resource was not found?",
    difficulty: "Medium",
    points: 15,
    options: ["200", "301", "404", "500"],
    correctAnswer: "404",
  },
  {
    question: "Which React hook is used for side effects such as data fetching?",
    difficulty: "Medium",
    points: 15,
    options: ["useEffect", "useContext", "useId", "useRef"],
    correctAnswer: "useEffect",
  },
  {
    question:
      "Which JavaScript method converts a JSON string into a JavaScript object?",
    difficulty: "Medium",
    points: 15,
    options: [
      "JSON.stringify()",
      "JSON.parse()",
      "JSON.convert()",
      "JSON.toObject()",
    ],
    correctAnswer: "JSON.parse()",
  },
];

export const hardQuestions: QuizQuestion[] = [
  {
    question:
      "Which Next.js file-system feature is used to define routes from folders and files under the `app` directory?",
    difficulty: "Hard",
    points: 20,
    options: [
      "Route mapping",
      "File-based routing",
      "Dynamic templates",
      "App registry",
    ],
    correctAnswer: "File-based routing",
  },
  {
    question:
      "Which CSS value creates a new stacking context when used with the `position` property and a non-auto `z-index`?",
    difficulty: "Hard",
    points: 20,
    options: ["relative", "static", "inherit", "unset"],
    correctAnswer: "relative",
  },
  {
    question: "What will `typeof null` return in JavaScript?",
    difficulty: "Hard",
    points: 20,
    options: ["null", "undefined", "object", "boolean"],
    correctAnswer: "object",
  },
  {
    question:
      "Which browser API allows code to persist key-value pairs with no automatic expiration in the client?",
    difficulty: "Hard",
    points: 20,
    options: ["sessionStorage", "localStorage", "history", "navigator"],
    correctAnswer: "localStorage",
  },
  {
    question:
      "In React, why is using an array index as a list key often discouraged when items can be reordered?",
    difficulty: "Hard",
    points: 20,
    options: [
      "It increases CSS specificity",
      "It prevents component reuse and can cause state mismatches",
      "It disables event bubbling",
      "It forces server-side rendering",
    ],
    correctAnswer:
      "It prevents component reuse and can cause state mismatches",
  },
];

export const quizData = {
  easy: {
    heading: "Frontend Basics Challenge",
    description: "Answer each easy question before the 25-second timer runs out.",
    questions: easyQuestions,
  },
  medium: {
    heading: "Frontend Intermediate Challenge",
    description: "Tackle medium-level questions with the same timed quiz flow.",
    questions: mediumQuestions,
  },
  hard: {
    heading: "Frontend Expert Challenge",
    description: "Hard mode focuses on deeper frontend and React knowledge.",
    questions: hardQuestions,
  },
};

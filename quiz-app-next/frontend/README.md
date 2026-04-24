# Quick Quiz Challenge

A modern, responsive, and interactive Quiz Application built with Next.js, React, and Tailwind CSS. Test your knowledge across different difficulty levels with a sleek UI featuring dark mode support and timed questions!

## 🌟 Features

- **Multiple Difficulty Levels**: Choose from Easy, Medium, or Hard questions to challenge yourself.
- **Timed Questions**: Answer quickly! Each question has a countdown timer to keep you on your toes.
- **Dynamic Progress Tracking**: A visual progress bar keeps track of how far you are in the quiz.
- **Dark & Light Mode**: Seamlessly toggle between dark and light themes for optimal viewing anytime.
- **Instant Feedback & Results**: See your final score, incorrect answers, and pass/fail status at the end of the quiz.
- **Responsive Design**: Beautifully crafted layouts that work perfectly on mobile, tablet, and desktop.
- **Modern UI Aesthetics**: Utilizes Tailwind CSS for a premium look with glassmorphism, gradients, and micro-animations.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Library**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 🛠️ Getting Started

First, make sure you have Node.js installed on your machine.

1. Navigate to the project directory:
   ```bash
   cd quiz-app-next/frontend
   ```

2. Install the dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the app in action.

## 📂 Project Structure

- `src/app/page.tsx`: The main landing page.
- `src/app/components/`: Contains reusable UI components such as:
  - `Timer`: Handles countdown logic for questions.
  - `QuizLevel`: The core quiz layout displaying questions, progress, and results.
  - `DarkModeToggle`: Theme switching component.
  - `RestartBtn`: Action buttons.
- `src/lib/questions.ts`: Centralized data store for quiz questions and answers.

## 💡 About

This project was built for fun and to explore my skills in making interactive web games. Throughout the development process, I focused on:
- Managing complex React state (timers, user answers, current questions).
- Creating responsive and highly polished UIs with Tailwind CSS.
- Implementing dark mode leveraging CSS variables and Tailwind classes.
- Refining the user experience with animations and seamless layout transitions.

## 📝 License

This project is open-source and available for educational purposes. Feel free to fork and modify it as you see fit!

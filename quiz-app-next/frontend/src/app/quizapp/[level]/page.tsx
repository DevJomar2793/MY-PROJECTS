"use client";

import { useParams } from "next/navigation";
import QuizLevel from "../../components/quizlevel/QuizLevel";
import { quizData } from "../../../lib/questions";

export default function DynamicQuizPage() {
  const params = useParams();
  const level = (params?.level as string) || "easy";
  
  // Safe fallback if invalid level is provided
  const data = quizData[level as keyof typeof quizData] || quizData.easy;

  return (
    <QuizLevel
      heading={data.heading}
      description={data.description}
      questions={data.questions}
    />
  );
}

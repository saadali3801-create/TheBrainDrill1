/**
 * BrainDrill — QuizCard Component
 * The main quiz question card — full-viewport focus experience
 * Design: Void Interface — centered card, amber timer ring, staggered option entrance
 * Polish: Mobile-first, tactile button feedback, smooth reveal transitions
 */

import { useEffect, useRef, useState } from "react";
import { AnswerRecord, QuizPhase } from "@/hooks/useQuiz";
import { Question } from "@/lib/questions";
import CategoryBadge from "./CategoryBadge";
import TimerRing from "./TimerRing";

interface QuizCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  timeLeft: number;
  phase: QuizPhase;
  selectedIndex: number | null;
  lastAnswer: AnswerRecord | null;
  onSelect: (index: number) => void;
  onNext: () => void;
}

const OPTION_LABELS = ["A", "B", "C", "D"];

export default function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  timeLeft,
  phase,
  selectedIndex,
  lastAnswer,
  onSelect,
  onNext,
}: QuizCardProps) {
  const [animKey, setAnimKey] = useState(0);
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);
  const [revealVisible, setRevealVisible] = useState(false);
  const nextBtnRef = useRef<HTMLButtonElement>(null);

  // Re-trigger entrance animation on new question
  useEffect(() => {
    setAnimKey((k) => k + 1);
    setShakeIndex(null);
    setRevealVisible(false);
  }, [question.id]);

  // Trigger shake on wrong answer + show reveal
  useEffect(() => {
    if (phase === "revealed") {
      if (lastAnswer && !lastAnswer.correct && lastAnswer.selectedIndex !== null) {
        setShakeIndex(lastAnswer.selectedIndex);
        const t = setTimeout(() => setShakeIndex(null), 500);
        setTimeout(() => setRevealVisible(true), 100);
        return () => clearTimeout(t);
      }
      setTimeout(() => setRevealVisible(true), 100);
    }
  }, [phase, lastAnswer]);

  const isRevealed = phase === "revealed";
  const progressPercent = ((questionNumber - 1) / totalQuestions) * 100;
  const isLastQuestion = questionNumber === totalQuestions;

  function getOptionClass(index: number): string {
    const base =
      "answer-option w-full rounded-xl px-4 py-3.5 sm:px-5 sm:py-4 flex items-center gap-3 sm:gap-4 text-left opacity-0 fade-up";
    if (!isRevealed) return base;

    if (index === question.correctIndex) return `${base} correct-reveal`;
    if (index === selectedIndex && index !== question.correctIndex)
      return `${base} selected-wrong`;
    return `${base} dimmed`;
  }

  return (
    <div key={animKey} className="w-full max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="w-full h-0.5 bg-white/5 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${progressPercent}%`,
            background: "oklch(0.78 0.17 75)",
          }}
        />
      </div>

      {/* Header: category + timer */}
      <div className="flex items-center justify-between mb-5 fade-up">
        <CategoryBadge category={question.category} />
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/30 mono hidden sm:block">
            {questionNumber} of {totalQuestions}
          </span>
          <TimerRing timeLeft={timeLeft} totalTime={30} size={60} />
        </div>
      </div>

      {/* Question */}
      <div
        className="void-card p-5 sm:p-6 mb-4 fade-up delay-50"
        style={{ animationFillMode: "forwards" }}
      >
        <p className="text-lg sm:text-xl font-semibold leading-relaxed text-white/90">
          {question.question}
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2.5 mb-5">
        {question.options.map((option, i) => (
          <button
            key={i}
            className={`${getOptionClass(i)} ${shakeIndex === i ? "shake" : ""}`}
            style={{
              animationDelay: `${80 + i * 55}ms`,
              animationFillMode: "forwards",
            }}
            disabled={isRevealed}
            onClick={() => onSelect(i)}
          >
            {/* Option label */}
            <span
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold mono shrink-0 transition-all duration-200 ${
                isRevealed && i === question.correctIndex
                  ? "bg-[oklch(0.72_0.18_145/0.25)] text-[oklch(0.72_0.18_145)]"
                  : isRevealed && i === selectedIndex
                  ? "bg-[oklch(0.65_0.22_25/0.25)] text-[oklch(0.65_0.22_25)]"
                  : "bg-white/6 text-white/40"
              }`}
            >
              {OPTION_LABELS[i]}
            </span>

            {/* Option text */}
            <span className="font-medium text-sm sm:text-base leading-snug flex-1">
              {option}
            </span>

            {/* Result icon */}
            {isRevealed && i === question.correctIndex && (
              <span className="ml-auto text-[oklch(0.72_0.18_145)] shrink-0">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="9" fill="oklch(0.72 0.18 145 / 0.2)" />
                  <path d="M5 9l3 3 5-5" stroke="oklch(0.72 0.18 145)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            )}
            {isRevealed && i === selectedIndex && i !== question.correctIndex && (
              <span className="ml-auto text-[oklch(0.65_0.22_25)] shrink-0">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="9" fill="oklch(0.65 0.22 25 / 0.2)" />
                  <path d="M6 6l6 6M12 6l-6 6" stroke="oklch(0.65 0.22 25)" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Explanation (revealed state) */}
      {isRevealed && revealVisible && (
        <div
          className="void-card p-4 sm:p-5 mb-4 fade-up"
          style={{
            borderColor: "oklch(0.78 0.17 75 / 0.15)",
            animationFillMode: "forwards",
          }}
        >
          <div className="flex items-start gap-3">
            <span className="text-lg mt-0.5 shrink-0">💡</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                {lastAnswer?.timeExpired && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[oklch(0.18_0.08_25/0.2)] text-[oklch(0.65_0.22_25)]">
                    Time expired
                  </span>
                )}
                {lastAnswer && !lastAnswer.correct && !lastAnswer.timeExpired && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[oklch(0.18_0.08_25/0.2)] text-[oklch(0.65_0.22_25)]">
                    Incorrect
                  </span>
                )}
                {lastAnswer?.correct && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[oklch(0.20_0.08_145/0.2)] text-[oklch(0.72_0.18_145)]">
                    Correct!
                  </span>
                )}
              </div>
              <p className="text-white/65 text-sm leading-relaxed">
                {question.explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Next button */}
      {isRevealed && revealVisible && (
        <button
          ref={nextBtnRef}
          className="btn-amber w-full py-4 rounded-xl text-base font-semibold fade-up delay-100"
          style={{ animationFillMode: "forwards" }}
          onClick={onNext}
        >
          {isLastQuestion ? "See Results →" : "Next Question →"}
        </button>
      )}
    </div>
  );
}

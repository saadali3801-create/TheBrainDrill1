/**
 * BrainDrill — Quiz Game State Hook
 * Design: Void Interface — amber accent, deep charcoal, full-viewport focus
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { getSessionQuestions, Question } from "@/lib/questions";
import { saveSessionResult, SessionResult } from "@/lib/storage";

export type QuizPhase =
  | "idle"
  | "question"
  | "revealed"
  | "finished";

export interface AnswerRecord {
  question: Question;
  selectedIndex: number | null; // null = timed out
  correct: boolean;
  timeExpired: boolean;
}

export interface QuizState {
  phase: QuizPhase;
  questions: Question[];
  currentIndex: number;
  timeLeft: number;
  answers: AnswerRecord[];
  selectedIndex: number | null;
  sessionResult: SessionResult | null;
}

const QUESTION_TIME = 30;

export function useQuiz() {
  const [state, setState] = useState<QuizState>({
    phase: "idle",
    questions: [],
    currentIndex: 0,
    timeLeft: QUESTION_TIME,
    answers: [],
    selectedIndex: null,
    sessionResult: null,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const revealAnswer = useCallback(
    (selectedIndex: number | null, timeExpired: boolean) => {
      clearTimer();
      setState((prev) => {
        const question = prev.questions[prev.currentIndex];
        const correct =
          selectedIndex !== null &&
          selectedIndex === question.correctIndex;
        const record: AnswerRecord = {
          question,
          selectedIndex,
          correct,
          timeExpired,
        };
        return {
          ...prev,
          phase: "revealed",
          selectedIndex,
          answers: [...prev.answers, record],
        };
      });
    },
    [clearTimer]
  );

  const startTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.phase !== "question") {
          clearTimer();
          return prev;
        }
        if (prev.timeLeft <= 1) {
          clearTimer();
          // Time expired — will trigger reveal via effect
          return { ...prev, timeLeft: 0 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
  }, [clearTimer]);

  // Watch for time expiry
  useEffect(() => {
    if (state.phase === "question" && state.timeLeft === 0) {
      revealAnswer(null, true);
    }
  }, [state.phase, state.timeLeft, revealAnswer]);

  const startSession = useCallback(() => {
    clearTimer();
    const questions = getSessionQuestions();
    setState({
      phase: "question",
      questions,
      currentIndex: 0,
      timeLeft: QUESTION_TIME,
      answers: [],
      selectedIndex: null,
      sessionResult: null,
    });
  }, [clearTimer]);

  // Start timer when phase becomes "question"
  useEffect(() => {
    if (state.phase === "question") {
      startTimer();
    }
    return () => {
      if (state.phase !== "question") clearTimer();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, state.currentIndex]);

  const selectAnswer = useCallback(
    (index: number) => {
      if (state.phase !== "question") return;
      revealAnswer(index, false);
    },
    [state.phase, revealAnswer]
  );

  const nextQuestion = useCallback(() => {
    setState((prev) => {
      const nextIndex = prev.currentIndex + 1;
      if (nextIndex >= prev.questions.length) {
        // Session complete
        const categoryScores: Record<
          string,
          { correct: number; total: number }
        > = {};
        for (const ans of prev.answers) {
          const cat = ans.question.category;
          if (!categoryScores[cat]) categoryScores[cat] = { correct: 0, total: 0 };
          categoryScores[cat].total += 1;
          if (ans.correct) categoryScores[cat].correct += 1;
        }
        const score = prev.answers.filter((a) => a.correct).length;
        const result: SessionResult = {
          date: new Date().toISOString().split("T")[0],
          score,
          total: prev.questions.length,
          categoryScores,
        };
        saveSessionResult(result);
        return {
          ...prev,
          phase: "finished",
          sessionResult: result,
        };
      }
      return {
        ...prev,
        phase: "question",
        currentIndex: nextIndex,
        timeLeft: QUESTION_TIME,
        selectedIndex: null,
      };
    });
  }, []);

  const resetSession = useCallback(() => {
    clearTimer();
    setState({
      phase: "idle",
      questions: [],
      currentIndex: 0,
      timeLeft: QUESTION_TIME,
      answers: [],
      selectedIndex: null,
      sessionResult: null,
    });
  }, [clearTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    state,
    startSession,
    selectAnswer,
    nextQuestion,
    resetSession,
  };
}

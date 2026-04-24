/**
 * BrainDrill — Quiz Game State Hook (with adaptive difficulty)
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ensureProfile,
  getCategoryPerformance,
  getDifficultyMap,
  getSeenQuestionIds,
  recordSeenQuestions,
  saveSessionPerformance,
} from "@/lib/adaptive";
import {
  getAdaptiveSessionQuestions,
  getSessionQuestions,
  type Category,
  type Difficulty,
  type Question,
} from "@/lib/questions";
import { saveSessionResult, type SessionResult } from "@/lib/storage";

export type QuizPhase = "idle" | "question" | "revealed" | "finished";

export interface AnswerRecord {
  question: Question;
  selectedIndex: number | null;
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
  currentDifficulty: Difficulty;
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
    currentDifficulty: 1,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionNumberRef = useRef<number>(0);

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

  const startSession = useCallback(async () => {
    clearTimer();

    let questions: Question[];
    let dominantDiff: Difficulty = 1;

    try {
      const [perfs, seenIds, profile] = await Promise.all([
        getCategoryPerformance(),
        getSeenQuestionIds(),
        ensureProfile(),
      ]);

      sessionNumberRef.current = profile.total_sessions + 1;
      const diffMap = getDifficultyMap(perfs);
      questions = getAdaptiveSessionQuestions(diffMap, seenIds);

      const diffs = Object.values(diffMap) as Difficulty[];
      const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
      dominantDiff = Math.min(3, Math.max(1, Math.round(avg))) as Difficulty;

      recordSeenQuestions(
        questions.map((q) => ({
          id: q.id,
          category: q.category as Category,
          difficulty: q.difficulty as Difficulty,
        }))
      ).catch(() => {});
    } catch {
      questions = getSessionQuestions();
      sessionNumberRef.current += 1;
    }

    setState({
      phase: "question",
      questions,
      currentIndex: 0,
      timeLeft: QUESTION_TIME,
      answers: [],
      selectedIndex: null,
      sessionResult: null,
      currentDifficulty: dominantDiff,
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
        const categoryScores: Record<
          string,
          { correct: number; total: number }
        > = {};
        for (const ans of prev.answers) {
          const cat = ans.question.category;
          if (!categoryScores[cat])
            categoryScores[cat] = { correct: 0, total: 0 };
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

        const answerData = prev.answers.map((a) => ({
          category: a.question.category as Category,
          correct: a.correct,
        }));
        saveSessionPerformance(answerData, sessionNumberRef.current).catch(
          () => {}
        );

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
      currentDifficulty: 1,
    });
  }, [clearTimer]);

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

/**
 * BrainDrill — ResultsView Component
 * End-of-session results with score, category breakdown, and share option
 * Design: Void Interface — massive score number, category performance bars
 * Polish: Mobile-first, smooth bar animations, tactile buttons
 */

import { useEffect, useState } from "react";
import { SessionResult } from "@/lib/storage";
import { CATEGORY_ICONS, CATEGORY_LABELS, Category } from "@/lib/questions";
import { loadStorage } from "@/lib/storage";
import {
  BRAIN_TYPE_ICONS,
  BRAIN_TYPE_LABELS,
  type BrainType,
} from "@/lib/adaptive";
import StreakBadge from "./StreakBadge";

interface ResultsViewProps {
  result: SessionResult;
  brainType?: BrainType | null;
  difficulty?: number;
  onRetry: () => void;
}

const CATEGORY_BAR_COLORS: Record<Category, string> = {
  logical_reasoning: "oklch(0.72 0.18 145)",
  number_sequences: "oklch(0.72 0.20 260)",
  verbal_analogies: "oklch(0.78 0.17 75)",
  pattern_recognition: "oklch(0.70 0.22 310)",
};

const DIFF_LABELS: Record<number, string> = {
  1: "Starter",
  2: "Challenge",
  3: "Expert",
};

const DIFF_COLORS: Record<number, string> = {
  1: "oklch(0.72 0.18 145)",
  2: "oklch(0.78 0.17 75)",
  3: "oklch(0.65 0.22 25)",
};

function getScoreMessage(
  score: number,
  total: number
): { title: string; sub: string } {
  const pct = score / total;
  if (pct === 1)
    return { title: "Perfect Score!", sub: "Your mind is razor-sharp today." };
  if (pct >= 0.8)
    return {
      title: "Excellent!",
      sub: "Your brain is firing on all cylinders.",
    };
  if (pct >= 0.6)
    return { title: "Good Work", sub: "Solid performance. Keep drilling." };
  if (pct >= 0.4)
    return { title: "Keep Going", sub: "Every session makes you sharper." };
  return {
    title: "Keep Drilling",
    sub: "The mind grows stronger with practice.",
  };
}

export default function ResultsView({
  result,
  brainType,
  difficulty = 1,
  onRetry,
}: ResultsViewProps) {
  const storage = loadStorage();
  const { title, sub } = getScoreMessage(result.score, result.total);
  const percentage = Math.round((result.score / result.total) * 100);
  const [barsVisible, setBarsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBarsVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  const categories = Object.entries(result.categoryScores) as [
    Category,
    { correct: number; total: number }
  ][];

  const sorted = [...categories].sort(
    (a, b) => b[1].correct / b[1].total - a[1].correct / a[1].total
  );

  function handleShare() {
    const diffLabel = DIFF_LABELS[difficulty] ?? "Starter";
    const brainLabel = brainType ? ` · ${BRAIN_TYPE_LABELS[brainType]}` : "";
    const text = `BrainDrill Daily Score: ${result.score}/${result.total} (${percentage}%) · ${diffLabel}${brainLabel}\nStreak: ${storage.streak} days\nTrain your brain at BrainDrill!`;
    if (navigator.share) {
      navigator.share({ title: "My BrainDrill Score", text }).catch(() => {});
    } else {
      navigator.clipboard
        .writeText(text)
        .then(() => alert("Score copied to clipboard!"))
        .catch(() => {});
    }
  }

  const diffColor = DIFF_COLORS[difficulty] ?? DIFF_COLORS[1];
  const diffLabel = DIFF_LABELS[difficulty] ?? "Starter";

  return (
    <div className="w-full max-w-2xl mx-auto fade-up">
      {/* Score hero */}
      <div className="text-center mb-8">
        <div className="mb-3 flex items-end justify-center gap-1">
          <span
            className="mono font-bold leading-none"
            style={{
              fontSize: "clamp(72px, 18vw, 112px)",
              background:
                "linear-gradient(135deg, oklch(0.84 0.17 75), oklch(0.68 0.20 55))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {result.score}
          </span>
          <span
            className="mono font-light text-white/25 pb-2"
            style={{ fontSize: "clamp(36px, 9vw, 60px)" }}
          >
            /{result.total}
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
          {title}
        </h2>
        <p className="text-white/40 text-sm">{sub}</p>

        {/* Streak + Brain Type row */}
        <div className="flex items-center justify-center gap-2.5 mt-4 flex-wrap">
          <StreakBadge streak={storage.streak} />
          {brainType && (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium"
              style={{
                color: "oklch(0.78 0.17 75)",
                borderColor: "oklch(0.78 0.17 75 / 0.30)",
                background: "oklch(0.78 0.17 75 / 0.08)",
              }}
            >
              <span>{BRAIN_TYPE_ICONS[brainType]}</span>
              {BRAIN_TYPE_LABELS[brainType]}
            </span>
          )}
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold mono"
            style={{
              color: diffColor,
              borderColor: diffColor.replace(")", " / 0.30)"),
              background: diffColor.replace(")", " / 0.08)"),
            }}
          >
            {diffLabel} Level
          </span>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="void-card p-5 sm:p-6 mb-4">
        <h3 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-5">
          Category Breakdown
        </h3>
        <div className="flex flex-col gap-5">
          {sorted.map(([cat, scores], i) => {
            const pct =
              scores.total > 0 ? (scores.correct / scores.total) * 100 : 0;
            const isStrong = pct >= 67;
            const isWeak = pct < 50;
            const color = CATEGORY_BAR_COLORS[cat];
            return (
              <div key={cat}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base">{CATEGORY_ICONS[cat]}</span>
                    <span className="text-sm font-medium text-white/75">
                      {CATEGORY_LABELS[cat]}
                    </span>
                    {isStrong && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[oklch(0.20_0.08_145/0.15)] text-[oklch(0.72_0.18_145)] border border-[oklch(0.72_0.18_145/0.25)]">
                        Strong
                      </span>
                    )}
                    {isWeak && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[oklch(0.18_0.08_25/0.15)] text-[oklch(0.65_0.22_25)] border border-[oklch(0.65_0.22_25/0.25)]">
                        Needs work
                      </span>
                    )}
                  </div>
                  <span className="mono text-sm font-semibold text-white/50 shrink-0 ml-2">
                    {scores.correct}/{scores.total}
                  </span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: barsVisible ? `${pct}%` : "0%",
                      background: color,
                      transition: `width 0.7s cubic-bezier(0.4, 0, 0.2, 1) ${200 + i * 100}ms`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Accuracy", value: `${percentage}%`, mono: true },
          {
            label: "Streak",
            value: `${storage.streak}`,
            suffix: "🔥",
            mono: true,
          },
          { label: "Sessions", value: `${storage.totalSessions}`, mono: true },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="void-card p-3 sm:p-4 text-center opacity-0 fade-up"
            style={{
              animationDelay: `${300 + i * 60}ms`,
              animationFillMode: "forwards",
            }}
          >
            <div
              className={`text-lg sm:text-xl font-bold text-white mb-1 ${stat.mono ? "mono" : ""}`}
            >
              {stat.value}
              {stat.suffix && <span className="ml-1">{stat.suffix}</span>}
            </div>
            <div className="text-xs text-white/30 uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Difficulty progress hint */}
      {percentage >= 80 && difficulty < 3 && (
        <div
          className="void-card p-4 mb-4 flex items-center gap-3 opacity-0 fade-up"
          style={{
            animationDelay: "360ms",
            animationFillMode: "forwards",
            borderColor: "oklch(0.72 0.18 145 / 0.2)",
          }}
        >
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "oklch(0.72 0.18 145 / 0.15)", color: "oklch(0.72 0.18 145)" }}
          >
            ↑
          </span>
          <p className="text-sm text-white/55 leading-snug">
            Strong session! Keep performing well to unlock{" "}
            <span style={{ color: DIFF_COLORS[difficulty + 1] }}>
              {DIFF_LABELS[difficulty + 1]}
            </span>{" "}
            difficulty.
          </p>
        </div>
      )}
      {percentage < 50 && difficulty > 1 && (
        <div
          className="void-card p-4 mb-4 flex items-center gap-3 opacity-0 fade-up"
          style={{
            animationDelay: "360ms",
            animationFillMode: "forwards",
            borderColor: "oklch(0.65 0.22 25 / 0.2)",
          }}
        >
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "oklch(0.65 0.22 25 / 0.15)", color: "oklch(0.65 0.22 25)" }}
          >
            ↓
          </span>
          <p className="text-sm text-white/55 leading-snug">
            Tough session. Keep drilling — the difficulty adjusts to help you grow.
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div
        className="flex gap-3 opacity-0 fade-up"
        style={{ animationDelay: "420ms", animationFillMode: "forwards" }}
      >
        <button
          className="btn-amber flex-1 py-4 rounded-xl text-base font-semibold"
          onClick={onRetry}
        >
          Train Again
        </button>
        <button
          className="btn-ghost px-5 sm:px-7 py-4 rounded-xl text-base font-semibold flex items-center gap-2"
          onClick={handleShare}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 10.5a2.5 2.5 0 1 0 0 2.5M12 5.5a2.5 2.5 0 1 0 0-2.5M4 8a2.5 2.5 0 1 0-2.5 0M12 5.5L4 8m8 2.5L4 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          Share
        </button>
      </div>
    </div>
  );
}

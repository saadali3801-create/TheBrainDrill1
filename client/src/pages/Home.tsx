/**
 * BrainDrill — Home Page
 * Design: Void Interface — radical negative space, amber urgency, full-viewport cognitive focus
 * Typography: Sora (body) + JetBrains Mono (numerals)
 * Colors: Deep blue-black void + amber accent
 *
 * Sections:
 * 1. Hero — brain image, tagline, start CTA, streak display
 * 2. Quiz session (inline, replaces hero)
 * 3. Results (inline, replaces quiz)
 * 4. Footer with Suggestions + Contact buttons
 */

import { useState } from "react";
import { useQuiz } from "@/hooks/useQuiz";
import { getCurrentStreak } from "@/lib/storage";
import QuizCard from "@/components/QuizCard";
import ResultsView from "@/components/ResultsView";
import StreakBadge from "@/components/StreakBadge";
import ContactModal from "@/components/ContactModal";
import { CATEGORY_ICONS, CATEGORY_LABELS } from "@/lib/questions";

const HERO_BG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663593493284/8an2RBkVX79yqFfMEH63y2/braindrill-hero-bg-LjvCVtQNH2JLfWKoHarMm2.webp";
const LOGO_ICON =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663593493284/8an2RBkVX79yqFfMEH63y2/braindrill-logo-icon-mCTu6UunULNNSmnRMYRxF4.webp";

const CATEGORIES = [
  { key: "logical_reasoning" as const, color: "oklch(0.72 0.18 145)" },
  { key: "number_sequences" as const, color: "oklch(0.72 0.20 260)" },
  { key: "verbal_analogies" as const, color: "oklch(0.78 0.17 75)" },
  { key: "pattern_recognition" as const, color: "oklch(0.70 0.22 310)" },
];

export default function Home() {
  const { state, startSession, selectAnswer, nextQuestion, resetSession } = useQuiz();
  const [modalMode, setModalMode] = useState<"contact" | "suggestion" | null>(null);
  const streak = getCurrentStreak();

  const isIdle = state.phase === "idle";
  const isFinished = state.phase === "finished";
  const isActive = state.phase === "question" || state.phase === "revealed";

  const lastAnswer =
    state.answers.length > 0 ? state.answers[state.answers.length - 1] : null;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.10 0.008 265)" }}
    >
      {/* ── Top Nav ──────────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl"
        style={{ background: "oklch(0.10 0.008 265 / 88%)" }}
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            onClick={isActive || isFinished ? resetSession : undefined}
          >
            <img
              src={LOGO_ICON}
              alt="BrainDrill"
              className="w-7 h-7 object-contain"
            />
            <span className="font-bold text-white tracking-tight text-lg">
              Brain
              <span style={{ color: "oklch(0.78 0.17 75)" }}>Drill</span>
            </span>
          </button>

          <div className="flex items-center gap-2">
            <StreakBadge streak={streak} />
            {isActive && (
              <button
                className="btn-ghost text-xs px-3 py-1.5 rounded-lg ml-1"
                onClick={resetSession}
              >
                Quit
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ── Main Content ─────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 py-8 sm:py-10">
        <div className="w-full max-w-2xl">

          {/* ── IDLE: Hero ──────────────────────────────────────────── */}
          {isIdle && (
            <div className="fade-up">
              {/* Hero image */}
              <div
                className="relative w-full rounded-2xl overflow-hidden mb-8"
                style={{ aspectRatio: "16/7" }}
              >
                <img
                  src={HERO_BG}
                  alt="Neural network brain visualization"
                  className="w-full h-full object-cover"
                  style={{ filter: "brightness(0.65)" }}
                />
                {/* Gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to bottom, oklch(0.10 0.008 265 / 0%) 20%, oklch(0.10 0.008 265 / 95%) 100%)",
                  }}
                />
                {/* Text overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.2em] mb-2"
                    style={{ color: "oklch(0.78 0.17 75)" }}
                  >
                    Daily Brain Training
                  </p>
                  <h1 className="text-2xl sm:text-4xl font-bold text-white leading-tight">
                    Sharpen your mind,
                    <br />
                    <span style={{ color: "oklch(0.78 0.17 75)" }}>
                      one drill at a time.
                    </span>
                  </h1>
                </div>
              </div>

              {/* Description */}
              <p className="text-white/45 text-sm sm:text-base leading-relaxed mb-7 text-center">
                10 questions · 4 categories · 30 seconds each.
                <br />
                No accounts. No distractions. Just your brain.
              </p>

              {/* Category pills */}
              <div className="flex flex-wrap gap-2 justify-center mb-7">
                {CATEGORIES.map((cat) => (
                  <span
                    key={cat.key}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border"
                    style={{
                      color: cat.color,
                      borderColor: cat.color.replace(")", " / 0.25)").replace("oklch(", "oklch("),
                      background: cat.color.replace(")", " / 0.08)").replace("oklch(", "oklch("),
                    }}
                  >
                    <span>{CATEGORY_ICONS[cat.key]}</span>
                    {CATEGORY_LABELS[cat.key]}
                  </span>
                ))}
              </div>

              {/* Start CTA */}
              <button
                className="btn-amber w-full py-5 rounded-2xl text-lg font-bold amber-pulse mb-3"
                onClick={startSession}
              >
                Start Today's Drill →
              </button>

              {/* Streak callout */}
              {streak > 0 ? (
                <p className="text-center text-white/35 text-sm mb-10">
                  You're on a{" "}
                  <span
                    className="font-semibold"
                    style={{ color: "oklch(0.78 0.17 75)" }}
                  >
                    {streak}-day streak
                  </span>
                  . Keep it going!
                </p>
              ) : (
                <p className="text-center text-white/25 text-sm mb-10">
                  Complete a session to start your streak 🔥
                </p>
              )}

              {/* How it works */}
              <div className="void-card p-5 sm:p-6">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-white/25 mb-5">
                  How it works
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      icon: "🎯",
                      title: "10 Questions",
                      desc: "Randomized from 60+ questions across 4 brain categories.",
                    },
                    {
                      icon: "⏱",
                      title: "30 Seconds Each",
                      desc: "Answer before time runs out or it counts as wrong.",
                    },
                    {
                      icon: "📊",
                      title: "Track Progress",
                      desc: "See your strong and weak areas after every session.",
                    },
                    {
                      icon: "🔥",
                      title: "Daily Streak",
                      desc: "Practice every day to build and maintain your streak.",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-xl mt-0.5 shrink-0">{item.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-white/75 mb-0.5">
                          {item.title}
                        </p>
                        <p className="text-xs text-white/35 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ACTIVE: Quiz ─────────────────────────────────────────── */}
          {isActive && (
            <QuizCard
              key={state.currentIndex}
              question={state.questions[state.currentIndex]}
              questionNumber={state.currentIndex + 1}
              totalQuestions={state.questions.length}
              timeLeft={state.timeLeft}
              phase={state.phase}
              selectedIndex={state.selectedIndex}
              lastAnswer={lastAnswer}
              onSelect={selectAnswer}
              onNext={nextQuestion}
            />
          )}

          {/* ── FINISHED: Results ────────────────────────────────────── */}
          {isFinished && state.sessionResult && (
            <ResultsView
              result={state.sessionResult}
              onRetry={() => {
                resetSession();
                setTimeout(startSession, 50);
              }}
            />
          )}
        </div>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-5 px-4">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/20 text-xs order-2 sm:order-1">
            © {new Date().getFullYear()} BrainDrill · Train daily, think sharper.
          </p>
          <div className="flex items-center gap-2 order-1 sm:order-2">
            <button
              className="btn-ghost text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 hover:text-[oklch(0.78_0.17_75)]"
              onClick={() => setModalMode("suggestion")}
            >
              <span>💬</span>
              <span>Suggestions</span>
            </button>
            <div className="w-px h-4 bg-white/10" />
            <button
              className="btn-ghost text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 hover:text-[oklch(0.78_0.17_75)]"
              onClick={() => setModalMode("contact")}
            >
              <span>✉️</span>
              <span>Contact</span>
            </button>
          </div>
        </div>
      </footer>

      {/* ── Modals ───────────────────────────────────────────────────── */}
      <ContactModal
        open={modalMode !== null}
        onClose={() => setModalMode(null)}
        mode={modalMode ?? "contact"}
      />
    </div>
  );
}

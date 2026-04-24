/**
 * BrainDrill — Home Page
 * Design: Void Interface — radical negative space, amber urgency, full-viewport cognitive focus
 * Typography: Sora (body) + JetBrains Mono (numerals)
 * Colors: Deep blue-black void + amber accent
 */

import { useEffect, useState } from "react";
import { useQuiz } from "@/hooks/useQuiz";
import { getCurrentStreak } from "@/lib/storage";
import QuizCard from "@/components/QuizCard";
import ResultsView from "@/components/ResultsView";
import StreakBadge from "@/components/StreakBadge";
import ContactModal from "@/components/ContactModal";
import OnboardingFlow from "@/components/OnboardingFlow";
import {
  ensureProfile,
  BRAIN_TYPE_ICONS,
  BRAIN_TYPE_LABELS,
  getProgressiveComplexity,
  type BrainType,
  type UserProfile,
} from "@/lib/adaptive";
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

export default function Home() {
  const { state, startSession, selectAnswer, nextQuestion, resetSession } = useQuiz();
  const [modalMode, setModalMode] = useState<"contact" | "suggestion" | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const streak = getCurrentStreak();

  const isIdle = state.phase === "idle";
  const isFinished = state.phase === "finished";
  const isActive = state.phase === "question" || state.phase === "revealed";

  const lastAnswer =
    state.answers.length > 0 ? state.answers[state.answers.length - 1] : null;

  useEffect(() => {
    ensureProfile()
      .then((p) => {
        setProfile(p);
        if (!p.onboarding_completed) {
          setShowOnboarding(true);
        }
        setProfileLoaded(true);
      })
      .catch(() => {
        setProfileLoaded(true);
      });
  }, []);

  function handleOnboardingComplete(brainType: BrainType) {
    setProfile((prev) =>
      prev
        ? { ...prev, brain_type: brainType, onboarding_completed: true }
        : {
            device_id: "",
            brain_type: brainType,
            onboarding_completed: true,
            total_sessions: 0,
          }
    );
    setShowOnboarding(false);
  }

  // Show onboarding before anything else (once profile is loaded)
  if (profileLoaded && showOnboarding) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ background: "oklch(0.10 0.008 265)" }}
      >
        <nav
          className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl"
          style={{ background: "oklch(0.10 0.008 265 / 88%)" }}
        >
          <div className="max-w-2xl mx-auto px-4 sm:px-6 h-14 flex items-center">
            <div className="flex items-center gap-2.5">
              <img src={LOGO_ICON} alt="BrainDrill" className="w-7 h-7 object-contain" />
              <span className="font-bold text-white tracking-tight text-lg">
                Brain<span style={{ color: "oklch(0.78 0.17 75)" }}>Drill</span>
              </span>
            </div>
          </div>
        </nav>
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  const brainType = profile?.brain_type ?? null;
  const diffLevel = state.currentDifficulty ?? 1;

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
            {/* Brain type badge in nav */}
            {brainType && !isActive && (
              <span
                className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border"
                style={{
                  color: "oklch(0.78 0.17 75)",
                  borderColor: "oklch(0.78 0.17 75 / 0.25)",
                  background: "oklch(0.78 0.17 75 / 0.08)",
                }}
              >
                <span>{BRAIN_TYPE_ICONS[brainType]}</span>
                {BRAIN_TYPE_LABELS[brainType]}
              </span>
            )}
            {/* Difficulty badge during quiz */}
            {isActive && (
              <span
                className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border mono"
                style={{
                  color: DIFF_COLORS[diffLevel],
                  borderColor: `${DIFF_COLORS[diffLevel].replace(")", " / 0.3)")}`,
                  background: `${DIFF_COLORS[diffLevel].replace(")", " / 0.08)")}`,
                }}
              >
                {DIFF_LABELS[diffLevel]}
              </span>
            )}
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
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to bottom, oklch(0.10 0.008 265 / 0%) 20%, oklch(0.10 0.008 265 / 95%) 100%)",
                  }}
                />
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

              {/* Brain Type card — shown if onboarded */}
              {brainType && (
                <div
                  className="void-card p-4 mb-6"
                  style={{ borderColor: "oklch(0.78 0.17 75 / 0.15)" }}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shrink-0"
                      style={{
                        background: "oklch(0.78 0.17 75 / 0.12)",
                        border: "1px solid oklch(0.78 0.17 75 / 0.25)",
                        color: "oklch(0.78 0.17 75)",
                      }}
                    >
                      {BRAIN_TYPE_ICONS[brainType]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/30 uppercase tracking-wider mb-0.5">
                        Your Brain Type
                      </p>
                      <p className="text-sm font-semibold text-white">
                        {BRAIN_TYPE_LABELS[brainType]}
                      </p>
                    </div>
                    {profile && profile.total_sessions > 0 && (
                      <div className="shrink-0 text-right">
                        <p className="mono text-lg font-bold text-white/70">
                          {profile.total_sessions}
                        </p>
                        <p className="text-xs text-white/25 uppercase tracking-wide">
                          Sessions
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Progressive Tier Progress */}
                  {profile && (() => {
                    const { sessionTier, tierProgress } = getProgressiveComplexity(profile.total_sessions);
                    const tierLabels = {
                      beginner: "Beginner",
                      intermediate: "Intermediate", 
                      advanced: "Advanced",
                      expert: "Expert"
                    };
                    const tierColors = {
                      beginner: "oklch(0.72 0.18 145)",
                      intermediate: "oklch(0.72 0.20 260)",
                      advanced: "oklch(0.78 0.17 75)",
                      expert: "oklch(0.65 0.22 25)"
                    };
                    const nextTier = {
                      beginner: "Intermediate",
                      intermediate: "Advanced",
                      advanced: "Expert",
                      expert: null
                    };
                    
                    return (
                      <div className="pt-3 border-t border-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <span 
                            className="text-xs font-semibold uppercase tracking-wide"
                            style={{ color: tierColors[sessionTier] }}
                          >
                            {tierLabels[sessionTier]} Tier
                          </span>
                          {nextTier[sessionTier] && (
                            <span className="text-xs text-white/30">
                              {tierProgress}% to {nextTier[sessionTier]}
                            </span>
                          )}
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${tierProgress}%`,
                              background: tierColors[sessionTier]
                            }}
                          />
                        </div>
                        <p className="text-xs text-white/25 mt-2">
                          {sessionTier === "expert" 
                            ? "You've mastered all tiers. Questions scale to your expertise."
                            : "Complete more sessions to unlock harder challenges."
                          }
                        </p>
                      </div>
                    );
                  })()}
                </div>
              )}

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
                  Complete a session to start your streak
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
                      title: "Adaptive Difficulty",
                      desc: "Questions get harder as you improve. The app learns you.",
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
              brainType={brainType}
              difficulty={diffLevel}
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

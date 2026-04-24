/**
 * BrainDrill — Personality Onboarding Flow
 * 6-step questionnaire that assigns a Brain Type.
 * Design: Void Interface — full-screen step transitions, amber accent, dark premium feel.
 */

import { useState } from "react";
import {
  assignBrainType,
  BRAIN_TYPE_DESCRIPTIONS,
  BRAIN_TYPE_ICONS,
  BRAIN_TYPE_LABELS,
  saveOnboarding,
  type BrainType,
  type OnboardingAnswers,
} from "@/lib/adaptive";

interface OnboardingFlowProps {
  onComplete: (brainType: BrainType) => void;
}

interface Step {
  key: keyof OnboardingAnswers;
  question: string;
  subtitle?: string;
  options: Array<{ value: string; label: string; emoji: string }>;
}

const STEPS: Step[] = [
  {
    key: "thinking_style",
    question: "How does your mind naturally work?",
    subtitle: "There's no wrong answer — this shapes your experience.",
    options: [
      { value: "logical", label: "Step-by-step logic", emoji: "⚙" },
      { value: "creative", label: "Lateral and creative", emoji: "✦" },
      { value: "systematic", label: "Structured systems", emoji: "▦" },
      { value: "intuitive", label: "Pattern and instinct", emoji: "◎" },
    ],
  },
  {
    key: "strength",
    question: "What's your sharpest mental skill?",
    subtitle: "The category you find easiest.",
    options: [
      { value: "numbers", label: "Numbers & math", emoji: "∑" },
      { value: "words", label: "Words & language", emoji: "∆" },
      { value: "patterns", label: "Visual patterns", emoji: "◈" },
      { value: "logic", label: "Deductive reasoning", emoji: "♟" },
    ],
  },
  {
    key: "challenge",
    question: "What challenges you most?",
    subtitle: "Where you want to grow.",
    options: [
      { value: "numbers", label: "Number puzzles", emoji: "∑" },
      { value: "verbal", label: "Verbal analogies", emoji: "∆" },
      { value: "patterns", label: "Pattern sequences", emoji: "◈" },
      { value: "logic", label: "Logic deduction", emoji: "♟" },
    ],
  },
  {
    key: "motivation",
    question: "What drives you to train your brain?",
    options: [
      { value: "compete", label: "Beat my own records", emoji: "◉" },
      { value: "learn", label: "Learn something new", emoji: "∞" },
      { value: "improve", label: "Sharpen weak spots", emoji: "▲" },
      { value: "enjoy", label: "Pure mental enjoyment", emoji: "✦" },
    ],
  },
  {
    key: "pace",
    question: "How do you prefer to think?",
    options: [
      { value: "fast", label: "Quick instinct — first answer wins", emoji: "→" },
      { value: "steady", label: "Balanced — think then commit", emoji: "◯" },
      { value: "thorough", label: "Careful — I double-check everything", emoji: "≡" },
    ],
  },
  {
    key: "goal",
    question: "What's your #1 goal with BrainDrill?",
    options: [
      { value: "sharpen_logic", label: "Sharpen logical thinking", emoji: "♟" },
      { value: "master_numbers", label: "Master numbers", emoji: "∑" },
      { value: "expand_vocab", label: "Expand vocabulary & analogies", emoji: "∆" },
      { value: "see_patterns", label: "See patterns faster", emoji: "◈" },
      { value: "all_around", label: "All-around brain fitness", emoji: "◎" },
    ],
  },
];

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<OnboardingAnswers>>({});
  const [brainType, setBrainType] = useState<BrainType | null>(null);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const totalSteps = STEPS.length;
  const isReveal = step === totalSteps;
  const currentStep = STEPS[step];

  function handleSelect(value: string) {
    setSelected(value);
  }

  function handleNext() {
    if (!selected) return;
    const key = currentStep.key;
    const newAnswers = { ...answers, [key]: selected };
    setAnswers(newAnswers);
    setSelected(null);

    if (step + 1 === totalSteps) {
      const type = assignBrainType(newAnswers as OnboardingAnswers);
      setBrainType(type);
      setStep(step + 1);
    } else {
      setStep(step + 1);
    }
  }

  async function handleConfirm() {
    if (!brainType) return;
    setSaving(true);
    try {
      await saveOnboarding(answers as Record<string, string>, brainType);
    } catch {}
    setSaving(false);
    onComplete(brainType);
  }

  const progress = isReveal ? 100 : (step / totalSteps) * 100;

  // Brain Type Reveal screen
  if (isReveal && brainType) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 fade-up">
        <div className="w-full max-w-md">
          {/* Progress bar */}
          <div className="w-full h-0.5 bg-white/5 rounded-full mb-10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: "100%", background: "oklch(0.78 0.17 75)" }}
            />
          </div>

          <div className="text-center mb-10">
            <div
              className="text-6xl mb-5 mx-auto w-20 h-20 rounded-2xl flex items-center justify-center font-bold"
              style={{
                background: "oklch(0.78 0.17 75 / 0.12)",
                border: "1px solid oklch(0.78 0.17 75 / 0.25)",
                color: "oklch(0.78 0.17 75)",
                fontSize: "2rem",
              }}
            >
              {BRAIN_TYPE_ICONS[brainType]}
            </div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.2em] mb-2"
              style={{ color: "oklch(0.78 0.17 75)" }}
            >
              Your Brain Type
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              {BRAIN_TYPE_LABELS[brainType]}
            </h2>
            <p className="text-white/50 text-base leading-relaxed">
              {BRAIN_TYPE_DESCRIPTIONS[brainType]}
            </p>
          </div>

          <div
            className="void-card p-5 mb-7"
            style={{ borderColor: "oklch(0.78 0.17 75 / 0.15)" }}
          >
            <h3 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-4">
              What this means for you
            </h3>
            <div className="space-y-3">
              {[
                "Questions are tuned to your natural strengths",
                "Difficulty adapts as you improve in each category",
                "Your weakest areas get extra attention over time",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5"
                    style={{ background: "oklch(0.78 0.17 75 / 0.15)", color: "oklch(0.78 0.17 75)" }}
                  >
                    ✓
                  </span>
                  <span className="text-sm text-white/60 leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            className="btn-amber w-full py-4 rounded-xl text-base font-semibold"
            onClick={handleConfirm}
            disabled={saving}
          >
            {saving ? "Setting up your profile…" : "Start My First Drill →"}
          </button>
        </div>
      </div>
    );
  }

  // Question steps
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md fade-up" key={step}>
        {/* Progress */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-0.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: "oklch(0.78 0.17 75)",
              }}
            />
          </div>
          <span className="text-xs text-white/25 mono shrink-0">
            {step + 1}/{totalSteps}
          </span>
        </div>

        {/* Header */}
        <div className="mb-7">
          <p
            className="text-xs font-semibold uppercase tracking-[0.2em] mb-2"
            style={{ color: "oklch(0.78 0.17 75)" }}
          >
            Brain Profile
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug mb-2">
            {currentStep.question}
          </h2>
          {currentStep.subtitle && (
            <p className="text-white/35 text-sm">{currentStep.subtitle}</p>
          )}
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2.5 mb-7">
          {currentStep.options.map((opt) => {
            const isSelected = selected === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className="w-full rounded-xl px-4 py-3.5 flex items-center gap-3.5 text-left transition-all duration-200"
                style={{
                  background: isSelected
                    ? "oklch(0.78 0.17 75 / 0.12)"
                    : "oklch(0.14 0.008 265)",
                  border: isSelected
                    ? "1px solid oklch(0.78 0.17 75 / 0.5)"
                    : "1px solid oklch(1 0 0 / 8%)",
                  color: isSelected ? "oklch(0.95 0.005 65)" : "oklch(0.80 0.005 65)",
                  transform: isSelected ? "translateX(4px)" : "none",
                }}
              >
                <span
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0 font-bold"
                  style={{
                    background: isSelected
                      ? "oklch(0.78 0.17 75 / 0.18)"
                      : "oklch(1 0 0 / 5%)",
                    color: isSelected ? "oklch(0.78 0.17 75)" : "oklch(0.50 0.008 265)",
                  }}
                >
                  {opt.emoji}
                </span>
                <span className="font-medium text-sm sm:text-base leading-snug">
                  {opt.label}
                </span>
                {isSelected && (
                  <span
                    className="ml-auto shrink-0 text-sm"
                    style={{ color: "oklch(0.78 0.17 75)" }}
                  >
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Next button */}
        <button
          className="btn-amber w-full py-4 rounded-xl text-base font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={handleNext}
          disabled={!selected}
          style={!selected ? { background: "oklch(0.78 0.17 75 / 0.4)" } : {}}
        >
          {step + 1 === totalSteps ? "See My Brain Type →" : "Continue →"}
        </button>
      </div>
    </div>
  );
}

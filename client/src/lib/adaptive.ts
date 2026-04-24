/**
 * BrainDrill Adaptive Difficulty Engine
 *
 * Tracks per-category performance and adjusts difficulty levels.
 * Uses Supabase for persistence, with localStorage as a fallback/cache.
 *
 * Difficulty rules:
 * - Promote: 3+ consecutive correct answers at current level → level up
 * - Demote: 3+ consecutive wrong answers at current level → level down
 * - Session complexity also scales with total_sessions count
 */

import { nanoid } from "nanoid";
import { supabase } from "./supabase";
import type { Category, Difficulty } from "./questions";

export type BrainType =
  | "strategist"
  | "pattern_hunter"
  | "wordsmith"
  | "calculator"
  | "explorer"
  | "analyst";

export const BRAIN_TYPE_LABELS: Record<BrainType, string> = {
  strategist: "The Strategist",
  pattern_hunter: "The Pattern Hunter",
  wordsmith: "The Wordsmith",
  calculator: "The Calculator",
  explorer: "The Explorer",
  analyst: "The Analyst",
};

export const BRAIN_TYPE_DESCRIPTIONS: Record<BrainType, string> = {
  strategist:
    "You think several moves ahead. Logic and deduction are your weapons.",
  pattern_hunter:
    "You see order in chaos. Sequences and visual patterns are your domain.",
  wordsmith:
    "Language is your tool. Analogies, nuance, and meaning come naturally.",
  calculator:
    "Numbers speak to you. Mathematical structures reveal themselves instantly.",
  explorer:
    "You thrive on variety. Wide curiosity across all domains keeps you sharp.",
  analyst:
    "You break problems apart. Systematic reasoning brings clarity every time.",
};

export const BRAIN_TYPE_ICONS: Record<BrainType, string> = {
  strategist: "♟",
  pattern_hunter: "◈",
  wordsmith: "✦",
  calculator: "∑",
  explorer: "◎",
  analyst: "⊕",
};

export interface CategoryPerf {
  category: Category;
  difficulty_level: Difficulty;
  correct_count: number;
  total_count: number;
  consecutive_correct: number;
  consecutive_wrong: number;
}

export interface UserProfile {
  device_id: string;
  brain_type: BrainType | null;
  onboarding_completed: boolean;
  total_sessions: number;
}

const DEVICE_ID_KEY = "braindrill_device_id";
const PROFILE_CACHE_KEY = "braindrill_profile_cache";
const PERF_CACHE_KEY = "braindrill_perf_cache";
const SEEN_IDS_KEY = "braindrill_seen_ids";

export function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = nanoid(21);
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

// ── Profile ────────────────────────────────────────────────────────────────

export async function ensureProfile(): Promise<UserProfile> {
  const deviceId = getDeviceId();

  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("device_id", deviceId)
    .maybeSingle();

  if (error) {
    return getCachedProfile(deviceId);
  }

  if (!data) {
    const newProfile: UserProfile = {
      device_id: deviceId,
      brain_type: null,
      onboarding_completed: false,
      total_sessions: 0,
    };
    await supabase.from("user_profiles").insert(newProfile);
    cacheProfile(newProfile);
    return newProfile;
  }

  const profile: UserProfile = {
    device_id: data.device_id,
    brain_type: data.brain_type as BrainType | null,
    onboarding_completed: data.onboarding_completed,
    total_sessions: data.total_sessions,
  };
  cacheProfile(profile);
  return profile;
}

function getCachedProfile(deviceId: string): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_CACHE_KEY);
    if (raw) return JSON.parse(raw) as UserProfile;
  } catch {}
  return {
    device_id: deviceId,
    brain_type: null,
    onboarding_completed: false,
    total_sessions: 0,
  };
}

function cacheProfile(profile: UserProfile) {
  try {
    localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profile));
  } catch {}
}

export async function saveOnboarding(
  answers: Record<string, string>,
  brainType: BrainType
): Promise<void> {
  const deviceId = getDeviceId();

  const rows = Object.entries(answers).map(([question_key, answer_value]) => ({
    device_id: deviceId,
    question_key,
    answer_value,
  }));

  await supabase.from("onboarding_answers").insert(rows);
  await supabase
    .from("user_profiles")
    .update({ brain_type: brainType, onboarding_completed: true })
    .eq("device_id", deviceId);

  const cached = getCachedProfile(deviceId);
  cacheProfile({ ...cached, brain_type: brainType, onboarding_completed: true });
}

// ── Category Performance ───────────────────────────────────────────────────

const DEFAULT_PERFS: CategoryPerf[] = (
  [
    "logical_reasoning",
    "number_sequences",
    "verbal_analogies",
    "pattern_recognition",
  ] as Category[]
).map((category) => ({
  category,
  difficulty_level: 1 as Difficulty,
  correct_count: 0,
  total_count: 0,
  consecutive_correct: 0,
  consecutive_wrong: 0,
}));

export async function getCategoryPerformance(): Promise<CategoryPerf[]> {
  const deviceId = getDeviceId();

  const { data, error } = await supabase
    .from("category_performance")
    .select("*")
    .eq("device_id", deviceId);

  if (error || !data || data.length === 0) {
    return getCachedPerf();
  }

  const perfs: CategoryPerf[] = (
    [
      "logical_reasoning",
      "number_sequences",
      "verbal_analogies",
      "pattern_recognition",
    ] as Category[]
  ).map((cat) => {
    const row = data.find((r) => r.category === cat);
    if (!row) {
      return DEFAULT_PERFS.find((d) => d.category === cat)!;
    }
    return {
      category: row.category as Category,
      difficulty_level: row.difficulty_level as Difficulty,
      correct_count: row.correct_count,
      total_count: row.total_count,
      consecutive_correct: row.consecutive_correct,
      consecutive_wrong: row.consecutive_wrong,
    };
  });

  cachePerf(perfs);
  return perfs;
}

function getCachedPerf(): CategoryPerf[] {
  try {
    const raw = localStorage.getItem(PERF_CACHE_KEY);
    if (raw) return JSON.parse(raw) as CategoryPerf[];
  } catch {}
  return DEFAULT_PERFS;
}

function cachePerf(perfs: CategoryPerf[]) {
  try {
    localStorage.setItem(PERF_CACHE_KEY, JSON.stringify(perfs));
  } catch {}
}

export function getDifficultyMap(
  perfs: CategoryPerf[]
): Record<Category, Difficulty> {
  const map: Record<Category, Difficulty> = {
    logical_reasoning: 1,
    number_sequences: 1,
    verbal_analogies: 1,
    pattern_recognition: 1,
  };
  for (const p of perfs) {
    map[p.category] = p.difficulty_level;
  }
  return map;
}

/**
 * Update performance after a session answer.
 * Returns the new difficulty level for the category (may have changed).
 */
export function computeNewPerf(
  current: CategoryPerf,
  correct: boolean
): CategoryPerf {
  const consCorrect = correct ? current.consecutive_correct + 1 : 0;
  const consWrong = !correct ? current.consecutive_wrong + 1 : 0;
  let newDiff = current.difficulty_level;

  // Promote after 3 consecutive correct
  if (consCorrect >= 3 && newDiff < 3) {
    newDiff = (newDiff + 1) as Difficulty;
  }
  // Demote after 3 consecutive wrong
  if (consWrong >= 3 && newDiff > 1) {
    newDiff = (newDiff - 1) as Difficulty;
  }

  return {
    ...current,
    correct_count: current.correct_count + (correct ? 1 : 0),
    total_count: current.total_count + 1,
    consecutive_correct: consCorrect >= 3 ? 0 : consCorrect,
    consecutive_wrong: consWrong >= 3 ? 0 : consWrong,
    difficulty_level: newDiff,
  };
}

export async function saveSessionPerformance(
  answers: Array<{ category: Category; correct: boolean }>,
  sessionNumber: number
): Promise<void> {
  const deviceId = getDeviceId();
  const perfs = await getCategoryPerformance();

  const perfMap: Record<string, CategoryPerf> = {};
  for (const p of perfs) {
    perfMap[p.category] = { ...p };
  }

  for (const ans of answers) {
    const current = perfMap[ans.category] ?? DEFAULT_PERFS.find(d => d.category === ans.category)!;
    perfMap[ans.category] = computeNewPerf(current, ans.correct);
  }

  const updatedPerfs = Object.values(perfMap);
  cachePerf(updatedPerfs);

  // Upsert each category performance row
  for (const p of updatedPerfs) {
    await supabase.from("category_performance").upsert(
      {
        device_id: deviceId,
        category: p.category,
        difficulty_level: p.difficulty_level,
        correct_count: p.correct_count,
        total_count: p.total_count,
        consecutive_correct: p.consecutive_correct,
        consecutive_wrong: p.consecutive_wrong,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "device_id,category" }
    );
  }

  // Update total sessions
  await supabase
    .from("user_profiles")
    .update({ total_sessions: sessionNumber, updated_at: new Date().toISOString() })
    .eq("device_id", deviceId);

  // Update local cache
  const cached = getCachedProfile(deviceId);
  cacheProfile({ ...cached, total_sessions: sessionNumber });
}

// ── Question History ───────────────────────────────────────────────────────

export async function getSeenQuestionIds(): Promise<Set<string>> {
  const deviceId = getDeviceId();

  // Check local cache first for speed
  const local = getLocalSeenIds();

  const { data, error } = await supabase
    .from("question_history")
    .select("question_id")
    .eq("device_id", deviceId);

  if (error || !data) return local;

  const remoteIds = new Set(data.map((r) => r.question_id));
  // Merge local + remote
  for (const id of local) remoteIds.add(id);

  saveLocalSeenIds(remoteIds);
  return remoteIds;
}

export async function recordSeenQuestions(
  questions: Array<{ id: string; category: Category; difficulty: Difficulty }>
): Promise<void> {
  const deviceId = getDeviceId();

  // Update local cache immediately
  const local = getLocalSeenIds();
  for (const q of questions) local.add(q.id);
  saveLocalSeenIds(local);

  const rows = questions.map((q) => ({
    device_id: deviceId,
    question_id: q.id,
    category: q.category,
    difficulty_level: q.difficulty,
    seen_at: new Date().toISOString(),
  }));

  await supabase
    .from("question_history")
    .upsert(rows, { onConflict: "device_id,question_id" });
}

export async function resetSeenQuestionsForCategory(
  category: Category
): Promise<void> {
  const deviceId = getDeviceId();

  await supabase
    .from("question_history")
    .delete()
    .eq("device_id", deviceId)
    .eq("category", category);

  // Clear local cache for this category too
  const local = getLocalSeenIds();
  const { data } = await supabase
    .from("question_history")
    .select("question_id")
    .eq("device_id", deviceId);

  const remaining = new Set(data?.map((r) => r.question_id) ?? []);
  saveLocalSeenIds(remaining);
}

function getLocalSeenIds(): Set<string> {
  try {
    const raw = localStorage.getItem(SEEN_IDS_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch {}
  return new Set();
}

function saveLocalSeenIds(ids: Set<string>) {
  try {
    localStorage.setItem(SEEN_IDS_KEY, JSON.stringify([...ids]));
  } catch {}
}

// ── Brain Type Assignment ──────────────────────────────────────────────────

export interface OnboardingAnswers {
  thinking_style: string;
  motivation: string;
  pace: string;
  strength: string;
  challenge: string;
  goal: string;
}

export function assignBrainType(answers: OnboardingAnswers): BrainType {
  const scores: Record<BrainType, number> = {
    strategist: 0,
    pattern_hunter: 0,
    wordsmith: 0,
    calculator: 0,
    explorer: 0,
    analyst: 0,
  };

  // thinking_style scoring
  const ts = answers.thinking_style;
  if (ts === "logical") { scores.strategist += 2; scores.analyst += 2; }
  if (ts === "creative") { scores.explorer += 2; scores.wordsmith += 1; }
  if (ts === "systematic") { scores.analyst += 2; scores.calculator += 2; }
  if (ts === "intuitive") { scores.pattern_hunter += 2; scores.explorer += 1; }

  // motivation scoring
  const mo = answers.motivation;
  if (mo === "compete") { scores.strategist += 2; scores.calculator += 1; }
  if (mo === "learn") { scores.analyst += 2; scores.explorer += 2; }
  if (mo === "improve") { scores.strategist += 1; scores.analyst += 1; }
  if (mo === "enjoy") { scores.wordsmith += 2; scores.explorer += 2; }

  // strength scoring
  const st = answers.strength;
  if (st === "numbers") { scores.calculator += 3; scores.pattern_hunter += 1; }
  if (st === "words") { scores.wordsmith += 3; }
  if (st === "patterns") { scores.pattern_hunter += 3; }
  if (st === "logic") { scores.strategist += 2; scores.analyst += 2; }

  // challenge scoring
  const ch = answers.challenge;
  if (ch === "verbal") { scores.wordsmith -= 1; scores.calculator += 1; }
  if (ch === "numbers") { scores.calculator -= 1; scores.wordsmith += 1; }
  if (ch === "patterns") { scores.pattern_hunter -= 1; scores.analyst += 1; }
  if (ch === "logic") { scores.strategist -= 1; scores.explorer += 1; }

  // pace scoring
  const pa = answers.pace;
  if (pa === "fast") { scores.strategist += 1; scores.calculator += 1; }
  if (pa === "steady") { scores.analyst += 1; scores.wordsmith += 1; }
  if (pa === "thorough") { scores.analyst += 2; }

  // goal scoring
  const go = answers.goal;
  if (go === "sharpen_logic") { scores.strategist += 2; scores.analyst += 1; }
  if (go === "master_numbers") { scores.calculator += 3; }
  if (go === "expand_vocab") { scores.wordsmith += 3; }
  if (go === "see_patterns") { scores.pattern_hunter += 3; }
  if (go === "all_around") { scores.explorer += 3; }

  const sorted = (Object.entries(scores) as [BrainType, number][]).sort(
    (a, b) => b[1] - a[1]
  );
  return sorted[0][0];
}

/**
 * Returns category weight multipliers based on brain type.
 * Higher weight = more questions from that category in sessions.
 */
export function getBrainTypeCategoryWeights(
  brainType: BrainType | null
): Record<Category, number> {
  const defaults: Record<Category, number> = {
    logical_reasoning: 1,
    number_sequences: 1,
    verbal_analogies: 1,
    pattern_recognition: 1,
  };

  if (!brainType) return defaults;

  const weights: Record<BrainType, Record<Category, number>> = {
    strategist: {
      logical_reasoning: 1.5,
      number_sequences: 1,
      verbal_analogies: 1,
      pattern_recognition: 1,
    },
    pattern_hunter: {
      logical_reasoning: 1,
      number_sequences: 1,
      verbal_analogies: 0.8,
      pattern_recognition: 1.5,
    },
    wordsmith: {
      logical_reasoning: 1,
      number_sequences: 0.8,
      verbal_analogies: 1.5,
      pattern_recognition: 1,
    },
    calculator: {
      logical_reasoning: 1,
      number_sequences: 1.5,
      verbal_analogies: 0.8,
      pattern_recognition: 1,
    },
    explorer: {
      logical_reasoning: 1,
      number_sequences: 1,
      verbal_analogies: 1,
      pattern_recognition: 1,
    },
    analyst: {
      logical_reasoning: 1.5,
      number_sequences: 1,
      verbal_analogies: 1,
      pattern_recognition: 1.2,
    },
  };

  return weights[brainType];
}

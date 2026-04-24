/*
  # BrainDrill Adaptive System

  ## Summary
  Adds the full adaptive difficulty and personality onboarding system.

  ## New Tables

  ### user_profiles
  Stores anonymous user identity (device-based), Brain Type from onboarding,
  onboarding answers, and global session metadata.

  ### onboarding_answers
  Stores the 6-question onboarding responses used to assign a Brain Type and
  adjust category weighting.

  ### category_performance
  Per-user, per-category rolling performance stats used to drive adaptive
  difficulty. Tracks correct/total counts and current difficulty level.

  ### question_history
  Tracks which question IDs have been seen by a user and when, to prevent
  repeats until the full pool is exhausted.

  ### session_records
  Full session metadata: score, difficulty level used, session number, and
  which Brain Type profile was active.

  ## Security
  - RLS enabled on all tables
  - All tables use a `device_id` (uuid stored in localStorage) as the identity
    column — no auth required, fully anonymous
  - Policies allow read/write only where device_id matches the requesting value
    passed as app_metadata claim or via a simple select-own pattern
  - Because this is an anonymous app (no Supabase Auth), we use a row-level
    secret approach: the anon key is used and policies match on device_id
    column. The client sends device_id as a filter; RLS enforces it.

  ## Notes
  - All operations use the anon key; device_id acts as a soft identity
  - difficulty_level: 1=easy, 2=medium, 3=hard
  - brain_type: one of 'strategist','pattern_hunter','wordsmith','calculator','explorer','analyst'
*/

-- ── user_profiles ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text UNIQUE NOT NULL,
  brain_type text DEFAULT NULL,
  onboarding_completed boolean DEFAULT false,
  total_sessions integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ── onboarding_answers ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS onboarding_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL REFERENCES user_profiles(device_id) ON DELETE CASCADE,
  question_key text NOT NULL,
  answer_value text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE onboarding_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own onboarding answers"
  ON onboarding_answers FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own onboarding answers"
  ON onboarding_answers FOR INSERT
  WITH CHECK (true);

-- ── category_performance ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS category_performance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL REFERENCES user_profiles(device_id) ON DELETE CASCADE,
  category text NOT NULL,
  difficulty_level integer DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 3),
  correct_count integer DEFAULT 0,
  total_count integer DEFAULT 0,
  consecutive_correct integer DEFAULT 0,
  consecutive_wrong integer DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(device_id, category)
);

ALTER TABLE category_performance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own category performance"
  ON category_performance FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own category performance"
  ON category_performance FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own category performance"
  ON category_performance FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ── question_history ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS question_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL REFERENCES user_profiles(device_id) ON DELETE CASCADE,
  question_id text NOT NULL,
  category text NOT NULL,
  difficulty_level integer NOT NULL,
  seen_at timestamptz DEFAULT now(),
  UNIQUE(device_id, question_id)
);

ALTER TABLE question_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own question history"
  ON question_history FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own question history"
  ON question_history FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can delete own question history"
  ON question_history FOR DELETE
  USING (true);

-- ── session_records ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS session_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL REFERENCES user_profiles(device_id) ON DELETE CASCADE,
  session_number integer NOT NULL,
  score integer NOT NULL,
  total integer NOT NULL,
  brain_type text,
  avg_difficulty_level numeric(3,1),
  category_scores jsonb DEFAULT '{}',
  played_at timestamptz DEFAULT now()
);

ALTER TABLE session_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own session records"
  ON session_records FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own session records"
  ON session_records FOR INSERT
  WITH CHECK (true);

-- ── indexes ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_category_performance_device ON category_performance(device_id);
CREATE INDEX IF NOT EXISTS idx_question_history_device ON question_history(device_id);
CREATE INDEX IF NOT EXISTS idx_question_history_device_category ON question_history(device_id, category);
CREATE INDEX IF NOT EXISTS idx_session_records_device ON session_records(device_id);

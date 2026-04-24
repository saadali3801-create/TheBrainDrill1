/**
 * BrainDrill Question Bank
 * Each question has a difficulty field: 1=easy, 2=medium, 3=hard
 * Questions are tagged by category and difficulty to power adaptive selection.
 */

export type Category =
  | "logical_reasoning"
  | "number_sequences"
  | "verbal_analogies"
  | "pattern_recognition";

export type Difficulty = 1 | 2 | 3;

export interface Question {
  id: string;
  category: Category;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  logical_reasoning: "Logical Reasoning",
  number_sequences: "Number Sequences",
  verbal_analogies: "Verbal Analogies",
  pattern_recognition: "Pattern Recognition",
};

export const CATEGORY_ICONS: Record<Category, string> = {
  logical_reasoning: "🧠",
  number_sequences: "🔢",
  verbal_analogies: "🔤",
  pattern_recognition: "🔷",
};

export const CATEGORY_COLORS: Record<Category, string> = {
  logical_reasoning: "oklch(0.72 0.18 145)",
  number_sequences: "oklch(0.72 0.20 260)",
  verbal_analogies: "oklch(0.78 0.17 75)",
  pattern_recognition: "oklch(0.70 0.22 310)",
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  1: "Starter",
  2: "Challenge",
  3: "Expert",
};

const questionBank: Question[] = [
  // ── LOGICAL REASONING — EASY ─────────────────────────────────────────────
  {
    id: "lr01",
    category: "logical_reasoning",
    difficulty: 1,
    question: "All roses are flowers. Some flowers fade quickly. Therefore:",
    options: [
      "All roses fade quickly",
      "Some roses may fade quickly",
      "No roses fade quickly",
      "All flowers are roses",
    ],
    correctIndex: 1,
    explanation:
      "Since only 'some' flowers fade quickly, we can only conclude that some roses may fall in that group — not all and not none.",
  },
  {
    id: "lr02",
    category: "logical_reasoning",
    difficulty: 1,
    question:
      "Alice is taller than Bob. Bob is taller than Carol. Who is the shortest?",
    options: ["Alice", "Bob", "Carol", "Cannot be determined"],
    correctIndex: 2,
    explanation:
      "By transitivity: Alice > Bob > Carol. Carol is the shortest.",
  },
  {
    id: "lr03",
    category: "logical_reasoning",
    difficulty: 1,
    question:
      "No mammals are cold-blooded. All whales are mammals. Therefore:",
    options: [
      "Some whales are cold-blooded",
      "Whales are not mammals",
      "No whales are cold-blooded",
      "All cold-blooded animals are whales",
    ],
    correctIndex: 2,
    explanation:
      "Since no mammals are cold-blooded and all whales are mammals, it follows that no whales are cold-blooded.",
  },
  {
    id: "lr04",
    category: "logical_reasoning",
    difficulty: 1,
    question:
      "In a race, Tom finishes before Sam but after Lisa. Who finishes second?",
    options: ["Tom", "Sam", "Lisa", "Cannot be determined"],
    correctIndex: 0,
    explanation: "Order: Lisa → Tom → Sam. Tom finishes second.",
  },
  {
    id: "lr05",
    category: "logical_reasoning",
    difficulty: 1,
    question:
      "Every student who studies passes. Maria did not pass. What can we conclude?",
    options: [
      "Maria studied",
      "Maria did not study",
      "Maria is not a student",
      "All students pass",
    ],
    correctIndex: 1,
    explanation:
      "By contrapositive: if a student did not pass, they did not study.",
  },
  // ── LOGICAL REASONING — MEDIUM ───────────────────────────────────────────
  {
    id: "lr06",
    category: "logical_reasoning",
    difficulty: 2,
    question:
      "If it rains, the ground gets wet. The ground is wet. Which conclusion is valid?",
    options: [
      "It must have rained",
      "It did not rain",
      "It may or may not have rained",
      "The ground is always wet",
    ],
    correctIndex: 2,
    explanation:
      "Wet ground doesn't confirm rain — other causes exist. This is the logical fallacy of 'affirming the consequent.'",
  },
  {
    id: "lr07",
    category: "logical_reasoning",
    difficulty: 2,
    question:
      "A bat and a ball cost $1.10 together. The bat costs $1 more than the ball. How much does the ball cost?",
    options: ["$0.10", "$0.05", "$0.15", "$0.20"],
    correctIndex: 1,
    explanation:
      "Let ball = x. Then bat = x + 1. So 2x + 1 = 1.10 → x = $0.05.",
  },
  {
    id: "lr08",
    category: "logical_reasoning",
    difficulty: 2,
    question:
      "Some doctors are teachers. All teachers are graduates. Which must be true?",
    options: [
      "All doctors are graduates",
      "Some doctors are graduates",
      "No doctors are graduates",
      "All graduates are doctors",
    ],
    correctIndex: 1,
    explanation:
      "The doctors who are also teachers are definitely graduates. So at least some doctors are graduates.",
  },
  {
    id: "lr09",
    category: "logical_reasoning",
    difficulty: 2,
    question:
      "Five people sit in a row. Anna is to the left of Ben. Ben is to the left of Carl. Dana is to the right of Carl. Who sits in the middle?",
    options: ["Anna", "Ben", "Carl", "Dana"],
    correctIndex: 2,
    explanation:
      "Order: Anna → Ben → Carl → Dana. With 5 seats Carl is third — the middle position.",
  },
  {
    id: "lr10",
    category: "logical_reasoning",
    difficulty: 2,
    question:
      "If all Bloops are Razzles and all Razzles are Lazzles, are all Bloops definitely Lazzles?",
    options: [
      "Yes",
      "No",
      "Only some Bloops",
      "Cannot be determined",
    ],
    correctIndex: 0,
    explanation:
      "By syllogism: Bloops ⊆ Razzles ⊆ Lazzles. Therefore all Bloops are Lazzles.",
  },
  // ── LOGICAL REASONING — HARD ─────────────────────────────────────────────
  {
    id: "lr11",
    category: "logical_reasoning",
    difficulty: 3,
    question:
      "A clock shows 3:15. What is the angle between the hour and minute hands?",
    options: ["0°", "7.5°", "15°", "22.5°"],
    correctIndex: 1,
    explanation:
      "At 3:15, minute hand is at 90°. Hour hand moves 0.5°/min → at 3:15 it's at 97.5°. Difference = 7.5°.",
  },
  {
    id: "lr12",
    category: "logical_reasoning",
    difficulty: 3,
    question:
      "You have two coins totaling 30 cents. One is not a nickel. What are the two coins?",
    options: [
      "Two dimes and a nickel",
      "A quarter and a nickel",
      "Three dimes",
      "A quarter and a dime",
    ],
    correctIndex: 1,
    explanation:
      "'One is not a nickel' — the quarter is not a nickel, but the other coin IS a nickel. 25 + 5 = 30.",
  },
  {
    id: "lr13",
    category: "logical_reasoning",
    difficulty: 3,
    question:
      "Three boxes are labeled 'Apples', 'Oranges', 'Mix' — all labels are wrong. You pull one fruit from the 'Mix' box — it's an apple. What does the 'Apples' box contain?",
    options: ["Apples", "Oranges", "Mix", "Cannot be determined"],
    correctIndex: 2,
    explanation:
      "'Mix' box = Apples (confirmed). 'Apples' box can't be apples, and can't be Mix (taken), so it must be the Mix.",
  },
  {
    id: "lr14",
    category: "logical_reasoning",
    difficulty: 3,
    question:
      "P implies Q. Q implies R. R is false. Which statement must be true?",
    options: [
      "P is true",
      "Q is true",
      "P is false",
      "Q is false but P may be true",
    ],
    correctIndex: 2,
    explanation:
      "By contrapositive: ¬R → ¬Q (from Q→R), and ¬Q → ¬P (from P→Q). So ¬R → ¬P. P must be false.",
  },
  {
    id: "lr15",
    category: "logical_reasoning",
    difficulty: 3,
    question:
      "In a tournament, every player plays every other player exactly once. There are 6 players. How many games are played in total?",
    options: ["12", "15", "18", "30"],
    correctIndex: 1,
    explanation:
      "Number of games = C(6,2) = 6! / (2! × 4!) = 15.",
  },

  // ── NUMBER SEQUENCES — EASY ──────────────────────────────────────────────
  {
    id: "ns01",
    category: "number_sequences",
    difficulty: 1,
    question: "2, 4, 8, 16, 32, ?",
    options: ["48", "64", "56", "40"],
    correctIndex: 1,
    explanation: "Each term doubles the previous. 32 × 2 = 64.",
  },
  {
    id: "ns02",
    category: "number_sequences",
    difficulty: 1,
    question: "1, 1, 2, 3, 5, 8, 13, ?",
    options: ["18", "21", "20", "24"],
    correctIndex: 1,
    explanation:
      "Fibonacci sequence: each term = sum of two before. 8 + 13 = 21.",
  },
  {
    id: "ns03",
    category: "number_sequences",
    difficulty: 1,
    question: "100, 50, 25, 12.5, ?",
    options: ["6", "6.25", "5", "7.5"],
    correctIndex: 1,
    explanation: "Each term is halved. 12.5 ÷ 2 = 6.25.",
  },
  {
    id: "ns04",
    category: "number_sequences",
    difficulty: 1,
    question: "1, 4, 9, 16, 25, ?",
    options: ["30", "36", "32", "49"],
    correctIndex: 1,
    explanation: "Perfect squares: 1², 2², 3², 4², 5², 6² = 36.",
  },
  {
    id: "ns05",
    category: "number_sequences",
    difficulty: 1,
    question: "5, 10, 20, 40, 80, ?",
    options: ["120", "160", "100", "140"],
    correctIndex: 1,
    explanation: "Each term multiplies by 2. 80 × 2 = 160.",
  },
  // ── NUMBER SEQUENCES — MEDIUM ────────────────────────────────────────────
  {
    id: "ns06",
    category: "number_sequences",
    difficulty: 2,
    question: "2, 3, 5, 7, 11, 13, ?",
    options: ["15", "17", "16", "19"],
    correctIndex: 1,
    explanation: "Prime numbers in order. The next prime after 13 is 17.",
  },
  {
    id: "ns07",
    category: "number_sequences",
    difficulty: 2,
    question: "3, 6, 11, 18, 27, ?",
    options: ["36", "38", "40", "35"],
    correctIndex: 1,
    explanation:
      "Differences: 3, 5, 7, 9, 11. Next: 27 + 11 = 38.",
  },
  {
    id: "ns08",
    category: "number_sequences",
    difficulty: 2,
    question: "10, 9, 7, 4, 0, ?",
    options: ["-5", "-4", "-3", "-6"],
    correctIndex: 0,
    explanation:
      "Differences: -1, -2, -3, -4, -5. Next: 0 + (-5) = -5.",
  },
  {
    id: "ns09",
    category: "number_sequences",
    difficulty: 2,
    question: "2, 6, 12, 20, 30, ?",
    options: ["40", "42", "44", "36"],
    correctIndex: 1,
    explanation:
      "Pattern: n(n+1) → 1×2, 2×3, 3×4, 4×5, 5×6, 6×7 = 42.",
  },
  {
    id: "ns10",
    category: "number_sequences",
    difficulty: 2,
    question: "0, 1, 3, 6, 10, 15, ?",
    options: ["18", "21", "20", "22"],
    correctIndex: 1,
    explanation:
      "Triangular numbers — differences increase by 1 each time. 15 + 6 = 21.",
  },
  // ── NUMBER SEQUENCES — HARD ──────────────────────────────────────────────
  {
    id: "ns11",
    category: "number_sequences",
    difficulty: 3,
    question: "1, 8, 27, 64, 125, ?",
    options: ["196", "216", "200", "225"],
    correctIndex: 1,
    explanation: "Perfect cubes: 1³, 2³, 3³, 4³, 5³, 6³ = 216.",
  },
  {
    id: "ns12",
    category: "number_sequences",
    difficulty: 3,
    question: "1, 3, 7, 15, 31, ?",
    options: ["55", "63", "61", "57"],
    correctIndex: 1,
    explanation:
      "Each term = 2× previous + 1. 31 × 2 + 1 = 63. Also 2ⁿ − 1.",
  },
  {
    id: "ns13",
    category: "number_sequences",
    difficulty: 3,
    question: "144, 121, 100, 81, 64, ?",
    options: ["49", "50", "48", "45"],
    correctIndex: 0,
    explanation:
      "Descending perfect squares: 12², 11², 10², 9², 8², 7² = 49.",
  },
  {
    id: "ns14",
    category: "number_sequences",
    difficulty: 3,
    question: "Row 1: [1,1,1], Row 2: [1,2,?] where each cell = cell above + cell left. What is the missing value?",
    options: ["2", "3", "4", "5"],
    correctIndex: 1,
    explanation:
      "Row 2 col 3: cell above (1) + cell left (2) = 3.",
  },
  {
    id: "ns15",
    category: "number_sequences",
    difficulty: 3,
    question: "What is the sum of the first 20 positive integers?",
    options: ["190", "200", "210", "220"],
    correctIndex: 2,
    explanation:
      "Sum = n(n+1)/2 = 20×21/2 = 210.",
  },

  // ── VERBAL ANALOGIES — EASY ──────────────────────────────────────────────
  {
    id: "va01",
    category: "verbal_analogies",
    difficulty: 1,
    question: "Book is to Library as Painting is to:",
    options: ["Canvas", "Museum", "Artist", "Frame"],
    correctIndex: 1,
    explanation:
      "A book is displayed in a library; a painting is displayed in a museum.",
  },
  {
    id: "va02",
    category: "verbal_analogies",
    difficulty: 1,
    question: "Doctor is to Hospital as Teacher is to:",
    options: ["Student", "School", "Classroom", "Knowledge"],
    correctIndex: 1,
    explanation:
      "A doctor works in a hospital; a teacher works in a school.",
  },
  {
    id: "va03",
    category: "verbal_analogies",
    difficulty: 1,
    question: "Glove is to Hand as Helmet is to:",
    options: ["Neck", "Head", "Shoulder", "Knee"],
    correctIndex: 1,
    explanation:
      "A glove protects the hand; a helmet protects the head.",
  },
  {
    id: "va04",
    category: "verbal_analogies",
    difficulty: 1,
    question: "Pen is to Write as Knife is to:",
    options: ["Sharpen", "Cut", "Cook", "Metal"],
    correctIndex: 1,
    explanation:
      "A pen is used to write; a knife is used to cut.",
  },
  {
    id: "va05",
    category: "verbal_analogies",
    difficulty: 1,
    question: "Hot is to Cold as Fast is to:",
    options: ["Quick", "Slow", "Speed", "Race"],
    correctIndex: 1,
    explanation: "Hot and cold are antonyms; fast and slow are antonyms.",
  },
  // ── VERBAL ANALOGIES — MEDIUM ────────────────────────────────────────────
  {
    id: "va06",
    category: "verbal_analogies",
    difficulty: 2,
    question: "Fish is to School as Wolf is to:",
    options: ["Forest", "Pack", "Howl", "Prey"],
    correctIndex: 1,
    explanation:
      "A group of fish is called a school; a group of wolves is called a pack.",
  },
  {
    id: "va07",
    category: "verbal_analogies",
    difficulty: 2,
    question: "Composer is to Symphony as Architect is to:",
    options: ["Blueprint", "Building", "Brick", "Design"],
    correctIndex: 1,
    explanation:
      "A composer creates a symphony; an architect creates a building.",
  },
  {
    id: "va08",
    category: "verbal_analogies",
    difficulty: 2,
    question: "Odometer is to Distance as Thermometer is to:",
    options: ["Weather", "Temperature", "Heat", "Mercury"],
    correctIndex: 1,
    explanation:
      "An odometer measures distance; a thermometer measures temperature.",
  },
  {
    id: "va09",
    category: "verbal_analogies",
    difficulty: 2,
    question: "Marathon is to Running as Regatta is to:",
    options: ["Swimming", "Sailing", "Rowing", "Cycling"],
    correctIndex: 1,
    explanation:
      "A marathon is a competitive running event; a regatta is a competitive sailing event.",
  },
  {
    id: "va10",
    category: "verbal_analogies",
    difficulty: 2,
    question: "Elegy is to Grief as Ode is to:",
    options: ["Sadness", "Praise", "Death", "Rhythm"],
    correctIndex: 1,
    explanation:
      "An elegy is a poem expressing grief; an ode is a poem expressing praise.",
  },
  // ── VERBAL ANALOGIES — HARD ──────────────────────────────────────────────
  {
    id: "va11",
    category: "verbal_analogies",
    difficulty: 3,
    question: "Opaque is to Light as Impermeable is to:",
    options: ["Air", "Water", "Sound", "Heat"],
    correctIndex: 1,
    explanation:
      "Opaque blocks light; impermeable blocks water.",
  },
  {
    id: "va12",
    category: "verbal_analogies",
    difficulty: 3,
    question: "Sycophant is to Flattery as Miser is to:",
    options: ["Wealth", "Greed", "Poverty", "Stinginess"],
    correctIndex: 3,
    explanation:
      "A sycophant is defined by flattery; a miser is defined by stinginess.",
  },
  {
    id: "va13",
    category: "verbal_analogies",
    difficulty: 3,
    question: "Pedantic is to Knowledge as Garrulous is to:",
    options: ["Silence", "Speech", "Wisdom", "Humor"],
    correctIndex: 1,
    explanation:
      "A pedantic person is excessively concerned with knowledge; a garrulous person is excessively concerned with speech (talkative).",
  },
  {
    id: "va14",
    category: "verbal_analogies",
    difficulty: 3,
    question: "Ephemeral is to Permanence as Loquacious is to:",
    options: ["Brevity", "Eloquence", "Noise", "Language"],
    correctIndex: 0,
    explanation:
      "Ephemeral is the opposite of permanence; loquacious (very talkative) is the opposite of brevity.",
  },
  {
    id: "va15",
    category: "verbal_analogies",
    difficulty: 3,
    question: "Enervate is to Energy as Obfuscate is to:",
    options: ["Light", "Clarity", "Knowledge", "Color"],
    correctIndex: 1,
    explanation:
      "To enervate is to drain energy; to obfuscate is to drain clarity (make unclear).",
  },

  // ── PATTERN RECOGNITION — EASY ───────────────────────────────────────────
  {
    id: "pr01",
    category: "pattern_recognition",
    difficulty: 1,
    question:
      "In the sequence: ○ △ □ ○ △ □ ○ △ ?, what comes next?",
    options: ["○", "△", "□", "◇"],
    correctIndex: 2,
    explanation:
      "The pattern repeats every 3: circle, triangle, square. The 9th element is square (□).",
  },
  {
    id: "pr02",
    category: "pattern_recognition",
    difficulty: 1,
    question: "Z Y X W V U T S ?, what letter comes next?",
    options: ["P", "Q", "R", "S"],
    correctIndex: 2,
    explanation:
      "The alphabet in reverse order. After S comes R.",
  },
  {
    id: "pr03",
    category: "pattern_recognition",
    difficulty: 1,
    question:
      "Which shape completes the pattern? Large circle → Small circle → Large square → Small square → Large triangle → ?",
    options: [
      "Large triangle",
      "Small triangle",
      "Large circle",
      "Small square",
    ],
    correctIndex: 1,
    explanation:
      "Pattern alternates large/small for each shape type. After large triangle comes small triangle.",
  },
  {
    id: "pr04",
    category: "pattern_recognition",
    difficulty: 1,
    question: "1, 2, 4, 7, 11, 16, 22, ?, what number comes next?",
    options: ["28", "29", "30", "27"],
    correctIndex: 1,
    explanation:
      "Differences: 1, 2, 3, 4, 5, 6, 7. Next: 22 + 7 = 29.",
  },
  {
    id: "pr05",
    category: "pattern_recognition",
    difficulty: 1,
    question:
      "Each row sums to the same value: Row 1: 3, 5, 2 | Row 2: 4, ?, 3. What is the missing number?",
    options: ["2", "3", "4", "5"],
    correctIndex: 1,
    explanation:
      "Row 1 sums to 10. Row 2: 4 + ? + 3 = 10 → ? = 3.",
  },
  // ── PATTERN RECOGNITION — MEDIUM ─────────────────────────────────────────
  {
    id: "pr06",
    category: "pattern_recognition",
    difficulty: 2,
    question: "A B D G K P ?, what letter comes next?",
    options: ["T", "U", "V", "W"],
    correctIndex: 2,
    explanation:
      "Gaps: +1, +2, +3, +4, +5, +6. P is 16th letter. 16 + 6 = 22 = V.",
  },
  {
    id: "pr07",
    category: "pattern_recognition",
    difficulty: 2,
    question:
      "If ★ = 5 and ★★ = 25 and ★★★ = 125, what does ★★★★ equal?",
    options: ["500", "525", "625", "600"],
    correctIndex: 2,
    explanation:
      "Each star multiplies by 5: 5¹=5, 5²=25, 5³=125, 5⁴=625.",
  },
  {
    id: "pr08",
    category: "pattern_recognition",
    difficulty: 2,
    question:
      "In a 3×3 grid each row and column contains 1, 2, 3 exactly once. Row 1: [1,2,3], Row 2: [3,?,1], Row 3: [2,1,?]. What fills the two blanks (left-to-right)?",
    options: ["2 and 3", "1 and 2", "3 and 2", "2 and 1"],
    correctIndex: 0,
    explanation: "Row 2 needs 2. Row 3 needs 3. Blanks: 2 and 3.",
  },
  {
    id: "pr09",
    category: "pattern_recognition",
    difficulty: 2,
    question:
      "Row 1: 2, 4, 8 | Row 2: 3, 9, 27 | Row 3: 4, 16, ? — What is the missing number?",
    options: ["32", "48", "64", "56"],
    correctIndex: 2,
    explanation: "Each row: n, n², n³. Row 3: 4, 4²=16, 4³=64.",
  },
  {
    id: "pr10",
    category: "pattern_recognition",
    difficulty: 2,
    question:
      "Tile pattern: each tile is rotated 90° clockwise from the previous. Starting at 0°, what is the rotation of the 7th tile?",
    options: ["90°", "180°", "270°", "0°"],
    correctIndex: 1,
    explanation:
      "Rotations cycle: 0°, 90°, 180°, 270°, 0°, 90°, 180°… The 7th tile = 180°.",
  },
  // ── PATTERN RECOGNITION — HARD ───────────────────────────────────────────
  {
    id: "pr11",
    category: "pattern_recognition",
    difficulty: 3,
    question: "In a code: CAT = 3120, DOG = 4157. What does BAT equal?",
    options: ["2120", "2121", "2020", "3121"],
    correctIndex: 0,
    explanation:
      "Each letter maps to its alphabet position: C=3,A=1,T=20 → 3120. B=2,A=1,T=20 → 2120.",
  },
  {
    id: "pr12",
    category: "pattern_recognition",
    difficulty: 3,
    question: "If RED = 27, BLUE = 40, what does GREEN equal?",
    options: ["49", "52", "57", "45"],
    correctIndex: 0,
    explanation:
      "Sum of letter positions: G(7)+R(18)+E(5)+E(5)+N(14) = 49.",
  },
  {
    id: "pr13",
    category: "pattern_recognition",
    difficulty: 3,
    question:
      "Mirror pattern: 1 2 3 4 5 4 3 2 1 2 3 4 5 4 3 2 1 2 3 ?, what comes next?",
    options: ["4", "5", "3", "2"],
    correctIndex: 0,
    explanation:
      "The pattern oscillates 1→5→1. After 3 comes 4 in the ascending phase.",
  },
  {
    id: "pr14",
    category: "pattern_recognition",
    difficulty: 3,
    question:
      "In a sequence of shapes each shape gains one side. Triangle → Square → Pentagon → Hexagon → ?",
    options: ["Heptagon", "Octagon", "Hexagon", "Nonagon"],
    correctIndex: 0,
    explanation: "3 → 4 → 5 → 6 → 7 sides = Heptagon.",
  },
  {
    id: "pr15",
    category: "pattern_recognition",
    difficulty: 3,
    question:
      "A checkerboard pattern uses black and white. In a 4×4 grid starting with black in the top-left, how many black squares are there?",
    options: ["6", "8", "10", "7"],
    correctIndex: 1,
    explanation:
      "In any even×even checkerboard, half the squares are black. 4×4 = 16 → 8 black.",
  },
];

export default questionBank;

export function getQuestionsByDifficulty(
  category: Category,
  difficulty: Difficulty
): Question[] {
  return questionBank.filter(
    (q) => q.category === category && q.difficulty === difficulty
  );
}

export function getAllByCategory(category: Category): Question[] {
  return questionBank.filter((q) => q.category === category);
}

/**
 * Adaptive session question selector.
 * Given per-category difficulty levels, seen question IDs, and optional weighting,
 * selects 10 questions at the appropriate difficulty,
 * falling back to adjacent tiers if the current tier is exhausted.
 * 
 * Enhanced features:
 * - Respects category weights from brain type
 * - Prioritizes unseen questions (no repeats until pool exhausted)
 * - Falls back gracefully when questions run out
 */
export function getAdaptiveSessionQuestions(
  categoryDifficulty: Record<Category, Difficulty>,
  seenIds: Set<string>,
  categoryWeights?: Record<Category, number>
): Question[] {
  const categories: Category[] = [
    "logical_reasoning",
    "number_sequences",
    "verbal_analogies",
    "pattern_recognition",
  ];

  // Default distribution: 3, 3, 2, 2 = 10 questions
  // Adjust based on category weights if provided
  let counts = [3, 3, 2, 2];
  
  if (categoryWeights) {
    // Calculate weighted distribution
    const totalWeight = categories.reduce((sum, cat) => sum + (categoryWeights[cat] ?? 1), 0);
    const rawCounts = categories.map(cat => {
      const weight = categoryWeights[cat] ?? 1;
      return (weight / totalWeight) * 10;
    });
    
    // Round and adjust to ensure exactly 10 questions
    counts = rawCounts.map(c => Math.round(c));
    const diff = 10 - counts.reduce((a, b) => a + b, 0);
    if (diff !== 0) {
      // Add/remove from highest weighted category
      const maxIdx = rawCounts.indexOf(Math.max(...rawCounts));
      counts[maxIdx] += diff;
    }
  }
  
  const shuffledCats = [...categories].sort(() => Math.random() - 0.5);
  const selected: Question[] = [];

  shuffledCats.forEach((cat, i) => {
    const targetDiff = categoryDifficulty[cat] ?? 1;
    const needed = counts[categories.indexOf(cat)];

    // Prioritize target difficulty, then adjacent ones
    const diffOrder: Difficulty[] =
      targetDiff === 1
        ? [1, 2, 3]
        : targetDiff === 2
        ? [2, 1, 3]
        : [3, 2, 1];

    const picked: Question[] = [];
    
    // First pass: unseen questions at preferred difficulty
    for (const diff of diffOrder) {
      if (picked.length >= needed) break;
      const pool = questionBank
        .filter(
          (q) =>
            q.category === cat &&
            q.difficulty === diff &&
            !seenIds.has(q.id) &&
            !picked.some((p) => p.id === q.id)
        )
        .sort(() => Math.random() - 0.5);
      picked.push(...pool.slice(0, needed - picked.length));
    }

    // If still not enough, allow previously seen questions (pool exhausted)
    if (picked.length < needed) {
      // Reset seen IDs for this category - user has seen all questions
      const fallback = questionBank
        .filter(
          (q) =>
            q.category === cat &&
            !picked.some((p) => p.id === q.id)
        )
        .sort(() => Math.random() - 0.5);
      picked.push(...fallback.slice(0, needed - picked.length));
    }

    selected.push(...picked);
  });

  return deinterleave(selected);
}

/** Fallback: legacy session selector used if adaptive data unavailable */
export function getSessionQuestions(): Question[] {
  const categories: Category[] = [
    "logical_reasoning",
    "number_sequences",
    "verbal_analogies",
    "pattern_recognition",
  ];

  let lastIds: string[] = [];
  try {
    const stored = localStorage.getItem("braindrill_last_session_ids");
    if (stored) lastIds = JSON.parse(stored);
  } catch {}

  const byCategory: Record<Category, Question[]> = {
    logical_reasoning: [],
    number_sequences: [],
    verbal_analogies: [],
    pattern_recognition: [],
  };

  for (const q of questionBank) {
    byCategory[q.category].push(q);
  }

  const selected: Question[] = [];
  const counts = [3, 3, 2, 2];
  const shuffledCats = [...categories].sort(() => Math.random() - 0.5);

  shuffledCats.forEach((cat, i) => {
    const pool = byCategory[cat].filter((q) => !lastIds.includes(q.id));
    const source = pool.length >= counts[i] ? pool : byCategory[cat];
    const shuffled = [...source].sort(() => Math.random() - 0.5);
    selected.push(...shuffled.slice(0, counts[i]));
  });

  const final = deinterleave(selected);

  try {
    localStorage.setItem(
      "braindrill_last_session_ids",
      JSON.stringify(final.map((q) => q.id))
    );
  } catch {}

  return final;
}

function deinterleave(questions: Question[]): Question[] {
  const result: Question[] = [];
  const remaining = [...questions];

  while (remaining.length > 0) {
    const lastCat =
      result.length > 0 ? result[result.length - 1].category : null;
    const idx = remaining.findIndex((q) => q.category !== lastCat);
    if (idx === -1) {
      result.push(...remaining.splice(0));
    } else {
      result.push(...remaining.splice(idx, 1));
    }
  }

  return result;
}

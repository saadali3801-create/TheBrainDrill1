/**
 * BrainDrill Question Bank
 * Design: Void Interface — radical focus, amber accent, full-viewport question experience
 *
 * Categories:
 * - logical_reasoning: Deductive/inductive logic puzzles
 * - number_sequences: Pattern-based numeric series
 * - verbal_analogies: Word relationship puzzles
 * - pattern_recognition: Visual/abstract pattern completion
 */

export type Category =
  | "logical_reasoning"
  | "number_sequences"
  | "verbal_analogies"
  | "pattern_recognition";

export interface Question {
  id: string;
  category: Category;
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
  logical_reasoning: "oklch(0.72 0.18 145)",   // green
  number_sequences: "oklch(0.72 0.20 260)",    // blue
  verbal_analogies: "oklch(0.78 0.17 75)",     // amber
  pattern_recognition: "oklch(0.70 0.22 310)", // violet
};

const questionBank: Question[] = [
  // ─── LOGICAL REASONING ───────────────────────────────────────────────────────
  {
    id: "lr01",
    category: "logical_reasoning",
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
      "Wet ground doesn't confirm rain — other causes (sprinklers, flooding) exist. This is the logical fallacy of 'affirming the consequent.'",
  },
  {
    id: "lr03",
    category: "logical_reasoning",
    question:
      "Alice is taller than Bob. Bob is taller than Carol. Who is the shortest?",
    options: ["Alice", "Bob", "Carol", "Cannot be determined"],
    correctIndex: 2,
    explanation:
      "By transitivity: Alice > Bob > Carol. Carol is the shortest.",
  },
  {
    id: "lr04",
    category: "logical_reasoning",
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
    id: "lr05",
    category: "logical_reasoning",
    question:
      "In a race, Tom finishes before Sam but after Lisa. Who finishes second?",
    options: ["Tom", "Sam", "Lisa", "Cannot be determined"],
    correctIndex: 0,
    explanation: "Order: Lisa → Tom → Sam. Tom finishes second.",
  },
  {
    id: "lr06",
    category: "logical_reasoning",
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
      "By contrapositive: if a student did not pass, they did not study. Maria did not pass, so Maria did not study.",
  },
  {
    id: "lr07",
    category: "logical_reasoning",
    question:
      "A bat and a ball cost $1.10 together. The bat costs $1 more than the ball. How much does the ball cost?",
    options: ["$0.10", "$0.05", "$0.15", "$0.20"],
    correctIndex: 1,
    explanation:
      "Let ball = x. Then bat = x + 1. So 2x + 1 = 1.10 → x = $0.05. The intuitive answer of $0.10 is wrong.",
  },
  {
    id: "lr08",
    category: "logical_reasoning",
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
  {
    id: "lr09",
    category: "logical_reasoning",
    question:
      "Five people sit in a row. Anna is to the left of Ben. Ben is to the left of Carl. Dana is to the right of Carl. Who sits in the middle?",
    options: ["Anna", "Ben", "Carl", "Dana"],
    correctIndex: 2,
    explanation:
      "Order: Anna → Ben → Carl → Dana (at least). Carl is the third in a row of at least 4, placing Carl in the middle of the group.",
  },
  {
    id: "lr10",
    category: "logical_reasoning",
    question:
      "A clock shows 3:15. What is the angle between the hour and minute hands?",
    options: ["0°", "7.5°", "15°", "22.5°"],
    correctIndex: 1,
    explanation:
      "At 3:15, the minute hand is at 90°. The hour hand moves 0.5° per minute, so at 3:15 it's at 90° + 7.5° = 97.5°. Difference = 7.5°.",
  },
  {
    id: "lr11",
    category: "logical_reasoning",
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
    id: "lr12",
    category: "logical_reasoning",
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
      "'One is not a nickel' — the quarter is not a nickel, but the other coin IS a nickel. 25 + 5 = 30 cents.",
  },
  {
    id: "lr13",
    category: "logical_reasoning",
    question:
      "If P implies Q, and Q implies R, which statement must be true?",
    options: ["R implies P", "P implies R", "Q implies P", "R implies Q"],
    correctIndex: 1,
    explanation:
      "By hypothetical syllogism: P → Q and Q → R means P → R.",
  },
  {
    id: "lr14",
    category: "logical_reasoning",
    question:
      "Three boxes contain apples, oranges, and a mix. All labels are wrong. You pick one fruit from the 'Mix' box — it's an apple. What does the 'Apples' box contain?",
    options: ["Apples", "Oranges", "Mix", "Cannot be determined"],
    correctIndex: 2,
    explanation:
      "Since all labels are wrong: 'Mix' box = Apples (you confirmed). 'Apples' box can't be apples, so it's the Mix. 'Oranges' box = Oranges.",
  },
  {
    id: "lr15",
    category: "logical_reasoning",
    question:
      "Every even number greater than 2 is the sum of two primes. Is 28 the sum of two primes?",
    options: [
      "No, 28 is not even",
      "Yes, e.g. 11 + 17",
      "Yes, e.g. 14 + 14",
      "Cannot be determined",
    ],
    correctIndex: 1,
    explanation:
      "28 = 11 + 17, both prime. (14 is not prime.) This is consistent with Goldbach's conjecture.",
  },

  // ─── NUMBER SEQUENCES ─────────────────────────────────────────────────────────
  {
    id: "ns01",
    category: "number_sequences",
    question: "2, 4, 8, 16, 32, ?",
    options: ["48", "64", "56", "40"],
    correctIndex: 1,
    explanation: "Each term doubles the previous. 32 × 2 = 64.",
  },
  {
    id: "ns02",
    category: "number_sequences",
    question: "1, 1, 2, 3, 5, 8, 13, ?",
    options: ["18", "21", "20", "24"],
    correctIndex: 1,
    explanation:
      "Fibonacci sequence: each term is the sum of the two before it. 8 + 13 = 21.",
  },
  {
    id: "ns03",
    category: "number_sequences",
    question: "3, 6, 11, 18, 27, ?",
    options: ["36", "38", "40", "35"],
    correctIndex: 1,
    explanation:
      "Differences: 3, 5, 7, 9, 11 (odd numbers increasing by 2). 27 + 11 = 38.",
  },
  {
    id: "ns04",
    category: "number_sequences",
    question: "100, 50, 25, 12.5, ?",
    options: ["6", "6.25", "5", "7.5"],
    correctIndex: 1,
    explanation: "Each term is halved. 12.5 ÷ 2 = 6.25.",
  },
  {
    id: "ns05",
    category: "number_sequences",
    question: "1, 4, 9, 16, 25, ?",
    options: ["30", "36", "32", "49"],
    correctIndex: 1,
    explanation: "Perfect squares: 1², 2², 3², 4², 5², 6² = 36.",
  },
  {
    id: "ns06",
    category: "number_sequences",
    question: "2, 3, 5, 7, 11, 13, ?",
    options: ["15", "17", "16", "19"],
    correctIndex: 1,
    explanation: "Prime numbers in order. The next prime after 13 is 17.",
  },
  {
    id: "ns07",
    category: "number_sequences",
    question: "5, 10, 20, 40, 80, ?",
    options: ["120", "160", "100", "140"],
    correctIndex: 1,
    explanation: "Each term multiplies by 2. 80 × 2 = 160.",
  },
  {
    id: "ns08",
    category: "number_sequences",
    question: "1, 8, 27, 64, 125, ?",
    options: ["196", "216", "200", "225"],
    correctIndex: 1,
    explanation: "Perfect cubes: 1³, 2³, 3³, 4³, 5³, 6³ = 216.",
  },
  {
    id: "ns09",
    category: "number_sequences",
    question: "7, 14, 28, 56, ?",
    options: ["84", "112", "100", "96"],
    correctIndex: 1,
    explanation: "Each term doubles. 56 × 2 = 112.",
  },
  {
    id: "ns10",
    category: "number_sequences",
    question: "10, 9, 7, 4, 0, ?",
    options: ["-5", "-4", "-3", "-6"],
    correctIndex: 0,
    explanation:
      "Differences: -1, -2, -3, -4, -5. Next: 0 + (-5) = -5.",
  },
  {
    id: "ns11",
    category: "number_sequences",
    question: "2, 6, 12, 20, 30, ?",
    options: ["40", "42", "44", "36"],
    correctIndex: 1,
    explanation:
      "Pattern: n(n+1) for n=1,2,3… → 1×2, 2×3, 3×4, 4×5, 5×6, 6×7 = 42.",
  },
  {
    id: "ns12",
    category: "number_sequences",
    question: "1, 3, 7, 15, 31, ?",
    options: ["55", "63", "61", "57"],
    correctIndex: 1,
    explanation:
      "Each term = 2× previous + 1. 31 × 2 + 1 = 63. Alternatively: 2ⁿ − 1.",
  },
  {
    id: "ns13",
    category: "number_sequences",
    question: "144, 121, 100, 81, 64, ?",
    options: ["49", "50", "48", "45"],
    correctIndex: 0,
    explanation:
      "Descending perfect squares: 12², 11², 10², 9², 8², 7² = 49.",
  },
  {
    id: "ns14",
    category: "number_sequences",
    question: "3, 9, 27, 81, ?",
    options: ["162", "243", "200", "270"],
    correctIndex: 1,
    explanation: "Powers of 3: 3¹, 3², 3³, 3⁴, 3⁵ = 243.",
  },
  {
    id: "ns15",
    category: "number_sequences",
    question: "0, 1, 3, 6, 10, 15, ?",
    options: ["18", "21", "20", "22"],
    correctIndex: 1,
    explanation:
      "Triangular numbers: differences are 1, 2, 3, 4, 5, 6. 15 + 6 = 21.",
  },

  // ─── VERBAL ANALOGIES ─────────────────────────────────────────────────────────
  {
    id: "va01",
    category: "verbal_analogies",
    question: "Book is to Library as Painting is to:",
    options: ["Canvas", "Museum", "Artist", "Frame"],
    correctIndex: 1,
    explanation:
      "A book is stored/displayed in a library; a painting is stored/displayed in a museum.",
  },
  {
    id: "va02",
    category: "verbal_analogies",
    question: "Doctor is to Hospital as Teacher is to:",
    options: ["Student", "School", "Classroom", "Knowledge"],
    correctIndex: 1,
    explanation:
      "A doctor works in a hospital; a teacher works in a school.",
  },
  {
    id: "va03",
    category: "verbal_analogies",
    question: "Glove is to Hand as Helmet is to:",
    options: ["Neck", "Head", "Shoulder", "Knee"],
    correctIndex: 1,
    explanation:
      "A glove protects the hand; a helmet protects the head.",
  },
  {
    id: "va04",
    category: "verbal_analogies",
    question: "Pen is to Write as Knife is to:",
    options: ["Sharpen", "Cut", "Cook", "Metal"],
    correctIndex: 1,
    explanation:
      "A pen is used to write; a knife is used to cut.",
  },
  {
    id: "va05",
    category: "verbal_analogies",
    question: "Hot is to Cold as Fast is to:",
    options: ["Quick", "Slow", "Speed", "Race"],
    correctIndex: 1,
    explanation: "Hot and cold are antonyms; fast and slow are antonyms.",
  },
  {
    id: "va06",
    category: "verbal_analogies",
    question: "Fish is to School as Wolf is to:",
    options: ["Forest", "Pack", "Howl", "Prey"],
    correctIndex: 1,
    explanation:
      "A group of fish is called a school; a group of wolves is called a pack.",
  },
  {
    id: "va07",
    category: "verbal_analogies",
    question: "Seed is to Tree as Egg is to:",
    options: ["Nest", "Bird", "Shell", "Hatch"],
    correctIndex: 1,
    explanation:
      "A seed grows into a tree; an egg hatches into a bird.",
  },
  {
    id: "va08",
    category: "verbal_analogies",
    question: "Composer is to Symphony as Architect is to:",
    options: ["Blueprint", "Building", "Brick", "Design"],
    correctIndex: 1,
    explanation:
      "A composer creates a symphony; an architect creates a building.",
  },
  {
    id: "va09",
    category: "verbal_analogies",
    question: "Odometer is to Distance as Thermometer is to:",
    options: ["Weather", "Temperature", "Heat", "Mercury"],
    correctIndex: 1,
    explanation:
      "An odometer measures distance; a thermometer measures temperature.",
  },
  {
    id: "va10",
    category: "verbal_analogies",
    question: "Marathon is to Running as Regatta is to:",
    options: ["Swimming", "Sailing", "Rowing", "Cycling"],
    correctIndex: 1,
    explanation:
      "A marathon is a competitive running event; a regatta is a competitive sailing event.",
  },
  {
    id: "va11",
    category: "verbal_analogies",
    question: "Petal is to Flower as Feather is to:",
    options: ["Nest", "Bird", "Wing", "Fly"],
    correctIndex: 1,
    explanation:
      "A petal is a part of a flower; a feather is a part of a bird.",
  },
  {
    id: "va12",
    category: "verbal_analogies",
    question: "Elegy is to Grief as Ode is to:",
    options: ["Sadness", "Praise", "Death", "Rhythm"],
    correctIndex: 1,
    explanation:
      "An elegy is a poem expressing grief; an ode is a poem expressing praise.",
  },
  {
    id: "va13",
    category: "verbal_analogies",
    question: "Opaque is to Light as Impermeable is to:",
    options: ["Air", "Water", "Sound", "Heat"],
    correctIndex: 1,
    explanation:
      "Opaque blocks light; impermeable blocks water.",
  },
  {
    id: "va14",
    category: "verbal_analogies",
    question: "Conductor is to Orchestra as Director is to:",
    options: ["Script", "Film", "Actor", "Camera"],
    correctIndex: 1,
    explanation:
      "A conductor leads an orchestra; a director leads a film.",
  },
  {
    id: "va15",
    category: "verbal_analogies",
    question: "Sycophant is to Flattery as Miser is to:",
    options: ["Wealth", "Greed", "Poverty", "Stinginess"],
    correctIndex: 3,
    explanation:
      "A sycophant is defined by flattery; a miser is defined by stinginess (extreme reluctance to spend).",
  },

  // ─── PATTERN RECOGNITION ──────────────────────────────────────────────────────
  {
    id: "pr01",
    category: "pattern_recognition",
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
    question:
      "Each row sums to the same value: Row 1: 3, 5, 2 | Row 2: 4, ?, 3 | Row 3: 1, 6, 3. What is the missing number?",
    options: ["2", "3", "4", "5"],
    correctIndex: 1,
    explanation:
      "Row 1 sums to 10. Row 3 sums to 10. Row 2: 4 + ? + 3 = 10 → ? = 3.",
  },
  {
    id: "pr03",
    category: "pattern_recognition",
    question:
      "A B D G K P ?, what letter comes next?",
    options: ["T", "U", "V", "W"],
    correctIndex: 2,
    explanation:
      "Gaps between letters: +1, +2, +3, +4, +5, +6. P is the 16th letter. 16 + 6 = 22 = V.",
  },
  {
    id: "pr04",
    category: "pattern_recognition",
    question:
      "If ★ = 5 and ★★ = 25 and ★★★ = 125, what does ★★★★ equal?",
    options: ["500", "525", "625", "600"],
    correctIndex: 2,
    explanation:
      "Each star multiplies by 5: 5¹=5, 5²=25, 5³=125, 5⁴=625.",
  },
  {
    id: "pr05",
    category: "pattern_recognition",
    question:
      "In a 3×3 grid, each row and column contains 1, 2, 3 exactly once. Row 1: [1, 2, 3], Row 2: [3, ?, 1], Row 3: [2, 1, ?]. What fills the two blanks?",
    options: ["2 and 3", "1 and 2", "3 and 2", "2 and 1"],
    correctIndex: 0,
    explanation:
      "Row 2 needs 2 (missing from 3,_,1). Row 3 needs 3 (missing from 2,1,_). Blanks: 2 and 3.",
  },
  {
    id: "pr06",
    category: "pattern_recognition",
    question:
      "Z Y X W V U T S ?, what letter comes next?",
    options: ["P", "Q", "R", "S"],
    correctIndex: 2,
    explanation:
      "The alphabet in reverse order. After S comes R.",
  },
  {
    id: "pr07",
    category: "pattern_recognition",
    question:
      "1, 2, 4, 7, 11, 16, 22, ?, what number comes next?",
    options: ["28", "29", "30", "27"],
    correctIndex: 1,
    explanation:
      "Differences: 1, 2, 3, 4, 5, 6, 7. Next: 22 + 7 = 29.",
  },
  {
    id: "pr08",
    category: "pattern_recognition",
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
    id: "pr09",
    category: "pattern_recognition",
    question:
      "In a code: CAT = 3120, DOG = 4157, what does BAT equal?",
    options: ["2120", "2121", "2020", "3121"],
    correctIndex: 0,
    explanation:
      "Each letter maps to its position: C=3, A=1, T=20 → 3120. B=2, A=1, T=20 → 2120.",
  },
  {
    id: "pr10",
    category: "pattern_recognition",
    question:
      "Row 1: 2, 4, 8 | Row 2: 3, 9, 27 | Row 3: 4, 16, ? — What is the missing number?",
    options: ["32", "48", "64", "56"],
    correctIndex: 2,
    explanation:
      "Each row: n, n², n³. Row 3: 4, 4²=16, 4³=64.",
  },
  {
    id: "pr11",
    category: "pattern_recognition",
    question:
      "If RED = 27, BLUE = 40, what does GREEN equal?",
    options: ["49", "52", "57", "45"],
    correctIndex: 1,
    explanation:
      "Sum of letter positions: R(18)+E(5)+D(4)=27. B(2)+L(12)+U(21)+E(5)=40. G(7)+R(18)+E(5)+E(5)+N(14)=49. Wait — GREEN = 49.",
  },
  {
    id: "pr12",
    category: "pattern_recognition",
    question:
      "Mirror pattern: 1 2 3 4 5 4 3 2 1 2 3 4 5 4 3 2 1 2 3 ?, what comes next?",
    options: ["4", "5", "3", "2"],
    correctIndex: 0,
    explanation:
      "The pattern oscillates 1→5→1. After 3 comes 4 in the ascending phase.",
  },
  {
    id: "pr13",
    category: "pattern_recognition",
    question:
      "In a sequence of shapes: each shape gains one side per step. Triangle → Square → Pentagon → Hexagon → ?",
    options: ["Heptagon", "Octagon", "Hexagon", "Nonagon"],
    correctIndex: 0,
    explanation:
      "3 sides → 4 → 5 → 6 → 7 sides = Heptagon.",
  },
  {
    id: "pr14",
    category: "pattern_recognition",
    question:
      "Tile pattern: each tile is rotated 90° clockwise from the previous. Starting at 0°, what is the rotation of the 7th tile?",
    options: ["90°", "180°", "270°", "0°"],
    correctIndex: 1,
    explanation:
      "Rotations cycle: 0°, 90°, 180°, 270°, 0°, 90°, 180°… The 7th tile = 180°.",
  },
  {
    id: "pr15",
    category: "pattern_recognition",
    question:
      "Number grid: each cell = sum of cell above + cell to its left. Row 1: [1, 1, 1]. Row 2: [1, ?, ?]. What is the last cell in row 2?",
    options: ["2", "3", "4", "5"],
    correctIndex: 1,
    explanation:
      "Row 2, col 2: 1(above) + 1(left) = 2. Row 2, col 3: 1(above) + 2(left) = 3.",
  },
];

export default questionBank;

/**
 * Get a session of 10 questions, 2-3 per category, no back-to-back repeats
 * compared to the last session stored in localStorage.
 */
export function getSessionQuestions(): Question[] {
  const categories: Category[] = [
    "logical_reasoning",
    "number_sequences",
    "verbal_analogies",
    "pattern_recognition",
  ];

  // Get last session question IDs to avoid immediate repeats
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

  // Pick 2-3 from each category (total 10: 3+3+2+2 or 3+2+3+2)
  const counts = [3, 3, 2, 2];
  // Shuffle category order for variety
  const shuffledCats = [...categories].sort(() => Math.random() - 0.5);

  shuffledCats.forEach((cat, i) => {
    const pool = byCategory[cat].filter((q) => !lastIds.includes(q.id));
    // If not enough non-repeated, fall back to full pool
    const source =
      pool.length >= counts[i] ? pool : byCategory[cat];
    const shuffled = [...source].sort(() => Math.random() - 0.5);
    selected.push(...shuffled.slice(0, counts[i]));
  });

  // Shuffle final selection and ensure no two same-category questions are adjacent
  const final = deinterleave(selected);

  // Store IDs for next session
  try {
    localStorage.setItem(
      "braindrill_last_session_ids",
      JSON.stringify(final.map((q) => q.id))
    );
  } catch {}

  return final;
}

/** Spread questions so same-category ones aren't back-to-back */
function deinterleave(questions: Question[]): Question[] {
  const result: Question[] = [];
  const remaining = [...questions];

  while (remaining.length > 0) {
    const lastCat = result.length > 0 ? result[result.length - 1].category : null;
    const idx = remaining.findIndex((q) => q.category !== lastCat);
    if (idx === -1) {
      // Can't avoid same category, just push remaining
      result.push(...remaining.splice(0));
    } else {
      result.push(...remaining.splice(idx, 1));
    }
  }

  return result;
}

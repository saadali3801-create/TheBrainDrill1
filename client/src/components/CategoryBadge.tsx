/**
 * BrainDrill — CategoryBadge Component
 * Design: Void Interface — category pill with icon and color coding
 */

import { Category, CATEGORY_ICONS, CATEGORY_LABELS } from "@/lib/questions";

interface CategoryBadgeProps {
  category: Category;
  size?: "sm" | "md";
}

const CATEGORY_STYLES: Record<Category, string> = {
  logical_reasoning: "bg-[oklch(0.20_0.08_145/0.15)] text-[oklch(0.72_0.18_145)] border-[oklch(0.72_0.18_145/0.25)]",
  number_sequences: "bg-[oklch(0.20_0.08_260/0.15)] text-[oklch(0.72_0.20_260)] border-[oklch(0.72_0.20_260/0.25)]",
  verbal_analogies: "bg-[oklch(0.20_0.08_75/0.15)] text-[oklch(0.78_0.17_75)] border-[oklch(0.78_0.17_75/0.25)]",
  pattern_recognition: "bg-[oklch(0.20_0.08_310/0.15)] text-[oklch(0.70_0.22_310)] border-[oklch(0.70_0.22_310/0.25)]",
};

export default function CategoryBadge({ category, size = "md" }: CategoryBadgeProps) {
  const isSmall = size === "sm";
  return (
    <span
      className={`inline-flex items-center gap-1.5 border rounded-full font-medium tracking-wide ${CATEGORY_STYLES[category]} ${
        isSmall ? "text-xs px-2.5 py-0.5" : "text-sm px-3 py-1"
      }`}
    >
      <span>{CATEGORY_ICONS[category]}</span>
      {CATEGORY_LABELS[category]}
    </span>
  );
}

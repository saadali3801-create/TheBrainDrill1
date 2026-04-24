/**
 * BrainDrill — StreakBadge Component
 * Design: Void Interface — flame icon + streak count with amber glow
 */

interface StreakBadgeProps {
  streak: number;
  className?: string;
}

export default function StreakBadge({ streak, className = "" }: StreakBadgeProps) {
  const isActive = streak > 0;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
        isActive
          ? "bg-[oklch(0.20_0.08_75/0.15)] border-[oklch(0.78_0.17_75/0.30)] text-[oklch(0.78_0.17_75)]"
          : "bg-[oklch(1_0_0/0.04)] border-[oklch(1_0_0/0.08)] text-[oklch(0.55_0.008_265)]"
      } ${className}`}
    >
      <span className="text-base leading-none" style={{ filter: isActive ? "none" : "grayscale(1)" }}>
        🔥
      </span>
      <span className="mono font-semibold text-sm leading-none">
        {streak}
      </span>
      <span className="text-xs font-medium opacity-70 leading-none">
        {streak === 1 ? "day" : "days"}
      </span>
    </div>
  );
}

/**
 * BrainDrill — TimerRing Component
 * Circular SVG countdown timer — the iconic visual element of BrainDrill
 * Design: Void Interface — amber ring depletes over 30 seconds, turns red when urgent
 * Polish: Smooth stroke animation, color transitions, subtle glow on urgency
 */

interface TimerRingProps {
  timeLeft: number;
  totalTime?: number;
  size?: number;
}

export default function TimerRing({
  timeLeft,
  totalTime = 30,
  size = 64,
}: TimerRingProps) {
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / totalTime;
  const strokeDashoffset = circumference * (1 - progress);

  const isUrgent = timeLeft <= 10;
  const isCritical = timeLeft <= 5;

  const ringColor = isCritical
    ? "oklch(0.65 0.22 25)"
    : isUrgent
    ? "oklch(0.72 0.20 45)"
    : "oklch(0.78 0.17 75)";

  const textColor = isCritical
    ? "oklch(0.65 0.22 25)"
    : isUrgent
    ? "oklch(0.78 0.17 55)"
    : "oklch(0.90 0.005 65)";

  const glowFilter = isCritical
    ? `drop-shadow(0 0 6px oklch(0.65 0.22 25 / 0.7))`
    : isUrgent
    ? `drop-shadow(0 0 4px oklch(0.72 0.20 45 / 0.5))`
    : "none";

  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          transform: "rotate(-90deg)",
          filter: glowFilter,
          transition: "filter 0.5s ease",
        }}
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="oklch(1 0 0 / 6%)"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition:
              "stroke-dashoffset 1s linear, stroke 0.5s ease",
          }}
        />
      </svg>
      {/* Time number */}
      <span
        className="absolute mono font-semibold leading-none"
        style={{
          fontSize: size < 56 ? "13px" : "15px",
          color: textColor,
          transition: "color 0.5s ease",
        }}
      >
        {timeLeft}
      </span>
    </div>
  );
}

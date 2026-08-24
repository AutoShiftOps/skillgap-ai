"use client";
import { useEffect, useState } from "react";

interface Props {
  score: number;
  size?: number;
  variant?: "light" | "dark";
}

const bandColor = (score: number) => {
  if (score <= 25) return "#10b981";
  if (score <= 50) return "#f59e0b";
  if (score <= 75) return "#f97316";
  return "#ef4444";
};

/**
 * An animated radial gauge that draws its arc and counts the number up on
 * mount, instead of rendering a static number + flat progress bar. Accepts
 * a `variant` so the center number and track color adapt to a dark hero
 * card (VerdictBanner) vs. a plain white card context -- fixes a real bug
 * where near-black text on a near-black background rendered invisible.
 */
export default function RadialScoreGauge({ score, size = 160, variant = "light" }: Props) {
  const [displayScore, setDisplayScore] = useState(0);
  const [dashOffset, setDashOffset] = useState(0);

  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const duration = 1100;
    const start = performance.now();
    let raf: number;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));
      setDashOffset(circumference * (1 - eased * (score / 100)));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score, circumference]);

  const color = bandColor(score);
  const trackColor = variant === "dark" ? "#334155" : "#e2e8f0";
  const textColor = variant === "dark" ? "text-white" : "text-ink-900";
  const subTextColor = variant === "dark" ? "text-slate-400" : "text-slate-400";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={12}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke 0.3s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-bold tabular-nums ${textColor}`}>{displayScore}</span>
        <span className={`text-xs ${subTextColor}`}>/ 100</span>
      </div>
    </div>
  );
}

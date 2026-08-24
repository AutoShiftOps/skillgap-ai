"use client";
import { useEffect, useState } from "react";

const STEPS = [
  "Reading the job description\u2026",
  "Parsing your resume\u2026",
  "Scoring how realistic this JD really is\u2026",
  "Mapping skill-by-skill gaps\u2026"
];

/**
 * A lightweight, illusionary step indicator shown while /api/analyze is in
 * flight. It does not track real backend progress (the API is a single
 * request) -- it exists purely so waiting feels like something is happening
 * in stages, rather than staring at a static "Analyzing..." label for
 * several seconds during the multi-call OpenAI sequence.
 */
export default function AnalyzingProgress() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => (i + 1 < STEPS.length ? i + 1 : i));
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3 mb-1">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75 animate-ping" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-600" />
        </span>
        <p className="text-sm font-medium text-ink-900">{STEPS[stepIndex]}</p>
      </div>
      <div className="mt-3 flex gap-1.5">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
              i <= stepIndex ? "bg-brand-500" : "bg-slate-100"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

"use client";
import RadialScoreGauge from "./RadialScoreGauge";
import type { UnicornScore } from "@/lib/types";

function verdictCopy(score: number, archetypes: string[]) {
  if (score <= 25) {
    return {
      headline: "This is a realistic, single-role posting.",
      sub: "You're likely being judged on one coherent job, not a blend of several."
    };
  }
  if (score <= 50) {
    return {
      headline: "Some scope creep, but still winnable honestly.",
      sub: "A strong senior candidate could plausibly cover this role."
    };
  }
  if (score <= 75) {
    return {
      headline: `This JD is really asking for ${archetypes.length || 2} different roles.`,
      sub: "Expect real gaps -- that's the posting's design, not necessarily your resume."
    };
  }
  return {
    headline: `This posting blends ${archetypes.length || "several"} distinct roles into one.`,
    sub: "Structurally unrealistic for almost any single honest candidate to fully satisfy."
  };
}

export default function VerdictBanner({ score }: { score: UnicornScore }) {
  const verdict = verdictCopy(score.score, score.archetypesDetected);

  return (
    <div className="rounded-2xl bg-ink-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
      <RadialScoreGauge score={score.score} />
      <div className="text-center sm:text-left">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
          The verdict
        </p>
        <h2 className="text-xl sm:text-2xl font-bold mb-1.5 leading-snug">{verdict.headline}</h2>
        <p className="text-sm text-slate-300">{verdict.sub}</p>
      </div>
    </div>
  );
}

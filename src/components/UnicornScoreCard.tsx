"use client";
import type { UnicornScore } from "@/lib/types";

function bandFor(score: number) {
  if (score <= 25) return { label: "Coherent role", color: "bg-emerald-100 text-emerald-700" };
  if (score <= 50) return { label: "Mild scope creep", color: "bg-amber-100 text-amber-700" };
  if (score <= 75) return { label: "Blended roles", color: "bg-orange-100 text-orange-700" };
  return { label: "Unicorn posting", color: "bg-red-100 text-red-700" };
}

export default function UnicornScoreCard({ score }: { score: UnicornScore }) {
  const band = bandFor(score.score);
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg">JD Realism (&quot;Unicorn&quot;) Score</h3>
        <span className={`badge ${band.color}`}>{band.label}</span>
      </div>
      <div className="flex items-end gap-3 mb-2">
        <span className="text-4xl font-bold text-ink-900">{score.score}</span>
        <span className="text-slate-400 pb-1">/ 100</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
        <div
          className="h-2 rounded-full bg-brand-600"
          style={{ width: `${score.score}%` }}
        />
      </div>
      {score.archetypesDetected.length > 0 && (
        <div className="mb-3">
          <p className="text-xs uppercase text-slate-400 mb-1">Archetypes detected</p>
          <div className="flex flex-wrap gap-1.5">
            {score.archetypesDetected.map((a) => (
              <span key={a} className="badge bg-slate-100 text-slate-700">{a}</span>
            ))}
          </div>
        </div>
      )}
      <p className="text-sm text-slate-600">{score.rationale}</p>
    </div>
  );
}

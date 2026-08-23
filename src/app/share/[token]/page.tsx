import { getSharedResult } from "@/lib/persistence";
import { notFound } from "next/navigation";

function bandFor(score: number) {
  if (score <= 25) return { label: "Coherent role", color: "text-emerald-700 bg-emerald-100" };
  if (score <= 50) return { label: "Mild scope creep", color: "text-amber-700 bg-amber-100" };
  if (score <= 75) return { label: "Blended roles", color: "text-orange-700 bg-orange-100" };
  return { label: "Unicorn posting", color: "text-red-700 bg-red-100" };
}

export default async function SharedResultPage({
  params
}: {
  params: { token: string };
}) {
  const result = await getSharedResult(params.token);
  if (!result) notFound();

  const unicorn = result.unicorn_score_json as {
    score: number;
    archetypesDetected: string[];
    rationale: string;
  };
  const band = bandFor(unicorn.score);
  const jd = (result as any).job_descriptions;

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm text-slate-400 mb-1">Shared SkillGap AI result</p>
        <h1 className="text-2xl font-bold text-slate-900">
          {jd?.title || "Job description"} {jd?.company ? `at ${jd.company}` : ""}
        </h1>
      </section>

      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">JD Realism (&quot;Unicorn&quot;) Score</h3>
          <span className={`badge ${band.color}`}>{band.label}</span>
        </div>
        <div className="flex items-end gap-3 mb-4">
          <span className="text-4xl font-bold text-slate-900">{unicorn.score}</span>
          <span className="text-slate-400 pb-1">/ 100</span>
        </div>
        <p className="text-sm text-slate-600">{unicorn.rationale}</p>
      </div>

      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Match Summary</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-slate-900">{result.match_percentage}%</p>
            <p className="text-xs text-slate-400">Overall</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{result.technical_match_percentage}%</p>
            <p className="text-xs text-slate-400">Technical</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{result.managerial_match_percentage}%</p>
            <p className="text-xs text-slate-400">Managerial</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center">
        Want your own Unicorn Score? Visit the SkillGap AI homepage to analyze your resume
        against any job description.
      </p>
    </div>
  );
}

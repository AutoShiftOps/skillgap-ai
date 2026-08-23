import { EXAMPLE_RESULT_PREVIEW as ex } from "@/lib/exampleResult";

const statusStyles: Record<string, string> = {
  match: "bg-emerald-100 text-emerald-700",
  missing: "bg-red-100 text-red-700"
};

/**
 * A static, clearly-labeled preview of real product output, shown directly
 * on the landing page above the upload form. Exists specifically to answer
 * "is this a real tool or just a form" before the visitor commits any effort.
 */
export default function ExamplePreview() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="bg-slate-900 px-5 py-2.5 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-300 uppercase tracking-wide">
          Example output &mdash; not your data
        </span>
        <span className="text-xs text-slate-500">{ex.jdTitle}</span>
      </div>
      <div className="p-5 grid sm:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-slate-500">Unicorn Score</p>
            <span className="badge bg-red-100 text-red-700">{ex.unicornScore.band}</span>
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-bold text-slate-900">{ex.unicornScore.score}</span>
            <span className="text-slate-400 text-sm pb-1">/ 100</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">{ex.unicornScore.rationale}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 mb-2">Match breakdown</p>
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Technical</span>
              <span className="font-medium text-emerald-600">{ex.technicalMatchPercentage}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Managerial</span>
              <span className="font-medium text-red-600">{ex.managerialMatchPercentage}%</span>
            </div>
          </div>
          <p className="text-xs font-medium text-slate-500 mb-1.5">Top gaps</p>
          <ul className="space-y-1">
            {ex.topGaps.map((g) => (
              <li key={g.skill} className="flex items-center justify-between text-xs">
                <span className="text-slate-600">{g.skill}</span>
                <span className={`badge ${statusStyles[g.status]}`}>{g.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

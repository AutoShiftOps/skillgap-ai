export default function TrustSection() {
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-2xl font-bold text-slate-900 mb-1">43%</p>
        <p className="text-xs text-slate-500 leading-relaxed">
          of large employers now use AI-detection tools when screening resumes, with real-world
          accuracy of only 67&ndash;82% &mdash; punishing honest applicants along with dishonest ones.
        </p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-2xl font-bold text-slate-900 mb-1">0</p>
        <p className="text-xs text-slate-500 leading-relaxed">
          fabricated claims, ever. Every suggestion is grounded in your actual resume text &mdash;
          gaps too large to word-smith honestly are pointed to a real upskilling action instead.
        </p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-2xl font-bold text-slate-900 mb-1">No detector</p>
        <p className="text-xs text-slate-500 leading-relaxed">
          built into this tool. We only apply a narrow style check to text we generate ourselves
          &mdash; not to your resume &mdash; because general AI detectors carry real false-positive risk.
        </p>
      </div>
    </div>
  );
}

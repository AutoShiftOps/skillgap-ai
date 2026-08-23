"use client";
import { useState } from "react";
import type { ParsedJD, ParsedResume, SkillGapItem, InterviewQuestion } from "@/lib/types";
import { interviewQuestionsRequest } from "@/lib/api";

const typeStyles: Record<string, string> = {
  technical: "bg-brand-50 text-brand-700",
  managerial: "bg-purple-50 text-purple-700",
  behavioral: "bg-teal-50 text-teal-700",
  "gap-probe": "bg-red-50 text-red-700"
};

export default function InterviewPrepPanel({
  jd,
  resume,
  gaps
}: {
  jd: ParsedJD;
  resume: ParsedResume;
  gaps: SkillGapItem[];
}) {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const result = await interviewQuestionsRequest(jd, resume, gaps);
      setQuestions(result);
    } catch (e: any) {
      setError(e.message || "Failed to generate interview questions.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Likely Interview Questions</h3>
        <button className="btn-secondary text-sm" onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating…" : questions.length ? "Regenerate" : "Generate"}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {questions.length > 0 && (
        <ul className="space-y-3">
          {questions.map((q, i) => (
            <li key={i} className="border border-slate-100 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className={`badge ${typeStyles[q.type] || "bg-slate-100 text-slate-700"}`}>
                  {q.type}
                </span>
              </div>
              <p className="text-sm text-slate-800 mb-1">{q.question}</p>
              <p className="text-xs text-slate-400">Based on: {q.basedOn}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

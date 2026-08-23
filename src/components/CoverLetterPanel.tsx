"use client";
import { useState } from "react";
import type { ParsedJD, ParsedResume } from "@/lib/types";

interface DetectorRiskFlag {
  pattern: string;
  match: string;
  suggestion: string;
}

interface DetectorRisk {
  riskLevel: "low" | "medium" | "high";
  flags: DetectorRiskFlag[];
}

const riskStyles: Record<string, string> = {
  low: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700"
};

export default function CoverLetterPanel({
  jd,
  resume
}: {
  jd: ParsedJD;
  resume: ParsedResume;
}) {
  const [letter, setLetter] = useState<string>("");
  const [detectorRisk, setDetectorRisk] = useState<DetectorRisk | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd, resume })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Cover letter generation failed.");
      setLetter(data.coverLetter);
      setDetectorRisk(data.detectorRisk ?? null);
    } catch (e: any) {
      setError(e.message || "Failed to generate cover letter.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Tailored Cover Letter</h3>
        <button className="btn-secondary text-sm" onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating…" : letter ? "Regenerate" : "Generate"}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {letter && (
        <>
          <pre className="whitespace-pre-wrap text-sm text-slate-700 bg-slate-50 rounded-lg p-4 border border-slate-100">
            {letter}
          </pre>
          {detectorRisk && (
            <div className="border border-slate-100 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className={`badge ${riskStyles[detectorRisk.riskLevel]}`}>
                  {detectorRisk.riskLevel} AI-style risk
                </span>
                <span className="text-xs text-slate-400">
                  Style check on this generated text, not a claim about your resume
                </span>
              </div>
              {detectorRisk.flags.length > 0 && (
                <ul className="space-y-1.5">
                  {detectorRisk.flags.map((f, i) => (
                    <li key={i} className="text-xs text-slate-600">
                      <span className="font-medium">{f.pattern}</span>: {f.suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <p className="text-xs text-slate-400">
            Generated from your resume only. Review before sending — verify every claim is
            something you can defend in an interview.
          </p>
        </>
      )}
    </div>
  );
}

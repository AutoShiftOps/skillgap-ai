"use client";
import { useState } from "react";
import type { ParsedJD, ParsedResume } from "@/lib/types";
import { coverLetterRequest } from "@/lib/api";

export default function CoverLetterPanel({
  jd,
  resume
}: {
  jd: ParsedJD;
  resume: ParsedResume;
}) {
  const [letter, setLetter] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const result = await coverLetterRequest(jd, resume);
      setLetter(result);
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
          <p className="text-xs text-slate-400">
            Generated from your resume only. Review before sending — verify every claim is
            something you can defend in an interview.
          </p>
        </>
      )}
    </div>
  );
}

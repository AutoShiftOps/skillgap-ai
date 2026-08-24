"use client";
import { useState, FormEvent } from "react";
import type { AnalysisResult } from "@/lib/types";
import { analyzeRequest } from "@/lib/api";
import { SAMPLE_JD_TEXT, SAMPLE_RESUME_TEXT } from "@/lib/sampleData";
import AnalyzingProgress from "./AnalyzingProgress";

type ResultWithId = AnalysisResult & { analysisId: string | null };

interface Props {
  onResult: (result: ResultWithId) => void;
}

export default function UploadForm({ onResult }: Props) {
  const [jdMode, setJdMode] = useState<"url" | "text">("url");
  const [jdUrl, setJdUrl] = useState("");
  const [jdText, setJdText] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runAnalysis(formData: FormData) {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeRequest(formData);
      onResult(result);
    } catch (e: any) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const formData = new FormData();
    if (jdMode === "url") {
      formData.append("jdUrl", jdUrl);
    } else {
      formData.append("jdText", jdText);
    }
    if (resumeFile) {
      formData.append("resumeFile", resumeFile);
    } else {
      formData.append("resumeText", resumeText);
    }
    await runAnalysis(formData);
  }

  async function handleTrySample() {
    setJdMode("text");
    setJdText(SAMPLE_JD_TEXT);
    setResumeText(SAMPLE_RESUME_TEXT);
    setResumeFile(null);

    const formData = new FormData();
    formData.append("jdText", SAMPLE_JD_TEXT);
    formData.append("resumeText", SAMPLE_RESUME_TEXT);
    await runAnalysis(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-slate-500">
          Paste a real JD + resume, or try an example first
        </h2>
        <button
          type="button"
          onClick={handleTrySample}
          disabled={loading}
          className="text-sm text-brand-600 hover:text-brand-700 font-medium underline disabled:opacity-50"
        >
          Try a sample JD + resume
        </button>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold text-lg">1. Job Description</h3>
          <div className="ml-auto flex gap-1 text-xs">
            <button
              type="button"
              onClick={() => setJdMode("url")}
              className={`px-3 py-1 rounded-full ${jdMode === "url" ? "bg-ink-900 text-white" : "bg-slate-100 text-slate-600"}`}
            >
              Paste URL
            </button>
            <button
              type="button"
              onClick={() => setJdMode("text")}
              className={`px-3 py-1 rounded-full ${jdMode === "text" ? "bg-ink-900 text-white" : "bg-slate-100 text-slate-600"}`}
            >
              Paste text
            </button>
          </div>
        </div>
        {jdMode === "url" ? (
          <input
            type="url"
            className="input-field"
            placeholder="https://company.com/careers/senior-engineer"
            value={jdUrl}
            onChange={(e) => setJdUrl(e.target.value)}
          />
        ) : (
          <textarea
            className="input-field min-h-32"
            placeholder="Paste the full job description text here…"
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
          />
        )}
        <p className="text-xs text-slate-400 mt-1">
          Some job sites block automated fetches — if the URL fails, switch to
          &quot;Paste text&quot; instead.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2">2. Your Resume</h3>
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          className="block w-full text-sm text-slate-600 mb-2"
          onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
        />
        <p className="text-xs text-slate-400 mb-2">PDF, DOCX, or TXT — or paste text below instead.</p>
        <textarea
          className="input-field min-h-24"
          placeholder="…or paste resume text here"
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <AnalyzingProgress />
      ) : (
        <button type="submit" className="btn-primary w-full">
          Analyze gap
        </button>
      )}
    </form>
  );
}

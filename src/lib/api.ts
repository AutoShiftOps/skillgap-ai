import type { AnalysisResult, InterviewQuestion, ParsedJD, ParsedResume, SkillGapItem } from "./types";

export async function analyzeRequest(
  formData: FormData
): Promise<AnalysisResult & { analysisId: string | null }> {
  const res = await fetch("/api/analyze", { method: "POST", body: formData });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Analysis failed.");
  return data as AnalysisResult & { analysisId: string | null };
}

export async function coverLetterRequest(
  jd: ParsedJD,
  resume: ParsedResume
): Promise<string> {
  const res = await fetch("/api/cover-letter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jd, resume })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Cover letter generation failed.");
  return data.coverLetter as string;
}

export async function interviewQuestionsRequest(
  jd: ParsedJD,
  resume: ParsedResume,
  gaps: SkillGapItem[]
): Promise<InterviewQuestion[]> {
  const res = await fetch("/api/interview-questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jd, resume, gaps })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Interview question generation failed.");
  return data.questions as InterviewQuestion[];
}

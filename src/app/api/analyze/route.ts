import { NextRequest, NextResponse } from "next/server";
import { fetchJDTextFromUrl } from "@/lib/jdFetcher";
import { extractTextFromFile } from "@/lib/fileParsers";
import {
  extractJD,
  extractResume,
  computeUnicornScore,
  computeGapAnalysis,
  computeMatchPercentages
} from "@/lib/extraction";
import { checkRateLimit, getClientIdentifier, pruneExpiredBuckets } from "@/lib/rateLimit";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { saveAnalysis } from "@/lib/persistence";
import type { AnalysisResult } from "@/lib/types";

export const maxDuration = 60;

const MAX_JD_CHARS = Number(process.env.MAX_JD_CHARS || 20000);
const MAX_RESUME_CHARS = Number(process.env.MAX_RESUME_CHARS || 20000);

export async function POST(req: NextRequest) {
  pruneExpiredBuckets();

  const identifier = getClientIdentifier(req);
  const rateLimit = checkRateLimit(identifier);

  if (!rateLimit.allowed) {
    const retryAfterSeconds = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
    return NextResponse.json(
      {
        error: `Rate limit exceeded. Try again in ${retryAfterSeconds}s. This limit protects shared API costs on the public demo.`
      },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfterSeconds) }
      }
    );
  }

  try {
    const formData = await req.formData();
    const jdUrl = formData.get("jdUrl") as string | null;
    const jdText = formData.get("jdText") as string | null;
    const resumeFile = formData.get("resumeFile") as File | null;
    const resumeText = formData.get("resumeText") as string | null;

    let rawJDText = "";
    if (jdUrl && jdUrl.trim()) {
      rawJDText = await fetchJDTextFromUrl(jdUrl.trim());
    } else if (jdText && jdText.trim()) {
      rawJDText = jdText.trim();
    } else {
      return NextResponse.json(
        { error: "Provide either a JD URL or pasted JD text." },
        { status: 400 }
      );
    }
    rawJDText = rawJDText.slice(0, MAX_JD_CHARS);

    let rawResumeText = "";
    if (resumeFile && resumeFile.size > 0) {
      const buffer = Buffer.from(await resumeFile.arrayBuffer());
      rawResumeText = await extractTextFromFile(
        buffer,
        resumeFile.type,
        resumeFile.name
      );
    } else if (resumeText && resumeText.trim()) {
      rawResumeText = resumeText.trim();
    } else {
      return NextResponse.json(
        { error: "Upload a resume file or paste resume text." },
        { status: 400 }
      );
    }
    rawResumeText = rawResumeText.slice(0, MAX_RESUME_CHARS);

    const [jd, resume] = await Promise.all([
      extractJD(rawJDText),
      extractResume(rawResumeText)
    ]);

    const [unicornScore, gaps] = await Promise.all([
      computeUnicornScore(jd),
      computeGapAnalysis(jd, resume)
    ]);

    const percentages = computeMatchPercentages(gaps);

    const result: AnalysisResult = {
      jd,
      resume,
      gaps,
      unicornScore,
      ...percentages
    };

    let analysisId: string | null = null;
    try {
      const supabase = createSupabaseServerClient();
      const { data: userData } = await supabase.auth.getUser();
      analysisId = await saveAnalysis(userData.user?.id ?? null, result);
    } catch (persistErr) {
      console.error("[/api/analyze] persistence error (non-blocking):", persistErr);
    }

    return NextResponse.json(
      { ...result, analysisId },
      { headers: { "X-RateLimit-Remaining": String(rateLimit.remaining) } }
    );
  } catch (err: any) {
    console.error("[/api/analyze] error:", err);
    return NextResponse.json(
      { error: err?.message || "Unexpected error during analysis." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { generateInterviewQuestions } from "@/lib/extraction";
import type { ParsedJD, ParsedResume, SkillGapItem } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { jd, resume, gaps } = (await req.json()) as {
      jd: ParsedJD;
      resume: ParsedResume;
      gaps: SkillGapItem[];
    };

    if (!jd || !resume || !gaps) {
      return NextResponse.json(
        { error: "jd, resume, and gaps payloads are all required." },
        { status: 400 }
      );
    }

    const questions = await generateInterviewQuestions(jd, resume, gaps);
    return NextResponse.json({ questions });
  } catch (err: any) {
    console.error("[/api/interview-questions] error:", err);
    return NextResponse.json(
      { error: err?.message || "Unexpected error generating interview questions." },
      { status: 500 }
    );
  }
}

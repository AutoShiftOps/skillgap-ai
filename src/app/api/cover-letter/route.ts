import { NextRequest, NextResponse } from "next/server";
import { generateCoverLetter } from "@/lib/extraction";
import type { ParsedJD, ParsedResume } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { jd, resume } = (await req.json()) as {
      jd: ParsedJD;
      resume: ParsedResume;
    };

    if (!jd || !resume) {
      return NextResponse.json(
        { error: "Both jd and resume payloads are required." },
        { status: 400 }
      );
    }

    const coverLetter = await generateCoverLetter(jd, resume);
    return NextResponse.json({ coverLetter });
  } catch (err: any) {
    console.error("[/api/cover-letter] error:", err);
    return NextResponse.json(
      { error: err?.message || "Unexpected error generating cover letter." },
      { status: 500 }
    );
  }
}

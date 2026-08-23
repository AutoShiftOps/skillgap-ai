import { NextRequest, NextResponse } from "next/server";
import { generateCoverLetter } from "@/lib/extraction";
import { checkRateLimit, getClientIdentifier, pruneExpiredBuckets } from "@/lib/rateLimit";
import type { ParsedJD, ParsedResume } from "@/lib/types";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  pruneExpiredBuckets();

  const identifier = getClientIdentifier(req);
  const rateLimit = checkRateLimit(identifier);

  if (!rateLimit.allowed) {
    const retryAfterSeconds = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
    return NextResponse.json(
      { error: `Rate limit exceeded. Try again in ${retryAfterSeconds}s.` },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

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

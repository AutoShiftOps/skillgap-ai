import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createShareLink } from "@/lib/persistence";

export async function POST(req: NextRequest) {
  try {
    const { analysisId } = (await req.json()) as { analysisId: string };
    if (!analysisId) {
      return NextResponse.json({ error: "analysisId is required." }, { status: 400 });
    }

    const supabase = createSupabaseServerClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      return NextResponse.json(
        { error: "Sign in to create a shareable link." },
        { status: 401 }
      );
    }

    const shareToken = await createShareLink(userData.user.id, analysisId);
    return NextResponse.json({ shareToken });
  } catch (err: any) {
    console.error("[/api/share] error:", err);
    return NextResponse.json(
      { error: err?.message || "Unable to create share link." },
      { status: 500 }
    );
  }
}

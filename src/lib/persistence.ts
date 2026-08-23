import { createSupabaseServiceClient } from "./supabase/serviceClient";
import type { AnalysisResult } from "./types";

/**
 * Persists a completed analysis (resume + JD + gaps + score) for a signed-in
 * user. Silently no-ops (returns null) for anonymous/unauthenticated users
 * rather than throwing, so the core analyze flow keeps working without an
 * account -- persistence is an enhancement, not a requirement.
 */
export async function saveAnalysis(
  userId: string | null,
  result: AnalysisResult
): Promise<string | null> {
  if (!userId) return null;

  const supabase = createSupabaseServiceClient();

  const { data: resumeRow, error: resumeErr } = await supabase
    .from("resumes")
    .insert({
      user_id: userId,
      name: result.resume.name || null,
      headline: result.resume.headline || null,
      raw_text: result.resume.rawText,
      parsed_json: result.resume
    })
    .select("id")
    .single();
  if (resumeErr) throw resumeErr;

  const { data: jdRow, error: jdErr } = await supabase
    .from("job_descriptions")
    .insert({
      user_id: userId,
      title: result.jd.title || null,
      company: result.jd.company || null,
      raw_text: result.jd.rawText,
      parsed_json: result.jd
    })
    .select("id")
    .single();
  if (jdErr) throw jdErr;

  const { data: analysisRow, error: analysisErr } = await supabase
    .from("analyses")
    .insert({
      user_id: userId,
      resume_id: resumeRow.id,
      job_description_id: jdRow.id,
      gaps_json: result.gaps,
      unicorn_score_json: result.unicornScore,
      match_percentage: result.matchPercentage,
      technical_match_percentage: result.technicalMatchPercentage,
      managerial_match_percentage: result.managerialMatchPercentage
    })
    .select("id")
    .single();
  if (analysisErr) throw analysisErr;

  return analysisRow.id as string;
}

export async function getAnalysisHistory(userId: string) {
  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("analyses")
    .select(
      "id, match_percentage, technical_match_percentage, managerial_match_percentage, unicorn_score_json, created_at, job_descriptions(title, company), resumes(name)"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return data;
}

function generateShareToken(): string {
  const bytes = new Uint8Array(9);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return Buffer.from(bytes)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function createShareLink(
  userId: string,
  analysisId: string
): Promise<string> {
  const supabase = createSupabaseServiceClient();

  const { data: analysis, error: fetchErr } = await supabase
    .from("analyses")
    .select("id, user_id")
    .eq("id", analysisId)
    .eq("user_id", userId)
    .single();
  if (fetchErr || !analysis) {
    throw new Error("Analysis not found or you do not have access to it.");
  }

  const shareToken = generateShareToken();
  const { error: insertErr } = await supabase.from("shared_results").insert({
    analysis_id: analysisId,
    share_token: shareToken,
    is_public: true
  });
  if (insertErr) throw insertErr;

  return shareToken;
}

export async function getSharedResult(shareToken: string) {
  const supabase = createSupabaseServiceClient();

  const { data: share, error: shareErr } = await supabase
    .from("shared_results")
    .select("id, analysis_id, view_count, expires_at")
    .eq("share_token", shareToken)
    .eq("is_public", true)
    .single();
  if (shareErr || !share) return null;

  if (share.expires_at && new Date(share.expires_at) < new Date()) return null;

  await supabase
    .from("shared_results")
    .update({ view_count: share.view_count + 1 })
    .eq("id", share.id);

  const { data: analysis, error: analysisErr } = await supabase
    .from("analyses")
    .select(
      "match_percentage, technical_match_percentage, managerial_match_percentage, unicorn_score_json, gaps_json, created_at, job_descriptions(title, company)"
    )
    .eq("id", share.analysis_id)
    .single();
  if (analysisErr || !analysis) return null;

  return analysis;
}

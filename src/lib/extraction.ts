import { getOpenAIClient, CHAT_MODEL } from "./openaiClient";
import {
  JD_EXTRACTION_SYSTEM_PROMPT,
  RESUME_EXTRACTION_SYSTEM_PROMPT,
  UNICORN_SCORE_SYSTEM_PROMPT,
  GAP_ANALYSIS_SYSTEM_PROMPT,
  COVER_LETTER_SYSTEM_PROMPT,
  INTERVIEW_QUESTIONS_SYSTEM_PROMPT
} from "./prompts";
import type {
  ParsedJD,
  ParsedResume,
  UnicornScore,
  SkillGapItem,
  InterviewQuestion
} from "./types";

export class ModelResponseError extends Error {
  constructor(message: string, public raw?: string) {
    super(message);
    this.name = "ModelResponseError";
  }
}

function safeJSONParse<T>(content: string): T {
  try {
    return JSON.parse(content) as T;
  } catch {
    const stripped = content
      .trim()
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/, "")
      .trim();
    try {
      return JSON.parse(stripped) as T;
    } catch (err) {
      throw new ModelResponseError(
        "The AI model returned a response that could not be parsed. Please try again.",
        content
      );
    }
  }
}

async function chatJSON<T>(system: string, user: string): Promise<T> {
  const client = getOpenAIClient();
  const completion = await client.chat.completions.create({
    model: CHAT_MODEL,
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user }
    ]
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new ModelResponseError("Empty response from model. Please try again.");
  }
  return safeJSONParse<T>(content);
}

export async function extractJD(rawText: string): Promise<ParsedJD> {
  const parsed = await chatJSON<Omit<ParsedJD, "rawText">>(
    JD_EXTRACTION_SYSTEM_PROMPT,
    rawText
  );
  return { ...parsed, rawText };
}

export async function extractResume(rawText: string): Promise<ParsedResume> {
  const parsed = await chatJSON<Omit<ParsedResume, "rawText">>(
    RESUME_EXTRACTION_SYSTEM_PROMPT,
    rawText
  );
  return { ...parsed, rawText };
}

export async function computeUnicornScore(jd: ParsedJD): Promise<UnicornScore> {
  const payload = JSON.stringify({
    title: jd.title,
    seniority: jd.seniority,
    technicalSkills: jd.technicalSkills,
    managerialSkills: jd.managerialSkills,
    domainSkills: jd.domainSkills,
    responsibilities: jd.responsibilities
  });
  return chatJSON<UnicornScore>(UNICORN_SCORE_SYSTEM_PROMPT, payload);
}

export async function computeGapAnalysis(
  jd: ParsedJD,
  resume: ParsedResume
): Promise<SkillGapItem[]> {
  const payload = JSON.stringify({ jd, resume });
  const result = await chatJSON<{ gaps: SkillGapItem[] }>(
    GAP_ANALYSIS_SYSTEM_PROMPT,
    payload
  );
  return result.gaps;
}

export async function generateCoverLetter(
  jd: ParsedJD,
  resume: ParsedResume
): Promise<string> {
  const client = getOpenAIClient();
  const completion = await client.chat.completions.create({
    model: CHAT_MODEL,
    temperature: 0.4,
    messages: [
      { role: "system", content: COVER_LETTER_SYSTEM_PROMPT },
      {
        role: "user",
        content: JSON.stringify({ jobDescription: jd, resume })
      }
    ]
  });
  return completion.choices[0]?.message?.content?.trim() || "";
}

export async function generateInterviewQuestions(
  jd: ParsedJD,
  resume: ParsedResume,
  gaps: SkillGapItem[]
): Promise<InterviewQuestion[]> {
  const payload = JSON.stringify({ jd, resume, gaps });
  const result = await chatJSON<{ questions: InterviewQuestion[] }>(
    INTERVIEW_QUESTIONS_SYSTEM_PROMPT,
    payload
  );
  return result.questions;
}

export function computeMatchPercentages(gaps: SkillGapItem[]) {
  const score = (status: string) =>
    status === "match" ? 1 : status === "partial" ? 0.5 : 0;

  const overall = gaps.length
    ? (gaps.reduce((sum, g) => sum + score(g.status), 0) / gaps.length) * 100
    : 0;

  const technical = gaps.filter((g) => g.category === "technical");
  const managerial = gaps.filter((g) => g.category === "managerial");

  const technicalPct = technical.length
    ? (technical.reduce((sum, g) => sum + score(g.status), 0) / technical.length) * 100
    : 0;

  const managerialPct = managerial.length
    ? (managerial.reduce((sum, g) => sum + score(g.status), 0) / managerial.length) * 100
    : 0;

  return {
    matchPercentage: Math.round(overall),
    technicalMatchPercentage: Math.round(technicalPct),
    managerialMatchPercentage: Math.round(managerialPct)
  };
}

/**
 * Lightweight stylistic-risk heuristic applied ONLY to SkillGap AI's own
 * generated suggestions and cover letters -- NOT a general-purpose AI
 * detector for arbitrary resumes. Third-party AI-resume detectors show
 * 67-82% real-world accuracy with meaningful false-positive rates (see
 * README), so building a general detector would inherit the same
 * liability. This heuristic instead flags a narrow, well-documented set of
 * stylistic patterns that recruiters and detectors commonly associate with
 * generic AI writing, so a user can revise their generated text before
 * sending it.
 */

export interface DetectorRiskFlag {
  pattern: string;
  match: string;
  suggestion: string;
}

export interface DetectorRiskResult {
  riskLevel: "low" | "medium" | "high";
  flags: DetectorRiskFlag[];
}

const OVERUSED_PHRASES: { pattern: RegExp; label: string; suggestion: string }[] = [
  {
    pattern: /\bleverage[ds]?\b/gi,
    label: '"leverage(d)"',
    suggestion: 'Replace with a concrete verb (e.g. "used," "applied," "built on").'
  },
  {
    pattern: /\bspearhead(ed|ing)?\b/gi,
    label: '"spearhead(ed)"',
    suggestion: 'Replace with a specific action (e.g. "led," "initiated," "drove").'
  },
  {
    pattern: /\bdelve[ds]?\s+into\b/gi,
    label: '"delve into"',
    suggestion: "Replace with a direct description of what you actually did."
  },
  {
    pattern: /\bin\s+today'?s\s+(fast-paced|competitive|ever-evolving)\b/gi,
    label: "generic opener phrase",
    suggestion: "Cut this filler entirely and open with a specific fact or achievement."
  },
  {
    pattern: /\bpassionate\s+about\b/gi,
    label: '"passionate about"',
    suggestion: "Show it with a specific example instead of stating it directly."
  },
  {
    pattern: /\btapestry\b/gi,
    label: '"tapestry"',
    suggestion: "This word is a strong AI-writing tell; remove or replace with plain language."
  },
  {
    pattern: /\bunlock(ing)?\s+(potential|value|opportunities)\b/gi,
    label: '"unlock potential/value"',
    suggestion: "Replace with the specific outcome you achieved."
  },
  {
    pattern: /\bholistic\b/gi,
    label: '"holistic"',
    suggestion: "Replace with a specific description of scope."
  },
  {
    pattern: /\bsynerg(y|ies|istic)\b/gi,
    label: '"synergy/synergies"',
    suggestion: "Replace with a concrete description of collaboration or integration."
  },
  {
    pattern: /\brobust\s+(solution|framework|approach)\b/gi,
    label: '"robust solution/framework"',
    suggestion: "Name the actual solution and why it held up, instead of the adjective."
  }
];

/**
 * Detects uniform, repetitive sentence-length patterns -- another commonly
 * cited stylistic signal in detector research -- by measuring the variance
 * of sentence word-counts. Very low variance across many sentences is a
 * mild risk signal on its own (not conclusive), so it's weighted lightly.
 */
function hasUniformSentenceLengths(text: string): boolean {
  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (sentences.length < 4) return false;

  const wordCounts = sentences.map((s) => s.split(/\s+/).length);
  const mean = wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length;
  const variance =
    wordCounts.reduce((sum, c) => sum + Math.pow(c - mean, 2), 0) / wordCounts.length;
  const stdDev = Math.sqrt(variance);

  return stdDev / mean < 0.25;
}

export function assessDetectorRisk(text: string): DetectorRiskResult {
  const flags: DetectorRiskFlag[] = [];

  for (const { pattern, label, suggestion } of OVERUSED_PHRASES) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      flags.push({ pattern: label, match: matches[0], suggestion });
    }
  }

  const uniformSentences = hasUniformSentenceLengths(text);
  if (uniformSentences) {
    flags.push({
      pattern: "uniform sentence length",
      match: "(structural pattern across the whole text)",
      suggestion:
        "Vary sentence length -- mix short, direct sentences with longer ones to sound less templated."
    });
  }

  let riskLevel: DetectorRiskResult["riskLevel"] = "low";
  if (flags.length >= 4) riskLevel = "high";
  else if (flags.length >= 2) riskLevel = "medium";

  return { riskLevel, flags };
}

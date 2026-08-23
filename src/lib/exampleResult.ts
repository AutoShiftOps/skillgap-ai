import type { AnalysisResult } from "./types";

/**
 * A static, precomputed example result shown directly on the landing page
 * so a first-time visitor sees real product output before doing anything --
 * instead of a bare form that requires an act of trust before any payoff.
 * This is NOT live-generated; it is a fixed illustrative example paired with
 * the sample JD/resume already used by the "Try a sample" flow.
 */
export const EXAMPLE_RESULT_PREVIEW = {
  jdTitle: "Senior Staff Platform Engineer / Engineering Manager",
  unicornScore: {
    score: 78,
    band: "Unicorn posting" as const,
    archetypesDetected: ["Staff/Principal Engineer", "Engineering Manager", "FinOps Lead"],
    rationale:
      "This posting asks one person to be a hands-on Staff-level architect, a people manager for 8 engineers with budget ownership, and a cost-optimization lead -- three distinct role archetypes rarely held by one honest candidate profile."
  },
  matchPercentage: 62,
  technicalMatchPercentage: 81,
  managerialMatchPercentage: 24,
  topGaps: [
    { skill: "People management (5+ yrs)", status: "missing" as const },
    { skill: "Budget ownership", status: "missing" as const },
    { skill: "AWS (EKS, Lambda, RDS)", status: "match" as const }
  ]
};

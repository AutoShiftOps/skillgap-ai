export interface SkillItem {
  name: string;
  category: "technical" | "managerial" | "domain" | "soft";
  required: boolean;
  yearsRequired?: number;
}

export interface ParsedJD {
  title: string;
  company?: string;
  seniority?: string;
  technicalSkills: SkillItem[];
  managerialSkills: SkillItem[];
  domainSkills: SkillItem[];
  softSkills: SkillItem[];
  responsibilities: string[];
  rawText: string;
}

export interface ParsedResume {
  name?: string;
  headline?: string;
  skills: string[];
  roles: {
    title: string;
    company?: string;
    duration?: string;
    achievements: string[];
  }[];
  education: string[];
  rawText: string;
}

export type GapStatus = "match" | "partial" | "missing";

export interface SkillGapItem {
  skill: string;
  category: SkillItem["category"];
  status: GapStatus;
  evidence?: string;
  suggestion?: string;
}

export interface UnicornScore {
  score: number;
  archetypesDetected: string[];
  rationale: string;
}

export interface AnalysisResult {
  jd: ParsedJD;
  resume: ParsedResume;
  gaps: SkillGapItem[];
  matchPercentage: number;
  technicalMatchPercentage: number;
  managerialMatchPercentage: number;
  unicornScore: UnicornScore;
}

export interface InterviewQuestion {
  question: string;
  type: "technical" | "managerial" | "behavioral" | "gap-probe";
  basedOn: string;
}

"use client";
import { useState } from "react";
import UploadForm from "@/components/UploadForm";
import UnicornScoreCard from "@/components/UnicornScoreCard";
import MatchSummary from "@/components/MatchSummary";
import GapTable from "@/components/GapTable";
import CoverLetterPanel from "@/components/CoverLetterPanel";
import InterviewPrepPanel from "@/components/InterviewPrepPanel";
import type { AnalysisResult } from "@/lib/types";

export default function HomePage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Is this JD asking for a unicorn — or are you actually missing skills?
        </h1>
        <p className="text-slate-600 max-w-2xl">
          Paste a job posting and your resume. SkillGap AI scores how realistic the JD
          actually is, maps your genuine skill gaps across technical and managerial
          dimensions, and gives you an honest path forward — no fabricated experience,
          ever.
        </p>
      </section>

      <UploadForm onResult={setResult} />

      {result && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <UnicornScoreCard score={result.unicornScore} />
            <MatchSummary
              matchPercentage={result.matchPercentage}
              technicalMatchPercentage={result.technicalMatchPercentage}
              managerialMatchPercentage={result.managerialMatchPercentage}
            />
          </div>
          <GapTable gaps={result.gaps} />
          <div className="grid md:grid-cols-2 gap-6">
            <CoverLetterPanel jd={result.jd} resume={result.resume} />
            <InterviewPrepPanel jd={result.jd} resume={result.resume} gaps={result.gaps} />
          </div>
        </div>
      )}
    </div>
  );
}

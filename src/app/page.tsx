"use client";
import { useState } from "react";
import UploadForm from "@/components/UploadForm";
import VerdictBanner from "@/components/VerdictBanner";
import MatchSummary from "@/components/MatchSummary";
import GapTable from "@/components/GapTable";
import CoverLetterPanel from "@/components/CoverLetterPanel";
import InterviewPrepPanel from "@/components/InterviewPrepPanel";
import ErrorBoundary from "@/components/ErrorBoundary";
import ShareButton from "@/components/ShareButton";
import ExamplePreview from "@/components/ExamplePreview";
import TrustSection from "@/components/TrustSection";
import StaggerReveal from "@/components/StaggerReveal";
import type { AnalysisResult } from "@/lib/types";

type ResultWithId = AnalysisResult & { analysisId: string | null };

export default function HomePage() {
  const [result, setResult] = useState<ResultWithId | null>(null);

  return (
    <div className="space-y-10">
      <section className="text-center max-w-2xl mx-auto">
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-3">
          Built after a real hiring debate at a Techsauga meetup
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3 leading-tight">
          Is this job description asking for a unicorn &mdash; or are you actually
          missing skills?
        </h1>
        <p className="text-slate-600">
          Paste any job posting and your resume. Get a realism score for the JD itself, a
          skill-by-skill gap map, and an honest cover letter &mdash; never a fabricated one.
        </p>
      </section>

      {!result && <ExamplePreview />}

      <ErrorBoundary>
        <UploadForm onResult={setResult} />
      </ErrorBoundary>

      {!result && <TrustSection />}

      {result && (
        <ErrorBoundary>
          <div className="space-y-6">
            <StaggerReveal>
              <VerdictBanner score={result.unicornScore} />
            </StaggerReveal>

            <StaggerReveal delayMs={150}>
              <MatchSummary
                matchPercentage={result.matchPercentage}
                technicalMatchPercentage={result.technicalMatchPercentage}
                managerialMatchPercentage={result.managerialMatchPercentage}
              />
            </StaggerReveal>

            <StaggerReveal delayMs={250}>
              <div className="flex justify-end">
                <ShareButton analysisId={result.analysisId} />
              </div>
            </StaggerReveal>

            <StaggerReveal delayMs={350}>
              <GapTable gaps={result.gaps} />
            </StaggerReveal>

            <StaggerReveal delayMs={500}>
              <div className="grid md:grid-cols-2 gap-6">
                <CoverLetterPanel jd={result.jd} resume={result.resume} />
                <InterviewPrepPanel jd={result.jd} resume={result.resume} gaps={result.gaps} />
              </div>
            </StaggerReveal>
          </div>
        </ErrorBoundary>
      )}
    </div>
  );
}

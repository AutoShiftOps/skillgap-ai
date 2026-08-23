# SkillGap AI — Roadmap

This roadmap tracks the product from initial concept validation through MVP launch and beyond.
Each phase below corresponds to a GitHub Issue (labeled `phase`) in this repository, closed with
a completion note once its milestone deliverables were merged into `main`.

## Phase 0 — Foundations & Problem Validation ✅ Closed

**Goal:** Validate the core hypothesis before writing product code.

- [x] Validate "hybrid unicorn JD" pattern and AI-resume-inflation dynamic against external
      sources (AI-detection adoption stats, ATS detector accuracy studies, competitor
      landscape scan of Jobscan/Teal/JobFix/Seekario/InstaApply).
- [x] Identify product wedge: JD-realism scoring + semantic gap mapping + strict
      anti-fabrication stance, distinct from existing keyword-matching tools.
- [x] Define MVP scope: single-session JD-vs-resume analysis, no auth, no persistence.

## Phase 1 — MVP Core Build ✅ Closed

**Goal:** Ship a working end-to-end flow: JD in, resume in, gap analysis out.

- [x] Next.js 14 + TypeScript + Tailwind scaffold.
- [x] JD ingestion: URL fetch (`jdFetcher.ts`) + paste-text fallback.
- [x] Resume ingestion: PDF/DOCX/TXT upload (`fileParsers.ts`) + paste-text fallback.
- [x] LLM-based structured extraction for JD (`extractJD`) and resume (`extractResume`),
      splitting skills into technical / managerial / domain / soft categories.
- [x] `/api/analyze` route wiring extraction → gap analysis → match percentages.
- [x] Skill-gap table UI with match / partial / missing states and honest suggestions.

## Phase 2 — Unicorn Score & Match Intelligence ✅ Closed

**Goal:** Ship the core differentiator — JD realism scoring — and richer match insight.

- [x] `computeUnicornScore`: LLM-based 0–100 realism score with detected role archetypes
      and rationale.
- [x] `UnicornScoreCard` UI component with banded labeling (coherent → unicorn posting).
- [x] Overall / technical / managerial match percentage breakdown (`MatchSummary`).
- [x] Anti-fabrication guardrails embedded directly in extraction and gap-analysis prompts.

## Phase 3 — Cover Letter & Interview Prep ✅ Closed

**Goal:** Close the loop from analysis to application-ready output.

- [x] `/api/cover-letter` route + `generateCoverLetter`, strictly grounded in resume content.
- [x] `/api/interview-questions` route + `generateInterviewQuestions` (technical, managerial,
      behavioral, gap-probe question types).
- [x] `CoverLetterPanel` and `InterviewPrepPanel` UI components.
- [x] End-to-end manual QA pass: JD URL fetch failure fallback, PDF parsing, DOCX parsing,
      malformed-JSON model-response handling.

## Phase 4 — Documentation, Deployment & Launch Readiness ✅ Closed

**Goal:** Make the repo self-serve for contributors and end users.

- [x] Full README with problem framing, grounded data points, architecture, and setup steps.
- [x] `DEPLOYMENT.md` with step-by-step Vercel deployment instructions.
- [x] `.env.example` documenting every required/optional environment variable.
- [x] `CHANGELOG.md` initialized with `v0.1.0` release notes.
- [x] MIT license.
- [x] GitHub Issues created for all five phases, each closed with a completion comment,
      preserving build history.

## Phase 5 — Production Hardening ✅ Closed

**Goal:** Close gaps identified after the initial MVP that would block or risk a safe public
deployment.

- [x] `.eslintrc.json` extending `next/core-web-vitals`.
- [x] In-memory IP-based rate limiter applied to all three AI-backed routes.
- [x] `maxDuration = 60` exported from all AI-backed routes.
- [x] Safe JSON parsing with markdown-fence stripping and a typed `ModelResponseError`.
- [x] Jest test suite covering match percentages, rate limiting, and JD fetch behavior.
- [x] "Try a sample JD + resume" fixture and button.
- [x] `ErrorBoundary` component wrapping the upload form and results UI.
- [x] Version bumped to `0.2.0`.

## Phase 6 — Persistence & Multi-JD Tracking ✅ Closed

**Goal:** Persist resumes, JDs, and analyses for signed-in users via Supabase/Postgres.

- [x] `resumes`, `job_descriptions`, `analyses`, `shared_results` tables with `pgvector`
      extension enabled for future embedding-based matching.
- [x] Row Level Security policies restricting access to each user's own data, with a public
      read exception for non-expired shared results.
- [x] `src/lib/supabase/{client,server}.ts` — browser, server, and service-role clients.
- [x] `src/lib/persistence.ts` — `saveAnalysis`, `getAnalysisHistory`, `createShareLink`,
      `getSharedResult`.
- [x] `/api/analyze` persists analyses for signed-in users, non-blocking for anonymous use.

## Phase 7 — Authentication & Saved Profiles ✅ Closed

**Goal:** Let a candidate sign in and have their analyses tied to their account.

- [x] Supabase magic-link (email OTP) authentication.
- [x] `src/middleware.ts` session refresh on every request.
- [x] `/auth/callback` route exchanging the magic-link code for a session.
- [x] `AuthWidget` header component (sign-in form ↔ signed-in state).

## Phase 8 — Detector-Risk Feedback on Generated Text ✅ Closed

**Goal:** Flag AI-writing-style risk in SkillGap AI's own generated cover letters, without
building a general-purpose resume detector.

- [x] `src/lib/detectorRisk.ts` — flags overused AI-writing phrases and uniform
      sentence-length patterns.
- [x] Applied only to generated cover letters via `/api/cover-letter`, never to the user's
      actual resume.
- [x] Risk badge + per-flag suggestions in `CoverLetterPanel`.
- [x] Jest test coverage for low/medium/high risk scenarios.

## Phase 9 — Mobile Experience (PWA) ✅ Closed

**Goal:** Make the app installable and usable on mobile without a native rebuild.

- [x] `public/manifest.json` PWA manifest.
- [x] `public/sw.js` service worker (network-first, API routes excluded from caching).
- [x] `ServiceWorkerRegister` component.

**Deferred:** app icon PNG assets (`/icon-192.png`, `/icon-512.png`) not yet generated.

## Phase 10 — Shareable "Unicorn Score" Links ✅ Closed

**Goal:** Let signed-in users share a read-only view of their JD realism score for organic
distribution.

- [x] `shared_results` table with unique share tokens, view counts, optional expiry.
- [x] `/api/share` route generating a share token for an owned analysis.
- [x] Public `/share/[token]` page rendering the Unicorn Score and match summary.
- [x] `ShareButton` component in the results UI.

**Deferred:** aggregate, anonymized "Unicorn Index" cross-analysis trend content engine.

---

## Future phases (not yet started)

### Phase 11 — Embedding-Based Semantic Matching
- Wire the `embedding vector(1536)` columns (already in the schema) into the extraction
  pipeline, replacing pure LLM-judgment gap analysis with a hybrid embedding + LLM approach
  for speed, cost, and consistency at scale.
- Durable rate limiting (Upstash Redis or Postgres-backed) replacing the in-memory limiter.

### Phase 12 — Resume History & Multi-Resume Management UI
- UI for viewing past analyses (`getAnalysisHistory` already implemented server-side).
- Resume version history and switching between saved resumes for new analyses.

### Phase 13 — Aggregate "Unicorn Index" Content Engine
- Publish aggregate, anonymized unicorn-score trends by role/industry as shareable content
  (LinkedIn posts, blog) — supports organic distribution without paid acquisition.

### Phase 14 — PWA Asset Polish & GitHub OAuth
- Generate and add `/icon-192.png` and `/icon-512.png` app icons.
- Add GitHub OAuth as a second sign-in option alongside magic-link email.

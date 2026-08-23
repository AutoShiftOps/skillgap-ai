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

- [x] `.eslintrc.json` extending `next/core-web-vitals` (previously missing; broke `npm run lint`
      on a fresh clone).
- [x] In-memory IP-based rate limiter (`src/lib/rateLimit.ts`) applied to all three AI-backed
      routes, protecting shared OpenAI API costs on the public demo.
- [x] `maxDuration = 60` exported from all AI-backed routes to reduce Vercel serverless timeout
      risk across the multi-call OpenAI sequence.
- [x] Safe JSON parsing with markdown-fence stripping and a typed `ModelResponseError` in
      `src/lib/extraction.ts`, replacing unhandled exceptions on malformed model output.
- [x] Jest test suite covering `computeMatchPercentages`, the rate limiter, and JD URL
      fetch/HTML-stripping behavior.
- [x] "Try a sample JD + resume" fixture and button, removing first-visit friction and doubling
      as a manual QA fixture.
- [x] `ErrorBoundary` component wrapping the upload form and results UI.
- [x] Version bumped to `0.2.0`; `CHANGELOG.md` updated.

**Known limitation carried forward:** the rate limiter is in-memory and per-instance — a
best-effort deterrent, not a hard guarantee, until Phase 6 introduces persistent storage.

---

## Future phases (not yet started)

### Phase 6 — Persistence & Multi-JD Tracking
- Postgres + `pgvector` integration for storing parsed resumes and JDs.
- Embedding-based semantic matching (replacing pure LLM-judgment gap analysis) for speed,
  cost, and consistency at scale.
- Durable rate limiting (Upstash Redis or Postgres-backed) replacing the in-memory limiter.
- Job-application tracker: save multiple JD analyses per resume over time.

### Phase 7 — Authentication & Saved Profiles
- User accounts (NextAuth or Clerk) so a candidate can pre-upload one resume and run it
  against many JDs without re-uploading.
- Resume version history.

### Phase 8 — Detector-Risk Feedback on Generated Text
- Lightweight stylistic-risk heuristic applied only to SkillGap AI's own generated
  suggestions/cover letters (not a general-purpose AI detector), warning users when a
  suggested phrase resembles high-flag patterns identified in third-party detector research.

### Phase 9 — Mobile Experience
- React Native or PWA wrapper for on-the-go JD scanning (e.g., scanning a JD immediately
  after a meetup conversation or LinkedIn scroll).

### Phase 10 — Aggregate "Unicorn Index" Content Engine
- Publish aggregate, anonymized unicorn-score trends by role/industry as shareable content
  (LinkedIn posts, blog) — supports organic distribution without paid acquisition.
- Shareable result links (e.g. "share my Unicorn Score") for organic distribution, without
  requiring full Phase 7 auth.

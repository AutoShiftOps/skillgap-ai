# Changelog

All notable changes to this project are documented in this file.

## [0.3.0] - 2026-08-23

### Added
- **Persistence (Phase 6):** Supabase/Postgres integration — `resumes`, `job_descriptions`,
  `analyses`, `shared_results` tables with Row Level Security and `pgvector` support.
  `/api/analyze` now persists analyses for signed-in users (non-blocking for anonymous use).
- **Auth (Phase 7):** Supabase magic-link email authentication, session-refresh middleware,
  and an `AuthWidget` header component.
- **Detector-risk heuristic (Phase 8):** `assessDetectorRisk()` flags overused AI-writing
  phrases and uniform sentence-length patterns in SkillGap AI's own generated cover letters
  only, surfaced via a risk badge in `CoverLetterPanel`.
- **PWA support (Phase 9):** `manifest.json`, a network-first service worker (excluding API
  routes from caching), and a `ServiceWorkerRegister` component.
- **Shareable links (Phase 10):** `/api/share` + public `/share/[token]` page letting
  signed-in users share a read-only Unicorn Score view; `ShareButton` component in the UI.
- `@supabase/ssr` and `@supabase/supabase-js` dependencies.

### Changed
- Bumped version to `0.3.0`.
- `.env.example` documents the new Supabase environment variables.

### Notes
- Anonymous (non-signed-in) use of the core analyze/cover-letter/interview-prep flow is fully
  preserved — persistence and sharing are additive, not required.

## [0.2.0] - 2026-08-23

### Added
- In-memory IP-based rate limiter (`src/lib/rateLimit.ts`) applied to all three
  AI-backed API routes (`/api/analyze`, `/api/cover-letter`, `/api/interview-questions`)
  to protect shared OpenAI API costs on the public demo deployment.
- `maxDuration = 60` exported from all AI-backed routes to extend the Vercel
  serverless function timeout beyond the 10s Hobby-plan default (requires Pro
  plan to take effect above 10s; see DEPLOYMENT.md).
- Safe JSON parsing with markdown-fence stripping and a typed `ModelResponseError`
  in `src/lib/extraction.ts`, so a malformed model response surfaces a clear,
  user-facing error instead of an unhandled exception.
- Jest test suite (`jest.config.js` + 3 test files) covering `computeMatchPercentages`,
  the rate limiter, and JD URL fetch/HTML-stripping behavior.
- `.eslintrc.json` extending `next/core-web-vitals` (previously missing, which broke
  `npm run lint` on a fresh clone).
- "Try a sample JD + resume" button and fixture data (`src/lib/sampleData.ts`),
  letting a first-time visitor see the full flow without pasting a real resume.
- `ErrorBoundary` component wrapping the upload form and results UI, so a render-time
  exception shows a recoverable error card instead of blanking the page.

### Changed
- Bumped version to `0.2.0` to reflect the hardening pass beyond the initial MVP.

## [0.1.0] - 2026-08-23

### Added
- Initial MVP scaffold: Next.js 14 (App Router) + TypeScript + Tailwind CSS.
- JD ingestion via URL fetch (`src/lib/jdFetcher.ts`) or pasted text.
- Resume ingestion via PDF/DOCX/TXT upload (`src/lib/fileParsers.ts`) or pasted text.
- LLM-based structured extraction for job descriptions and resumes
  (`src/lib/extraction.ts`, `src/lib/prompts.ts`), classifying skills into technical,
  managerial, domain, and soft-skill categories.
- Unicorn JD realism score (0–100) with detected role archetypes and rationale.
- Semantic skill-gap analysis (match / partial / missing) with cited evidence and
  honest, non-fabricating improvement suggestions.
- Overall, technical, and managerial match-percentage summary.
- Tailored cover letter generation, strictly grounded in resume content.
- Interview question generation (technical, managerial, behavioral, gap-probe types).
- API routes: `/api/analyze`, `/api/cover-letter`, `/api/interview-questions`, `/api/health`.
- UI components: `UploadForm`, `UnicornScoreCard`, `MatchSummary`, `GapTable`,
  `CoverLetterPanel`, `InterviewPrepPanel`.
- Full README, ROADMAP, DEPLOYMENT guide, `.env.example`, and MIT license.

### Notes
- No authentication or persistence layer yet (stateless, single-session MVP).
- No custom AI-detector built by design; see README "Responsible-use principles."

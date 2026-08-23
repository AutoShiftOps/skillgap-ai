# Changelog

All notable changes to this project are documented in this file.

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

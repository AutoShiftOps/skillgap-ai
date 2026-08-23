# SkillGap AI

**Is the job description asking for a unicorn — or are you actually missing skills?**

SkillGap AI is a decision-support tool for job seekers, born out of a real observation from a
Techsauga meetup discussion: modern job descriptions increasingly demand a blend of deep
technical *and* senior managerial competencies in a single posting, which pushes candidates
toward AI-assisted resume inflation to appear qualified — which in turn has made it harder for
ATS and recruiters to separate authentic signal from generated noise.

Instead of just optimizing a resume's keywords against a JD (what most existing tools do),
SkillGap AI does three things differently:

1. **Scores the JD itself** for realism — is this one coherent role, or 2–3 blended
   role-archetypes compressed into one requisition ("unicorn" posting)?
2. **Maps genuine skill gaps semantically** (not keyword-matching) across technical,
   managerial, domain, and soft-skill dimensions — and is explicit about what's a *match*,
   *partial*, or *missing*.
3. **Refuses to help you fabricate.** Every suggestion is grounded in real resume content;
   gaps too large to word-smith honestly are pointed toward an upskilling action instead.

## Why this exists (grounded in data, not vibes)

- 43% of large employers now use AI-detection tooling in resume screening, and 49% auto-dismiss
  suspected AI-generated content — yet real-world detector accuracy is only 67–82%, well below
  marketed claims, with meaningful false-positive rates that disproportionately hurt non-native
  speakers and career-changers.
- On the candidate side, a large share of technical applicants now use AI or prompt-injection
  tricks specifically to beat ATS keyword filters — and a majority of fraudulent applications
  still pass ATS screening undetected.
- Legacy resume-matching tools (Jobscan-style) score on keyword overlap, a model that is
  increasingly mismatched to modern ATS platforms (Greenhouse, Lever, Ashby) which use semantic
  embeddings — meaning keyword-stuffing to beat one system can actively hurt you on the other.
- The "hybrid unicorn JD" problem is a structural symptom of companies compressing multiple
  roles into a single requisition, which pushes any single honest candidate profile to fall
  short on at least one axis (technical depth *or* management scope) — fueling the incentive to
  inflate both.

SkillGap AI's product wedge is addressing the JD side of this equation (something Jobscan, Teal,
JobFix, and similar tools do not message on) while keeping the candidate side strictly honest.

## Features (MVP)

- **JD ingestion** — paste a URL (auto-fetched and stripped to text) or paste raw JD text
  directly.
- **Resume ingestion** — upload PDF/DOCX/TXT or paste text.
- **Structured extraction** — JD and resume are parsed into structured skills (technical,
  managerial, domain, soft), responsibilities, roles, and achievements via LLM extraction.
- **Unicorn JD score** — 0–100 realism score with detected role archetypes and rationale.
- **Semantic gap analysis** — every JD-required skill is marked match / partial / missing
  against the resume, with cited evidence and an honest, non-fabricating suggestion.
- **Match summary** — overall, technical, and managerial match percentages.
- **Tailored cover letter** — generated strictly from real resume content.
- **Interview question prep** — 8 likely questions (technical, managerial, behavioral, and a
  gap-probe question) grounded in the actual JD and resume.

## Tech stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **AI:** OpenAI Chat Completions (structured JSON extraction + generation) via `openai` SDK
- **File parsing:** `pdf-parse` (PDF), `mammoth` (DOCX)
- **Deployment target:** Vercel
- **Planned (Phase 2+):** Postgres + `pgvector` for persisted embeddings and multi-JD tracking

## Project structure

```
src/
  app/
    api/
      analyze/route.ts              # JD + resume ingestion, extraction, gap analysis
      cover-letter/route.ts         # Cover letter generation
      interview-questions/route.ts  # Interview question generation
      health/route.ts               # Health check
    page.tsx                        # Main single-page UI
    layout.tsx
    globals.css
  components/
    UploadForm.tsx
    UnicornScoreCard.tsx
    MatchSummary.tsx
    GapTable.tsx
    CoverLetterPanel.tsx
    InterviewPrepPanel.tsx
  lib/
    types.ts          # Shared TypeScript types
    prompts.ts         # All LLM system prompts (extraction, scoring, generation)
    extraction.ts       # OpenAI calls + match-percentage logic
    openaiClient.ts     # OpenAI client singleton
    jdFetcher.ts        # URL → plain text fetcher
    fileParsers.ts       # PDF/DOCX/TXT → plain text
    api.ts               # Client-side fetch helpers
```

## Getting started locally

1. Clone the repo and install dependencies:
   ```bash
   git clone https://github.com/AutoShiftOps/skillgap-ai.git
   cd skillgap-ai
   npm install
   ```
2. Copy the environment template and add your OpenAI key:
   ```bash
   cp .env.example .env.local
   # edit .env.local and set OPENAI_API_KEY
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel (end-user access)

See [`DEPLOYMENT.md`](./DEPLOYMENT.md) for full step-by-step Vercel deployment instructions,
including environment variable setup and post-deploy verification.

## Product plan

See [`ROADMAP.md`](./ROADMAP.md) for the full phased roadmap, and the repository's
[GitHub Issues](https://github.com/AutoShiftOps/skillgap-ai/issues) for the phase/milestone
history (all initial-build milestones are tracked and closed with completion notes).

## Responsible-use principles

- The product never generates or suggests fabricated experience, titles, or metrics.
- Gaps that can't be honestly closed by rewriting are pointed toward a real upskilling action
  (course, project, certification) rather than a rephrase.
- The tool does not build or rely on its own "AI-resume detector" — third-party detector
  accuracy in 2026 real-world testing is only 67–82%, and building one would inherit the same
  false-positive liability. Instead, it applies a lightweight stylistic-risk check to its own
  generated suggestions only.

## License

MIT — see [`LICENSE`](./LICENSE).

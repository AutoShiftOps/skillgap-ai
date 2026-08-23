# Deploying SkillGap AI to Vercel

This guide walks through deploying SkillGap AI so end users can access it via a public URL.

## Prerequisites

- A [Vercel](https://vercel.com) account (free tier is sufficient for the MVP).
- An [OpenAI API key](https://platform.openai.com/api-keys) with access to a chat model
  (default: `gpt-4o-mini`).
- This repository pushed to GitHub under `AutoShiftOps/skillgap-ai` (already done).

## 1. Import the project into Vercel

1. Go to [vercel.com/new](https://vercel.com/new).
2. Choose **Import Git Repository** and select `AutoShiftOps/skillgap-ai`.
   - If the org isn't connected yet, click **Add GitHub Account/Org** and grant Vercel access
     to the `AutoShiftOps` organization.
3. Vercel will auto-detect the **Next.js** framework preset from `vercel.json` and
   `package.json`. Leave the default build command (`next build`) and output settings as-is.

## 2. Configure environment variables

In the Vercel project's **Settings → Environment Variables**, add:

| Key | Value | Environment |
|---|---|---|
| `OPENAI_API_KEY` | your real OpenAI secret key | Production, Preview, Development |
| `OPENAI_MODEL` | `gpt-4o-mini` (or your preferred model) | Production, Preview, Development |
| `OPENAI_EMBEDDING_MODEL` | `text-embedding-3-small` | Production, Preview, Development |
| `MAX_JD_CHARS` | `20000` | Production, Preview, Development |
| `MAX_RESUME_CHARS` | `20000` | Production, Preview, Development |

Only `OPENAI_API_KEY` is secret — never commit it to the repo (it's already excluded via
`.gitignore` / `.env.example` pattern).

## 3. Deploy

1. Click **Deploy**. Vercel will install dependencies, run `next build`, and provision a
   production URL (e.g. `https://skillgap-ai.vercel.app` or a project-specific subdomain).
2. Wait for the build to complete (typically 1–2 minutes for this project size).

## 4. Verify the deployment

1. Visit the deployed URL and confirm the homepage loads with the JD/resume upload form.
2. Check the health endpoint to confirm the API key is wired correctly:
   ```
   https://<your-deployment-url>/api/health
   ```
   Expected response:
   ```json
   { "status": "ok", "hasOpenAIKey": true, "model": "gpt-4o-mini" }
   ```
   If `hasOpenAIKey` is `false`, double-check the environment variable was added to the
   **Production** environment and redeploy.
3. Run one full end-to-end test: paste a real JD URL (or text) and upload a sample resume,
   confirm the Unicorn Score, gap table, cover letter, and interview questions all render.

## 5. Custom domain (optional)

1. In **Settings → Domains**, add your domain (e.g. `skillgap.autoshiftops.com`).
2. Follow Vercel's DNS instructions (typically a `CNAME` record pointing to
   `cname.vercel-dns.com`).
3. Vercel provisions SSL automatically once DNS propagates.

## 6. Ongoing deploys

Every push to the `main` branch triggers an automatic production redeploy. Pull requests get
their own preview deployment URL for review before merging — use this to validate changes
(e.g. new phases from the roadmap) before they reach end users.

## Cost note

Each analysis run makes 2–4 OpenAI chat completion calls (JD extraction, resume extraction,
unicorn score, gap analysis), plus 1 call each for cover letter and interview questions if
requested. With `gpt-4o-mini`, a typical full session (analysis + cover letter + interview
prep) costs well under $0.01 in API usage at current OpenAI pricing — monitor usage via the
[OpenAI usage dashboard](https://platform.openai.com/usage) as traffic grows.

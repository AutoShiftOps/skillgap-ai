import type { Metadata } from "next";
import "./globals.css";
import AuthWidget from "@/components/AuthWidget";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "SkillGap AI — Honest JD-to-Resume Gap Analysis",
  description:
    "Paste any job description, upload your resume, and get a semantic skill-gap analysis, a JD realism (\"unicorn\") score, a tailored cover letter, and likely interview questions — without encouraging resume fabrication.",
  manifest: "/manifest.json",
  themeColor: "#141414"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <ServiceWorkerRegister />
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-serif font-bold text-ink-900">SkillGap AI</span>
              <span className="hidden sm:inline text-xs text-slate-400">by AutoShiftOps</span>
            </div>
            <div className="flex items-center gap-4">
              <AuthWidget />
              <a
                href="https://github.com/AutoShiftOps/skillgap-ai"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-400 hover:text-ink-900"
              >
                Source
              </a>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-10">{children}</main>
        <footer className="mx-auto max-w-3xl px-4 py-8 text-xs text-slate-400 border-t border-slate-100 mt-4">
          SkillGap AI never fabricates experience and flags AI-authorship risk in its own
          generated text. Built in the open &mdash; see the{" "}
          <a
            href="https://github.com/AutoShiftOps/skillgap-ai"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-ink-900"
          >
            source and roadmap
          </a>
          .
        </footer>
      </body>
    </html>
  );
}

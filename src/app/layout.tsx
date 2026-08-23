import type { Metadata } from "next";
import "./globals.css";
import AuthWidget from "@/components/AuthWidget";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "SkillGap AI — Honest JD-to-Resume Gap Analysis",
  description:
    "Paste any job description, upload your resume, and get a semantic skill-gap analysis, a JD realism (\"unicorn\") score, a tailored cover letter, and likely interview questions — without encouraging resume fabrication.",
  manifest: "/manifest.json",
  themeColor: "#4338ca"
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
          <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-brand-600">SkillGap</span>
              <span className="text-xl font-bold text-slate-900">AI</span>
            </div>
            <div className="flex items-center gap-4">
              <AuthWidget />
              <a
                href="https://github.com/AutoShiftOps/skillgap-ai"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-slate-500 hover:text-brand-600"
              >
                GitHub
              </a>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 py-8 text-xs text-slate-400">
          SkillGap AI is a decision-support tool. It never fabricates experience and
          flags AI-authorship risk in its own suggestions. Built by AutoShiftOps.
        </footer>
      </body>
    </html>
  );
}

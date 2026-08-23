"use client";
import { useState } from "react";

export default function ShareButton({ analysisId }: { analysisId: string | null }) {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!analysisId) {
    return (
      <p className="text-xs text-slate-400">
        Sign in above to save this analysis and get a shareable link.
      </p>
    );
  }

  async function handleShare() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create share link.");
      const url = `${window.location.origin}/share/${data.shareToken}`;
      setShareUrl(url);
    } catch (e: any) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2">
      {!shareUrl ? (
        <button className="btn-secondary text-sm" onClick={handleShare} disabled={loading}>
          {loading ? "Creating link…" : "Share my Unicorn Score"}
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <input readOnly value={shareUrl} className="input-field text-xs w-64" />
          <button onClick={handleCopy} className="btn-secondary text-sm">
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

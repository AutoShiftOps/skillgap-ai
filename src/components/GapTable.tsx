"use client";
import { useState } from "react";
import type { SkillGapItem } from "@/lib/types";

const statusStyles: Record<string, string> = {
  match: "bg-emerald-100 text-emerald-700",
  partial: "bg-amber-100 text-amber-700",
  missing: "bg-red-100 text-red-700"
};

const categoryLabels: Record<string, string> = {
  technical: "Technical",
  managerial: "Managerial",
  domain: "Domain",
  soft: "Soft skill"
};

export default function GapTable({ gaps }: { gaps: SkillGapItem[] }) {
  const [expanded, setExpanded] = useState(false);

  const ordered = [...gaps].sort((a, b) => {
    const rank = { missing: 0, partial: 1, match: 2 } as Record<string, number>;
    return rank[a.status] - rank[b.status];
  });

  const counts = ordered.reduce(
    (acc, g) => {
      acc[g.status] = (acc[g.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const visibleRows = expanded ? ordered : ordered.slice(0, 4);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Skill-by-Skill Gap Analysis</h3>
        <div className="flex gap-2">
          {counts.missing > 0 && (
            <span className="badge bg-red-100 text-red-700">{counts.missing} missing</span>
          )}
          {counts.partial > 0 && (
            <span className="badge bg-amber-100 text-amber-700">{counts.partial} partial</span>
          )}
          {counts.match > 0 && (
            <span className="badge bg-emerald-100 text-emerald-700">{counts.match} match</span>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="py-2 pr-4">Skill</th>
              <th className="py-2 pr-4">Category</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Suggestion</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((g, i) => (
              <tr key={`${g.skill}-${i}`} className="border-b border-slate-50 align-top">
                <td className="py-2.5 pr-4 font-medium text-slate-800">{g.skill}</td>
                <td className="py-2.5 pr-4 text-slate-500">{categoryLabels[g.category] || g.category}</td>
                <td className="py-2.5 pr-4">
                  <span className={`badge ${statusStyles[g.status]}`}>{g.status}</span>
                </td>
                <td className="py-2.5 pr-4 text-slate-600 max-w-md">
                  {g.suggestion || (g.status === "match" ? g.evidence : "—")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {ordered.length > 4 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-sm text-brand-600 hover:text-brand-700 font-medium"
        >
          {expanded ? "Show fewer" : `Show all ${ordered.length} skills`}
        </button>
      )}
    </div>
  );
}

"use client";

interface Props {
  matchPercentage: number;
  technicalMatchPercentage: number;
  managerialMatchPercentage: number;
}

function Bar({ label, value }: { label: string; value: number }) {
  const color =
    value >= 70 ? "bg-emerald-500" : value >= 40 ? "bg-amber-500" : "bg-red-500";
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-600">{label}</span>
        <span className="font-medium text-slate-900">{value}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function MatchSummary({
  matchPercentage,
  technicalMatchPercentage,
  managerialMatchPercentage
}: Props) {
  return (
    <div className="card space-y-4">
      <h3 className="font-semibold text-lg">Match Summary</h3>
      <Bar label="Overall semantic match" value={matchPercentage} />
      <Bar label="Technical skills" value={technicalMatchPercentage} />
      <Bar label="Managerial skills" value={managerialMatchPercentage} />
    </div>
  );
}

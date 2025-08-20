import React from "react";

export default function ProgressBar({ value, goal }: { value: number; goal: number }) {
  const pct = Math.min(100, (value / goal) * 100);
  return (
    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

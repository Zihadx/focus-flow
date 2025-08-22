import React from "react";

export default function ProgressBar({ value, goal }: { value: number; goal: number }) {
  const pct = Math.min(100, (value / goal) * 100);

  return (
    <div className="relative w-full h-4 bg-gray-100 dark:bg-slate-800/30 backdrop-blur-md rounded-full overflow-hidden border border-white/20 dark:border-slate-700">
      <div
        className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-cyan-900 to-cyan-700 shadow-[0_0_10px_rgba(0,255,255,0.5)] transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
      <span className="absolute right-2 top-0 text-xs font-semibold text-slate-900 dark:text-slate-100">
        {Math.floor(pct)}%
      </span>
    </div>
  );
}

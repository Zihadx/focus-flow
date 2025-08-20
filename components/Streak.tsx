"use client";
import React, { useEffect, useMemo } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { todayKey } from "./utils/date";
import { Flame } from "lucide-react";

const GOAL_MINUTES = 240;

type SessionsMap = Record<string, number[]>;

function computeDayMinutes(map: SessionsMap, date: string): number {
  return (map[date] ?? []).reduce((a, b) => a + b, 0);
}

export default function Streak({ todayMinutes }: { todayMinutes: number }) {
  const [sessions] = useLocalStorage<SessionsMap>("lt.sessions", {});
  const today = todayKey();

  const streak = useMemo(() => {
    let count = 0;
    let d = new Date(today + "T00:00:00");
    if (todayMinutes >= GOAL_MINUTES) count++;
    else return 0;

    while (true) {
      d.setDate(d.getDate() - 1);
      const key = d.toISOString().slice(0, 10);
      const mins = computeDayMinutes(sessions, key);
      if (mins >= GOAL_MINUTES) count++;
      else break;
    }
    return count;
  }, [sessions, today, todayMinutes]);

  useEffect(() => {
    if (streak && streak % 3 === 0) {
      (window as any).notify?.({
        id: crypto.randomUUID(),
        title: `🔥 ${streak}-day streak!`,
        message: "Consistency compounds. Keep going!",
      });
    }
  }, [streak]);

  return (
    <div className="card p-5 bg-white/30 dark:bg-slate-800/30 backdrop-blur-md border border-white/20 dark:border-slate-700 rounded-xl shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Streak</h2>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-orange-50/40 dark:bg-orange-700/40 border border-orange-200/40 dark:border-orange-600/40 flex items-center justify-center backdrop-blur-sm">
          <Flame className="h-6 w-6 text-orange-600 dark:text-orange-200" />
        </div>
        <div>
          <div className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {streak} day{streak === 1 ? "" : "s"}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Consecutive days with ≥ 4 hours
          </div>
        </div>
      </div>

      <div className="mt-4 h-3 w-full bg-white/30 dark:bg-slate-700/30 rounded-full overflow-hidden border border-white/20 dark:border-slate-600">
        <div
          className="h-full bg-gradient-to-r from-orange-400 to-orange-600 shadow-[0_0_8px_rgba(255,165,0,0.5)] transition-all duration-500"
          style={{ width: `${Math.min(100, (streak / 10) * 100)}%` }}
        />
      </div>
      <p className="text-xs text-slate-500 mt-2 dark:text-slate-300">Streak resets if a day is missed.</p>
    </div>
  );
}

"use client";
import React, { useEffect, useMemo } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { todayKey, daysBetween } from "./utils/date";
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
    // Count consecutive days backward from today where minutes >= GOAL_MINUTES
    let count = 0;
    let d = new Date(today + "T00:00:00");
    // Check today first (using prop for live minutes when timer is running)
    const todayTotal = todayMinutes;
    if (todayTotal >= GOAL_MINUTES) count++;
    else return 0;

    // Go backwards
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
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Streak</h2>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center">
          <Flame className="h-6 w-6 text-orange-600" />
        </div>
        <div>
          <div className="text-3xl font-semibold">{streak} day{streak === 1 ? "" : "s"}</div>
          <div className="text-sm text-slate-600">Consecutive days with ≥ 4 hours</div>
        </div>
      </div>

      <div className="mt-4 h-2 w-full bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all"
          style={{ width: `${Math.min(100, (streak / 10) * 100)}%` }}
        />
      </div>
      <p className="text-xs text-slate-500 mt-2">Streak resets if a day is missed.</p>
    </div>
  );
}

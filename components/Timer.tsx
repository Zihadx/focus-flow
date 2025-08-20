"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ProgressBar from "./ProgressBar";
import { formatMinutes, todayKey } from "./utils/date";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { Play, Pause, RotateCcw } from "lucide-react";

const GOAL_MINUTES = 240; // 4 hours

type SessionsMap = Record<string, number[]>; // date -> [session_minutes, ...]

export default function Timer({ onDayMinutesChange }: { onDayMinutesChange?: (mins: number) => void }) {
  const [sessions, setSessions] = useLocalStorage<SessionsMap>("lt.sessions", {});
  const dateKey = todayKey();

  const [isRunning, setIsRunning] = useState(false);
  const [startTs, setStartTs] = useState<number | null>(null);
  const tickRef = useRef<number | null>(null);
  const [liveElapsed, setLiveElapsed] = useState(0); // seconds

  const todayMins = useMemo(() => {
    const total = (sessions[dateKey] ?? []).reduce((a, b) => a + b, 0);
    const live = isRunning ? Math.floor(liveElapsed / 60) : 0;
    return total + live;
  }, [sessions, dateKey, isRunning, liveElapsed]);

  useEffect(() => {
    onDayMinutesChange?.(todayMins);
  }, [todayMins, onDayMinutesChange]);

  useEffect(() => {
    if (isRunning) {
      tickRef.current = window.setInterval(() => {
        setLiveElapsed((s) => s + 1);
      }, 1000) as unknown as number;
    } else if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [isRunning]);

  const start = () => {
    setIsRunning(true);
    setStartTs(Date.now());
    setLiveElapsed(0);
  };

  const stop = () => {
    if (!isRunning || !startTs) return;
    setIsRunning(false);
    const elapsedSec = Math.max(0, Math.floor((Date.now() - startTs) / 1000));
    const elapsedMin = Math.floor(elapsedSec / 60);
    if (elapsedMin > 0) {
      const list = sessions[dateKey] ?? [];
      const next = { ...sessions, [dateKey]: [...list, elapsedMin] };
      setSessions(next);
      (window as any).notify?.({
        id: crypto.randomUUID(),
        title: "Session saved",
        message: `You logged ${formatMinutes(elapsedMin)}. Great job!`,
      });
      // Milestones
      const before = list.reduce((a, b) => a + b, 0);
      const after = before + elapsedMin;
      if (before < GOAL_MINUTES && after >= GOAL_MINUTES) {
        (window as any).notify?.({
          id: crypto.randomUUID(),
          title: "Daily goal reached 🎉",
          message: "You've hit your 4-hour goal today!",
        });
      }
    }
  };

  const resetToday = () => {
    const next = { ...sessions, [dateKey]: [] };
    setSessions(next);
    setIsRunning(false);
    setStartTs(null);
    setLiveElapsed(0);
  };

  // New helper to format hours, minutes, seconds
  const formatHMS = (totalMinutes: number, liveSeconds: number) => {
    const totalSeconds = totalMinutes * 60 + liveSeconds;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Time Tracker</h2>
        <span className="badge">Goal: 4 hours</span>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 p-4 bg-white">
        <div className="text-4xl font-semibold tracking-tight">
          {formatHMS(todayMins, isRunning ? liveElapsed % 60 : 0)}
        </div>
        <div className="text-sm text-slate-600 mt-1">Total today</div>
        <div className="mt-3">
          <ProgressBar value={todayMins} goal={GOAL_MINUTES} />
        </div>

        <div className="mt-4 flex items-center gap-3">
          {!isRunning ? (
            <button onClick={start} className="rounded-xl bg-brand-600 text-white px-4 py-2 hover:bg-brand-700 inline-flex items-center gap-2">
              <Play className="h-4 w-4" /> Start
            </button>
          ) : (
            <button onClick={stop} className="rounded-xl bg-amber-600 text-white px-4 py-2 hover:bg-amber-700 inline-flex items-center gap-2">
              <Pause className="h-4 w-4" /> Stop
            </button>
          )}
          <button onClick={resetToday} className="rounded-xl border px-4 py-2 inline-flex items-center gap-2 hover:bg-slate-50">
            <RotateCcw className="h-4 w-4" /> Reset today
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">Sessions persist in localStorage. Leaving or refreshing keeps your data.</p>
      </div>
    </div>
  );
}

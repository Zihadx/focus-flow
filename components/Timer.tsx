"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ProgressBar from "./ProgressBar";
import {  todayKey } from "./utils/date";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { Play, Pause, RotateCcw } from "lucide-react";

const GOAL_MINUTES = 240; 
const GOAL_SECONDS = GOAL_MINUTES * 60;
type SessionsMap = Record<string, number[]>;

export default function Timer({ onDayMinutesChange }: { onDayMinutesChange?: (mins: number) => void }) {
  const [sessions, setSessions] = useLocalStorage<SessionsMap>("lt.sessions", {});
  const dateKey = todayKey();

  const [isRunning, setIsRunning] = useState(false);
  const [startTs, setStartTs] = useState<number | null>(null);
  const tickRef = useRef<number | null>(null);
  const [liveElapsed, setLiveElapsed] = useState(0);

  const todaySeconds = useMemo(() => {
    const total = (sessions[dateKey] ?? []).reduce((a, b) => a + b, 0);
    const live = isRunning ? liveElapsed : 0;
    return total + live;
  }, [sessions, dateKey, isRunning, liveElapsed]);

  const todayMins = todaySeconds / 60;

  useEffect(() => {
    onDayMinutesChange?.(todayMins);
  }, [todayMins, onDayMinutesChange]);

  useEffect(() => {
    if (isRunning) {
      tickRef.current = window.setInterval(() => setLiveElapsed((s) => s + 1), 1000) as unknown as number;
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
    if (elapsedSec > 0) {
      const list = sessions[dateKey] ?? [];
      const next = { ...sessions, [dateKey]: [...list, elapsedSec] };
      setSessions(next);
      (window as any).notify?.({
        id: crypto.randomUUID(),
        title: "Session saved",
        message: `You logged ${formatSessionTime(elapsedSec)}. Great job!`,
      });
      const before = list.reduce((a, b) => a + b, 0);
      const after = before + elapsedSec;
      if (before < GOAL_SECONDS && after >= GOAL_SECONDS) {
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

  const formatHMS = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const formatSessionTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes === 0) {
      return `${remainingSeconds} seconds`;
    } else if (remainingSeconds === 0) {
      return `${minutes} minutes`;
    } else {
      return `${minutes} minutes ${remainingSeconds} seconds`;
    }
  };

  return (
    <div className="card p-5 bg-white/30 dark:bg-slate-800/30 backdrop-blur-md border border-white/20 dark:border-slate-700 rounded-xl shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Time Tracker</h2>
        <span className="badge dark:bg-slate-800 dark:text-gray-50 bg-white backdrop-blur-lg">Goal: 4 hours</span>
      </div>

      <div className="mt-4 rounded-xl border border-white/20 dark:border-slate-700 p-4 bg-white/30 dark:bg-slate-800/30 backdrop-blur-md">
        <div className="text-4xl font-semibold tracking-tight">
          {formatHMS(todaySeconds)}
        </div>
        <div className="text-sm text-slate-600 mt-1">Total today</div>
        <div className="mt-3">
          <ProgressBar value={todayMins} goal={GOAL_MINUTES} />
        </div>

        <div className="mt-4 flex items-center gap-3">
          {!isRunning ? (
            <button
              onClick={start}
              className="rounded-xl bg-brand-600 text-white px-4 py-2 hover:bg-brand-700 inline-flex items-center gap-2"
            >
              <Play className="h-4 w-4" /> Start
            </button>
          ) : (
            <button
              onClick={stop}
              className="rounded-xl bg-amber-600 text-white px-4 py-2 hover:bg-amber-700 inline-flex items-center gap-2"
            >
              <Pause className="h-4 w-4" /> Stop
            </button>
          )}
          <button
            onClick={resetToday}
            className="rounded-xl border border-gray-500  px-4 py-2 inline-flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="h-4 w-4" /> Reset today
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Your focus sessions are saved—refresh or leave, your progress stays intact.
        </p>
      </div>
    </div>
  );
}
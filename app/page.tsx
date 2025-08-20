"use client";
import React, { useState } from "react";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useLocalStorage } from "@/components/hooks/useLocalStorage";
import { todayKey } from "@/components/utils/date";
import Notifications from "@/components/Notifications";
import Timer from "@/components/Timer";
import Streak from "@/components/Streak";
import DailyTasks from "@/components/DailyTasks";
import MotivationalTip from "@/components/MotivationalTip";

const GOAL_MINUTES = 240;

interface DarkMoodProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export default function Page({ theme, toggleTheme }: DarkMoodProps) {
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [sessions] = useLocalStorage<Record<string, number[]>>(
    "lt.sessions",
    {}
  );
  const key = todayKey();
  const saved = (sessions[key] ?? []).reduce((a, b) => a + b, 0);
  const totalToday = Math.max(saved, todayMinutes);

  const behind = totalToday < GOAL_MINUTES / 2;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-200 overflow-hidden">
      {/* Glow Elements */}
      <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] bg-cyan-400/30 dark:bg-cyan-700/30 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] bg-cyan-500/40 dark:bg-cyan-600/40 blur-[150px] rounded-full pointer-events-none" />

      <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <Notifications />

        <header className="mb-6 md:mb-10 flex items-center justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100"
            >
              FocusFlow
            </motion.h1>
            <p className="text-slate-600 dark:text-slate-300 mt-1">
              Visualize your growth, manage tasks, and track learning hours in a
              minimal and responsive dashboard.
            </p>
          </div>
          <div>
            {/* <button
              className="h-7 px-2"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </button> */}
          </div>
          <div ><p className="badge bg-cyan-500 text-white dark:bg-cyan-800 dark:text-gray-50">Ready to scale</p></div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Timer onDayMinutesChange={setTodayMinutes} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Streak todayMinutes={totalToday} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <DailyTasks />
          </motion.div>
        </section>

        <section className="mt-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <MotivationalTip show={behind} />
          </motion.div>
        </section>

        <footer className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400">
          Built with Next.js + Tailwind • All data stays in your browser
          (localStorage).
        </footer>
      </main>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
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

export default function Page() {
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [sessions] = useLocalStorage<Record<string, number[]>>(
    "lt.sessions",
    {}
  );

  // 👇 theme state saved in localStorage
  const [theme, setTheme] = useLocalStorage<"light" | "dark">(
    "lt.theme",
    "light"
  );

  // Apply theme to <html> classList
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const key = todayKey();
  const saved = (sessions[key] ?? []).reduce((a, b) => a + b, 0);
  const totalToday = Math.max(saved, todayMinutes);
  const behind = totalToday < GOAL_MINUTES / 2;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-200 overflow-hidden">
      {/* Glow Elements -----------------*/}
      <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] bg-cyan-400/30 dark:bg-cyan-700/30 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] bg-cyan-500/40 dark:bg-cyan-600/40 blur-[150px] rounded-full pointer-events-none" />

      <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <Notifications />

        <header className="mb-6 md:mb-10 flex flex-col md:flex-row items-center justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="text-2xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100"
            >
              FocusFlow
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-slate-600 dark:text-slate-300 mt-1"
            >
              Visualize your growth, manage tasks, and track learning hours in a
              minimal and responsive dashboard.
            </motion.p>
          </div>

          <div>
            <motion.p 
            initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            
            className=" text-[12px] font-semibold px-3 py-1 rounded-3xl bg-cyan-500 text-white dark:bg-cyan-700 dark:text-gray-50 flex items-center backdrop-blur-lg">
              Ready to scale
            </motion.p>
          </div>
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
          {/* THEME TOGGLE BUTTON */}
          <motion.button
            onClick={toggleTheme}
            whileTap={{ scale: 0.9 }}
            className="absolute top-5 right-10 md:top-10 md:left-2/3 p-2 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:scale-110 transition h-8 w-8 flex items-center justify-center shadow-md hover:shadow-lg"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
        </section>

        <footer className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400">
          Built with Next.js + Tailwind • All data stays in your browser
          (localStorage).
        </footer>
      </main>
    </div>
  );
}

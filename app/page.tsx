"use client";
import React, { useState } from "react";
import DailyTasks from "../components/DailyTasks";
import Timer from "../components/Timer";
import Streak from "../components/Streak";
import MotivationalTip from "../components/MotivationalTip";
import Notifications from "../components/Notifications";
import { todayKey } from "../components/utils/date";
import { useLocalStorage } from "../components/hooks/useLocalStorage";
import { motion } from "framer-motion";

const GOAL_MINUTES = 240;

export default function Page() {
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [sessions] = useLocalStorage<Record<string, number[]>>("lt.sessions", {});
  const key = todayKey();
  const saved = (sessions[key] ?? []).reduce((a, b) => a + b, 0);
  const totalToday = Math.max(saved, todayMinutes);

  const behind = totalToday < GOAL_MINUTES / 2; // behind schedule if < 2 hours

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <Notifications />
      <header className="mb-6 md:mb-10 flex items-center justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-2xl md:text-4xl font-bold tracking-tight"
          >
            FocusFlow
          </motion.h1>
          <p className="text-slate-600 mt-1">Visualize your growth, manage tasks, and track learning hours in a minimal and responsive dashboard.</p>
        </div>
        <div className="badge">Ready to scale</div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Timer onDayMinutesChange={setTodayMinutes} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Streak todayMinutes={totalToday} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <DailyTasks />
        </motion.div>
      </section>

      <section className="mt-5">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <MotivationalTip show={behind} />
        </motion.div>
      </section>

      <footer className="mt-10 text-center text-sm text-slate-500">
        Built with Next.js + Tailwind • All data stays in your browser (localStorage).
      </footer>
    </main>
  );
}

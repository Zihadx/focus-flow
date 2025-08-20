"use client";
import React, { useEffect, useState } from "react";
import { Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TIPS = [
  "Start with a 25-minute deep-focus sprint (Pomodoro) right now.",
  "Reduce friction: open your editor + notes before anything else.",
  "Turn off notifications for 60 minutes. You’ll finish twice as fast.",
  "If stuck, write down the smallest next action. Then do just that.",
  "Teach what you learned today in 3 bullet points. It will stick.",
  "Remember: imperfect action beats perfect intention.",
  "Split the 4-hour goal into 4 × 1-hour blocks. One block at a time."
];

export default function MotivationalTip({ show }: { show: boolean }) {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 5000); // change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (!show) return null;

  return (
    <div className="card p-5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-yellow-50 border border-yellow-200 flex items-center justify-center">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
        </div>
        <div>
          <div className="font-semibold">Motivation</div>
          <AnimatePresence mode="wait">
            <motion.p
              key={tipIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-slate-700"
            >
              {TIPS[tipIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

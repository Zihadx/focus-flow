"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Notice = {
  id: string;
  title: string;
  message?: string;
};

export default function Notifications() {
  const [toasts, setToasts] = useState<Notice[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    (window as any).notify = (payload: Notice) => {
      setToasts((prev) => [...prev, payload]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== payload.id));
      }, 3500);

      // Native notifications
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(payload.title, { body: payload.message });
      }
    };
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  return (
    <div className="fixed z-50 right-4 bottom-4 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.35 }}
            className="w-80 p-4 rounded-xl bg-white/30 dark:bg-slate-800/30 backdrop-blur-md border border-white/20 dark:border-slate-700 shadow-lg"
          >
            <div className="font-semibold text-slate-900 dark:text-slate-100">{t.title}</div>
            {t.message && (
              <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                {t.message}
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

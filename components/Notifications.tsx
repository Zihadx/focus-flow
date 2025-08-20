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
    // Hook into global window to trigger notifications anywhere without a library.
    if (typeof window === "undefined") return;
    (window as any).notify = (payload: Notice) => {
      setToasts((prev) => [...prev, payload]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== payload.id));
      }, 3500);
      // Also try native notifications if permitted
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
            exit={{ opacity: 0, y: 10 }}
            className="card w-80 p-4 shadow-lg"
          >
            <div className="font-semibold text-slate-900">{t.title}</div>
            {t.message && <div className="text-sm text-slate-600 mt-1">{t.message}</div>}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

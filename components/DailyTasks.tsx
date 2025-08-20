"use client";
import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle, Plus, Trash2 } from "lucide-react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { Task } from "./types";
import { todayKey } from "./utils/date";

const DEFAULT_TASKS: Task[] = [
  { id: "t1", text: "Learn n8n basics", done: false },
  { id: "t2", text: "Build first AI agent demo", done: false },
  { id: "t3", text: "Take notes and summarize", done: false },
];

export default function DailyTasks() {
  const dateKey = todayKey();
  const [tasksMap, setTasksMap] = useLocalStorage<Record<string, Task[]>>(
    "lt.tasks",
    {}
  );
  const tasks = useMemo<Task[]>(() => tasksMap[dateKey] ?? DEFAULT_TASKS, [tasksMap, dateKey]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    if (!tasksMap[dateKey]) {
      setTasksMap({ ...tasksMap, [dateKey]: tasks });
    }
  }, []);

  const toggle = (id: string) => {
    const next = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    setTasksMap({ ...tasksMap, [dateKey]: next });
  };

  const addTask = () => {
    const text = newTask.trim();
    if (!text) return;
    const next = [...tasks, { id: crypto.randomUUID(), text, done: false }];
    setTasksMap({ ...tasksMap, [dateKey]: next });
    setNewTask("");
  };

  const removeTask = (id: string) => {
    const next = tasks.filter((t) => t.id !== id);
    setTasksMap({ ...tasksMap, [dateKey]: next });
  };

  const completed = tasks.filter((t) => t.done).length;

  return (
    <div className="card p-5 bg-white/30 dark:bg-slate-800/30 backdrop-blur-md border border-white/20 dark:border-slate-700 rounded-xl shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Daily Target Checklist</h2>
        <span className="badge bg-cyan-500 text-white dark:bg-gray-700 dark:text-gray-50">
          {completed}/{tasks.length} done
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {tasks.map((t) => (
          <button
            key={t.id}
            onClick={() => toggle(t.id)}
            className={`w-full flex items-center justify-between rounded-xl border p-3 transition duration-200 hover:shadow-lg ${
              t.done
                ? "bg-white/40 dark:bg-gray-900/40 border-slate-200 dark:border-gray-400 backdrop-blur-md"
                : "bg-green-50/30 dark:bg-gray-700/30 border-green-200/30 backdrop-blur-md"
            }`}
          >
            <div className="flex items-center gap-3 text-left">
              <CheckCircle
                className={`h-5 w-5 ${t.done ? "text-green-600" : "text-slate-300"}`}
              />
              <span className={`${t.done ? "line-through text-slate-400 dark:text-slate-400" : ""}`}>
                {t.text}
              </span>
            </div>
            <Trash2
              onClick={(e) => {
                e.stopPropagation();
                removeTask(t.id);
              }}
              className="h-5 w-5 text-slate-300 hover:text-rose-500"
            />
          </button>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          className="flex-1 rounded-xl border border-slate-200 bg-white/30 dark:bg-gray-700/30 px-3 py-2 outline-none backdrop-blur-md focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-200 dark:text-white"
          placeholder="Add a new target..."
        />
        <button
          onClick={addTask}
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 text-white px-4 py-2 hover:bg-cyan-600 dark:bg-gray-700 dark:hover:bg-gray-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      <p className="text-xs text-slate-500 mt-3 dark:text-slate-200">
        Track tasks, never lose progress.
      </p>
    </div>
  );
}

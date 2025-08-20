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
    // Ensure current day is initialized
    if (!tasksMap[dateKey]) {
      setTasksMap({ ...tasksMap, [dateKey]: tasks });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const next = tasks.filter((t) => t.id != id);
    setTasksMap({ ...tasksMap, [dateKey]: next });
  };

  const completed = tasks.filter((t) => t.done).length;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Daily Target Checklist</h2>
        <span className="badge">{completed}/{tasks.length} done</span>
      </div>
      <div className="mt-4 space-y-2">
        {tasks.map((t) => (
          <button
            key={t.id}
            onClick={() => toggle(t.id)}
            className={`w-full flex items-center justify-between rounded-xl border p-3 transition hover:shadow-soft ${
              t.done ? "bg-green-50 border-green-200" : "bg-white border-slate-200"
            }`}
          >
            <div className="flex items-center gap-3 text-left">
              <CheckCircle className={`h-5 w-5 ${t.done ? "text-green-600" : "text-slate-300"}`} />
              <span className={`${t.done ? "line-through text-slate-400" : ""}`}>{t.text}</span>
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
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-brand-400"
          placeholder="Add a new target..."
        />
        <button
          onClick={addTask}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2 hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>
      <p className="text-xs text-slate-500 mt-3">Tasks persist per-day via localStorage.</p>
    </div>
  );
}

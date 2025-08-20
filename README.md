# Learning Tracker Dashboard (Client-side Only)

A clean, modern dashboard to track your daily learning with **no backend/database**. All data persists in **localStorage**.

## Features
- **Daily target checklist** with add/remove and completion states per day.
- **Time tracker** with start/stop and animated progress toward 4-hour goal.
- **Streak counter**: counts consecutive days with ≥ 4 hours logged.
- **Mini pop-up notifications** (custom toasts + optional native Notification API).
- **Motivational tips** shown when you're behind schedule (no external AI).
- **Responsive UI** with subtle animations and hover effects.
- **Future-ready structure** to swap localStorage for n8n or a real DB later.

## Tech
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Framer Motion (small entrance animations)
- Lucide React icons

## Getting Started
```bash
pnpm install # or npm install / yarn
pnpm dev     # or npm run dev
```
Open http://localhost:3000 to view the dashboard.

## Persistence
- Sessions and tasks are stored under keys: `lt.sessions` and `lt.tasks` in `localStorage`.
- Data is namespaced by **YYYY-MM-DD** for per-day isolation.

## Scaling Later
- Replace `useLocalStorage` and `storage` in `components/hooks` and `components/utils` with:
  - n8n workflow triggers (HTTP Node) or
  - API routes that talk to a real DB.
- Keep the `DayLog` and `Task` types as your DTOs for easy migration.

import "./globals.css";
import React from "react";

export const metadata = {
  title: "Learning Tracker Dashboard",
  description: "Fully client-side learning tracker with localStorage persistence",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}

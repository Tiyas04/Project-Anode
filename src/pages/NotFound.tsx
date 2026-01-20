"use client"

import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-slate-950 relative flex items-center justify-center px-4">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-slate-950 [background:radial-gradient(circle_at_50%_50%,#1e293b_10%,#020617_100%)] opacity-80"></div>

      <div className="glass border border-white/20 rounded-2xl shadow-xl max-w-md w-full p-10 text-center">

        {/* ICON */}
        <div className="flex justify-center mb-6">
          <div className="bg-rose-500/10 p-4 rounded-full shadow-inner ring-1 ring-rose-500/20">
            <AlertTriangle className="w-12 h-12 text-rose-500" />
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-4xl font-bold text-white mb-2">
          Page Not Found
        </h1>

        {/* DESCRIPTION */}
        <p className="text-slate-400 text-base leading-relaxed">
          The page you are looking for doesn’t exist or may have been moved.
        </p>

        {/* ACTION */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-primary hover:bg-sky-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back to Home
        </Link>

        {/* FOOT NOTE */}
        <p className="mt-8 text-xs text-slate-400 font-mono tracking-widest uppercase">
          Error Code: 404
        </p>
      </div>
    </main>
  );
}

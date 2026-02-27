"use client"

import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-[#F4F8FA] relative flex items-center justify-center px-4 font-sans">
      <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] max-w-md w-full p-10 text-center">

        {/* ICON */}
        <div className="flex justify-center mb-6">
          <div className="bg-rose-50 p-4 rounded-full">
            <AlertTriangle className="w-12 h-12 text-rose-500" />
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-4xl font-bold text-slate-800 mb-2">
          Page Not Found
        </h1>

        {/* DESCRIPTION */}
        <p className="text-slate-500 text-base leading-relaxed">
          The page you are looking for doesn’t exist or may have been moved.
        </p>

        {/* ACTION */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 bg-[#14B8A6] hover:bg-[#0D9486] text-white rounded-xl font-bold transition-all shadow-md active:scale-[0.98]"
        >
          <ArrowLeft className="w-5 h-5" />
          Go back to Home
        </Link>

        {/* FOOT NOTE */}
        <p className="mt-8 text-xs text-slate-400 font-mono tracking-widest uppercase font-medium">
          Error Code: 404
        </p>
      </div>
    </main>
  );
}

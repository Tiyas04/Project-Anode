"use client"

import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="glass mt-auto border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-10 text-center">
        <div className="flex items-center justify-center gap-2 text-slate-400">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">
            Compliant with chemical safety regulations
          </span>
        </div>

        <p className="text-sm text-slate-500 mt-6">
          © {new Date().getFullYear()} Sai PSB Laboratory. All rights reserved.
        </p>

        <p className="text-xs text-slate-600 mt-2">
          Chemicals are sold only to verified buyers where required.
        </p>
      </div>
    </footer>
  );
}

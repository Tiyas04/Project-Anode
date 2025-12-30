"use client"

import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-6 py-10 text-center">
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-sm">
            Compliant with chemical safety regulations
          </span>
        </div>

        <p className="text-sm text-gray-600 mt-4">
          © {new Date().getFullYear()} ChemStore. All rights reserved.
        </p>

        <p className="text-xs text-gray-500 mt-2">
          Chemicals are sold only to verified buyers where required.
        </p>
      </div>
    </footer>
  );
}

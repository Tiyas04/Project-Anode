"use client"

import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white border rounded-lg shadow-md max-w-md w-full p-8 text-center">
        
        {/* ICON */}
        <div className="flex justify-center mb-4">
          <AlertTriangle className="w-12 h-12 text-blue-600" />
        </div>

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-gray-800">
          Page Not Found
        </h1>

        {/* DESCRIPTION */}
        <p className="mt-3 text-gray-600 text-sm">
          The page you are looking for doesn’t exist or may have been moved.
        </p>

        {/* ACTION */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-6 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back to Home
        </Link>

        {/* FOOT NOTE */}
        <p className="mt-6 text-xs text-gray-500">
          Error code: 404
        </p>
      </div>
    </main>
  );
}

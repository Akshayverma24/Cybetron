"use client";

import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

/**
 * Global Error Boundary — Demonstrates: Error and Loading UI
 */
export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center p-5 rounded-2xl bg-red-500/10 border border-red-500/30 mb-6">
          <AlertTriangle className="h-10 w-10 text-red-400" />
        </div>
        <h1 className="text-3xl font-black text-white mb-3">Something Went Wrong</h1>
        <p className="text-slate-400 mb-2">{error?.message || "An unexpected error occurred."}</p>
        <p className="text-slate-500 text-sm mb-8">Please try again or return to the home page.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-dark-900 font-bold rounded-xl transition-all">
            <RefreshCw className="h-4 w-4" /> Try Again
          </button>
          <Link href="/"
            className="inline-flex items-center gap-2 px-6 py-3 border border-slate-600 text-slate-300 hover:text-white hover:border-cyan-500/50 rounded-xl transition-all">
            <Home className="h-4 w-4" /> Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}


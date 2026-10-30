import Link from "next/link";
import { AlertTriangle, Home, Search } from "lucide-react";

/**
 * Not Found Page — Demonstrates: Error and Loading UI
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-900 cyber-grid-bg flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-cyan-400/20 font-mono mb-4">404</div>
        <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-red-500/10 border border-red-500/30 mb-6">
          <AlertTriangle className="h-8 w-8 text-red-400" />
        </div>
        <h1 className="text-3xl font-black text-white mb-3">Page Not Found</h1>
        <p className="text-slate-400 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-dark-900 font-bold rounded-xl transition-all">
            <Home className="h-4 w-4" /> Go Home
          </Link>
          <Link href="/reports" className="inline-flex items-center gap-2 px-6 py-3 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-400/10 rounded-xl transition-all">
            <Search className="h-4 w-4" /> View Reports
          </Link>
        </div>
      </div>
    </div>
  );
}


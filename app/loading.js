import { Spinner } from "@/components/ui";

/**
 * Global loading skeleton
 * Demonstrates: Loading UI, Suspense boundaries
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="text-slate-400 mt-4 text-sm animate-pulse">Loading…</p>
      </div>
    </div>
  );
}


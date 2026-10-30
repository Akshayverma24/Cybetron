import { Spinner } from "@/components/ui";

export default function ReportsLoading() {
  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header skeleton */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="h-9 w-64 bg-slate-800 animate-pulse rounded-lg mb-2" />
            <div className="h-4 w-40 bg-slate-800 animate-pulse rounded" />
          </div>
          <div className="h-10 w-36 bg-slate-800 animate-pulse rounded-xl" />
        </div>

        {/* Filter skeleton */}
        <div className="h-14 w-full bg-slate-800/50 animate-pulse rounded-xl mb-6" />

        {/* Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="glass rounded-xl p-5 border border-slate-800 animate-pulse">
              <div className="h-4 w-32 bg-slate-700 rounded mb-3" />
              <div className="h-5 w-full bg-slate-700 rounded mb-2" />
              <div className="h-4 w-3/4 bg-slate-700 rounded mb-4" />
              <div className="h-3 w-20 bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


import { Spinner } from "@/components/ui";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-dark-900 pt-20 flex items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="text-slate-400 mt-4 text-sm animate-pulse">Loading dashboard…</p>
      </div>
    </div>
  );
}


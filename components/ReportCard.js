import { cn, formatStatus, formatCrimeType, formatDate } from "@/lib/utils";
import { Shield, AlertTriangle, Clock, CheckCircle, Eye, Calendar } from "lucide-react";
import Link from "next/link";

/**
 * ReportCard — Server Component
 * Demonstrates: Server Components, Rendering Strategy
 */
export default function ReportCard({ report }) {
  const status   = formatStatus(report.status);
  const crime    = formatCrimeType(report.crimeType);

  const severityColors = {
    low:      "text-green-400  bg-green-400/10  border-green-400/20",
    medium:   "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    high:     "text-orange-400 bg-orange-400/10 border-orange-400/20",
    critical: "text-red-400    bg-red-400/10    border-red-400/20",
  };

  return (
    <div className="glass rounded-xl p-5 cyber-card border border-cyan-500/10 hover:border-cyan-500/30 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded">
              {report.reportId}
            </span>
            <span className={cn(
              "text-xs px-2 py-0.5 rounded border",
              severityColors[report.severity] || severityColors.medium
            )}>
              {report.severity?.toUpperCase()}
            </span>
          </div>
          <h3 className="text-white font-semibold text-sm line-clamp-2 leading-snug">
            {report.title}
          </h3>
        </div>
        <span className={cn("text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap", status.color)}>
          {status.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-slate-400 text-sm line-clamp-2 mb-4">{report.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <span className="text-xs px-2 py-0.5 rounded bg-slate-700/60 text-slate-300 border border-slate-600/50">
          {crime}
        </span>
        {report.isAnonymous && (
          <span className="text-xs px-2 py-0.5 rounded bg-slate-700/60 text-slate-400 border border-slate-600/50">
            Anonymous
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(report.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {report.views}
          </span>
        </div>
        <Link
          href={`/reports/${report._id}`}
          className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}


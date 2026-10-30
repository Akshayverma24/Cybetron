"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ReportCard from "@/components/ReportCard";
import { Spinner } from "@/components/ui";
import { CRIME_TYPES } from "@/lib/utils";
import { Search, Filter, X, AlertTriangle } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";

/**
 * Reports Listing Page — Client Component with client-side fetching
 * Demonstrates: Client-side Rendering, Client-side Fetching, Dynamic Routes
 */
export default function ReportsPage() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const [reports,    setReports]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [pagination, setPagination] = useState({});
  const [search,     setSearch]     = useState(searchParams.get("search") || "");
  const [filters,    setFilters]    = useState({
    crimeType: searchParams.get("crimeType") || "",
    status:    searchParams.get("status")    || "",
    severity:  searchParams.get("severity")  || "",
  });

  const fetchReports = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (search)          params.set("search",    search);
      if (filters.crimeType) params.set("crimeType", filters.crimeType);
      if (filters.status)    params.set("status",    filters.status);
      if (filters.severity)  params.set("severity",  filters.severity);

      const res  = await fetch(`/api/reports?${params}`);
      const data = await res.json();

      if (data.success) {
        setReports(data.reports);
        setPagination(data.pagination);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, filters]);

  useEffect(() => { fetchReports(1); }, [fetchReports]);

  function clearFilters() {
    setFilters({ crimeType: "", status: "", severity: "" });
    setSearch("");
    router.push("/reports");
  }

  const hasFilters = filters.crimeType || filters.status || filters.severity || search;

  return (
    <>
      <div className="min-h-screen bg-dark-900 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pt-8">
            <div>
              <h1 className="text-3xl font-black text-white mb-1">Cyber Crime Reports</h1>
              <p className="text-slate-400">
                {pagination.total !== undefined
                  ? `${pagination.total} reports found`
                  : "Browse all reported cyber crimes"}
              </p>
            </div>
            <Link href="/report/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-dark-900 font-bold rounded-xl transition-all">
              <AlertTriangle className="h-4 w-4" /> File a Report
            </Link>
          </div>

          {/* Search & Filters */}
          <div className="glass rounded-xl p-4 border border-cyan-500/10 mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchReports(1)}
                  placeholder="Search by title, ID, or description…"
                  className="w-full pl-10 pr-4 py-2.5 bg-dark-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-sm cyber-input"
                />
              </div>

              {/* Crime Type filter */}
              <select
                value={filters.crimeType}
                onChange={(e) => setFilters((f) => ({ ...f, crimeType: e.target.value }))}
                className="px-4 py-2.5 bg-dark-800 border border-slate-700 rounded-lg text-slate-300 text-sm cyber-input min-w-[160px]"
              >
                <option value="">All Types</option>
                {CRIME_TYPES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>

              {/* Status filter */}
              <select
                value={filters.status}
                onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                className="px-4 py-2.5 bg-dark-800 border border-slate-700 rounded-lg text-slate-300 text-sm cyber-input min-w-[140px]"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

              {/* Severity filter */}
              <select
                value={filters.severity}
                onChange={(e) => setFilters((f) => ({ ...f, severity: e.target.value }))}
                className="px-4 py-2.5 bg-dark-800 border border-slate-700 rounded-lg text-slate-300 text-sm cyber-input min-w-[130px]"
              >
                <option value="">All Severity</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>

              {hasFilters && (
                <button onClick={clearFilters}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-400/10 rounded-lg transition-all whitespace-nowrap">
                  <X className="h-4 w-4" /> Clear
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Spinner size="lg" />
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-24">
              <Filter className="h-16 w-16 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400 text-lg mb-2">No reports found</p>
              <p className="text-slate-500 text-sm mb-6">Try adjusting your filters or search terms</p>
              <button onClick={clearFilters}
                className="px-6 py-2.5 border border-cyan-500/40 text-cyan-400 rounded-lg hover:bg-cyan-400/10 transition-all">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {reports.map((report) => (
                  <ReportCard key={report._id} report={report} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center gap-2">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => fetchReports(p)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                        p === pagination.page
                          ? "bg-cyan-500 text-dark-900"
                          : "text-slate-400 hover:text-white hover:bg-white/5 border border-slate-700"
                      }`}>
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}


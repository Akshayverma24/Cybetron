import { getSession, hasRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Report from "@/models/Report";
import User from "@/models/User";
import Link from "next/link";
import {
  Shield, Users, FileText, AlertTriangle, CheckCircle,
  Clock, TrendingUp, Settings, BarChart3,
} from "lucide-react";
import { StatCard } from "@/components/ui";
import { formatDate, formatStatus, formatCrimeType } from "@/lib/utils";
import Footer from "@/components/Footer";

/**
 * Admin Panel — Server Component
 * Demonstrates: Role-based Access Control, Server Components,
 *               Protected Routes, Server-side Data Fetching
 */
export const metadata = { title: "Admin Panel" };
export const dynamic  = "force-dynamic"; // always fresh

async function getAdminStats() {
  await connectDB();
  const [
    totalReports, pending, investigating, resolved,
    totalUsers, officers, admins,
    crimeBreakdown, recentReports, recentUsers,
  ] = await Promise.all([
    Report.countDocuments(),
    Report.countDocuments({ status: "pending" }),
    Report.countDocuments({ status: "investigating" }),
    Report.countDocuments({ status: "resolved" }),
    User.countDocuments({ role: "user" }),
    User.countDocuments({ role: "officer" }),
    User.countDocuments({ role: "admin" }),
    Report.aggregate([
      { $group: { _id: "$crimeType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]),
    Report.find().sort({ createdAt: -1 }).limit(10).populate("reporter", "name").lean(),
    User.find().sort({ createdAt: -1 }).limit(8).select("-password").lean(),
  ]);

  return {
    totalReports, pending, investigating, resolved,
    totalUsers, officers, admins,
    crimeBreakdown, recentReports, recentUsers,
  };
}

export default async function AdminPage() {
  const session = await getSession();
  if (!session || !hasRole(session, "admin")) {
    redirect("/dashboard");
  }

  const stats = await getAdminStats();

  return (
    <>
      <div className="min-h-screen bg-dark-900 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pt-8">
            <div>
              <h1 className="text-3xl font-black text-white mb-1 flex items-center gap-3">
                <Shield className="h-8 w-8 text-purple-400" /> Admin Control Panel
              </h1>
              <p className="text-slate-400">Full system overview and management</p>
            </div>
            <div className="text-right text-sm text-slate-500">
              <p>Logged in as <span className="text-purple-400 font-semibold">{session.name}</span></p>
              <p>Role: Administrator</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={FileText}    label="Total Reports"   value={stats.totalReports}  color="cyan"   />
            <StatCard icon={Clock}       label="Pending"         value={stats.pending}        color="yellow" />
            <StatCard icon={CheckCircle} label="Resolved"        value={stats.resolved}       color="green"  />
            <StatCard icon={Users}       label="Total Users"     value={stats.totalUsers}     color="purple" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            <StatCard icon={TrendingUp}  label="Investigating"   value={stats.investigating}  color="purple" />
            <StatCard icon={Shield}      label="Officers"        value={stats.officers}       color="cyan"   />
            <StatCard icon={Settings}    label="Admins"          value={stats.admins}         color="yellow" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Crime Type Breakdown */}
            <div className="glass rounded-xl p-6 border border-cyan-500/10">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-cyan-400" /> Crime Breakdown
              </h2>
              <div className="space-y-3">
                {stats.crimeBreakdown.map(({ _id, count }) => {
                  const pct = Math.round((count / stats.totalReports) * 100) || 0;
                  return (
                    <div key={_id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300">{formatCrimeType(_id)}</span>
                        <span className="text-cyan-400 font-mono">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Users */}
            <div className="glass rounded-xl p-6 border border-purple-500/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-400" /> Recent Registrations
                </h2>
                <Link href="/admin/users" className="text-sm text-purple-400 hover:text-purple-300">View all →</Link>
              </div>
              <div className="space-y-2">
                {stats.recentUsers.map((user) => (
                  <div key={user._id} className="flex items-center justify-between py-2 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 text-xs font-bold">
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      user.role === "admin"   ? "bg-purple-400/10 text-purple-400" :
                      user.role === "officer" ? "bg-blue-400/10 text-blue-400"     :
                                                "bg-slate-700/50 text-slate-400"
                    }`}>
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Reports Table */}
          <div className="glass rounded-xl border border-cyan-500/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-400" /> Recent Reports
              </h2>
              <Link href="/reports" className="text-sm text-cyan-400 hover:text-cyan-300">View all →</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {["ID", "Title", "Type", "Severity", "Status", "Reporter", "Date", ""].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {stats.recentReports.map((r) => {
                    const st = formatStatus(r.status);
                    return (
                      <tr key={r._id} className="hover:bg-white/2 transition-colors">
                        <td className="px-4 py-3 font-mono text-cyan-400 text-xs whitespace-nowrap">{r.reportId}</td>
                        <td className="px-4 py-3 text-slate-200 max-w-[160px] truncate">{r.title}</td>
                        <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{formatCrimeType(r.crimeType)}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium ${
                            r.severity === "critical" ? "text-red-400" :
                            r.severity === "high"     ? "text-orange-400" :
                            r.severity === "medium"   ? "text-yellow-400" : "text-green-400"
                          }`}>{r.severity}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${st.color}`}>{st.label}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs">
                          {r.isAnonymous ? "Anonymous" : (r.reporter?.name || r.reporterName || "—")}
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{formatDate(r.createdAt)}</td>
                        <td className="px-4 py-3">
                          <Link href={`/reports/${r._id}`} className="text-cyan-400 hover:text-cyan-300 text-xs">View →</Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}


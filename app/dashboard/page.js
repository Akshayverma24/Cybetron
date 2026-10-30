
import { getSession, hasRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Report from "@/models/Report";
import User from "@/models/User";
import Link from "next/link";

import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  TrendingUp,
  ArrowRight,
  Shield,
} from "lucide-react";

import { StatCard } from "@/components/ui";
import {
  formatDate,
  formatStatus,
  formatCrimeType,
} from "@/lib/utils";

import Footer from "@/components/Footer";

export const metadata = {
  title: "Dashboard",
};

export const revalidate = 60;

// Fetch dashboard data
async function getDashboardData(session) {
  await connectDB();

  if (hasRole(session, "admin", "officer")) {
    const [
      total,
      pending,
      investigating,
      resolved,
      users,
      recent,
    ] = await Promise.all([
      Report.countDocuments(),

      Report.countDocuments({
        status: "pending",
      }),

      Report.countDocuments({
        status: "investigating",
      }),

      Report.countDocuments({
        status: "resolved",
      }),

      User.countDocuments({
        role: "user",
      }),

      Report.find()
        .sort({ createdAt: -1 })
        .limit(8)
        .populate("reporter", "name")
        .lean(),
    ]);

    return {
      total,
      pending,
      investigating,
      resolved,
      users,
      recent,
      isOfficer: true,
    };
  } else {
    const [
      myReports,
      myPending,
      myResolved,
      recent,
    ] = await Promise.all([
      Report.countDocuments({
        reporter: session.userId,
      }),

      Report.countDocuments({
        reporter: session.userId,
        status: "pending",
      }),

      Report.countDocuments({
        reporter: session.userId,
        status: "resolved",
      }),

      Report.find({
        reporter: session.userId,
      })
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
    ]);

    return {
      myReports,
      myPending,
      myResolved,
      recent,
      isOfficer: false,
    };
  }
}

// Dashboard page
export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?redirect=/dashboard");
  }

  const data = await getDashboardData(session);

  return (
    <>
      <div className="min-h-screen bg-dark-900 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-1">
              {data.isOfficer
                ? "Operations Dashboard"
                : "My Dashboard"}
            </h1>

            <p className="text-slate-400">
              Welcome back,{" "}
              <span className="text-cyan-400 font-semibold">
                {session.name}
              </span>

              {" "}—{" "}

              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Statistics Grid */}
          {data.isOfficer ? (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">

              <StatCard
                icon="FileText"
                label="Total Reports"
                value={data.total}
                color="cyan"
              />

              <StatCard
                icon="Clock"
                label="Pending"
                value={data.pending}
                color="yellow"
              />

              <StatCard
                icon="TrendingUp"
                label="Investigating"
                value={data.investigating}
                color="purple"
              />

              <StatCard
                icon="CheckCircle"
                label="Resolved"
                value={data.resolved}
                color="green"
              />

              <StatCard
                icon="Users"
                label="Total Users"
                value={data.users}
                color="cyan"
              />

            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

              <StatCard
                icon="FileText"
                label="My Reports"
                value={data.myReports}
                color="cyan"
              />

              <StatCard
                icon="Clock"
                label="Pending"
                value={data.myPending}
                color="yellow"
              />

              <StatCard
                icon="CheckCircle"
                label="Resolved"
                value={data.myResolved}
                color="green"
              />

            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

            <Link
              href="/report/new"
              className="glass rounded-xl p-5 border border-cyan-500/20 hover:border-cyan-500/40 flex items-center gap-4 transition-all group"
            >
              <div className="p-3 rounded-xl bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
                <AlertTriangle className="h-6 w-6" />
              </div>

              <div>
                <p className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                  File New Report
                </p>

                <p className="text-sm text-slate-400">
                  Report a cyber crime
                </p>
              </div>

              <ArrowRight className="ml-auto h-5 w-5 text-slate-600 group-hover:text-cyan-400 transition-all group-hover:translate-x-1" />
            </Link>

            <Link
              href="/reports"
              className="glass rounded-xl p-5 border border-slate-700/50 hover:border-cyan-500/30 flex items-center gap-4 transition-all group"
            >
              <div className="p-3 rounded-xl bg-slate-700/50 text-slate-300 border border-slate-600/50">
                <FileText className="h-6 w-6" />
              </div>

              <div>
                <p className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                  View All Reports
                </p>

                <p className="text-sm text-slate-400">
                  Browse the report list
                </p>
              </div>

              <ArrowRight className="ml-auto h-5 w-5 text-slate-600 group-hover:text-cyan-400 transition-all group-hover:translate-x-1" />
            </Link>

            {session.role === "admin" && (
              <Link
                href="/admin"
                className="glass rounded-xl p-5 border border-purple-500/20 hover:border-purple-500/40 flex items-center gap-4 transition-all group"
              >
                <div className="p-3 rounded-xl bg-purple-400/10 text-purple-400 border border-purple-400/20">
                  <Shield className="h-6 w-6" />
                </div>

                <div>
                  <p className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                    Admin Panel
                  </p>

                  <p className="text-sm text-slate-400">
                    Manage users & reports
                  </p>
                </div>

                <ArrowRight className="ml-auto h-5 w-5 text-slate-600 group-hover:text-purple-400 transition-all group-hover:translate-x-1" />
              </Link>
            )}

          </div>

          {/* Recent Reports */}
          <div className="glass rounded-xl border border-cyan-500/10 overflow-hidden">

            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {data.isOfficer
                  ? "Recent Reports"
                  : "My Reports"}
              </h2>

              <Link
                href="/reports"
                className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {data.recent.length === 0 ? (
              <div className="px-6 py-12 text-center">

                <FileText className="h-12 w-12 text-slate-600 mx-auto mb-3" />

                <p className="text-slate-400 mb-4">
                  No reports yet
                </p>

                <Link
                  href="/report/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 text-dark-900 rounded-lg font-semibold text-sm"
                >
                  <AlertTriangle className="h-4 w-4" />
                  File Your First Report
                </Link>

              </div>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full text-sm">

                  <thead>
                    <tr className="border-b border-white/5">

                      {[
                        "Report ID",
                        "Title",
                        "Type",
                        "Severity",
                        "Status",
                        "Date",
                        "",
                      ].map((heading, index) => (
                        <th
                          key={`${heading}-${index}`}
                          className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                        >
                          {heading}
                        </th>
                      ))}

                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/5">

                    {data.recent.map((report) => {
                      const status = formatStatus(report.status);

                      return (
                        <tr
                          key={report._id.toString()}
                          className="hover:bg-white/2 transition-colors"
                        >

                          <td className="px-4 py-3 font-mono text-cyan-400 text-xs">
                            {report.reportId}
                          </td>

                          <td className="px-4 py-3 text-slate-200 max-w-[200px] truncate">
                            {report.title}
                          </td>

                          <td className="px-4 py-3 text-slate-400">
                            {formatCrimeType(report.crimeType)}
                          </td>

                          <td className="px-4 py-3">
                            <span
                              className={`text-xs uppercase font-medium ${
                                report.severity === "critical"
                                  ? "text-red-400"
                                  : report.severity === "high"
                                  ? "text-orange-400"
                                  : report.severity === "medium"
                                  ? "text-yellow-400"
                                  : "text-green-400"
                              }`}
                            >
                              {report.severity}
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${status.color}`}
                            >
                              {status.label}
                            </span>
                          </td>

                          <td className="px-4 py-3 text-slate-500 text-xs">
                            {formatDate(report.createdAt)}
                          </td>

                          <td className="px-4 py-3">
                            <Link
                              href={`/reports/${report._id.toString()}`}
                              className="text-cyan-400 hover:text-cyan-300 text-xs font-medium"
                            >
                              View →
                            </Link>
                          </td>

                        </tr>
                      );
                    })}

                  </tbody>
                </table>

              </div>
            )}

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}


import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Report from "@/models/Report";
import User from "@/models/User";
import { getSession } from "@/lib/auth";
import {
  formatDate,
  formatStatus,
  formatCrimeType,
} from "@/lib/utils";

import {
  Calendar,
  MapPin,
  Eye,
  Shield,
  AlertTriangle,
  User as UserIcon,
  Mail,
  Phone,
  Globe,
  Hash,
  ChevronLeft,
} from "lucide-react";

import Link from "next/link";
import ReportStatusUpdater from "@/components/ReportStatusUpdater";

// Register User model before using populate()
void User;

// Dynamic metadata based on the report
export async function generateMetadata({ params }) {
  try {
    await connectDB();

    const { id } = await params;

    const report = await Report.findById(id).lean();

    if (!report) {
      return { title: "Report Not Found" };
    }

    return {
      title: `${report.reportId} — ${report.title}`,
      description: report.description.slice(0, 160),
    };
  } catch (error) {
    console.error("REPORT METADATA ERROR:", error);
    return { title: "Report Detail" };
  }
}

// Fetch report from MongoDB
async function getReport(id) {
  await connectDB();

  const report = await Report.findById(id)
    .populate("reporter", "name email")
    .populate("assignedOfficer", "name email")
    .populate("officerNotes.addedBy", "name")
    .lean();

  if (report) {
    // Increment report views
    await Report.findByIdAndUpdate(id, {
      $inc: { views: 1 },
    }).exec();
  }

  return report;
}

// Report Detail Page
export default async function ReportDetailPage({ params }) {
  const { id } = await params;

  const session = await getSession();
  const report = await getReport(id);

  if (!report) {
    notFound();
  }

  const status = formatStatus(report.status);

  const severityColor = {
    low: "text-green-400 bg-green-400/10 border-green-400/20",
    medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    high: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    critical: "text-red-400 bg-red-400/10 border-red-400/20",
  }[report.severity] || "";

  const canUpdate =
    session &&
    (session.role === "officer" || session.role === "admin");

  return (
    <div className="min-h-screen bg-dark-900 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back link */}
        <Link
          href="/reports"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 text-sm mb-6 transition-colors mt-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Reports
        </Link>

        {/* Header */}
        <div className="glass rounded-2xl p-6 border border-cyan-500/15 mb-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">

                <span className="font-mono text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full text-sm border border-cyan-400/20">
                  {report.reportId}
                </span>

                <span
                  className={`text-xs px-2.5 py-1 rounded-full border font-medium ${severityColor}`}
                >
                  {report.severity?.toUpperCase()} SEVERITY
                </span>

                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${status.color}`}
                >
                  {status.label}
                </span>

                {report.isAnonymous && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-700/50 text-slate-400 border border-slate-600">
                    Anonymous
                  </span>
                )}

              </div>

              <h1 className="text-2xl font-black text-white">
                {report.title}
              </h1>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {report.views} views
              </span>

              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(report.createdAt)}
              </span>
            </div>

          </div>

          {/* Crime type and location */}
          <div className="flex flex-wrap gap-3 text-sm text-slate-400">

            <span className="flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-orange-400" />
              {formatCrimeType(report.crimeType)}
            </span>

            {report.incidentDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-cyan-400" />
                Incident:{" "}
                {new Date(report.incidentDate).toLocaleDateString("en-IN")}
              </span>
            )}

            {report.incidentLocation && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-cyan-400" />
                {report.incidentLocation}
              </span>
            )}

          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Description */}
            <div className="glass rounded-xl p-6 border border-cyan-500/10">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Hash className="h-5 w-5 text-cyan-400" />
                Incident Description
              </h2>

              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {report.description}
              </p>
            </div>

            {/* Suspect Information */}
            {report.suspectInfo &&
              Object.values(report.suspectInfo).some(Boolean) && (
                <div className="glass rounded-xl p-6 border border-red-500/10">

                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-red-400" />
                    Suspect Information
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        label: "Name",
                        val: report.suspectInfo.name,
                        icon: UserIcon,
                      },
                      {
                        label: "Email",
                        val: report.suspectInfo.email,
                        icon: Mail,
                      },
                      {
                        label: "Phone",
                        val: report.suspectInfo.phone,
                        icon: Phone,
                      },
                      {
                        label: "Website",
                        val: report.suspectInfo.website,
                        icon: Globe,
                      },
                      {
                        label: "IP Address",
                        val: report.suspectInfo.ipAddress,
                        icon: Globe,
                      },
                      {
                        label: "Social Media",
                        val: report.suspectInfo.socialMedia,
                        icon: Globe,
                      },
                    ]
                      .filter(({ val }) => val)
                      .map(({ label, val, icon: Icon }) => (
                        <div
                          key={label}
                          className="flex items-start gap-3 p-3 rounded-lg bg-dark-800 border border-slate-700/50"
                        >
                          <Icon className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />

                          <div>
                            <p className="text-xs text-slate-500 mb-0.5">
                              {label}
                            </p>

                            <p className="text-sm text-slate-200 break-all">
                              {val}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>

                  {report.suspectInfo.otherDetails && (
                    <div className="mt-3 p-3 rounded-lg bg-dark-800 border border-slate-700/50">
                      <p className="text-xs text-slate-500 mb-1">
                        Other Details
                      </p>

                      <p className="text-sm text-slate-200">
                        {report.suspectInfo.otherDetails}
                      </p>
                    </div>
                  )}

                </div>
              )}

            {/* Officer Notes */}
            {report.officerNotes?.length > 0 && (
              <div className="glass rounded-xl p-6 border border-blue-500/10">

                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-400" />
                  Officer Updates
                </h2>

                <div className="space-y-3">
                  {report.officerNotes.map((note, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg bg-dark-800 border border-blue-500/10"
                    >
                      <p className="text-slate-200 text-sm mb-2">
                        {note.note}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>
                          — {note.addedBy?.name || "Officer"}
                        </span>

                        <span>•</span>

                        <span>{formatDate(note.addedAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>

          {/* Sidebar */}
          <div className="space-y-4">

            {/* Case Information */}
            <div className="glass rounded-xl p-5 border border-cyan-500/10">

              <h3 className="font-bold text-white mb-4">
                Case Information
              </h3>

              <div className="space-y-3 text-sm">

                <div className="flex justify-between">
                  <span className="text-slate-400">Status</span>

                  <span className={`font-medium ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned To</span>

                  <span className="text-slate-200">
                    {report.assignedOfficer?.name || "Unassigned"}
                  </span>
                </div>

                {report.financialLoss?.amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">
                      Financial Loss
                    </span>

                    <span className="text-red-400 font-mono">
                      ₹
                      {report.financialLoss.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-slate-400">Reporter</span>

                  <span className="text-slate-200">
                    {report.isAnonymous
                      ? "Anonymous"
                      : report.reporter?.name ||
                        report.reporterName ||
                        "Unknown"}
                  </span>
                </div>

              </div>
            </div>

            {/* Officer Action Panel */}
            {canUpdate && (
              <ReportStatusUpdater
                reportId={report._id.toString()}
                currentStatus={report.status}
              />
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

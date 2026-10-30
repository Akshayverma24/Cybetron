import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Report from "@/models/Report";
import User from "@/models/User";
import { getSession, hasRole } from "@/lib/auth";

/**
 * GET /api/stats — dashboard statistics
 * Demonstrates: Server-side Data Fetching, Aggregation
 */
export async function GET() {
  try {
    const session = await getSession();
    if (!session || !hasRole(session, "officer", "admin")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const [
      totalReports,
      pendingReports,
      investigatingReports,
      resolvedReports,
      totalUsers,
      recentReports,
      crimeTypeCounts,
    ] = await Promise.all([
      Report.countDocuments(),
      Report.countDocuments({ status: "pending" }),
      Report.countDocuments({ status: "investigating" }),
      Report.countDocuments({ status: "resolved" }),
      User.countDocuments({ role: "user" }),
      Report.find().sort({ createdAt: -1 }).limit(5).populate("reporter", "name"),
      Report.aggregate([
        { $group: { _id: "$crimeType", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalReports,
        pendingReports,
        investigatingReports,
        resolvedReports,
        totalUsers,
        recentReports,
        crimeTypeCounts,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}



import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Report from "@/models/Report";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET: Fetch reports
export async function GET(request) {
  try {
    await connectDB();

    const session = await getSession();
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number(searchParams.get("limit")) || 10)
    );

    const status = searchParams.get("status");
    const crimeType = searchParams.get("crimeType");
    const severity = searchParams.get("severity");
    const search = searchParams.get("search");
    const myReports = searchParams.get("myReports") === "true";

    const filters = [];

    // Show only the logged-in user's reports when requested
    if (myReports) {
      if (!session?.userId) {
        return NextResponse.json(
          { success: false, message: "Please login first" },
          { status: 401 }
        );
      }

      filters.push({
        reporter: new mongoose.Types.ObjectId(session.userId),
      });
    } else {
      // Public listing: hide anonymous reports and reports
      // that do not have a reporter account.
      filters.push({
        isAnonymous: false,
        reporter: { $ne: null },
      });
    }

    if (status) filters.push({ status });
    if (crimeType) filters.push({ crimeType });
    if (severity) filters.push({ severity });

    if (search) {
      filters.push({
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { reportId: { $regex: search, $options: "i" } },
        ],
      });
    }

    const query = filters.length ? { $and: filters } : {};

    const total = await Report.countDocuments(query);

    const reports = await Report.find(query)
      .populate("reporter", "name email")
      .populate("assignedOfficer", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json(
      {
        success: true,
        reports,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("GET REPORTS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch reports",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST: Create a new report
export async function POST(request) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Verify actual database and collection
    console.log("=================================");
    console.log("MONGODB DATABASE:", mongoose.connection.name);
    console.log("REPORT COLLECTION:", Report.collection.name);
    console.log("MONGODB HOST:", mongoose.connection.host);
    console.log("=================================");

    const session = await getSession();

    const body = await request.json();

    const {
      title,
      description,
      crimeType,
      severity,
      incidentDate,
      incidentLocation,
      suspectInfo,
      financialLoss,
      isAnonymous,
      reporterName,
      reporterEmail,
      reporterPhone,
    } = body;

    // Required field validation
    if (!title || !description || !crimeType || !incidentDate) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Title, description, crime type and incident date are required",
        },
        { status: 400 }
      );
    }

    const reportData = {
      title,
      description,
      crimeType,
      severity: severity || "medium",
      incidentDate: new Date(incidentDate),
      incidentLocation,
      suspectInfo: suspectInfo || {},
      financialLoss: financialLoss || {},
      isAnonymous: Boolean(isAnonymous),
    };

    // Attach logged-in user if available
    if (session?.userId) {
      reportData.reporter = session.userId;
    } else {
      reportData.reporter = null;
      reportData.reporterName = reporterName || "";
      reportData.reporterEmail = reporterEmail || "";
      reportData.reporterPhone = reporterPhone || "";
    }

    // Save report to MongoDB
    const report = await Report.create(reportData);

    console.log("=================================");
    console.log("REPORT SAVED SUCCESSFULLY");
    console.log("REPORT ID:", report.reportId);
    console.log("DOCUMENT ID:", report._id);
    console.log("DATABASE:", mongoose.connection.name);
    console.log("COLLECTION:", Report.collection.name);
    console.log("=================================");

    return NextResponse.json(
      {
        success: true,
        message: "Report submitted successfully",
        report,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE REPORT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.name === "ValidationError"
            ? error.message
            : "Failed to submit report",
        error: error.message,
      },
      {
        status:
          error.name === "ValidationError" || error.name === "CastError"
            ? 400
            : 500,
      }
    );
  }
}

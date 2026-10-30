import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Report from "@/models/Report";
import { getSession, hasRole } from "@/lib/auth";

/**
 * GET /api/reports/[id]
 * Demonstrates: Dynamic Route Handlers
 */
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const report = await Report.findById(id)
      .populate("reporter", "name email")
      .populate("assignedOfficer", "name email")
      .populate("officerNotes.addedBy", "name");

    if (!report) {
      return NextResponse.json(
        { success: false, message: "Report not found" },
        { status: 404 }
      );
    }

    // Increment views
    report.views += 1;
    await report.save();

    return NextResponse.json({ success: true, report });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/reports/[id]
 * Demonstrates: Dynamic Route Handlers, CRUD Operations, Data Mutations
 */
export async function PATCH(request, { params }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = params;
    const body   = await request.json();

    const report = await Report.findById(id);
    if (!report) {
      return NextResponse.json({ success: false, message: "Report not found" }, { status: 404 });
    }

    // Officers/admins can update status and add notes
    if (hasRole(session, "officer", "admin")) {
      if (body.status)       report.status = body.status;
      if (body.assignedOfficer) report.assignedOfficer = body.assignedOfficer;
      if (body.note) {
        report.officerNotes.push({ note: body.note, addedBy: session.userId });
      }
    }

    // Owner can update their own report (if still pending)
    if (
      session.userId === report.reporter?.toString() &&
      report.status === "pending"
    ) {
      const allowedFields = ["title", "description", "severity", "suspectInfo", "financialLoss"];
      allowedFields.forEach((f) => {
        if (body[f] !== undefined) report[f] = body[f];
      });
    }

    await report.save();
    return NextResponse.json({ success: true, report });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/reports/[id] — admin only
 */
export async function DELETE(request, { params }) {
  try {
    const session = await getSession();
    if (!session || !hasRole(session, "admin")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    await connectDB();
    const report = await Report.findByIdAndDelete(params.id);
    if (!report) {
      return NextResponse.json({ success: false, message: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Report deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}


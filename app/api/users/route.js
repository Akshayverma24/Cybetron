import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getSession, hasRole } from "@/lib/auth";

/**
 * GET /api/users — list users (admin only)
 * Demonstrates: Route Handlers, Authorization, Role-based Access Control
 */
export async function GET(request) {
  try {
    const session = await getSession();
    if (!session || !hasRole(session, "admin")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page  = parseInt(searchParams.get("page")  || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const role  = searchParams.get("role");
    const search = searchParams.get("search");

    const query = {};
    if (role)   query.role = role;
    if (search) query.$or = [
      { name:  { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/users — update user role or status (admin only)
 * Demonstrates: CRUD Operations, Data Mutations
 */
export async function PATCH(request) {
  try {
    const session = await getSession();
    if (!session || !hasRole(session, "admin")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    await connectDB();
    const { userId, role, isActive } = await request.json();

    const update = {};
    if (role     !== undefined) update.role     = role;
    if (isActive !== undefined) update.isActive = isActive;

    const user = await User.findByIdAndUpdate(userId, update, { new: true }).select("-password");
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}


import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { signToken } from "@/lib/auth";
import { cookies } from "next/headers";

/**
 * POST /api/auth/signup
 * Demonstrates: Route Handlers, REST APIs, HTTP Methods, Request & Response Handling
 */
export async function POST(request) {
  try {
    const { action, name, email, password, phone } = await request.json();

    await connectDB();

    // ── SIGN UP ─────────────────────────────────────────────
    if (action === "signup") {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "Email already registered" },
          { status: 409 }
        );
      }

      const user = await User.create({ name, email, password, phone });

      const token = await signToken({
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      });

      const cookieStore = cookies();
      cookieStore.set("cybetron_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return NextResponse.json({
        success: true,
        message: "Account created successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    // ── LOGIN ────────────────────────────────────────────────
    if (action === "login") {
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return NextResponse.json(
          { success: false, message: "Invalid email or password" },
          { status: 401 }
        );
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return NextResponse.json(
          { success: false, message: "Invalid email or password" },
          { status: 401 }
        );
      }

      if (!user.isActive) {
        return NextResponse.json(
          { success: false, message: "Account is deactivated. Contact support." },
          { status: 403 }
        );
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      const token = await signToken({
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      });

      const cookieStore = cookies();
      cookieStore.set("cybetron_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return NextResponse.json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    // ── LOGOUT ───────────────────────────────────────────────
    if (action === "logout") {
      const cookieStore = cookies();
      cookieStore.delete("cybetron_token");
      return NextResponse.json({ success: true, message: "Logged out" });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth — check current session
 */
export async function GET() {
  const { getSession } = await import("@/lib/auth");
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user: session });
}


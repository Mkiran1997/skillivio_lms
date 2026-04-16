import dbConnect from "@/lib/mongoose";
import User from "@/models/user";
import Session from "@/models/session";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { handleAuthError } from "@/lib/auth";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { email, password, tenantId } = body;

    if (!email || !password || !tenantId) {
      return handleAuthError("Missing fields", 400);
    }

    const user = await User.findOne({ email, tenantId }).select("+password");
    if (!user) {
      return handleAuthError("Invalid credentials", 401);
    }

    if (!user.isActive) {
      return handleAuthError("User is not active", 403);
    }

    // schema doesn't have comparePassword, so we use bcrypt directly
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return handleAuthError("Invalid credentials", 401);
    }

    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";
    const userAgent = req.headers.get("user-agent") || "";

    const sessionId = new mongoose.Types.ObjectId();
    const payload = {
      userId: user._id,
      roles: user.roles,
      tenantId: user.tenantId,
      sessionId
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const salt = await bcrypt.genSalt(10);
    const refreshTokenHash = await bcrypt.hash(refreshToken, salt);

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const session = new Session({
      _id: sessionId,
      userId: user._id,
      refreshTokenHash,
      userAgent,
      ipAddress,
      isValid: true,
      expiresAt
    });
    await session.save();

    const cookieStore = await cookies();
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 30 * 24 * 60 * 60
    });

    return new Response(JSON.stringify({ accessToken }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Login error:", error);
    return handleAuthError("Internal server error", 500);
  }
}

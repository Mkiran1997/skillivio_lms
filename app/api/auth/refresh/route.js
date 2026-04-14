import dbConnect from "@/lib/mongoose";
import Session from "@/app/api/model/session";
import User from "@/app/api/model/user";
import { verifyRefreshToken, signAccessToken, signRefreshToken } from "@/lib/jwt";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { handleAuthError } from "@/lib/auth";

export async function POST(req) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const currentRefreshToken = cookieStore.get("refreshToken")?.value;

    if (!currentRefreshToken) {
      return handleAuthError("No refresh token provided", 401);
    }

    const payload = verifyRefreshToken(currentRefreshToken);
    if (!payload || !payload.sessionId) {
      return handleAuthError("Invalid or expired refresh token", 401);
    }

    const session = await Session.findById(payload.sessionId);
    if (!session || !session.isValid || session.expiresAt < new Date()) {
      return handleAuthError("Invalid or expired session", 401);
    }

    const isMatch = await bcrypt.compare(currentRefreshToken, session.refreshTokenHash);
    if (!isMatch) {
      return handleAuthError("Refresh token mismatch", 401);
    }

    const user = await User.findById(session.userId);
    if (!user || !user.isActive) {
      return handleAuthError("User is inactive or not found", 403);
    }

    // Rotate refresh token
    const newPayload = {
      userId: user._id,
      roles: user.roles,
      tenantId: user.tenantId,
      sessionId: session._id
    };

    const newAccessToken = signAccessToken(newPayload);
    const newRefreshToken = signRefreshToken(newPayload);

    const salt = await bcrypt.genSalt(10);
    session.refreshTokenHash = await bcrypt.hash(newRefreshToken, salt);
    await session.save();

    cookieStore.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 30 * 24 * 60 * 60
    });

    return new Response(JSON.stringify({ accessToken: newAccessToken }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Refresh error:", error);
    return handleAuthError("Internal server error", 500);
  }
}

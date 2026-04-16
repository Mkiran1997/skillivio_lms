import dbConnect from "@/lib/mongoose";
import Session from "@/models/session";
import { verifyRefreshToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { handleAuthError } from "@/lib/auth";

export async function POST(req) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (refreshToken) {
      const payload = verifyRefreshToken(refreshToken);
      if (payload && payload.sessionId) {
        // Invalidate session in DB
        await Session.findByIdAndUpdate(payload.sessionId, { isValid: false });
      }
    }

    // Clear cookie always
    cookieStore.delete("refreshToken");

    return new Response(JSON.stringify({ success: true, message: "Logged out successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Logout error:", error);
    return handleAuthError("Internal server error", 500);
  }
}

import { getAuthContext, handleAuthError } from "@/lib/auth";

export async function GET(req) {
  try {
    const { user, error } = await getAuthContext(req);

    if (error) {
      return handleAuthError(error, 401);
    }

    // `user` from `getAuthContext` already has `passwordHash` excluded via `.select("-passwordHash")`
    return new Response(JSON.stringify({ user }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Me route error:", error);
    return handleAuthError("Internal server error", 500);
  }
}

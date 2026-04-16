import { verifyAccessToken } from "./jwt";
import { resolveTenant } from "./tenant";
import dbConnect from "./mongoose";
import User from "@/models/user";

export async function getAuthContext(request) {
  await dbConnect();

  const tenant = await resolveTenant(request);

  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { tenant, user: null, payload: null, error: "Missing or invalid authorization header" };
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyAccessToken(token);

  if (!payload) {
    return { tenant, user: null, payload: null, error: "Invalid or expired access token" };
  }

  const user = await User.findById(payload.userId).select("-password").populate("tenantId");;

  if (!user || !user.isActive) {
    return { tenant, user: null, payload: null, error: "User is inactive or not found" };
  }

  if (tenant && String(user.tenantId._id) !== String(tenant._id)) {
    return { tenant, user: null, payload: null, error: "Tenant mismatch" };
  }

  // Flatten roles for backward compatibility
  if (user && user.roles && user.roles.length > 0) {
    user.roles = user.roles;
  }

  return { tenant, user, payload, error: null };
}

export function authorizeRoles(user, ...allowedRoles) {
  if (!user || !user.roles) return false;
  return user.roles.some((roles) => allowedRoles.includes(roles));
}

export function handleAuthError(error, status = 401) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

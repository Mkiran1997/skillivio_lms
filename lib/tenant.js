import Tenant from "@/models/tenant";
import dbConnect from "@/lib/mongoose";

/**
 * Resolves tenant primarily using x-tenant-id header, falling back to subdomain/host.
 */
export async function resolveTenant(request) {
  await dbConnect();

  const tenantIdHeader = request.headers.get("x-tenant-id");

  if (tenantIdHeader) {
    try {
      const tenant = await Tenant.findOne({ _id: tenantIdHeader, $or: [{ status: "Active" }, { isActive: true }] });
      if (tenant) return tenant;
    } catch (e) {
      console.error("Invalid tenant header:", e);
    }
  }

  // Fallback to domain/subdomain matching if necessary
  const hostHeader = request.headers.get("host"); // e.g. "tenantA.example.com"
  if (hostHeader) {
    const domainPart = hostHeader.split(":")[0];
    let tenant = await Tenant.findOne({ domain: domainPart, $or: [{ status: "Active" }, { isActive: true }] });
    if (tenant) return tenant;

    // Optional slug match
    const slug = domainPart.split(".")[0];
    if (slug) {
      tenant = await Tenant.findOne({ slug, $or: [{ status: "Active" }, { isActive: true }] });
      if (tenant) return tenant;
    }
  }

  return null;
}

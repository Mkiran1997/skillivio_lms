import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Tenant from "@/models/tenant";
import { uploadTenantLogo } from "@/lib/s3";

async function handleRequestData(req, tenantId) {
  const contentType = req.headers.get("content-type") || "";
  let data;

  if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const dataString = formData.get("data");
      data = dataString ? JSON.parse(dataString) : {};

      // Handle logo file from multipart
      const logoFile = formData.get("logo");
      if (logoFile && typeof logoFile !== "string") {
          const buffer = Buffer.from(await logoFile.arrayBuffer());
          const s3Url = await uploadTenantLogo(buffer, tenantId.toString(), logoFile.name, logoFile.type);
          if (!data.branding) data.branding = {};
          data.branding.logo = s3Url;
      }
  } else {
      data = await req.json();
  }

  // Support Base64 logo in JSON payload
  if (data.logo && typeof data.logo === "string" && data.logo.startsWith("data:image/")) {
      const matches = data.logo.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
          const mimeType = matches[1];
          const buffer = Buffer.from(matches[2], "base64");
          const extension = mimeType.split("/")[1] || "png";
          const fileName = `logo_${Date.now()}.${extension}`;
          
          const s3Url = await uploadTenantLogo(buffer, tenantId.toString(), fileName, mimeType);
          
          if (!data.branding) data.branding = {};
          data.branding.logo = s3Url;
          delete data.logo; 
      }
  }

  // Auto-map flat branding fields if present
  const brandingFields = ["primary", "secondary", "accent", "favicon"];
  brandingFields.forEach(field => {
      if (data[field]) {
          if (!data.branding) data.branding = {};
          data.branding[field] = data[field];
          delete data[field];
      }
  });

  return data;
}

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const paramsRes = await params;
    const tenant = await Tenant.findById(paramsRes.id).lean();
    if (!tenant) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    return NextResponse.json({ ...tenant, id: tenant._id.toString() });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const paramsRes = await params;
    const data = await handleRequestData(req, paramsRes.id);
    
    // We use $set to avoid overwriting the entire branding object if only logo is updated
    // However, findByIdAndUpdate with plain object also works if data structure is correct.
    const tenant = await Tenant.findByIdAndUpdate(paramsRes.id, data, { new: true });
    
    if (!tenant) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    return NextResponse.json({ ...tenant.toObject(), id: tenant._id.toString() });
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const paramsRes = await params;
    const tenant = await Tenant.findByIdAndDelete(paramsRes.id);
    if (!tenant) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
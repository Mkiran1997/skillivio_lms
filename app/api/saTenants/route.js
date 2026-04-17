import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Tenant from "@/models/tenant";
import mongoose from "mongoose";
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

export async function GET() {
    try {
        await dbConnect();
        const tenants = await Tenant.find().lean();
        const mapped = tenants.map(t => ({ ...t, id: t._id.toString() }));
        return NextResponse.json(mapped);
    } catch (err) {
        console.error("GET error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}


export async function POST(req) {
    await dbConnect();
    try {
        // Pre-generate ID for S3 folder consistency
        const tenantId = new mongoose.Types.ObjectId();
        const data = await handleRequestData(req, tenantId);

        const tenant = new Tenant(data);
        tenant._id = tenantId;
        await tenant.save();

        return NextResponse.json({ ...tenant.toObject(), id: tenant._id.toString() });
    } catch (err) {
        console.error("POST error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
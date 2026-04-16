import { NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/s3";

/**
 * API Route to handle generic file uploads to S3
 * Supports Images, PDF, Video, Audio, and Text
 */
export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Optional: Get folder from form data
    const folder = formData.get("folder") || "general";

    // Validate file type if necessary
    const allowedTypes = [
      "image/jpeg", "image/png", "image/gif", "image/webp",
      "application/pdf",
      "video/mp4", "video/mpeg", "video/quicktime",
      "audio/mpeg", "audio/wav", "audio/ogg",
      "text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "File type not supported" }, { status: 400 });
    }

    // Convert file to Buffer for S3 upload
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to S3 using our common function
    const s3Url = await uploadToS3(buffer, file.name, file.type, folder);

    return NextResponse.json({
      success: true,
      url: s3Url,
      fileName: file.name,
      fileType: file.type
    });
  } catch (err) {
    console.error("Upload Route Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
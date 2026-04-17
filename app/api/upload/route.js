import { NextResponse } from "next/server";
import { uploadToS3, deleteFromS3 } from "@/lib/s3";

/**
 * API Route to handle file uploads to S3
 * Supports Images, PDF, Video, Audio, and Text
 * POST: Upload one or more files
 * DELETE: Delete a file from S3
 */

export async function POST(req) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("file");
    const folder = formData.get("folder") || "general";

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const allowedTypes = [
      "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
      "application/pdf",
      "video/mp4", "video/mpeg", "video/quicktime",
      "audio/mpeg", "audio/wav", "audio/ogg",
      "text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ];

    const uploadPromises = files.map(async (file) => {
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`File type ${file.type} not supported for ${file.name}`);
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const s3Url = await uploadToS3(buffer, file.name, file.type, folder);
      
      return {
        success: true,
        url: s3Url,
        fileName: file.name,
        fileType: file.type
      };
    });

    const results = await Promise.all(uploadPromises);

    return NextResponse.json({
      success: true,
      message: `${results.length} file(s) uploaded successfully`,
      data: results.length === 1 ? results[0] : results
    });
  } catch (err) {
    console.error("Upload Route Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const fileUrl = searchParams.get("url");
    const key = searchParams.get("key");

    if (!fileUrl && !key) {
      return NextResponse.json({ error: "URL or Key is required to delete" }, { status: 400 });
    }

    const result = await deleteFromS3(fileUrl || key);
    
    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
      ...result
    });
  } catch (err) {
    console.error("Delete Route Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
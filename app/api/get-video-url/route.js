import { NextResponse } from "next/server";
import { getSignedS3Url } from "@/lib/s3";
// import { getAuthContext } from "@/lib/auth"; // Uncomment if you want to restrict to logged-in users

/**
 * API to generate a temporary signed URL for a private S3 object
 * GET /api/get-video-url?fileKey=courses/123/lessons/video.mp4
 */
export async function GET(req) {
  try {
    // 1. Security check: Ensure user is authenticated (Optional but recommended)
    // const { user } = await getAuthContext(req);
    // if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const fileKey = searchParams.get("fileKey");

    if (!fileKey) {
      return NextResponse.json({ error: "fileKey is required" }, { status: 400 });
    }

    // 2. Security validation: Only allow access to specific folders
    // This prevents users from requesting sensitive system files or credentials if they exist in the bucket
    if (!fileKey.startsWith("courses/")) {
      return NextResponse.json({ error: "Access denied: Invalid file path" }, { status: 403 });
    }

    // 3. Generate the signed URL (expires in 1 hour by default)
    // The getSignedS3Url helper handles the GetObjectCommand and signing logic
    const signedUrl = await getSignedS3Url(fileKey, 3600);

    return NextResponse.json({ url: signedUrl });
  } catch (err) {
    console.error("Presigned URL Error:", err);
    return NextResponse.json({ error: "Failed to generate video access" }, { status: 500 });
  }
}

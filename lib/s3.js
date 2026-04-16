import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Common function to upload a file to S3
 * @param {Buffer | ReadableStream} fileData - The file data
 * @param {string} fileName - Original file name
 * @param {string} mimeType - File mime type
 * @param {string} folder - Optional folder path in bucket
 * @returns {Promise<string>} - The S3 URL of the uploaded file
 */
export async function uploadToS3(fileData, fileName, mimeType, folder = "uploads") {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/\s+/g, "-").toLowerCase();
  const key = `${folder}/${timestamp}-${sanitizedFileName}`;

  try {
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        Body: fileData,
        ContentType: mimeType,
      },
    });

    await upload.done();

    const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    return url;
  } catch (err) {
    console.error("S3 Upload Error:", err);
    throw new Error("Failed to upload file to S3");
  }
}

export default s3Client;

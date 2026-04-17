import { S3Client, PutObjectCommand, DeleteObjectCommand, DeleteObjectsCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 Client with trimmed environment variables to prevent issues with leading/trailing spaces
// const s3Client = new S3Client({
//   region: process.env.SKILLIVIO_AWS_REGION?.trim(),
//   credentials: {
//     accessKeyId: process.env.SKILLIVIO_AWS_ACCESS_KEY_ID?.trim(),
//     secretAccessKey: process.env.SKILLIVIO_  AWS_SECRET_ACCESS_KEY?.trim(),
//   },
// });


const s3Client = new S3Client({
  region: process.env.SKILLIVIO_AWS_REGION,
  credentials: {
    accessKeyId: process.env.SKILLIVIO_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.SKILLIVIO_AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Common function to upload a file to S3
 * @param {Buffer | Uint8Array | Blob | string} fileData - The file data
 * @param {string} fileName - Original file name
 * @param {string} mimeType - File mime type
 * @param {string} folder - Optional folder path in bucket
 * @returns {Promise<string>} - The S3 URL of the uploaded file
 */
export async function uploadToS3(fileData, fileName, mimeType, folder = "uploads") {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/\s+/g, "-").toLowerCase();
  const folderPath = folder.trim().replace(/\/+$/, ""); // Remove trailing slashes
  const key = `${folderPath}/${timestamp}-${sanitizedFileName}`;

  try {
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: "skillivio",
        Key: key,
        Body: fileData,
        ContentType: mimeType,
      },
    });

    await upload.done();

    // Construct the public URL correctly
    const region = "eu-north-1";
    const bucket = "skillivio";
    const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

    return url;
  } catch (err) {
    console.error("S3 Upload Error:", err);
    throw new Error(`Failed to upload file to S3: ${err.message}`);
  }
}

/**
 * Delete a single file from S3
 * @param {string} keyOrUrl - The S3 key or full S3 URL
 */
export async function deleteFromS3(keyOrUrl) {
  try {
    const key = getS3KeyFromUrl(keyOrUrl);
    const command = new DeleteObjectCommand({
      Bucket: process.env.SKILLIVIO_AWS_S3_BUCKET_NAME?.trim(),
      Key: key,
    });

    await s3Client.send(command);
    return { success: true, key };
  } catch (err) {
    console.error("S3 Delete Error:", err);
    throw new Error(`Failed to delete file from S3: ${err.message}`);
  }
}

/**
 * Delete multiple files from S3
 * @param {string[]} keysOrUrls - Array of S3 keys or full S3 URLs
 */
export async function deleteMultipleFromS3(keysOrUrls) {
  if (!keysOrUrls || keysOrUrls.length === 0) return { success: true, count: 0 };

  try {
    const objects = keysOrUrls.map(u => ({ Key: getS3KeyFromUrl(u) }));
    const command = new DeleteObjectsCommand({
      Bucket: process.env.SKILLIVIO_AWS_S3_BUCKET_NAME?.trim(),
      Delete: {
        Objects: objects,
        Quiet: true,
      },
    });

    await s3Client.send(command);
    return { success: true, count: keysOrUrls.length };
  } catch (err) {
    console.error("S3 Bulk Delete Error:", err);
    throw new Error(`Failed to delete multiple files from S3: ${err.message}`);
  }
}

/**
 * Helper to extract S3 key from a full S3 URL
 * @param {string} urlOrKey - The S3 key or full S3 URL
 * @returns {string} - The extracted key
 */
/**
 * Upload material specifically for a course
 * @param {Buffer | Blob} fileData - The file data
 * @param {string} courseId - ID of the course
 * @param {string} fileName - Original file name
 * @param {string} mimeType - File mime type
 * @param {string} subFolder - Optional subfolder like 'lessons' or 'materials'
 */
export async function uploadCourseMaterial(fileData, courseId, fileName, mimeType, subFolder = "") {
  console.log("uploadCourseMaterial", fileData);
  const folder = `courses/${courseId}${subFolder ? `/${subFolder}` : ""}`;
  return await uploadToS3(fileData, fileName, mimeType, folder);
}

export async function uploadLearnerDocument(fileData, courseId, fileName, mimeType, subFolder = "") {
  console.log("uploadLearnerDocument", fileData);
  const folder = `learner/${courseId}${subFolder ? `/${subFolder}` : ""}`;
  return await uploadToS3(fileData, fileName, mimeType, folder);
}

/**
 * Upload an enrollment document (Proof of Payment, ID, CV, etc.)
 */
export async function uploadEnrollmentDocument(fileData, enrollmentId, fileName, mimeType) {
  const folder = `enrollments/${enrollmentId}/documents`;
  return await uploadToS3(fileData, fileName, mimeType, folder);
}

/**
 * Upload a logo for a tenant
 */
export async function uploadTenantLogo(fileData, tenantId, fileName, mimeType) {
  const folder = `tenants/${tenantId}`;
  return await uploadToS3(fileData, fileName, mimeType, folder);
}

/**
 * Generates a temporary (signed) URL for an S3 object
 * @param {string} keyOrUrl - S3 Key or permanent URL
 * @param {number} expiresSeconds - Expiration in seconds (default 3600 = 1 hour)
 */
export async function getSignedS3Url(keyOrUrl, expiresSeconds = 3600) {
  if (!keyOrUrl || typeof keyOrUrl !== "string" || !keyOrUrl.includes("amazonaws.com")) {
    return keyOrUrl; // Return as is if it's an emoji or already a signed URL / non-S3 URL
  }

  try {
    const key = getS3KeyFromUrl(keyOrUrl);
    console.log("key", key);

    const command = new GetObjectCommand({
      Bucket: "skillivio",
      Key: key,
    });
    console.log("command", command);
    console.log("process.env.SKILLIVIO_AWS_S3_BUCKET_NAME", process.env.SKILLIVIO_AWS_S3_BUCKET_NAME);

    return await getSignedUrl(s3Client, command, { expiresIn: expiresSeconds });
  } catch (err) {
    console.error("Error generating signed URL:", err);
    return keyOrUrl;
  }
}

/**
 * Helper to sign all S3 URLs within a Course object
 * @param {Object} course - The course document
 */
export async function signCourseAssets(course) {
  if (!course) return course;

  // Create a deep copy to avoid mutating original if needed
  const signedCourse = JSON.parse(JSON.stringify(course));

  // 1. Sign Course Level Assets
  if (signedCourse.thumb) {
    signedCourse.thumb = await getSignedS3Url(signedCourse.thumb);
  }
  if (signedCourse.thumbnail) {
    signedCourse.thumbnail = await getSignedS3Url(signedCourse.thumbnail);
  }
  if (signedCourse.previewVideo) {
    signedCourse.previewVideo = await getSignedS3Url(signedCourse.previewVideo);
  }

  // 2. Sign Module & Lesson Assets
  if (signedCourse.modules && Array.isArray(signedCourse.modules)) {
    for (let m = 0; m < signedCourse.modules.length; m++) {
      const module = signedCourse.modules[m];
      if (module.lessons && Array.isArray(module.lessons)) {
        for (let l = 0; l < module.lessons.length; l++) {
          const lesson = module.lessons[l];
          if (lesson.url) {
            lesson.url = await getSignedS3Url(lesson.url);
          }
        }
      }
    }
  }

  return signedCourse;
}

export function getS3KeyFromUrl(urlOrKey) {
  if (!urlOrKey) return "";

  // If it's already a key (doesn't start with http), return it
  if (!urlOrKey.startsWith("http")) return urlOrKey;

  try {
    const url = new URL(urlOrKey);
    // Pathname usually starts with /BucketName/Key or /Key depending on domain
    // For standard s3.amazonaws.com URLs, it's /Key
    let key = url.pathname;
    if (key.startsWith("/")) {
      key = key.substring(1);
    }
    return decodeURIComponent(key);
  } catch (e) {
    return urlOrKey;
  }
}

export default s3Client;

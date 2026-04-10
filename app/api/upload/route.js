// app/api/upload/route.js

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { NextResponse } from 'next/server';

// Set up Multer storage
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true }); // Create directory if it doesn't exist
      }
      cb(null, uploadDir); // Store the file in 'public/uploads'
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename
    },
  }),
});

// POST handler for file upload
export async function POST(req) {
  // Multer middleware needs to handle the request and the response
  return new Promise((resolve, reject) => {
    upload.single('file')(req, {}, (err) => {
      if (err) {
        // If there's an error during the upload, reject with an error message
        return reject(new NextResponse(JSON.stringify({ error: 'File upload failed', details: err.message }), { status: 500 }));
      }

      if (!req.file) {
        // If no file was uploaded
        return reject(new NextResponse(JSON.stringify({ error: 'No file uploaded' }), { status: 400 }));
      }

      // File uploaded successfully, construct the file URL
      const uploadedFileUrl = `/uploads/${req.file.filename}`;
      return resolve(new NextResponse(JSON.stringify({ url: uploadedFileUrl }), { status: 200 }));
    });
  });
}
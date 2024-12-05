import express from "express";
import multer from "multer";
import { Storage } from "@google-cloud/storage";
import { PROJECT_ID, KEYFILENAME, BUCKET_NAME } from "./uploadFile-config.js";

const app = express();
const port = parseInt(process.env.PORT) || 3000;

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// Initialize Google Cloud Storagex
const storage = new Storage({
  projectId: PROJECT_ID,
  keyFilename: KEYFILENAME,
});

// Upload file to Google Cloud Storage function
async function uploadFile(bucketName, file, fileOutputName) {
  try {
    const bucket = storage.bucket(bucketName);

    // Create a blob (file) in the bucket
    const blob = bucket.file(fileOutputName);

    // Create a write stream
    const blobStream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      blobStream.on("error", (err) => {
        reject(err);
      });

      blobStream.on("finish", () => {
        // Make the file public (optional)
        blob
          .makePublic()
          .then(() => {
            const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileOutputName}`;
            resolve({
              message: "Upload successful",
              fileName: fileOutputName,
              publicUrl: publicUrl,
            });
          })
          .catch(reject);
      });

      // End the stream with the file buffer
      blobStream.end(file.buffer);
    });
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

// API endpoint for file upload
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // Check if file is present
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    // Custom filename (you can modify this logic as needed)
    const fileOutputName = `uploads/${Date.now()}-${req.file.originalname}`;

    // Upload file to Google Cloud Storage
    const result = await uploadFile(BUCKET_NAME, req.file, fileOutputName);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("File upload failed");
  }
});

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).send("Google Cloud Storage Upload API is running");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

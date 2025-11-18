import { promises as fs } from "fs";
import path from "path";
import { randomBytes } from "crypto";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || "10485760"); // 10MB default

export interface UploadResult {
  success: boolean;
  filePath?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  error?: string;
}

/**
 * Save uploaded file
 */
export async function saveUploadedFile(
  file: File,
  subfolder: string = "general"
): Promise<UploadResult> {
  try {
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE} bytes`,
      };
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/quicktime",
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: `File type ${file.type} is not allowed`,
      };
    }

    // Create unique filename
    const ext = path.extname(file.name);
    const randomName = randomBytes(16).toString("hex");
    const fileName = `${randomName}${ext}`;

    // Create directory if it doesn't exist
    const uploadPath = path.join(UPLOAD_DIR, subfolder);
    await fs.mkdir(uploadPath, { recursive: true });

    // Save file
    const filePath = path.join(uploadPath, fileName);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await fs.writeFile(filePath, buffer);

    return {
      success: true,
      filePath,
      fileName,
      fileSize: file.size,
      mimeType: file.type,
    };
  } catch (error: any) {
    console.error("File upload error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Save multiple files
 */
export async function saveMultipleFiles(
  files: File[],
  subfolder: string = "general"
): Promise<UploadResult[]> {
  return await Promise.all(
    files.map(file => saveUploadedFile(file, subfolder))
  );
}

/**
 * Delete a file
 */
export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return false; // File not found
    }
    console.error("File deletion error:", error);
    throw error;
  }
}

/**
 * Delete multiple files
 */
export async function deleteMultipleFiles(filePaths: string[]): Promise<boolean[]> {
  return await Promise.all(filePaths.map(deleteFile));
}

/**
 * Get file info
 */
export async function getFileInfo(filePath: string) {
  try {
    const stats = await fs.stat(filePath);
    const ext = path.extname(filePath).toLowerCase();

    const mimeTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".mp4": "video/mp4",
      ".mov": "video/quicktime",
    };

    return {
      fileName: path.basename(filePath),
      fileSize: stats.size,
      mimeType: mimeTypes[ext] || "application/octet-stream",
      createdAt: stats.birthtime,
      modifiedAt: stats.mtime,
    };
  } catch (error) {
    console.error("Error getting file info:", error);
    return null;
  }
}

/**
 * Validate image dimensions
 */
export async function validateImageDimensions(
  filePath: string,
  maxWidth?: number,
  maxHeight?: number
): Promise<{ valid: boolean; width: number; height: number }> {
  // This would require an image processing library like 'sharp'
  // Placeholder implementation

  // TODO: Implement with sharp
  /*
  const sharp = require('sharp');
  const metadata = await sharp(filePath).metadata();

  const valid = (!maxWidth || metadata.width <= maxWidth) &&
                (!maxHeight || metadata.height <= maxHeight);

  return {
    valid,
    width: metadata.width,
    height: metadata.height,
  };
  */

  return {
    valid: true,
    width: 0,
    height: 0,
  };
}

/**
 * Resize image
 */
export async function resizeImage(
  inputPath: string,
  outputPath: string,
  width?: number,
  height?: number
): Promise<string> {
  // TODO: Implement with sharp
  /*
  const sharp = require('sharp');

  await sharp(inputPath)
    .resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .toFile(outputPath);

  return outputPath;
  */

  console.log("Would resize image:", { inputPath, outputPath, width, height });
  return outputPath;
}

/**
 * Generate thumbnail
 */
export async function generateThumbnail(
  imagePath: string,
  thumbnailSize: number = 300
): Promise<string> {
  const ext = path.extname(imagePath);
  const thumbnailPath = imagePath.replace(ext, `_thumb${ext}`);

  await resizeImage(imagePath, thumbnailPath, thumbnailSize, thumbnailSize);

  return thumbnailPath;
}

/**
 * Clean up old files (for maintenance)
 */
export async function cleanupOldFiles(daysOld: number = 30): Promise<number> {
  try {
    const files = await fs.readdir(UPLOAD_DIR);
    const now = Date.now();
    const maxAge = daysOld * 24 * 60 * 60 * 1000;

    let deletedCount = 0;

    for (const file of files) {
      const filePath = path.join(UPLOAD_DIR, file);
      const stats = await fs.stat(filePath);

      if (now - stats.mtimeMs > maxAge) {
        await fs.unlink(filePath);
        deletedCount++;
      }
    }

    return deletedCount;
  } catch (error) {
    console.error("Error cleaning up old files:", error);
    return 0;
  }
}

/**
 * Get total storage used
 */
export async function getTotalStorageUsed(): Promise<number> {
  try {
    const files = await fs.readdir(UPLOAD_DIR, { recursive: true });
    let totalSize = 0;

    for (const file of files) {
      const filePath = path.join(UPLOAD_DIR, file as string);
      const stats = await fs.stat(filePath);

      if (stats.isFile()) {
        totalSize += stats.size;
      }
    }

    return totalSize;
  } catch (error) {
    console.error("Error calculating storage:", error);
    return 0;
  }
}

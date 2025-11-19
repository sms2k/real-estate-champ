import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  withErrorHandler,
  apiSuccess,
  ApiErrors,
} from "@/lib/api/errors";
import { requireAuthMiddleware } from "@/lib/api/middleware";
import { saveUploadedFile } from "@/lib/storage/file-upload";
import { writeFile } from "fs/promises";
import path from "path";

/**
 * POST /api/properties/[id]/images - Upload property images
 */
export const POST = withErrorHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { userId } = await requireAuthMiddleware(request);
    const { id: propertyId } = await params;

    // Check ownership
    const property = await prisma.property.findFirst({
      where: { id: propertyId, userId },
    });

    if (!property) {
      throw ApiErrors.NotFound("Property");
    }

    // Get form data
    const formData = await request.formData();
    const files = formData.getAll("images") as File[];

    if (!files || files.length === 0) {
      throw ApiErrors.BadRequest("No images provided");
    }

    const uploadedImages = [];

    for (const file of files) {
      try {
        // Validate file
        if (!file.type.startsWith("image/")) {
          continue; // Skip non-image files
        }

        // Save file
        const result = await saveUploadedFile(file, `properties/${propertyId}`);

        if (result.success && result.filePath) {
          // Create database record
          const image = await prisma.propertyImage.create({
            data: {
              propertyId,
              filePath: result.filePath,
              fileName: result.fileName,
              fileSize: result.fileSize || 0,
              fileType: file.type,
              isVideo: false,
            },
          });

          uploadedImages.push(image);
        }
      } catch (error) {
        console.error("Failed to upload image:", error);
        // Continue with other files
      }
    }

    if (uploadedImages.length === 0) {
      throw ApiErrors.BadRequest("Failed to upload any images");
    }

    return apiSuccess({
      message: `Successfully uploaded ${uploadedImages.length} image(s)`,
      images: uploadedImages,
    });
  }
);

/**
 * DELETE /api/properties/[id]/images - Delete property image
 */
export const DELETE = withErrorHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { userId } = await requireAuthMiddleware(request);
    const { id: propertyId } = await params;
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get("imageId");

    if (!imageId) {
      throw ApiErrors.BadRequest("Image ID is required");
    }

    // Check ownership
    const property = await prisma.property.findFirst({
      where: { id: propertyId, userId },
    });

    if (!property) {
      throw ApiErrors.NotFound("Property");
    }

    // Delete image
    await prisma.propertyImage.delete({
      where: { id: imageId },
    });

    return apiSuccess({
      message: "Image deleted successfully",
    });
  }
);

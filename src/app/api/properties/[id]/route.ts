import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  withErrorHandler,
  apiSuccess,
  ApiErrors,
} from "@/lib/api/errors";
import { requireAuthMiddleware } from "@/lib/api/middleware";
import { propertySchema } from "@/lib/validation";

/**
 * GET /api/properties/[id] - Get single property
 */
export const GET = withErrorHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { userId } = await requireAuthMiddleware(request);
    const { id } = await params;

    const property = await prisma.property.findFirst({
      where: {
        id,
        userId, // Ensure user owns this property
      },
      include: {
        images: true,
        contents: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!property) {
      throw ApiErrors.NotFound("Property");
    }

    return apiSuccess(property);
  }
);

/**
 * PATCH /api/properties/[id] - Update property
 */
export const PATCH = withErrorHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { userId } = await requireAuthMiddleware(request);
    const { id } = await params;

    // Check ownership
    const existing = await prisma.property.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw ApiErrors.NotFound("Property");
    }

    const body = await request.json();
    const validated = propertySchema.partial().parse(body);

    const updated = await prisma.property.update({
      where: { id },
      data: validated,
    });

    return apiSuccess({
      message: "Property updated successfully",
      property: updated,
    });
  }
);

/**
 * DELETE /api/properties/[id] - Delete property
 */
export const DELETE = withErrorHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { userId } = await requireAuthMiddleware(request);
    const { id } = await params;

    // Check ownership
    const existing = await prisma.property.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw ApiErrors.NotFound("Property");
    }

    // Delete property (cascades to images and content posts)
    await prisma.property.delete({
      where: { id },
    });

    return apiSuccess({
      message: "Property deleted successfully",
    });
  }
);

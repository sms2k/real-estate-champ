import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  withErrorHandler,
  apiSuccess,
  apiPaginated,
  ApiErrors,
} from "@/lib/api/errors";
import {
  requireAuthMiddleware,
  checkUsageLimitMiddleware,
  getPaginationParams,
} from "@/lib/api/middleware";
import { propertySchema } from "@/lib/validation";
import { incrementUsage } from "@/lib/auth/session";

/**
 * GET /api/properties - List user's properties
 */
export const GET = withErrorHandler(async (request: NextRequest) => {
  const { userId } = await requireAuthMiddleware(request);
  const { page, limit, skip } = getPaginationParams(request);

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        address: true,
        city: true,
        state: true,
        price: true,
        bedrooms: true,
        bathrooms: true,
        squareFeet: true,
        propertyType: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.property.count({
      where: { userId },
    }),
  ]);

  return apiPaginated(properties, page, limit, total);
});

/**
 * POST /api/properties - Create new property
 */
export const POST = withErrorHandler(async (request: NextRequest) => {
  const { userId } = await requireAuthMiddleware(request);

  // Check if user has reached property limit
  await checkUsageLimitMiddleware(userId, "properties");

  const body = await request.json();
  const validated = propertySchema.parse(body);

  // Create property
  const property = await prisma.property.create({
    data: {
      ...validated,
      userId,
      status: validated.status || "DRAFT",
    },
  });

  // Increment usage counter
  await incrementUsage(userId, "properties");

  return apiSuccess(
    {
      message: "Property created successfully",
      property,
    },
    201
  );
});

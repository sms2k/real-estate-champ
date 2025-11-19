import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  withErrorHandler,
  apiSuccess,
  ApiErrors,
} from "@/lib/api/errors";
import { requireAuthMiddleware } from "@/lib/api/middleware";
import { socialAccountSchema } from "@/lib/validation";

/**
 * GET /api/social-accounts - List user's social accounts
 */
export const GET = withErrorHandler(async (request: NextRequest) => {
  const { userId } = await requireAuthMiddleware(request);

  const accounts = await prisma.socialAccount.findMany({
    where: { userId },
    select: {
      id: true,
      platform: true,
      platformUsername: true,
      isActive: true,
      expiresAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return apiSuccess({ accounts });
});

/**
 * POST /api/social-accounts - Add social account
 */
export const POST = withErrorHandler(async (request: NextRequest) => {
  const { userId } = await requireAuthMiddleware(request);

  const body = await request.json();
  const validated = socialAccountSchema.parse(body);

  // Check if account already exists for this platform
  const existing = await prisma.socialAccount.findFirst({
    where: {
      userId,
      platform: validated.platform,
      platformUserId: validated.platformUserId,
    },
  });

  if (existing) {
    // Update existing account
    const updated = await prisma.socialAccount.update({
      where: { id: existing.id },
      data: {
        platformUsername: validated.platformUsername,
        accessToken: validated.accessToken,
        refreshToken: validated.refreshToken,
        expiresAt: validated.expiresAt ? new Date(validated.expiresAt) : null,
        scope: validated.scope,
        pageId: validated.pageId,
        pageAccessToken: validated.pageAccessToken,
        isActive: true,
      },
    });

    return apiSuccess({
      message: "Social account updated successfully",
      account: updated,
    });
  }

  // Create new account
  const account = await prisma.socialAccount.create({
    data: {
      userId,
      platform: validated.platform,
      platformUserId: validated.platformUserId,
      platformUsername: validated.platformUsername,
      accessToken: validated.accessToken,
      refreshToken: validated.refreshToken,
      expiresAt: validated.expiresAt ? new Date(validated.expiresAt) : null,
      scope: validated.scope,
      pageId: validated.pageId,
      pageAccessToken: validated.pageAccessToken,
      isActive: true,
    },
  });

  return apiSuccess(
    {
      message: "Social account connected successfully",
      account,
    },
    201
  );
});

/**
 * DELETE /api/social-accounts/[id] - Remove social account
 */
export const DELETE = withErrorHandler(async (request: NextRequest) => {
  const { userId } = await requireAuthMiddleware(request);
  const { searchParams } = new URL(request.url);
  const accountId = searchParams.get("id");

  if (!accountId) {
    throw ApiErrors.BadRequest("Account ID is required");
  }

  // Check ownership
  const account = await prisma.socialAccount.findFirst({
    where: { id: accountId, userId },
  });

  if (!account) {
    throw ApiErrors.NotFound("Social account");
  }

  await prisma.socialAccount.delete({
    where: { id: accountId },
  });

  return apiSuccess({
    message: "Social account disconnected successfully",
  });
});

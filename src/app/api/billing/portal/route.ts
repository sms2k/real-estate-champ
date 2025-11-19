import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  withErrorHandler,
  apiSuccess,
  ApiErrors,
} from "@/lib/api/errors";
import { requireAuthMiddleware } from "@/lib/api/middleware";
import { createBillingPortalSession } from "@/lib/stripe";

/**
 * POST /api/billing/portal - Create Stripe billing portal session
 */
export const POST = withErrorHandler(async (request: NextRequest) => {
  const { userId } = await requireAuthMiddleware(request);

  // Get user
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });

  if (!user || !user.stripeCustomerId) {
    throw ApiErrors.BadRequest("No Stripe customer found");
  }

  // Create portal session
  const session = await createBillingPortalSession(user.stripeCustomerId);

  return apiSuccess({
    url: session.url,
  });
});

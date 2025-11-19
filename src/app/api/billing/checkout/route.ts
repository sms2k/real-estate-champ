import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  withErrorHandler,
  apiSuccess,
  ApiErrors,
} from "@/lib/api/errors";
import { requireAuthMiddleware } from "@/lib/api/middleware";
import { createCheckoutSession } from "@/lib/stripe";
import { z } from "zod";

const checkoutSchema = z.object({
  priceId: z.string().min(1, "Price ID is required"),
});

/**
 * POST /api/billing/checkout - Create Stripe checkout session
 */
export const POST = withErrorHandler(async (request: NextRequest) => {
  const { userId } = await requireAuthMiddleware(request);

  const body = await request.json();
  const validated = checkoutSchema.parse(body);

  // Get user
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });

  if (!user) {
    throw ApiErrors.NotFound("User");
  }

  // Create checkout session
  const session = await createCheckoutSession(
    userId,
    validated.priceId,
    user.stripeCustomerId || undefined
  );

  return apiSuccess({
    sessionId: session.id,
    url: session.url,
  });
});

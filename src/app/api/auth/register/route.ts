import { NextRequest } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";
import { withErrorHandler, apiSuccess, ApiErrors } from "@/lib/api/errors";
import { registerSchema } from "@/lib/validation";
import { createStripeCustomer } from "@/lib/stripe";

export const POST = withErrorHandler(async (request: NextRequest) => {
  const body = await request.json();

  // Validate input
  const validated = registerSchema.parse(body);

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: validated.email },
  });

  if (existingUser) {
    throw ApiErrors.BadRequest("User with this email already exists");
  }

  // Hash password
  const hashedPassword = await hash(validated.password, 12);

  // Create user
  const user = await prisma.user.create({
    data: {
      name: validated.name,
      email: validated.email,
      password: hashedPassword,
      role: "REALTOR",
      companyName: validated.companyName,
      subscriptionPlan: "FREE",
      propertiesLimit: 5,
      monthlyContentLimit: 10,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      subscriptionPlan: true,
    },
  });

  // Create Stripe customer
  try {
    await createStripeCustomer(user.id, user.email, user.name || undefined);
  } catch (error) {
    console.error("Failed to create Stripe customer:", error);
    // Don't fail registration if Stripe customer creation fails
  }

  return apiSuccess(
    {
      message: "Registration successful",
      user,
    },
    201
  );
});

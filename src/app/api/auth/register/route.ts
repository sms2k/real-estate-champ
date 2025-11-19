import { NextRequest } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";
import { withErrorHandler, apiSuccess, ApiErrors } from "@/lib/api/errors";
import { registerSchema } from "@/lib/validation";

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

  // Create user (Free version - no limits!)
  const user = await prisma.user.create({
    data: {
      name: validated.name,
      email: validated.email,
      password: hashedPassword,
      role: "REALTOR",
      companyName: validated.companyName,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return apiSuccess(
    {
      message: "Registration successful",
      user,
    },
    201
  );
});

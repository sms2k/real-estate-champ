import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth";
import { ApiErrors } from "./errors";
import { checkUsageLimit } from "@/lib/auth/session";

/**
 * Middleware to require authentication
 */
export async function requireAuthMiddleware(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    throw ApiErrors.Unauthorized();
  }

  return {
    user: session.user,
    userId: session.user.id as string,
  };
}

/**
 * Middleware to require admin role
 */
export async function requireAdminMiddleware(request: NextRequest) {
  const { user } = await requireAuthMiddleware(request);

  if ((user as any).role !== "SUPER_ADMIN") {
    throw ApiErrors.Forbidden("Admin access required");
  }

  return { user };
}

/**
 * Middleware to check usage limits
 */
export async function checkUsageLimitMiddleware(
  userId: string,
  type: "properties" | "content"
) {
  const { allowed, current, limit } = await checkUsageLimit(userId, type);

  if (!allowed) {
    throw ApiErrors.LimitExceeded(
      `You've reached your ${type} limit (${current}/${limit}). Please upgrade your plan.`
    );
  }

  return { current, limit };
}

/**
 * Parse and validate request body
 */
export async function parseBody<T>(request: NextRequest): Promise<T> {
  try {
    const body = await request.json();
    return body as T;
  } catch (error) {
    throw ApiErrors.BadRequest("Invalid JSON in request body");
  }
}

/**
 * Get query parameters as object
 */
export function getQueryParams(request: NextRequest): Record<string, string> {
  const { searchParams } = new URL(request.url);
  const params: Record<string, string> = {};

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}

/**
 * Get pagination parameters from query string
 */
export function getPaginationParams(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10")));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

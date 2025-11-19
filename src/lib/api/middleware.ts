import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth";
import { ApiErrors } from "./errors";

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
 * Middleware to check usage limits (now unlimited - no restrictions)
 */
export async function checkUsageLimitMiddleware(
  userId: string,
  type: "properties" | "content"
) {
  // Free version - no limits!
  return { current: 0, limit: -1 }; // -1 indicates unlimited
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

import { auth } from "./auth";
import { prisma } from "@/lib/db";
import type { User } from "@prisma/client";

/**
 * Get current user from session
 */
export async function getCurrentUser() {
  try {
    const session = await auth();
    return session?.user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Get full user data from database
 */
export async function getFullUserData(userId: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    return user;
  } catch (error) {
    console.error("Error getting full user data:", error);
    return null;
  }
}

/**
 * Increment usage counter (now a no-op for free version)
 */
export async function incrementUsage(
  userId: string,
  type: "properties" | "content",
  amount: number = 1
) {
  // Free version - no usage tracking
  return;
}

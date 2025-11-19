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
      include: {
        subscription: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Error getting full user data:", error);
    return null;
  }
}

/**
 * Check if user has active subscription
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionStatus: true,
        subscriptionEndDate: true
      },
    });

    if (!user) return false;

    return (
      user.subscriptionStatus === "ACTIVE" ||
      user.subscriptionStatus === "TRIALING" ||
      (user.subscriptionEndDate !== null && user.subscriptionEndDate > new Date())
    );
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return false;
  }
}

/**
 * Get user's current usage for the month
 */
export async function getCurrentMonthUsage(userId: string) {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const usage = await prisma.usageRecord.findUnique({
      where: {
        userId_month_year: {
          userId,
          month,
          year,
        },
      },
    });

    return usage || { properties: 0, content: 0 };
  } catch (error) {
    console.error("Error getting usage:", error);
    return { properties: 0, content: 0 };
  }
}

/**
 * Increment usage counter
 */
export async function incrementUsage(
  userId: string,
  type: "properties" | "content",
  amount: number = 1
) {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    await prisma.usageRecord.upsert({
      where: {
        userId_month_year: {
          userId,
          month,
          year,
        },
      },
      create: {
        userId,
        month,
        year,
        [type]: amount,
      },
      update: {
        [type]: {
          increment: amount,
        },
      },
    });
  } catch (error) {
    console.error("Error incrementing usage:", error);
    throw error;
  }
}

/**
 * Check if user has reached their limit
 */
export async function checkUsageLimit(
  userId: string,
  type: "properties" | "content"
): Promise<{ allowed: boolean; current: number; limit: number }> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        propertiesLimit: true,
        monthlyContentLimit: true,
      },
    });

    if (!user) {
      return { allowed: false, current: 0, limit: 0 };
    }

    const usage = await getCurrentMonthUsage(userId);
    const limit = type === "properties" ? user.propertiesLimit : user.monthlyContentLimit;
    const current = type === "properties" ? usage.properties : usage.content;

    // 999999 means unlimited
    const allowed = limit === 999999 || current < limit;

    return { allowed, current, limit };
  } catch (error) {
    console.error("Error checking usage limit:", error);
    return { allowed: false, current: 0, limit: 0 };
  }
}

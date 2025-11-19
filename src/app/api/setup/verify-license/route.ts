import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { apiSuccess, ApiErrors, ApiException } from "@/lib/api/errors";

// Force dynamic runtime
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/setup/verify-license - Verify license key
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { licenseKey, email } = body;

    if (!licenseKey || !email) {
      throw ApiErrors.BadRequest("License key and email are required");
    }

    // Check if license exists in database
    const license = await prisma.license.findUnique({
      where: { licenseKey },
    });

    if (!license) {
      throw ApiErrors.BadRequest("Invalid license key");
    }

    // Check if license email matches
    if (license.email.toLowerCase() !== email.toLowerCase()) {
      throw ApiErrors.BadRequest("License key does not match the provided email");
    }

    // Check if license is already used
    if (license.isActivated) {
      throw ApiErrors.BadRequest("This license key has already been used");
    }

    // Check if license is expired
    if (license.expiresAt && license.expiresAt < new Date()) {
      throw ApiErrors.BadRequest("This license key has expired");
    }

    return apiSuccess({
      valid: true,
      message: "License key verified successfully",
    });
  } catch (error) {
    if (error instanceof ApiException) {
      throw error;
    }
    console.error("License verification error:", error);
    throw ApiErrors.ServerError("Failed to verify license");
  }
}

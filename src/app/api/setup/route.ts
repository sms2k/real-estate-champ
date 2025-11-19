import { NextRequest } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";
import { apiSuccess, ApiErrors, ApiException } from "@/lib/api/errors";
import { saveBrandingSettings } from "@/lib/settings";

// Force dynamic runtime
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/setup - Check if setup is complete
 */
export async function GET() {
  try {
    // Check if any SUPER_ADMIN users exist
    const adminCount = await prisma.user.count({
      where: { role: "SUPER_ADMIN" },
    });

    return apiSuccess({
      setupComplete: adminCount > 0,
      hasAdmin: adminCount > 0,
    });
  } catch (error) {
    console.error("Setup check error:", error);
    return apiSuccess({
      setupComplete: false,
      hasAdmin: false,
    });
  }
}

/**
 * POST /api/setup - Complete initial setup
 */
export async function POST(request: NextRequest) {
  try {
    // Check if setup already completed
    const adminCount = await prisma.user.count({
      where: { role: "SUPER_ADMIN" },
    });

    if (adminCount > 0) {
      throw ApiErrors.BadRequest("Setup has already been completed");
    }

    const body = await request.json();
    const {
      licenseKey,
      customerEmail,
      adminName,
      adminEmail,
      adminPassword,
      googleAiKey,
      companyName,
      companyLogo,
    } = body;

    // Validate required fields
    if (!licenseKey || !customerEmail) {
      throw ApiErrors.BadRequest("License key and customer email are required");
    }

    if (!adminName || !adminEmail || !adminPassword) {
      throw ApiErrors.BadRequest("Admin name, email, and password are required");
    }

    if (!googleAiKey) {
      throw ApiErrors.BadRequest("Google AI API key is required");
    }

    // Verify license key
    const license = await prisma.license.findUnique({
      where: { licenseKey },
    });

    if (!license) {
      throw ApiErrors.BadRequest("Invalid license key");
    }

    if (license.email.toLowerCase() !== customerEmail.toLowerCase()) {
      throw ApiErrors.BadRequest("License key does not match the provided email");
    }

    if (license.isActivated) {
      throw ApiErrors.BadRequest("This license key has already been activated");
    }

    if (license.expiresAt && license.expiresAt < new Date()) {
      throw ApiErrors.BadRequest("This license key has expired");
    }

    // Hash admin password
    const hashedPassword = await hash(adminPassword, 12);

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: "SUPER_ADMIN",
        companyName: companyName || null,
        companyLogo: companyLogo || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    // Save Google AI API key to ApiKey table
    await prisma.apiKey.create({
      data: {
        name: "Google AI",
        key: googleAiKey,
        isActive: true,
      },
    });

    // Mark license as activated
    await prisma.license.update({
      where: { licenseKey },
      data: {
        isActivated: true,
        activatedAt: new Date(),
        activatedBy: adminUser.id,
      },
    });

    // Save branding configuration to settings
    if (companyName || companyLogo) {
      try {
        await saveBrandingSettings({
          companyName: companyName || "Real Estate Champ",
          companyLogo: companyLogo || "",
        });
      } catch (err) {
        console.error("Failed to save branding settings:", err);
        // Non-critical, continue
      }
    }

    return apiSuccess(
      {
        message: "Setup completed successfully",
        admin: adminUser,
      },
      201
    );
  } catch (error) {
    if (error instanceof ApiException) {
      throw error;
    }
    console.error("Setup error:", error);
    throw ApiErrors.ServerError("Failed to complete setup");
  }
}

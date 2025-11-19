import { NextRequest } from "next/server";
import { apiSuccess, ApiErrors, ApiException } from "@/lib/api/errors";
import { getBrandingSettings, saveBrandingSettings } from "@/lib/settings";
import { requireAuth } from "@/lib/auth/utils";

// Force dynamic runtime
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/settings/branding - Get branding settings
 */
export async function GET(request: NextRequest) {
  try {
    const branding = await getBrandingSettings();
    return apiSuccess(branding);
  } catch (error) {
    console.error("Error fetching branding settings:", error);
    throw ApiErrors.ServerError("Failed to fetch branding settings");
  }
}

/**
 * PUT /api/settings/branding - Update branding settings
 */
export async function PUT(request: NextRequest) {
  try {
    // Require authentication and SUPER_ADMIN role
    const user = await requireAuth();

    // @ts-ignore - custom role property
    if (user.role !== "SUPER_ADMIN") {
      throw ApiErrors.Forbidden("Only administrators can update branding settings");
    }

    const body = await request.json();
    const {
      companyName,
      companyLogo,
      primaryColor,
      secondaryColor,
      favicon,
      tagline,
      supportEmail,
      websiteUrl,
    } = body;

    // Save branding settings
    await saveBrandingSettings({
      companyName,
      companyLogo,
      primaryColor,
      secondaryColor,
      favicon,
      tagline,
      supportEmail,
      websiteUrl,
    });

    return apiSuccess({
      message: "Branding settings updated successfully",
    });
  } catch (error) {
    if (error instanceof ApiException) {
      throw error;
    }
    console.error("Error updating branding settings:", error);
    throw ApiErrors.ServerError("Failed to update branding settings");
  }
}

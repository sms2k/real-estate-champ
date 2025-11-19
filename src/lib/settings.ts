import { prisma } from "@/lib/db";

/**
 * Get a single setting value by key
 */
export async function getSetting(key: string): Promise<string | null> {
  const setting = await prisma.settings.findUnique({
    where: { key },
  });
  return setting?.value || null;
}

/**
 * Get multiple settings by keys
 */
export async function getSettings(keys: string[]): Promise<Record<string, string>> {
  const settings = await prisma.settings.findMany({
    where: {
      key: { in: keys },
    },
  });

  return settings.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {} as Record<string, string>);
}

/**
 * Get all settings in a category
 */
export async function getSettingsByCategory(category: string): Promise<Record<string, string>> {
  const settings = await prisma.settings.findMany({
    where: { category },
  });

  return settings.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {} as Record<string, string>);
}

/**
 * Set a single setting value
 */
export async function setSetting(
  key: string,
  value: string,
  description?: string,
  category: string = "general"
): Promise<void> {
  await prisma.settings.upsert({
    where: { key },
    update: { value, description, category },
    create: { key, value, description, category },
  });
}

/**
 * Set multiple settings at once
 */
export async function setSettings(
  settings: Array<{
    key: string;
    value: string;
    description?: string;
    category?: string;
  }>
): Promise<void> {
  await Promise.all(
    settings.map((setting) =>
      setSetting(
        setting.key,
        setting.value,
        setting.description,
        setting.category || "general"
      )
    )
  );
}

/**
 * Delete a setting
 */
export async function deleteSetting(key: string): Promise<void> {
  await prisma.settings.delete({
    where: { key },
  });
}

/**
 * Get all branding settings for white-label customization
 */
export async function getBrandingSettings() {
  const settings = await getSettingsByCategory("branding");

  return {
    companyName: settings.company_name || "Real Estate Champ",
    companyLogo: settings.company_logo || "/logo.png",
    primaryColor: settings.primary_color || "#2563eb",
    secondaryColor: settings.secondary_color || "#1e40af",
    favicon: settings.favicon || "/favicon.ico",
    tagline: settings.tagline || "AI-Powered Property Marketing",
    supportEmail: settings.support_email || "",
    websiteUrl: settings.website_url || "",
  };
}

/**
 * Save branding settings
 */
export async function saveBrandingSettings(branding: {
  companyName?: string;
  companyLogo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  favicon?: string;
  tagline?: string;
  supportEmail?: string;
  websiteUrl?: string;
}) {
  const settingsToSave = [];

  if (branding.companyName !== undefined) {
    settingsToSave.push({
      key: "company_name",
      value: branding.companyName,
      description: "Company name displayed throughout the platform",
      category: "branding",
    });
  }

  if (branding.companyLogo !== undefined) {
    settingsToSave.push({
      key: "company_logo",
      value: branding.companyLogo,
      description: "URL to company logo",
      category: "branding",
    });
  }

  if (branding.primaryColor !== undefined) {
    settingsToSave.push({
      key: "primary_color",
      value: branding.primaryColor,
      description: "Primary brand color (hex code)",
      category: "branding",
    });
  }

  if (branding.secondaryColor !== undefined) {
    settingsToSave.push({
      key: "secondary_color",
      value: branding.secondaryColor,
      description: "Secondary brand color (hex code)",
      category: "branding",
    });
  }

  if (branding.favicon !== undefined) {
    settingsToSave.push({
      key: "favicon",
      value: branding.favicon,
      description: "URL to favicon",
      category: "branding",
    });
  }

  if (branding.tagline !== undefined) {
    settingsToSave.push({
      key: "tagline",
      value: branding.tagline,
      description: "Company tagline",
      category: "branding",
    });
  }

  if (branding.supportEmail !== undefined) {
    settingsToSave.push({
      key: "support_email",
      value: branding.supportEmail,
      description: "Support email address",
      category: "branding",
    });
  }

  if (branding.websiteUrl !== undefined) {
    settingsToSave.push({
      key: "website_url",
      value: branding.websiteUrl,
      description: "Company website URL",
      category: "branding",
    });
  }

  await setSettings(settingsToSave);
}

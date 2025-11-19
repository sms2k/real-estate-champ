import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

function generateLicenseKey(): string {
  // Generate 16 random bytes and convert to hex
  const bytes = randomBytes(8);
  const hex = bytes.toString("hex").toUpperCase();

  // Format as XXXX-XXXX-XXXX-XXXX
  return `${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}`;
}

async function createLicense(email: string, customerName?: string, expiresInDays?: number) {
  const licenseKey = generateLicenseKey();

  const expiresAt = expiresInDays
    ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
    : null;

  const license = await prisma.license.create({
    data: {
      licenseKey,
      email: email.toLowerCase(),
      customerName,
      expiresAt,
    },
  });

  console.log("\n✅ License Created Successfully!\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`License Key:  ${license.licenseKey}`);
  console.log(`Email:        ${license.email}`);
  console.log(`Customer:     ${license.customerName || "N/A"}`);
  console.log(`Expires:      ${license.expiresAt ? license.expiresAt.toLocaleDateString() : "Never"}`);
  console.log(`Created:      ${license.createdAt.toLocaleDateString()}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log("📧 Email this license key to your customer along with");
  console.log("   the installation files and setup instructions.\n");

  return license;
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    console.log("\n📝 License Key Generator for Real Estate Champ\n");
    console.log("Usage:");
    console.log("  npm run generate-license <email> [customer-name] [expires-in-days]\n");
    console.log("Examples:");
    console.log("  npm run generate-license john@example.com");
    console.log("  npm run generate-license john@example.com \"John's Realty\"");
    console.log("  npm run generate-license john@example.com \"John's Realty\" 365\n");
    console.log("Options:");
    console.log("  email             Customer's email address (required)");
    console.log("  customer-name     Customer's name or company name (optional)");
    console.log("  expires-in-days   Number of days until expiration (optional, default: never)\n");
    process.exit(0);
  }

  const [email, customerName, expiresInDays] = args;

  if (!email || !email.includes("@")) {
    console.error("❌ Error: Valid email address is required");
    console.log("   Usage: npm run generate-license <email> [customer-name] [expires-in-days]");
    process.exit(1);
  }

  const expires = expiresInDays ? parseInt(expiresInDays, 10) : undefined;
  if (expiresInDays && isNaN(expires!)) {
    console.error("❌ Error: expires-in-days must be a number");
    process.exit(1);
  }

  try {
    await createLicense(email, customerName, expires);
  } catch (error) {
    console.error("❌ Error creating license:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  withErrorHandler,
  apiSuccess,
  ApiErrors,
} from "@/lib/api/errors";
import { requireAuthMiddleware } from "@/lib/api/middleware";
import { chatMessageSchema } from "@/lib/validation";
import { chatWithGemini, extractPropertyDataFromChat } from "@/lib/ai/gemini";

/**
 * POST /api/chat - Chat with AI about property
 */
export const POST = withErrorHandler(async (request: NextRequest) => {
  const { userId } = await requireAuthMiddleware(request);

  const body = await request.json();
  const validated = chatMessageSchema.parse(body);

  // Build context if property ID provided
  let context = "";
  if (validated.propertyId) {
    const property = await prisma.property.findFirst({
      where: {
        id: validated.propertyId,
        userId,
      },
    });

    if (property) {
      context = `
Current property details:
- Title: ${property.title}
- Address: ${property.address || "Not set"}
- City: ${property.city || "Not set"}
- State: ${property.state || "Not set"}
- Price: ${property.price ? `$${property.price.toLocaleString()}` : "Not set"}
- Bedrooms: ${property.bedrooms || "Not set"}
- Bathrooms: ${property.bathrooms || "Not set"}
- Square Feet: ${property.squareFeet || "Not set"}
- Type: ${property.propertyType || "Not set"}
- Description: ${property.description || "Not set"}
      `.trim();
    }
  }

  // Get AI response
  const response = await chatWithGemini(validated.messages, context);

  // Try to extract property data from conversation
  let extractedData = null;
  if (validated.propertyId) {
    try {
      extractedData = await extractPropertyDataFromChat(validated.messages);
    } catch (error) {
      console.error("Failed to extract property data:", error);
    }
  }

  return apiSuccess({
    response,
    extractedData,
  });
});

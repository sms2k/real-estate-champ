import axios from "axios";
import { createHmac } from "crypto";
import { WebhookPayload } from "@/types";
import { prisma } from "@/lib/db";

export interface WebhookDeliveryResult {
  success: boolean;
  statusCode?: number;
  error?: string;
  webhookId: string;
}

/**
 * Send payload to a webhook
 */
export async function sendWebhook(
  webhookId: string,
  payload: WebhookPayload
): Promise<WebhookDeliveryResult> {
  try {
    const webhook = await prisma.webhook.findUnique({
      where: { id: webhookId },
    });

    if (!webhook || !webhook.isActive) {
      throw new Error("Webhook not found or inactive");
    }

    // Create signature if secret is set
    let signature: string | undefined;
    if (webhook.secret) {
      signature = createWebhookSignature(payload, webhook.secret);
    }

    // Send the webhook
    const response = await axios.post(webhook.url, payload, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "RealEstateChamp-Webhook/1.0",
        ...(signature && { "X-Webhook-Signature": signature }),
        "X-Webhook-Event": payload.event,
        "X-Webhook-Timestamp": payload.timestamp.toISOString(),
      },
      timeout: 30000, // 30 second timeout
    });

    return {
      success: true,
      statusCode: response.status,
      webhookId,
    };
  } catch (error: any) {
    console.error("Webhook delivery error:", error.message);
    return {
      success: false,
      statusCode: error.response?.status,
      error: error.message,
      webhookId,
    };
  }
}

/**
 * Send webhook to multiple endpoints
 */
export async function sendWebhookToMultiple(
  webhookIds: string[],
  payload: WebhookPayload
): Promise<WebhookDeliveryResult[]> {
  const results = await Promise.all(
    webhookIds.map(id => sendWebhook(id, payload))
  );

  return results;
}

/**
 * Send webhook to all user's active webhooks
 */
export async function sendWebhookToUserWebhooks(
  userId: string,
  payload: WebhookPayload
): Promise<WebhookDeliveryResult[]> {
  const webhooks = await prisma.webhook.findMany({
    where: {
      userId,
      isActive: true,
    },
  });

  const results = await Promise.all(
    webhooks.map(webhook => sendWebhook(webhook.id, payload))
  );

  return results;
}

/**
 * Create HMAC signature for webhook payload
 */
function createWebhookSignature(payload: any, secret: string): string {
  const hmac = createHmac("sha256", secret);
  hmac.update(JSON.stringify(payload));
  return `sha256=${hmac.digest("hex")}`;
}

/**
 * Verify webhook signature (for receiving webhooks from other services)
 */
export function verifyWebhookSignature(
  payload: any,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = createWebhookSignature(payload, secret);
  return signature === expectedSignature;
}

/**
 * Test webhook endpoint
 */
export async function testWebhook(
  url: string,
  secret?: string
): Promise<{ success: boolean; statusCode?: number; error?: string }> {
  try {
    const testPayload: WebhookPayload = {
      event: "content.generated",
      propertyId: "test-property-id",
      contentType: "test",
      data: {
        message: "This is a test webhook from RealEstateChamp",
      },
      timestamp: new Date(),
    };

    let signature: string | undefined;
    if (secret) {
      signature = createWebhookSignature(testPayload, secret);
    }

    const response = await axios.post(url, testPayload, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "RealEstateChamp-Webhook/1.0",
        ...(signature && { "X-Webhook-Signature": signature }),
        "X-Webhook-Event": "test",
      },
      timeout: 10000,
    });

    return {
      success: true,
      statusCode: response.status,
    };
  } catch (error: any) {
    return {
      success: false,
      statusCode: error.response?.status,
      error: error.message,
    };
  }
}

/**
 * Retry failed webhook with exponential backoff
 */
export async function retryWebhook(
  webhookId: string,
  payload: WebhookPayload,
  maxRetries: number = 3
): Promise<WebhookDeliveryResult> {
  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const result = await sendWebhook(webhookId, payload);

    if (result.success) {
      return result;
    }

    lastError = result.error;

    // Exponential backoff: 1s, 2s, 4s
    if (attempt < maxRetries - 1) {
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }

  return {
    success: false,
    error: `Failed after ${maxRetries} retries: ${lastError}`,
    webhookId,
  };
}

import { NextRequest } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import {
  handleSubscriptionChange,
  handleSubscriptionDeleted,
  handleInvoicePaymentSucceeded,
} from "@/lib/stripe";
import { apiSuccess } from "@/lib/api/errors";

/**
 * POST /api/webhooks/stripe - Handle Stripe webhooks
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return new Response("Webhook signature verification failed", {
      status: 400,
    });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionChange(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        console.log("Invoice payment failed:", event.data.object);
        // TODO: Send email notification to user
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return apiSuccess({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Webhook processing failed", { status: 500 });
  }
}

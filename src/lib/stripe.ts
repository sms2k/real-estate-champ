import Stripe from 'stripe';
import { prisma } from './db';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover' as any,
  typescript: true,
});

/**
 * Create Stripe customer
 */
export async function createStripeCustomer(userId: string, email: string, name?: string) {
  const customer = await stripe.customers.create({
    email,
    name: name || undefined,
    metadata: {
      userId,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer;
}

/**
 * Create Stripe checkout session
 */
export async function createCheckoutSession(
  userId: string,
  priceId: string,
  customerId?: string
) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
    metadata: {
      userId,
    },
    subscription_data: {
      trial_period_days: 14, // 14-day free trial
      metadata: {
        userId,
      },
    },
  });

  return session;
}

/**
 * Create billing portal session
 */
export async function createBillingPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXTAUTH_URL}/dashboard/billing`,
  });

  return session;
}

/**
 * Handle subscription created/updated
 */
export async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;

  if (!userId) {
    throw new Error('No userId in subscription metadata');
  }

  const plan = getPlanFromPriceId(subscription.items.data[0].price.id);
  const limits = getPlanLimits(plan);

  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionId: subscription.id,
      subscriptionStatus: subscription.status.toUpperCase() as any,
      subscriptionPlan: plan,
      subscriptionEndDate: (subscription as any).current_period_end
        ? new Date((subscription as any).current_period_end * 1000)
        : null,
      propertiesLimit: limits.properties,
      monthlyContentLimit: limits.monthlyContent,
    },
  });

  // Update or create subscription record
  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      plan,
      status: subscription.status.toUpperCase() as any,
      stripeCurrentPeriodEnd: (subscription as any).current_period_end
        ? new Date((subscription as any).current_period_end * 1000)
        : null,
    },
    update: {
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      plan,
      status: subscription.status.toUpperCase() as any,
      stripeCurrentPeriodEnd: (subscription as any).current_period_end
        ? new Date((subscription as any).current_period_end * 1000)
        : null,
    },
  });
}

/**
 * Handle subscription deleted
 */
export async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;

  if (!userId) {
    return;
  }

  // Revert to free plan
  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionId: null,
      subscriptionStatus: 'CANCELED',
      subscriptionPlan: 'FREE',
      subscriptionEndDate: null,
      propertiesLimit: 5,
      monthlyContentLimit: 10,
    },
  });

  await prisma.subscription.update({
    where: { userId },
    data: {
      status: 'CANCELED',
    },
  });
}

/**
 * Handle invoice payment succeeded
 */
export async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  if (!invoice.customer) return;

  const customer = await stripe.customers.retrieve(invoice.customer as string);

  if (customer.deleted) return;

  const userId = customer.metadata.userId;

  if (!userId) return;

  // Record invoice
  await prisma.invoice.create({
    data: {
      userId,
      stripeInvoiceId: invoice.id,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: invoice.status || 'paid',
      invoicePdf: invoice.invoice_pdf || null,
      hostedInvoiceUrl: invoice.hosted_invoice_url || null,
    },
  });
}

/**
 * Get plan from Stripe price ID
 */
function getPlanFromPriceId(priceId: string): 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE' {
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID) {
    return 'STARTER';
  } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID) {
    return 'PROFESSIONAL';
  } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID) {
    return 'ENTERPRISE';
  }
  return 'STARTER'; // Default
}

/**
 * Get plan limits
 */
function getPlanLimits(plan: string) {
  const limits: Record<string, { properties: number; monthlyContent: number }> = {
    FREE: { properties: 5, monthlyContent: 10 },
    STARTER: { properties: 25, monthlyContent: 100 },
    PROFESSIONAL: { properties: 999999, monthlyContent: 999999 },
    ENTERPRISE: { properties: 999999, monthlyContent: 999999 },
  };

  return limits[plan] || limits.FREE;
}

/**
 * Check if user has active subscription
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionStatus: true, subscriptionEndDate: true },
  });

  if (!user) return false;

  return Boolean(
    user.subscriptionStatus === 'ACTIVE' ||
    user.subscriptionStatus === 'TRIALING' ||
    (user.subscriptionEndDate && user.subscriptionEndDate > new Date())
  );
}

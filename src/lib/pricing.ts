/**
 * Pricing Plans Configuration
 */

export interface PricingPlan {
  id: 'FREE' | 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  name: string;
  price: number; // in dollars
  priceId: string; // Stripe Price ID
  interval: 'month' | 'year';
  features: string[];
  limits: {
    properties: number;
    monthlyContent: number;
    socialAccounts: number;
    videoGeneration: boolean;
    imageEditing: boolean;
    whiteLabel: boolean;
    customDomain: boolean;
    apiAccess: boolean;
    prioritySupport: boolean;
  };
  popular?: boolean;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'FREE',
    name: 'Free',
    price: 0,
    priceId: '', // No Stripe price ID for free plan
    interval: 'month',
    features: [
      '5 property listings',
      '10 AI-generated posts per month',
      '2 social media accounts',
      'Blog post generation',
      'Basic image enhancement',
      'Email support',
    ],
    limits: {
      properties: 5,
      monthlyContent: 10,
      socialAccounts: 2,
      videoGeneration: false,
      imageEditing: true,
      whiteLabel: false,
      customDomain: false,
      apiAccess: false,
      prioritySupport: false,
    },
  },
  {
    id: 'STARTER',
    name: 'Starter',
    price: 49,
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || '',
    interval: 'month',
    features: [
      '25 property listings',
      '100 AI-generated posts per month',
      '5 social media accounts',
      'Blog post generation',
      'Advanced image editing',
      'Video generation (5/month)',
      'Priority email support',
    ],
    limits: {
      properties: 25,
      monthlyContent: 100,
      socialAccounts: 5,
      videoGeneration: true,
      imageEditing: true,
      whiteLabel: false,
      customDomain: false,
      apiAccess: false,
      prioritySupport: false,
    },
    popular: true,
  },
  {
    id: 'PROFESSIONAL',
    name: 'Professional',
    price: 99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || '',
    interval: 'month',
    features: [
      'Unlimited property listings',
      'Unlimited AI-generated posts',
      'Unlimited social accounts',
      'Unlimited video generation',
      'Advanced image editing & staging',
      'White-label branding',
      'Priority phone & email support',
      'Analytics dashboard',
    ],
    limits: {
      properties: 999999,
      monthlyContent: 999999,
      socialAccounts: 999999,
      videoGeneration: true,
      imageEditing: true,
      whiteLabel: true,
      customDomain: false,
      apiAccess: false,
      prioritySupport: true,
    },
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    price: 299,
    priceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID || '',
    interval: 'month',
    features: [
      'Everything in Professional',
      'Custom domain',
      'API access',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
      'Team collaboration (up to 10 users)',
      'Advanced analytics & reporting',
    ],
    limits: {
      properties: 999999,
      monthlyContent: 999999,
      socialAccounts: 999999,
      videoGeneration: true,
      imageEditing: true,
      whiteLabel: true,
      customDomain: true,
      apiAccess: true,
      prioritySupport: true,
    },
  },
];

/**
 * Get plan by ID
 */
export function getPlanById(planId: string): PricingPlan | undefined {
  return PRICING_PLANS.find(plan => plan.id === planId);
}

/**
 * Get plan features for comparison
 */
export function getPlanFeatures() {
  return {
    features: [
      'Property Listings',
      'Monthly AI Content',
      'Social Media Accounts',
      'Video Generation',
      'Advanced Image Editing',
      'White-Label Branding',
      'Custom Domain',
      'API Access',
      'Priority Support',
    ],
    plans: PRICING_PLANS.map(plan => ({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      values: [
        plan.limits.properties === 999999 ? 'Unlimited' : plan.limits.properties.toString(),
        plan.limits.monthlyContent === 999999 ? 'Unlimited' : plan.limits.monthlyContent.toString(),
        plan.limits.socialAccounts === 999999 ? 'Unlimited' : plan.limits.socialAccounts.toString(),
        plan.limits.videoGeneration ? '✓' : '—',
        plan.limits.imageEditing ? '✓' : '—',
        plan.limits.whiteLabel ? '✓' : '—',
        plan.limits.customDomain ? '✓' : '—',
        plan.limits.apiAccess ? '✓' : '—',
        plan.limits.prioritySupport ? '✓' : '—',
      ],
    })),
  };
}

/**
 * Check if user has reached limit
 */
export function hasReachedLimit(
  currentCount: number,
  limit: number
): boolean {
  if (limit === 999999) return false; // Unlimited
  return currentCount >= limit;
}

/**
 * Calculate trial end date (14 days from now)
 */
export function getTrialEndDate(): Date {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return date;
}

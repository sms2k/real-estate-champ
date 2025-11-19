import { requireAuth } from "@/lib/auth/utils";
import { prisma } from "@/lib/db";
import { PRICING_PLANS } from "@/lib/pricing";
import Link from "next/link";

async function getBillingData(userId: string) {
  const [user, subscription, invoices] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionPlan: true,
        subscriptionStatus: true,
        subscriptionEndDate: true,
        stripeCustomerId: true,
      },
    }),
    prisma.subscription.findUnique({
      where: { userId },
    }),
    prisma.invoice.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  return { user, subscription, invoices };
}

export default async function BillingPage() {
  const authUser = await requireAuth();
  const { user, subscription, invoices } = await getBillingData(
    authUser.id as string
  );

  const currentPlan = PRICING_PLANS.find((p) => p.id === user?.subscriptionPlan);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-600 mt-1">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Current Plan */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Current Plan
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-gray-900">
              {currentPlan?.name}
            </div>
            <div className="text-gray-600 mt-1">
              {currentPlan?.price === 0 ? (
                "Free forever"
              ) : (
                <>
                  ${currentPlan?.price}/month
                  {user?.subscriptionStatus === "TRIALING" && (
                    <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      14-day trial
                    </span>
                  )}
                </>
              )}
            </div>
            {subscription?.stripeCurrentPeriodEnd && (
              <div className="text-sm text-gray-500 mt-2">
                {subscription.cancelAtPeriodEnd
                  ? "Cancels on"
                  : "Renews on"}{" "}
                {new Date(subscription.stripeCurrentPeriodEnd).toLocaleDateString()}
              </div>
            )}
          </div>
          {user?.stripeCustomerId && (
            <form action="/api/billing/portal" method="POST">
              <button
                type="submit"
                className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Manage Subscription
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Available Plans */}
      {user?.subscriptionPlan === "FREE" && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Upgrade Your Plan
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {PRICING_PLANS.filter((p) => p.id !== "FREE").map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-xl p-6 shadow-sm border ${
                  plan.popular
                    ? "border-blue-600 ring-2 ring-blue-600"
                    : "border-gray-200"
                }`}
              >
                {plan.popular && (
                  <div className="text-xs font-semibold text-blue-600 mb-2">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="text-3xl font-bold text-gray-900 mb-4">
                  ${plan.price}
                  <span className="text-lg text-gray-500 font-normal">
                    /month
                  </span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.slice(0, 5).map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/auth/signup?plan=${plan.id}`}
                  className={`block text-center py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  Start Free Trial
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invoices */}
      {invoices.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Invoices
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Invoice
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoices.map((invoice: any) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${(invoice.amount / 100).toFixed(2)} {invoice.currency.toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          invoice.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {invoice.hostedInvoiceUrl && (
                        <a
                          href={invoice.hostedInvoiceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          View
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

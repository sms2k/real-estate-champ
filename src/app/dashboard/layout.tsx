import { requireAuth } from "@/lib/auth/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ErrorBoundary } from "@/components/ErrorBoundary";

async function DashboardNav() {
  const user = await requireAuth();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-xl font-bold text-blue-600">
              Real Estate Champ
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Properties
              </Link>
              <Link
                href="/dashboard/content"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Content
              </Link>
              <Link
                href="/dashboard/social"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Social Accounts
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard/billing"
              className="text-sm text-gray-700 hover:text-blue-600"
            >
              Billing
            </Link>
            <div className="text-sm text-gray-600">
              {user.name || user.email}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <ErrorBoundary>
        <main className="container mx-auto px-4 py-8">{children}</main>
      </ErrorBoundary>
    </div>
  );
}

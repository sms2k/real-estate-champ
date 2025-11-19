import { requireAuth } from "@/lib/auth/utils";
import { prisma } from "@/lib/db";
import Link from "next/link";

async function getPropertiesData(userId: string) {
  const properties = await prisma.property.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      images: {
        take: 1,
      },
    },
  });

  return { properties };
}

export default async function DashboardPage() {
  const authUser = await requireAuth();
  const { properties } = await getPropertiesData(authUser.id as string);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600 mt-1">
            Manage your property listings and generate unlimited content with AI
          </p>
        </div>
        <Link
          href="/dashboard/properties/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          + Add Property
        </Link>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-1">
            Total Properties
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {properties.length}
          </div>
          <p className="text-sm text-green-600 mt-1">Unlimited</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-1">
            AI Content Generation
          </div>
          <div className="text-3xl font-bold text-gray-900">∞</div>
          <p className="text-sm text-green-600 mt-1">Unlimited & Free</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-1">
            Platform
          </div>
          <div className="text-3xl font-bold text-gray-900">FREE</div>
          <p className="text-sm text-green-600 mt-1">Always free, no limits!</p>
        </div>
      </div>

      {/* Properties List */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Properties
        </h2>

        {properties.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No properties yet
            </h3>
            <p className="text-gray-600 mb-6">
              Add your first property to start generating amazing content
            </p>
            <Link
              href="/dashboard/properties/new"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Add Your First Property
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property: any) => (
              <Link
                key={property.id}
                href={`/dashboard/properties/${property.id}`}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                {property.images[0] ? (
                  <img
                    src={property.images[0].filePath}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-6xl">🏠</span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {property.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {property.city && property.state
                      ? `${property.city}, ${property.state}`
                      : property.address || "No address"}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {property.bedrooms && (
                      <span>{property.bedrooms} bed</span>
                    )}
                    {property.bathrooms && (
                      <span>{property.bathrooms} bath</span>
                    )}
                    {property.price && (
                      <span className="font-semibold text-blue-600">
                        ${property.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

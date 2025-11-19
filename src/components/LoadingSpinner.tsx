export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      className={`${sizeClasses[size]} border-blue-600 border-t-transparent rounded-full animate-spin`}
    />
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export function LoadingButton({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <LoadingSpinner size="sm" />
      <span>{children}</span>
    </div>
  );
}

/**
 * Skeleton loader for content
 */
export function Skeleton({
  className = "",
  variant = "text",
}: {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
}) {
  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  return (
    <div
      className={`bg-gray-200 animate-pulse ${variantClasses[variant]} ${className}`}
    />
  );
}

/**
 * Property card skeleton
 */
export function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <Skeleton variant="rectangular" className="w-full h-48 mb-4" />
      <Skeleton className="w-3/4 h-6 mb-2" />
      <Skeleton className="w-1/2 h-4 mb-4" />
      <div className="flex gap-4">
        <Skeleton className="w-16 h-4" />
        <Skeleton className="w-16 h-4" />
        <Skeleton className="w-16 h-4" />
      </div>
    </div>
  );
}

/**
 * List skeleton
 */
export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
          <Skeleton className="w-3/4 h-5 mb-2" />
          <Skeleton className="w-1/2 h-4" />
        </div>
      ))}
    </div>
  );
}

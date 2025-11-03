// Reusable loading and empty state components

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-3",
    lg: "h-16 w-16 border-4",
  };

  return (
    <div className="flex items-center justify-center py-8">
      <div
        className={`animate-spin rounded-full border-blue-600 border-t-transparent ${sizeClasses[size]}`}
      ></div>
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/6"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  );
}

export function LoadingFeed({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  );
}

export function EmptyState({
  icon = "📭",
  title = "No items found",
  description = "There's nothing here yet",
  action,
}: {
  icon?: string;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}) {
  return (
    <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
      <div className="text-6xl mb-4">{icon}</div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this content",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="text-center py-16 bg-white rounded-lg border border-red-200">
      <div className="text-6xl mb-4">⚠️</div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export function SuccessMessage({ message = "Success!" }: { message?: string }) {
  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
      <span className="text-2xl">✓</span>
      <p className="text-green-800 font-medium">{message}</p>
    </div>
  );
}

export function WarningMessage({ message = "Warning!" }: { message?: string }) {
  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
      <span className="text-2xl">⚠️</span>
      <p className="text-yellow-800 font-medium">{message}</p>
    </div>
  );
}

export function InfoMessage({ message = "Info" }: { message?: string }) {
  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
      <span className="text-2xl">ℹ️</span>
      <p className="text-blue-800 font-medium">{message}</p>
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
      <div className="flex items-start gap-6">
        <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="flex gap-4">
            <div className="h-8 bg-gray-200 rounded w-20"></div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
      <div className="h-10 w-10 bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-20"></div>
    </div>
  );
}


export const SkeletonBlock = ({ className = "" }) => (
  <div className={`skeleton rounded-xl ${className}`} />
);

export const SkeletonStatCard = () => (
  <div className="bg-white dark:bg-transparent rounded-2xl border border-gray-100 shadow-card p-5">
    <SkeletonBlock className="h-3 w-20 mb-3" />
    <SkeletonBlock className="h-8 w-16" />
  </div>
);

export const SkeletonChart = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5">
    <SkeletonBlock className="h-4 w-28 mb-4" />
    <SkeletonBlock className="h-48 w-full" />
  </div>
);

export const SkeletonCard = ({ lines = 3 }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 space-y-2">
    <SkeletonBlock className="h-4 w-1/3" />
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBlock key={i} className="h-3 w-full" />
    ))}
  </div>
);

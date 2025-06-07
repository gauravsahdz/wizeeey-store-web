export function SearchResultsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-10 w-full bg-muted animate-pulse rounded-lg" />
      <div className="grid md:grid-cols-4 gap-8">
        <div className="md:col-span-1 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg bg-muted animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchResultsSkeleton() {
  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for t-shirts, jeans, dresses..."
            className="w-full pl-10 text-base"
            disabled
          />
        </div>
      </header>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Filter sidebar skeleton */}
        <div className="space-y-4">
          <div className="h-8 w-24 bg-muted rounded animate-pulse" />
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 w-full bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>

        {/* Product grid skeleton */}
        <main className="md:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-square w-full bg-muted rounded-lg animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-10 w-full bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
} 
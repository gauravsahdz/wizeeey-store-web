"use client";

import { Suspense } from "react";
import { SearchResults } from "@/components/search/search-results";
import { SearchResultsSkeleton } from "@/components/search/search-results-skeleton";

export function SearchPageContent() {
  return (
    <div className="container py-8">
      <Suspense fallback={<SearchResultsSkeleton />}>
        <SearchResults />
      </Suspense>
    </div>
  );
} 
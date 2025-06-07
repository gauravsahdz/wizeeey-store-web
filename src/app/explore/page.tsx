"use client";

import { useState } from "react";
import { ProductGrid } from "@/components/products/product-grid";
import { FilterSidebar } from "@/components/explore/filter-sidebar";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function ExplorePage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    size: "",
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Explore Products</h1>
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="md:hidden">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              onClose={() => setIsFilterOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex gap-8">
        {/* Desktop filters */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
          />
        </div>

        {/* Product grid */}
        <div className="flex-1">
          <ProductGrid filters={filters} />
        </div>
      </div>
    </div>
  );
} 
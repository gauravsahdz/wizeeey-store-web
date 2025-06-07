
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/product/product-card';
import { mockProducts, mockCategories } from '@/lib/mock-data';
import type { Product, Category } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { SearchIcon } from 'lucide-react';

const MAX_PRICE = Math.max(...mockProducts.map(p => p.price), 100); // Determine max price from products or default

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  const [sortBy, setSortBy] = useState('relevance');

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);


  const filteredProducts = useMemo(() => {
    let products = [...mockProducts];

    // Filter by search term
    if (searchTerm) {
      products = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      const categoryObj = mockCategories.find(c => c.id === selectedCategory);
      if (categoryObj) {
        products = products.filter(product => product.category === categoryObj.name);
      }
    }
    
    // Filter by price range
    products = products.filter(product => product.price >= priceRange[0] && product.price <= priceRange[1]);

    // Sort products
    if (sortBy === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      products.sort((a,b) => a.name.localeCompare(b.name));
    }
    // 'relevance' is default (no specific sort or could be based on a backend score)

    return products;
  }, [searchTerm, selectedCategory, priceRange, sortBy]);

  if (!mounted) {
     // To avoid hydration mismatch with slider initial value
    return <div className="container mx-auto py-8 space-y-8"> <h1 className="text-3xl font-bold tracking-tight">Loading Search...</h1></div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <header className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Search Products</h1>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for t-shirts, jeans, dresses..."
            className="w-full pl-10 text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="md:col-span-1 space-y-6 p-4 border rounded-lg shadow-sm h-fit sticky top-24">
          <h2 className="text-xl font-semibold">Filters</h2>
          
          {/* Category Filter */}
          <div>
            <Label htmlFor="category-filter" className="text-sm font-medium">Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger id="category-filter">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {mockCategories.map((category: Category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range Filter */}
          <div>
            <Label className="text-sm font-medium">Price Range</Label>
            <div className="mt-2">
              <Slider
                min={0}
                max={MAX_PRICE}
                step={1}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                className="my-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>
          
           {/* Sort By Filter */}
          <div>
            <Label htmlFor="sort-by-filter" className="text-sm font-medium">Sort By</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sort-by-filter">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </aside>

        {/* Product Grid */}
        <main className="md:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <SearchIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold">No products found</h2>
              <p className="text-muted-foreground">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

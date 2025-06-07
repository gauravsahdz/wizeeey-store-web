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
import { Suspense } from "react";
import { SearchResults } from "@/components/search/search-results";
import { SearchResultsSkeleton } from "@/components/search/search-results-skeleton";

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Search Results</h1>
      <Suspense fallback={<SearchResultsSkeleton />}>
        <SearchResults />
      </Suspense>
    </div>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { getProducts, getCategories } from '@/services/api';
import type { Product, Category } from '@/types';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import { ChevronRight, AlertTriangle } from 'lucide-react';
import { PLACEHOLDER_IMAGE_DATA_URI } from '@/lib/constants';
import { ProductGrid } from "@/components/products/product-grid";
import { CategoryList } from "@/components/categories/category-list";
import { Hero } from "@/components/home/hero";

// Helper to adapt API product to frontend Product type
function adaptApiProductToFrontend(apiProduct: any): Product {
  return {
    id: apiProduct.id || apiProduct._id,
    name: apiProduct.name,
    description: apiProduct.description,
    price: apiProduct.price,
    imageUrl: apiProduct.imageUrl || PLACEHOLDER_IMAGE_DATA_URI,
    categoryName: apiProduct.categoryName,
    categoryId: typeof apiProduct.categoryId === 'string' ? apiProduct.categoryId : (apiProduct.categoryId as any)?.id || '',
    availableSizes: apiProduct.availableSizes || [],
    stock: apiProduct.stock,
    sku: apiProduct.sku,
  };
}

function adaptApiCategoryToFrontend(apiCategory: any): Category {
  return {
    id: apiCategory.id || apiCategory._id,
    name: apiCategory.name,
    slug: apiCategory.slug,
    description: apiCategory.description,
    imageUrl: apiCategory.imageUrl || `https://placehold.co/800x400.png`,
    dataAiHint: 'fashion style', // API doesn't provide this, so using a default
  };
}

export default function HomePage() {
  return (
    <div className="space-y-12">
      <Hero />
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Featured Categories</h2>
        <CategoryList />
      </section>
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        <ProductGrid />
      </section>
    </div>
  );
}

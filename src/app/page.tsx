
import Image from 'next/image';
import Link from 'next/link';
import { getProducts, getCategories } from '@/services/api';
import type { Product, Category } from '@/types';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import { ChevronRight, AlertTriangle } from 'lucide-react';
import { PLACEHOLDER_IMAGE_DATA_URI } from '@/lib/constants';

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


export default async function HomePage() {
  let products: Product[] = [];
  let categories: Category[] = [];
  let heroProduct: Product | null = null;
  let apiError: string | null = null;

  try {
    const [apiProductsResponse, apiCategoriesResponse] = await Promise.all([
      getProducts(),
      getCategories(),
    ]);

    // Ensure apiProductsResponse and apiCategoriesResponse are arrays before mapping
    products = Array.isArray(apiProductsResponse) ? apiProductsResponse.map(adaptApiProductToFrontend) : [];
    categories = Array.isArray(apiCategoriesResponse) ? apiCategoriesResponse.map(adaptApiCategoryToFrontend) : [];
    
    if (products.length > 0) {
      heroProduct = products[0];
    }
  } catch (error: any) {
    console.error("Failed to fetch homepage data:", error);
    apiError = "We're having trouble loading our products and categories right now. This might be due to a temporary issue with our servers or access permissions. Please try again later.";
    if (error.message && error.message.includes("401")) {
      apiError = "Failed to load products and categories due to an authorization (401) issue. This often means the backend API (potentially via Google Cloud Workstations or Render.com) requires authentication and is not configured for public/anonymous access from the application server. Even if accessible in your browser (which uses your personal login), the application server needs separate permissions. Please check API and Cloud Workstation/Render.com access controls to allow unauthenticated requests for public data.";
    }
    // Set products and categories to empty arrays so the page can still render parts of its structure
    products = [];
    categories = [];
  }

  const getProductsByApiCategoryId = (categoryId: string) => {
    return products.filter(p => p.categoryId === categoryId);
  }

  const newArrivalsCategory = categories.find(c => c.name.toLowerCase().includes('new') || c.slug.toLowerCase().includes('new')) || (categories.length > 0 ? categories[0] : null);
  const secondFeaturedCategory = categories.length > 1 ? categories[1] : (categories.length > 0 && newArrivalsCategory !== categories[0] ? categories[0] : null);


  if (apiError) {
    return (
      <div className="container mx-auto py-12 text-center">
        <AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2 text-destructive">Content Load Error</h2>
        <p className="text-muted-foreground mb-6">{apiError}</p>
        <Button asChild>
          <Link href="/">Try Again</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      {heroProduct && (
        <section className="rounded-lg overflow-hidden shadow-lg bg-card">
          <div className="container mx-auto px-0">
            <div className="grid md:grid-cols-2 items-center">
              <div className="p-8 md:p-12 lg:p-16">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                  {heroProduct.name}
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                  {heroProduct.description.substring(0,150)}...
                </p>
                <div className="mt-8 flex gap-4">
                  <Button size="lg" asChild>
                    <Link href={`/products/${heroProduct.id}`}>Shop Now</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/#categories">Explore Collections</Link>
                  </Button>
                </div>
              </div>
              {heroProduct.imageUrl && (
                 <div className="aspect-[3/4] md:aspect-auto md:h-full relative">
                   <Image
                     src={heroProduct.imageUrl}
                     alt={heroProduct.name}
                     fill
                     className="object-cover"
                     priority
                     data-ai-hint={'fashion model'}
                   />
                 </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      {categories.length > 0 && (
        <section id="categories" className="space-y-8">
          <h2 className="text-3xl font-bold tracking-tight text-center">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(0,3).map((category) => ( 
              <Link key={category.id} href={`/search?category=${category.id}`} className="group block">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-shadow">
                  {category.imageUrl && 
                    <Image 
                      src={category.imageUrl} 
                      alt={category.name} 
                      fill 
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={category.dataAiHint || 'fashion style'}
                    />
                  }
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h3 className="text-2xl font-semibold text-white">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products Section (e.g., New Arrivals) */}
      {newArrivalsCategory && products.length > 0 && (
        <section className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold tracking-tight">{newArrivalsCategory.name}</h2>
            <Button variant="outline" asChild>
              <Link href={`/search?category=${newArrivalsCategory.id}`}>View All <ChevronRight className="ml-1 h-4 w-4"/></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {getProductsByApiCategoryId(newArrivalsCategory.id).slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {getProductsByApiCategoryId(newArrivalsCategory.id).length === 0 && products.length > 0 && (
                products.slice(0,4).map((product) => ( // Fallback to first 4 products if category has no specific products
                     <ProductCard key={product.id} product={product} />
                ))
            )}
          </div>
        </section>
      )}
      
      {/* Another category section for variety */}
      {secondFeaturedCategory && products.length > 0 && secondFeaturedCategory.id !== newArrivalsCategory?.id && (
        <section className="space-y-8">
           <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold tracking-tight">{secondFeaturedCategory.name}</h2>
            <Button variant="outline" asChild>
              <Link href={`/search?category=${secondFeaturedCategory.id}`}>View All <ChevronRight className="ml-1 h-4 w-4"/></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {getProductsByApiCategoryId(secondFeaturedCategory.id).slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
             {getProductsByApiCategoryId(secondFeaturedCategory.id).length === 0 && products.length > 1 && (
                products.slice(4,8).map((product) => ( // Fallback to next 4 products
                     <ProductCard key={product.id} product={product} />
                ))
            )}
          </div>
        </section>
      )}
      
      {products.length === 0 && categories.length === 0 && !apiError && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold">Our store is currently empty.</h2>
          <p className="text-muted-foreground">Please check back later for new products and collections!</p>
        </div>
      )}
    </div>
  );
}

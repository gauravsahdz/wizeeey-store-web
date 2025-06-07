"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/products/product-card";
import { FilterSidebar } from "@/components/explore/filter-sidebar";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Product } from "@/types";
import { getProducts } from "@/services/api";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/components/ui/use-toast";

export function SearchResults() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const { addItem } = useCart();
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    size: searchParams.get("size") || "",
  });

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const apiProducts = await getProducts();
      // Adapt API products to frontend Product type
      const adaptedProducts: Product[] = apiProducts.map(apiProduct => ({
        id: apiProduct._id,
        name: apiProduct.name,
        description: apiProduct.description,
        price: apiProduct.price,
        imageUrl: apiProduct.imageUrl,
        categoryId: apiProduct.categoryId,
        availableSizes: apiProduct.availableSizes,
        stock: apiProduct.stock,
        sku: apiProduct.sku,
      }));

      // Filter products based on search term and filters
      const filteredProducts = adaptedProducts.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !filters.category || product.categoryId === filters.category;
        const matchesPrice = (!filters.minPrice || product.price >= Number(filters.minPrice)) &&
          (!filters.maxPrice || product.price <= Number(filters.maxPrice));
        const matchesSize = !filters.size || product.availableSizes.includes(filters.size);
        return matchesSearch && matchesCategory && matchesPrice && matchesSize;
      });
      setProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem(product, 1, product.availableSizes[0]); // Add first available size by default
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  return (
    <div className="space-y-8">
      <header className="space-y-4">
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
        <FilterSidebar
          filters={filters}
          onFilterChange={setFilters}
          onClose={() => {}}
        />

        <main className="md:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => handleAddToCart(product)}
                />
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
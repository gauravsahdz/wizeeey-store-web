"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import type { Category } from "@/lib/types";
import { getCategories } from "@/services/api";

export function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data.data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="aspect-[4/3] rounded-lg bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categories.map((category) => (
        <Link
          key={category._id}
          href={`/explore?category=${category.slug}`}
          className="group relative aspect-[4/3] overflow-hidden rounded-lg"
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${category.imageUrl}`}
            alt={category.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h3 className="text-xl font-semibold text-white">
              {category.name}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
}

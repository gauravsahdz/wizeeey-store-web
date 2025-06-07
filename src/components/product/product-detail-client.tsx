
"use client";

import type { Product } from '@/types';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { AiStyleTool } from './ai-style-tool';
import { CheckCircle, ShoppingCart } from 'lucide-react';
import { PLACEHOLDER_IMAGE_DATA_URI } from '@/lib/constants';

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedSize, setSelectedSize] = useState<string>(product.availableSizes[0] || '');
  // Color selection removed as product.colors is no longer available
  const [quantity, setQuantity] = useState<number>(1);
  // Assuming single image from product.imageUrl. If multiple images were needed, API and Product type would need an array.
  // For now, currentImageIndex logic might not be necessary or could be adapted if imageUrl could be an array later.
  // const [currentImageIndex, setCurrentImageIndex] = useState(0); 

  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    if (product.availableSizes.length > 0 && !product.availableSizes.includes(selectedSize)) {
      setSelectedSize(product.availableSizes[0]);
    }
  }, [product, selectedSize]);


  const handleAddToCart = () => {
    if (!selectedSize && product.availableSizes.length > 0) {
      toast({ title: "Please select a size", variant: "destructive" });
      return;
    }
    // Pass undefined or a default for color if addItem expects it
    addItem(product, quantity, selectedSize);
    toast({
      title: "Added to cart!",
      description: `${product.name} (${selectedSize}) has been added to your cart.`,
      action: <CheckCircle className="text-green-500" />,
    });
  };
  
  // Thumbnail logic might need to be removed or simplified if only one product.imageUrl
  // const handleThumbnailClick = (index: number) => {
  //   setCurrentImageIndex(index);
  // };

  const displayImageUrl = product.imageUrl || PLACEHOLDER_IMAGE_DATA_URI;

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      {/* Image Gallery - Simplified for single image */}
      <div className="space-y-4">
        <div className="aspect-[3/4] relative w-full overflow-hidden rounded-lg shadow-lg bg-muted">
          <Image
            src={displayImageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            data-ai-hint="product image" // Generic hint as specific one is lost
          />
        </div>
        {/* Thumbnail display removed as we assume single imageUrl for now */}
      </div>

      {/* Product Info & Actions */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">{product.name}</h1>
          <p className="text-2xl font-semibold text-primary mt-2">${product.price.toFixed(2)}</p>
          <p className="text-muted-foreground mt-4 text-base">{product.description}</p>
        </div>

        <Separator />

        {/* Size Selection */}
        {product.availableSizes && product.availableSizes.length > 0 && (
          <div className="space-y-2">
            <Label className="text-base font-medium">Size: {selectedSize}</Label>
            <RadioGroup
              value={selectedSize}
              onValueChange={setSelectedSize}
              className="flex flex-wrap gap-2"
            >
              {product.availableSizes.map((size) => (
                <Label
                  key={size}
                  htmlFor={`size-${size}`}
                  className={`cursor-pointer rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground
                              ${selectedSize === size ? 'bg-primary text-primary-foreground border-primary ring-2 ring-primary' : 'bg-background'}`}
                >
                  <RadioGroupItem value={size} id={`size-${size}`} className="sr-only" />
                  {size}
                </Label>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Color Selection Removed */}
        
        {/* Quantity Selection */}
        <div className="space-y-2">
          <Label htmlFor="quantity" className="text-base font-medium">Quantity</Label>
          <Select value={String(quantity)} onValueChange={(val) => setQuantity(Number(val))}>
            <SelectTrigger id="quantity" className="w-[80px]">
              <SelectValue placeholder="Qty" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(Math.min(product.stock, 10)).keys()].map((i) => (
                <SelectItem key={i + 1} value={String(i + 1)}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button size="lg" onClick={handleAddToCart} className="w-full md:w-auto" disabled={product.stock === 0}>
          <ShoppingCart className="mr-2 h-5 w-5" /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
        
        <AiStyleTool product={product} />
      </div>
    </div>
  );
}

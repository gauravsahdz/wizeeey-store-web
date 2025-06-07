
"use client";

import type { CartItem } from '@/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/cart-context';
import { X, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import { PLACEHOLDER_IMAGE_DATA_URI } from '@/lib/constants';

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    // updateQuantity now only takes productId and selectedSize for identification
    updateQuantity(item.product.id, item.selectedSize, newQuantity);
  };

  const displayImageUrl = item.product.imageUrl || PLACEHOLDER_IMAGE_DATA_URI;

  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg shadow-sm">
      <Link href={`/products/${item.product.id}`}>
        <div className="w-24 h-32 relative rounded overflow-hidden bg-muted shrink-0">
          <Image
            src={displayImageUrl}
            alt={item.product.name}
            fill
            className="object-cover"
            sizes="100px"
            data-ai-hint="cart item" // Generic hint
          />
        </div>
      </Link>
      <div className="flex-grow">
        <Link href={`/products/${item.product.id}`}>
           <h3 className="font-semibold text-md hover:text-primary transition-colors">{item.product.name}</h3>
        </Link>
        <p className="text-sm text-muted-foreground">
          Size: {item.selectedSize}
        </p>
        {/* Color display removed */}
        <p className="text-md font-semibold text-primary mt-1">
          ${item.product.price.toFixed(2)}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            className="h-8 w-12 text-center px-0"
            value={item.quantity}
            onChange={(e) => {
              const newQuantity = parseInt(e.target.value);
              if (!isNaN(newQuantity)) {
                handleQuantityChange(newQuantity);
              }
            }}
            min="1"
            max={item.product.stock}
          />
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={item.quantity >= item.product.stock}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between h-full">
        <p className="font-semibold text-lg">${(item.product.price * item.quantity).toFixed(2)}</p>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive"
          // removeItem now only takes productId and selectedSize
          onClick={() => removeItem(item.product.id, item.selectedSize)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

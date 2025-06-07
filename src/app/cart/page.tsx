"use client";

import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useModals } from '@/context/modal-context';
import { useAuth } from '@/context/auth-context';
import { createOrder } from '@/services/api';
import type { ApiOrderPayload, ApiOrderItem } from '@/types/api';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const { openAuthModal } = useModals();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  const handleProceedToCheckout = async () => {
    if (!isAuthenticated || !user) {
      openAuthModal();
      toast({
        title: "Authentication Required",
        description: "Please log in or create an account to proceed with your order.",
        variant: "default",
      });
      return;
    }

    setIsProcessingOrder(true);

    const orderItems: ApiOrderItem[] = items.map(cartItem => ({
      productId: cartItem.product.id,
      productName: cartItem.product.name,
      quantity: cartItem.quantity,
      price: cartItem.product.price,
      selectedSize: cartItem.selectedSize,
    }));

    // Default customer info - in a real app, this would come from user profile or a form
    const customerInfo = {
      name: user.name || "Guest User",
      email: user.email || "guest@example.com",
      shippingAddress: "123 Main St, Anytown, USA", // Placeholder
    };
    
    const orderPayload: ApiOrderPayload = {
      customerInfo,
      items: orderItems,
      totalAmount: totalPrice,
      customerId: user.id, // Using the mock user ID from AuthContext
      notes: "Online web order",
    };

    try {
      const createdOrder = await createOrder(orderPayload);
      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${createdOrder.id.slice(-6)} has been placed. Sit tight!`, // Show partial ID
        variant: "default",
        duration: 5000,
      });
      clearCart();
      router.push('/account/orders'); // Redirect to my orders page
    } catch (error: any) {
      console.error("Failed to create order:", error);
      toast({
        title: "Order Failed",
        description: error.message || "There was an issue placing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">
          Looks like you haven't added any items to your cart yet.
        </p>
        <Link href="/explore">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex gap-4 p-4 border rounded-lg"
            >
              <div className="relative w-24 h-24">
                <Image
                  src={item.product.images[0] || "/images/placeholder.png"}
                  alt={item.product.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{item.product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.product.category}
                </p>
                <p className="font-medium mt-1">${item.product.price}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.product.id, parseInt(e.target.value))
                      }
                      className="w-16 text-center"
                      min="1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item.product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Button
              className="w-full"
              onClick={handleProceedToCheckout}
              disabled={isProcessingOrder}
            >
              {isProcessingOrder ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Proceed to Checkout"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

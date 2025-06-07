
"use client";

import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { CartItemCard } from '@/components/cart/cart-item-card';
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

  return (
    <div className="container mx-auto py-8 animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Your Shopping Cart</h1>
        {items.length > 0 && (
          <Button variant="outline" onClick={clearCart} className="text-destructive hover:bg-destructive/10">
            Clear Cart
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
           <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Button asChild className="transition-transform hover:scale-105">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItemCard key={`${item.product.id}-${item.selectedSize}`} item={item} />
            ))}
          </div>

          <Card className="md:col-span-1 sticky top-24 shadow-lg transition-all duration-300 ease-out hover:shadow-xl">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({totalItems} items)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>Free</span> {/* Assuming free shipping for now */}
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                size="lg" 
                className="w-full transition-transform hover:scale-105" 
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
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}

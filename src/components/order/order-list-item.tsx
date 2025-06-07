
"use client";

import type { Order, ApiOrderItem } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { PLACEHOLDER_IMAGE_DATA_URI } from '@/lib/constants';
import { Package, CalendarDays, Hash, DollarSign, ListOrdered } from 'lucide-react';

interface OrderListItemProps {
  order: Order;
}

// Helper to get a placeholder image URL based on product name (very basic)
const getProductImagePlaceholder = (productName: string) => {
  // In a real app, you might have actual image URLs for ordered products
  // or a more sophisticated placeholder generation.
  // For now, always return a generic placeholder.
  return PLACEHOLDER_IMAGE_DATA_URI;
};

export function OrderListItem({ order }: OrderListItemProps) {
  const orderDate = order.orderDate ? format(new Date(order.orderDate), "MMMM d, yyyy 'at' h:mm a") : 'N/A';
  const shortOrderId = order.id.slice(-8).toUpperCase(); // Display a shorter, more readable part of the ID

  const getStatusVariant = (status: Order['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Delivered': return 'default'; // Greenish in some themes
      case 'Shipped': return 'default'; 
      case 'Processing': return 'secondary';
      case 'Pending': return 'outline';
      case 'Cancelled': return 'destructive';
      case 'Refunded': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <CardTitle className="text-xl flex items-center gap-2">
             <Package className="h-6 w-6 text-primary" />
             Order <Hash className="inline h-5 w-5 text-muted-foreground" />{shortOrderId}
          </CardTitle>
          <Badge variant={getStatusVariant(order.status)} className="text-sm w-fit sm:w-auto">
            {order.status}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-2 pt-1">
          <CalendarDays className="h-4 w-4" /> Placed on: {orderDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-md mb-2 flex items-center gap-2">
            <ListOrdered className="h-5 w-5 text-muted-foreground" /> Items ({order.items.length})
          </h4>
          <Separator className="mb-3" />
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 simple-scrollbar">
            {order.items.map((item: ApiOrderItem, index: number) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                <Image
                  src={getProductImagePlaceholder(item.productName)} // Assuming no direct image URL for ordered items
                  alt={item.productName}
                  width={48}
                  height={64}
                  className="rounded object-cover border bg-slate-100"
                  data-ai-hint="product clothing"
                />
                <div className="flex-grow">
                  <Link href={`/products/${item.productId}`} className="font-medium text-sm hover:text-primary hover:underline">
                    {item.productName}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item.quantity} | Size: {item.selectedSize || 'N/A'}
                  </p>
                </div>
                <p className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
        
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 gap-2">
        <div className="text-sm text-muted-foreground">
          Shipping to: {order.customerInfo.shippingAddress}
        </div>
        <div className="font-bold text-lg flex items-center gap-1">
           <DollarSign className="h-5 w-5 text-primary" /> Total: ${order.totalAmount.toFixed(2)}
        </div>
      </CardFooter>
    </Card>
  );
}

// Minimal scrollbar styling (can be added to globals.css for wider use)
// Ensure globals.css has this if you want custom scrollbars for this component:
// .simple-scrollbar::-webkit-scrollbar { width: 6px; }
// .simple-scrollbar::-webkit-scrollbar-track { background: hsl(var(--muted)); border-radius: 3px;}
// .simple-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--border)); border-radius: 3px; }
// .simple-scrollbar::-webkit-scrollbar-thumb:hover { background: hsl(var(--primary) / 0.7); }

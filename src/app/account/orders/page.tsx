
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { getOrders } from '@/services/api';
import type { Order } from '@/types';
import { Button } from '@/components/ui/button';
import { OrderListItem } from '@/components/order/order-list-item';
import Link from 'next/link';
import { Loader2, ShoppingBag, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MyOrdersPage() {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/'); // Redirect to home if not authenticated
      return;
    }

    if (isAuthenticated && user) {
      const fetchOrders = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const allOrders = await getOrders();
          // Client-side filtering: This is a placeholder.
          // Ideally, backend provides an endpoint to fetch orders for the logged-in user.
          const userOrders = allOrders.filter(order => order.customerId === user.id);
          setOrders(userOrders);
        } catch (err: any) {
          console.error("Failed to fetch orders:", err);
          setError(err.message || "Could not load your orders. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrders();
    }
  }, [isAuthenticated, user, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto py-12 text-center animate-fadeIn">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Loading your orders...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
     // This case should ideally be handled by the redirect, but as a fallback:
    return (
      <div className="container mx-auto py-12 text-center animate-fadeIn">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-6">Please log in to view your orders.</p>
        <Button asChild>
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-12 text-center animate-fadeIn">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2 text-destructive">Error Loading Orders</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8 animate-fadeIn">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
      </header>

      {orders.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-muted-foreground/30 rounded-lg">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No Orders Yet</h2>
          <p className="text-muted-foreground mb-6">You haven't placed any orders. Let's change that!</p>
          <Button asChild className="transition-transform hover:scale-105">
            <Link href="/">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <OrderListItem key={order.id} order={order} />
          ))}
        </div>
      )}
      <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Please note: Order filtering is currently done client-side for demonstration.</p>
          <p>In a production app, orders would be fetched specifically for your user ID from the backend.</p>
      </div>
    </div>
  );
}

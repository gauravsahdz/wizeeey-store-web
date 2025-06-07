import type { Metadata } from 'next';
// import { GeistSans } from 'geist/font/sans'; // Removed problematic import
// import { GeistMono } from 'geist/font/mono'; // Removed problematic import
import './globals.css';
import { APP_NAME } from '@/lib/constants';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from '@/context/cart-context';
import { ModalProvider } from '@/context/modal-context';
import { AuthProvider } from '@/context/auth-context';
import { AuthModal } from '@/components/modals/auth-modal';
import { CheckoutModal } from '@/components/modals/checkout-modal';

// const geistSans = GeistSans; // Removed GeistSans variable
// const geistMono = GeistMono; // Removed GeistMono variable

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: `Discover the latest trends in fashion with ${APP_NAME}. Quality clothing for all styles.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"><body className="antialiased flex flex-col min-h-screen">
        <AuthProvider>
          <ModalProvider>
            <CartProvider>
              <Header />
              <main className="flex-grow container px-4 py-8 md:px-6 md:py-12">
                {children}
              </main>
              <Footer />
              <Toaster />
              <AuthModal />
              <CheckoutModal />
            </CartProvider>
          </ModalProvider>
        </AuthProvider>
      </body></html>
  );
}

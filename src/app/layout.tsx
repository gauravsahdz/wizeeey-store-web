import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
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

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en"><body className={inter.className}>
        <AuthProvider>
          <ModalProvider>
            <CartProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
              <Toaster />
              <AuthModal />
              <CheckoutModal />
            </CartProvider>
          </ModalProvider>
        </AuthProvider>
      </body></html>
  );
}

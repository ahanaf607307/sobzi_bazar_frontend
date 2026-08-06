import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/providers/Providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/store/CartDrawer';

export const metadata: Metadata = {
  title: 'Sobji Bazar | Fresh & Organic Vegetables Online',
  description:
    'Buy fresh vegetables, organic produce, and daily grocery items online with same-day delivery in Bangladesh.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans text-slate-800 bg-slate-50 flex flex-col min-h-screen">
        <AppProviders>
          <Navbar />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}

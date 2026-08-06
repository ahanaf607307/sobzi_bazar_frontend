'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/services/productApi';
import { ProductCard } from '@/components/store/ProductCard';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import {
  Leaf,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

export default function HomePage() {
  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['public-categories'],
    queryFn: () => productApi.getPublicCategories(),
  });

  const { data: productsData, isLoading: isProductsLoading } = useQuery({
    queryKey: ['public-products-featured'],
    queryFn: () => productApi.getPublicProducts({ limit: 8 }),
  });

  const categories = categoriesData?.data || [];
  const products = productsData?.data || [];

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-emerald-900 via-emerald-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-amber-400" />
                100% Farm Fresh Delivery
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Fresh & Organic <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-lime-300 to-amber-300">
                  Vegetables Directly
                </span> <br />
                To Your Door
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Experience pesticide-free, handpicked fresh vegetables, fruits, and organic produce harvested daily from local farms.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link href="/products">
                  <Button
                    variant="primary"
                    size="lg"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-xl shadow-emerald-500/30"
                  >
                    Explore Shop
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-400"
                  >
                    View Categories
                  </Button>
                </Link>
              </div>

              {/* Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-emerald-800/50 max-w-md mx-auto lg:mx-0">
                <div>
                  <p className="text-2xl font-black text-emerald-400">50+</p>
                  <p className="text-xs text-slate-400 font-medium">Organic Varieties</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-amber-400">100%</p>
                  <p className="text-xs text-slate-400 font-medium">Quality Guaranteed</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-emerald-400">30 Min</p>
                  <p className="text-xs text-slate-400 font-medium">Fast Dispatch</p>
                </div>
              </div>
            </div>

            {/* Hero Image Collage */}
            <div className="relative flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-500/20 glass-card">
                <img
                  src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"
                  alt="Fresh Vegetables Basket"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl glass-card text-slate-900 border border-white/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-emerald-700 uppercase">Today's Special Harvest</p>
                      <p className="text-sm font-black text-slate-800">Fresh Organic Basket</p>
                    </div>
                    <span className="bg-amber-400 text-slate-900 text-xs font-black px-3 py-1 rounded-full">
                      Up to 25% Off
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Slider/Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Shop By Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Browse our fresh collection by category
            </p>
          </div>
          <Link
            href="/categories"
            className="text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            See All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isCategoriesLoading ? (
          <Spinner />
        ) : categories.length === 0 ? (
          <p className="text-center text-slate-400 py-6 text-sm">No categories found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?categoryId=${cat.id}`}
                className="group p-5 rounded-2xl bg-white border border-slate-100/80 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1 transition-all text-center flex flex-col items-center justify-center gap-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 group-hover:bg-emerald-600 text-emerald-600 group-hover:text-white transition-colors flex items-center justify-center shadow-sm">
                  <Leaf className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    Fresh Stock
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Featured Fresh Produce
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Selected top quality vegetables and organic daily needs
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            View All Products <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isProductsLoading ? (
          <Spinner size="lg" />
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No Products Available</h3>
            <p className="text-xs text-slate-400 mt-1">Please check back later for fresh updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Banner / Trust Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left z-10">
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Quality Assured
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Healthy Eating Starts With Fresh Sobji
            </h2>
            <p className="text-emerald-100 text-sm leading-relaxed">
              Order before 2 PM for same-day delivery right to your kitchen counter. Crisp, clean, and 100% natural guaranteed.
            </p>
            <div className="pt-2">
              <Link href="/products">
                <Button variant="amber" size="lg">
                  Shop Fresh Items
                </Button>
              </Link>
            </div>
          </div>

          <div className="w-full md:w-auto flex justify-center z-10">
            <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full border-4 border-white/30 overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=600&q=80"
                alt="Organic Produce"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

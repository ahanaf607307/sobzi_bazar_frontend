'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/services/productApi';
import { Spinner } from '@/components/ui/Spinner';
import { Leaf, ArrowRight } from 'lucide-react';

export default function CategoriesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['public-categories'],
    queryFn: () => productApi.getPublicCategories(),
  });

  const categories = data?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Product Categories
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore all fresh vegetable and produce categories
        </p>
      </div>

      {isLoading ? (
        <Spinner size="lg" />
      ) : categories.length === 0 ? (
        <p className="text-center text-slate-400 py-12 text-sm">
          No categories found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?categoryId=${cat.id}`}
              className="group glass-card rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 border border-slate-100 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center justify-center shadow-md">
                  <Leaf className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {cat.description || 'Fresh daily harvest in this category.'}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
                <span>View Products</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

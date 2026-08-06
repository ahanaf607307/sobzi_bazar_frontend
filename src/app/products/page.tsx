'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/services/productApi';
import { ProductCard } from '@/components/store/ProductCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Search, Filter, RefreshCw, ShoppingBag } from 'lucide-react';

function ProductCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('categoryId') || '';
  const initialSearch = searchParams.get('searchTerm') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  useEffect(() => {
    setSelectedCategory(searchParams.get('categoryId') || '');
    setSearchTerm(searchParams.get('searchTerm') || '');
  }, [searchParams]);

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['public-categories'],
    queryFn: () => productApi.getPublicCategories(),
  });

  // Fetch products
  const { data: productsData, isLoading, refetch } = useQuery({
    queryKey: ['public-products', selectedCategory, searchTerm],
    queryFn: () =>
      productApi.getPublicProducts({
        categoryId: selectedCategory || undefined,
        searchTerm: searchTerm || undefined,
      }),
  });

  const categories = categoriesData?.data || [];
  const products = productsData?.data || [];

  const handleReset = () => {
    setSelectedCategory('');
    setSearchTerm('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Fresh Products Catalog
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Search and filter fresh vegetables and organic items
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        {/* Search Input */}
        <div className="md:col-span-6">
          <Input
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Category Selector */}
        <div className="md:col-span-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        <div className="md:col-span-2 flex items-end">
          <Button
            variant="ghost"
            onClick={handleReset}
            className="w-full text-slate-600 hover:text-slate-900 border border-slate-200"
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Active Filter Badges */}
      {(selectedCategory || searchTerm) && (
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span>Active Filters:</span>
          {selectedCategory && (
            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
              Category Selected
            </span>
          )}
          {searchTerm && (
            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
              "{searchTerm}"
            </span>
          )}
        </div>
      )}

      {/* Products Grid */}
      {isLoading ? (
        <Spinner size="lg" />
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 space-y-4">
          <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Products Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We couldn't find any products matching your selected search or category filter.
          </p>
          <Button variant="outline" onClick={handleReset}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<Spinner size="lg" />}>
      <ProductCatalogContent />
    </Suspense>
  );
}

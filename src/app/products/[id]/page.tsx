'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi, getImageUrl } from '@/services/api';
import { cartApi } from '@/services/cartApi';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import {
  ShoppingBag,
  ArrowLeft,
  Plus,
  Minus,
  CheckCircle,
  Truck,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { toggleCartDrawer } from '@/redux/slices/cartSlice';

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [quantity, setQuantity] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-product', id],
    queryFn: () => productApi.getPublicProductById(id),
  });

  const product = data?.data;

  const addToCartMutation = useMutation({
    mutationFn: () => cartApi.addToCart(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success(`${product?.name} added to cart!`);
      dispatch(toggleCartDrawer(true));
    },
    onError: (err: Error) => {
      if (!isAuthenticated) {
        toast.error('Please login to add items to cart');
      } else {
        toast.error(err.message);
      }
    },
  });

  if (isLoading) return <Spinner size="lg" className="py-20" />;

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-slate-500 text-sm">
          The requested product may have been removed or is unavailable.
        </p>
        <Link href="/products">
          <Button variant="primary">Back to Catalog</Button>
        </Link>
      </div>
    );
  }

  const discountedPrice =
    product.discount > 0
      ? product.price * (1 - product.discount / 100)
      : product.price;

  const mainImage = product.images?.[0]
    ? getImageUrl(product.images[0])
    : 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Products Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm">
        {/* Images */}
        <div className="space-y-4">
          <div className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 relative">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-full shadow-lg">
                -{product.discount}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {product.category && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  {product.category.name}
                </span>
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3">
              <Badge variant={product.stock > 0 ? 'success' : 'danger'}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
              </Badge>
              {product.isFeatured && (
                <Badge variant="warning">Featured Harvest</Badge>
              )}
            </div>

            {/* Pricing */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-baseline gap-3">
              <span className="text-3xl font-black text-emerald-700">
                ৳{discountedPrice.toFixed(2)}
              </span>
              <span className="text-sm font-semibold text-slate-500">
                per {product.unit || 'kg'}
              </span>
              {product.discount > 0 && (
                <span className="text-sm text-slate-400 line-through font-medium ml-2">
                  ৳{product.price.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {product.description ||
                'Freshly harvested organic vegetables supplied directly from Bangladesh local farms. Standard hygiene quality and freshness guaranteed.'}
            </p>
          </div>

          {/* Quantity Selector & Add button */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                <button
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(quantity - 1)}
                  className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-extrabold text-slate-900 text-sm">
                  {quantity}
                </span>
                <button
                  disabled={quantity >= product.stock}
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Total: ৳{(discountedPrice * quantity).toFixed(2)}
              </span>
            </div>

            <Button
              size="lg"
              variant="primary"
              disabled={product.stock <= 0}
              isLoading={addToCartMutation.isPending}
              onClick={() => addToCartMutation.mutate()}
              className="w-full shadow-lg shadow-emerald-600/30"
              leftIcon={<ShoppingBag className="w-5 h-5" />}
            >
              Add {quantity} {product.unit || 'kg'} to Basket
            </Button>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-2 gap-4 pt-4 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>100% Quality Checked</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Same-Day Dispatch</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { getImageUrl } from '@/services/api';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ShoppingBag, Star } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/services/cartApi';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { toggleCartDrawer } from '@/redux/slices/cartSlice';

export interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const mainImage = product.images?.[0]
    ? getImageUrl(product.images[0])
    : '/placeholder-vegetable.jpg';

  const discountedPrice =
    product.discount > 0
      ? product.price * (1 - product.discount / 100)
      : product.price;

  const addToCartMutation = useMutation({
    mutationFn: () => cartApi.addToCart(product.id, 1),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success(`${product.name} added to cart!`);
      dispatch(toggleCartDrawer(true));
    },
    onError: (error: Error) => {
      if (!isAuthenticated) {
        toast.error('Please login to add items to cart');
      } else {
        toast.error(error.message);
      }
    },
  });

  return (
    <div className="group relative bg-white/90 backdrop-blur-md rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 border border-slate-100/80 flex flex-col justify-between overflow-hidden">
      {/* Top Badges */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-1.5 items-start">
        {product.discount > 0 && (
          <span className="bg-rose-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md animate-pulse">
            -{product.discount}% OFF
          </span>
        )}
        {product.isFeatured && (
          <span className="bg-amber-400 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            ★ Featured
          </span>
        )}
      </div>

      <div className="absolute top-6 right-6 z-10">
        <Badge variant={product.stock > 0 ? 'success' : 'danger'}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </Badge>
      </div>

      {/* Image Link */}
      <Link href={`/products/${product.id}`} className="block relative w-full h-48 rounded-xl overflow-hidden mb-4 bg-slate-50">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80';
          }}
        />
      </Link>

      {/* Info Section */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {product.category && (
            <span className="text-xs font-semibold text-emerald-600 tracking-wider uppercase mb-1 block">
              {product.category.name}
            </span>
          )}
          <Link href={`/products/${product.id}`}>
            <h3 className="text-base font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 min-h-[32px]">
            {product.description || 'Fresh & organic direct from farm to your kitchen.'}
          </p>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-emerald-700">
                ৳{discountedPrice.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                / {product.unit || 'kg'}
              </span>
            </div>
            {product.discount > 0 && (
              <span className="text-xs text-slate-400 line-through font-medium">
                ৳{product.price.toFixed(2)}
              </span>
            )}
          </div>

          <Button
            size="sm"
            variant="primary"
            disabled={product.stock <= 0}
            isLoading={addToCartMutation.isPending}
            onClick={() => addToCartMutation.mutate()}
            leftIcon={<ShoppingBag className="w-4 h-4" />}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

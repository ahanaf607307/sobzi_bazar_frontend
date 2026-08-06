'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { toggleCartDrawer, setCartCount } from '@/redux/slices/cartSlice';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/services/cartApi';
import { getImageUrl } from '@/services/api';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export const CartDrawer: React.FC = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { isCartDrawerOpen } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  const { data: cartData, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.getCart,
    enabled: isAuthenticated && isCartDrawerOpen,
  });

  const cart = cartData?.data;
  const items = cart?.items || [];

  // Initialize and clean up selected item IDs
  useEffect(() => {
    if (items.length > 0) {
      setSelectedItemIds((prev) => {
        const validPrev = prev.filter((id) => items.some((item) => item.id === id));
        return validPrev.length > 0 ? validPrev : items.map((item) => item.id);
      });
    } else {
      setSelectedItemIds([]);
    }
  }, [items]);

  // Calculate cart total count
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Selected items calculation
  const selectedItems = items.filter((item) => selectedItemIds.includes(item.id));
  const selectedTotalPrice = selectedItems.reduce((acc, item) => {
    const price =
      item.product.discount > 0
        ? item.product.price * (1 - item.product.discount / 100)
        : item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const isAllSelected = items.length > 0 && selectedItemIds.length === items.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(items.map((i) => i.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    dispatch(setCartCount(totalCount));
  }, [totalCount, dispatch]);

  const updateQuantityMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartApi.updateCartItemQuantity(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const removeItemMutation = useMutation({
    mutationFn: (itemId: string) => cartApi.removeCartItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Item removed from cart');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const clearCartMutation = useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Cart cleared');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity cursor-pointer"
        onClick={() => dispatch(toggleCartDrawer(false))}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-100 animate-slideInRight">
          {/* Drawer Header */}
          <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-emerald-400" />
              <div>
                <h2 className="text-lg font-bold">Your Shopping Cart</h2>
                <p className="text-xs text-slate-400">{totalCount} items in basket</p>
              </div>
            </div>
            <button
              onClick={() => dispatch(toggleCartDrawer(false))}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {!isAuthenticated ? (
              <div className="text-center py-12 space-y-4">
                <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-700">Please Login</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  You need to be logged in to view and manage your shopping cart items.
                </p>
                <Link href="/login" onClick={() => dispatch(toggleCartDrawer(false))}>
                  <Button variant="primary" className="mt-2">
                    Login to Account
                  </Button>
                </Link>
              </div>
            ) : isLoading ? (
              <Spinner size="lg" />
            ) : items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Your Cart is Empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Looks like you haven't added any fresh vegetables or products yet!
                </p>
                <Button
                  variant="outline"
                  onClick={() => dispatch(toggleCartDrawer(false))}
                >
                  Start Shopping
                </Button>
              </div>
            ) : (
              <div>
                {/* Select All Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 bg-slate-50 p-2.5 rounded-xl">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                    />
                    Select All ({selectedItemIds.length}/{items.length})
                  </label>
                  {selectedItemIds.length < items.length && (
                    <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      {selectedItemIds.length} item(s) selected
                    </span>
                  )}
                </div>

                {/* Items List */}
                <div className="space-y-4 divide-y divide-slate-100">
                  {items.map((item) => {
                    const isSelected = selectedItemIds.includes(item.id);
                    const unitPrice =
                      item.product.discount > 0
                        ? item.product.price * (1 - item.product.discount / 100)
                        : item.product.price;
                    const itemTotal = unitPrice * item.quantity;

                    return (
                      <div
                        key={item.id}
                        className={`pt-4 first:pt-0 flex gap-3 items-center p-2 rounded-xl transition-colors ${
                          isSelected ? 'bg-emerald-50/40' : 'opacity-70 bg-slate-50/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectItem(item.id)}
                          className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer shrink-0"
                        />

                        <img
                          src={
                            item.product.images?.[0]
                              ? getImageUrl(item.product.images[0])
                              : '/placeholder-vegetable.jpg'
                          }
                          alt={item.product.name}
                          className="w-14 h-14 object-cover rounded-xl border border-slate-100 shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-800 truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium">
                            ৳{unitPrice.toFixed(2)} / {item.product.unit || 'kg'}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <button
                              disabled={item.quantity <= 1 || updateQuantityMutation.isPending}
                              onClick={() =>
                                updateQuantityMutation.mutate({
                                  itemId: item.id,
                                  quantity: item.quantity - 1,
                                })
                              }
                              className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-slate-800 w-5 text-center">
                              {item.quantity}
                            </span>
                            <button
                              disabled={
                                item.quantity >= item.product.stock ||
                                updateQuantityMutation.isPending
                              }
                              onClick={() =>
                                updateQuantityMutation.mutate({
                                  itemId: item.id,
                                  quantity: item.quantity + 1,
                                })
                              }
                              className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-sm font-black text-emerald-700 block">
                            ৳{itemTotal.toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeItemMutation.mutate(item.id)}
                            className="text-xs text-rose-500 hover:text-rose-700 font-medium flex items-center gap-1 ml-auto mt-2 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          {isAuthenticated && items.length > 0 && (
            <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Selected Subtotal ({selectedItemIds.length} items)</span>
                  <span className="font-semibold text-slate-800">৳{selectedTotalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-emerald-600">Free / Standard</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Payable</span>
                  <span className="text-emerald-700">৳{selectedTotalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => clearCartMutation.mutate()}
                  isLoading={clearCartMutation.isPending}
                  className="flex-1"
                >
                  Clear Cart
                </Button>
                <Link
                  href={`/checkout${selectedItemIds.length > 0 ? `?items=${selectedItemIds.join(',')}` : ''}`}
                  onClick={(e) => {
                    if (selectedItemIds.length === 0) {
                      e.preventDefault();
                      toast.error('Please select at least 1 item to checkout');
                      return;
                    }
                    dispatch(toggleCartDrawer(false));
                  }}
                  className="flex-1"
                >
                  <Button
                    variant="primary"
                    size="md"
                    disabled={selectedItemIds.length === 0}
                    className="w-full"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Checkout ({selectedItemIds.length})
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

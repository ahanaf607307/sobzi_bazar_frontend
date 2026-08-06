'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/services/cartApi';
import { orderApi } from '@/services/orderApi';
import { PaymentMethod } from '@/types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ShoppingBag, Truck, CheckCircle2, ShieldCheck, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const selectedItemsParam = searchParams.get('items');
  const selectedCartItemIds = selectedItemsParam
    ? selectedItemsParam.split(',').filter(Boolean)
    : [];

  const [shippingAddress, setShippingAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH_ON_DELIVERY');

  const { data: cartData, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.getCart,
    enabled: isAuthenticated,
  });

  const cart = cartData?.data;
  const allCartItems = cart?.items || [];

  // Filter items based on selected cartItemIds if specified
  const items =
    selectedCartItemIds.length > 0
      ? allCartItems.filter((ci) => selectedCartItemIds.includes(ci.id))
      : allCartItems;

  const subtotal = items.reduce((acc, item) => {
    const price =
      item.product.discount > 0
        ? item.product.price * (1 - item.product.discount / 100)
        : item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const checkoutMutation = useMutation({
    mutationFn: () =>
      orderApi.checkout({
        shippingAddress,
        phone,
        paymentMethod,
        cartItemIds: selectedCartItemIds.length > 0 ? selectedCartItemIds : undefined,
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
      toast.success('Order placed successfully!');
      router.push('/orders');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.trim() || !phone.trim()) {
      toast.error('Shipping address and phone number are required');
      return;
    }
    if (items.length === 0) {
      toast.error('No items selected for checkout');
      return;
    }
    checkoutMutation.mutate();
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Login Required</h2>
        <p className="text-sm text-slate-500">Please login to proceed with order checkout.</p>
        <Button variant="primary" onClick={() => router.push('/login')}>
          Go to Login
        </Button>
      </div>
    );
  }

  if (isLoading) return <Spinner size="lg" className="py-20" />;

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-800">No Items Selected</h2>
        <p className="text-sm text-slate-500">
          {allCartItems.length > 0
            ? 'Please select at least 1 item from your cart to checkout.'
            : 'Add products to your basket before checking out.'}
        </p>
        <Button variant="primary" onClick={() => router.push('/products')}>
          Browse Shop
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-slate-200 pb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Checkout Order</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review your selected items and enter delivery information
          </p>
        </div>
        {selectedCartItemIds.length > 0 && selectedCartItemIds.length < allCartItems.length && (
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-200">
            Checking out {selectedCartItemIds.length} of {allCartItems.length} items in cart
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Delivery Information Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-600" />
              Delivery Details
            </h3>

            <div className="space-y-4">
              <Input
                label="Full Name"
                value={user?.name || ''}
                disabled
                className="bg-slate-100 text-slate-500 cursor-not-allowed"
              />

              <Input
                label="Phone Number"
                placeholder="e.g. 01700000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  Shipping Delivery Address
                </label>
                <textarea
                  rows={3}
                  placeholder="House no, Road no, Area, City..."
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              Select Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'CASH_ON_DELIVERY'
                    ? 'border-emerald-600 bg-emerald-50/50 text-slate-900'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'CASH_ON_DELIVERY'}
                  onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                  className="accent-emerald-600 w-4 h-4 cursor-pointer"
                />
                <div>
                  <p className="text-sm font-bold">Cash On Delivery</p>
                  <p className="text-xs text-slate-500">Pay when order arrives</p>
                </div>
              </label>

              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'ONLINE_PAYMENT'
                    ? 'border-emerald-600 bg-emerald-50/50 text-slate-900'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'ONLINE_PAYMENT'}
                  onChange={() => setPaymentMethod('ONLINE_PAYMENT')}
                  className="accent-emerald-600 w-4 h-4 cursor-pointer"
                />
                <div>
                  <p className="text-sm font-bold">Online Payment</p>
                  <p className="text-xs text-slate-500">Bkash / Nagad / Cards</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary Side */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6 sticky top-28">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">
              Order Summary ({items.length} item{items.length > 1 ? 's' : ''})
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1">
              {items.map((item) => {
                const itemPrice =
                  item.product.discount > 0
                    ? item.product.price * (1 - item.product.discount / 100)
                    : item.product.price;
                return (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{item.product.name}</p>
                      <p className="text-slate-500">
                        {item.quantity} x ৳{itemPrice.toFixed(2)} / {item.product.unit || 'kg'}
                      </p>
                    </div>
                    <span className="font-extrabold text-slate-900">
                      ৳{(itemPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">৳{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping Fee</span>
                <span className="font-semibold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Payable</span>
                <span className="text-emerald-700 text-lg">৳{subtotal.toFixed(2)}</span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={checkoutMutation.isPending}
              className="w-full shadow-lg shadow-emerald-600/30"
              leftIcon={<CheckCircle2 className="w-5 h-5" />}
            >
              Confirm & Place Order
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<Spinner size="lg" className="py-20" />}>
      <CheckoutPageContent />
    </Suspense>
  );
}

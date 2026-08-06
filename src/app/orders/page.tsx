'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '@/services/orderApi';
import { Order, OrderStatus } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';
import { ShoppingBag, PackageCheck, Clock, XCircle, Eye, Calendar, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function MyOrdersPage() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['user-orders'],
    queryFn: orderApi.getUserOrders,
    enabled: isAuthenticated,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => orderApi.cancelOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
      toast.success('Order cancelled successfully');
      setSelectedOrder(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const orders = data?.data || [];

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="warning">PENDING</Badge>;
      case 'PROCESSING':
        return <Badge variant="info">PROCESSING</Badge>;
      case 'SHIPPED':
        return <Badge variant="primary">SHIPPED</Badge>;
      case 'DELIVERED':
        return <Badge variant="success">DELIVERED</Badge>;
      case 'CANCELLED':
        return <Badge variant="danger">CANCELLED</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Login Required</h2>
        <p className="text-sm text-slate-500">Please login to view your order history.</p>
        <Link href="/login">
          <Button variant="primary">Login to Account</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Orders</h1>
        <p className="text-sm text-slate-500 mt-1">
          Track current order status and past order receipts
        </p>
      </div>

      {isLoading ? (
        <Spinner size="lg" />
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 space-y-4">
          <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Orders Yet</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            You haven't placed any orders with Sobji Bazar yet.
          </p>
          <Link href="/products">
            <Button variant="primary">Explore Fresh Shop</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-emerald-200 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    ORDER #{order.id.slice(0, 8)}
                  </span>
                  {getStatusBadge(order.orderStatus)}
                  <span className="text-xs font-semibold text-slate-500">
                    Payment: <strong className="text-slate-700">{order.paymentStatus}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span>•</span>
                  <span>{order.items?.length || 0} Items</span>
                </div>
              </div>

              <div className="flex items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                <div className="text-left md:text-right">
                  <p className="text-xs text-slate-400 font-semibold">Total Payable</p>
                  <p className="text-lg font-black text-emerald-700">
                    ৳{order.totalAmount.toFixed(2)}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedOrder(order)}
                  leftIcon={<Eye className="w-4 h-4" />}
                >
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order Details #${selectedOrder.id.slice(0, 8)}`}
          maxWidth="lg"
        >
          <div className="space-y-6">
            {/* Status Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-semibold">Status</p>
                <div className="mt-1">{getStatusBadge(selectedOrder.orderStatus)}</div>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">Payment Method</p>
                <p className="text-xs font-bold text-slate-800 uppercase">
                  {selectedOrder.paymentMethod}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">Total Amount</p>
                <p className="text-sm font-black text-emerald-700">
                  ৳{selectedOrder.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Address & Phone */}
            <div className="space-y-2 text-xs">
              <p className="font-bold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" /> Shipping Address:
              </p>
              <p className="text-slate-600 bg-slate-50 p-3 rounded-xl">
                {selectedOrder.shippingAddress || 'N/A'} (Phone: {selectedOrder.phone || 'N/A'})
              </p>
            </div>

            {/* Items List */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-700">Purchased Items:</p>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl p-3 bg-white">
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{item.product?.name || 'Product'}</p>
                      <p className="text-slate-500">
                        {item.quantity} x ৳{item.price.toFixed(2)}
                      </p>
                    </div>
                    <span className="font-extrabold text-slate-900">
                      ৳{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cancel Button if PENDING */}
            {selectedOrder.orderStatus === 'PENDING' && (
              <div className="pt-4 border-t border-slate-100">
                <Button
                  variant="danger"
                  size="md"
                  className="w-full"
                  isLoading={cancelMutation.isPending}
                  onClick={() => cancelMutation.mutate(selectedOrder.id)}
                  leftIcon={<XCircle className="w-4 h-4" />}
                >
                  Cancel Order
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

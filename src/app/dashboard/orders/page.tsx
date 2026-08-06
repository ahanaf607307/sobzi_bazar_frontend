'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '@/services/orderApi';
import { Order, OrderStatus } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';
import { ListOrdered, Eye, Edit2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageOrdersPage() {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newOrderStatus, setNewOrderStatus] = useState<OrderStatus>('PENDING');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => orderApi.getAllOrders(),
  });

  const orders = data?.data || [];

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, orderStatus }: { id: string; orderStatus: string }) =>
      orderApi.updateOrderStatus(id, { orderStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Order status updated');
      setSelectedOrder(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Manage Orders</h1>
        <p className="text-xs text-slate-500 mt-1">Review orders and advance fulfillment status</p>
      </div>

      {isLoading ? (
        <Spinner size="lg" />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Address</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Order Status</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/80">
                  <td className="p-4 font-mono font-bold text-slate-800">#{o.id.slice(0, 8)}</td>
                  <td className="p-4 font-semibold text-slate-900">{o.user?.name || 'Customer'}</td>
                  <td className="p-4 text-slate-500 max-w-xs truncate">{o.shippingAddress || 'N/A'}</td>
                  <td className="p-4">
                    <Badge variant="neutral">{o.paymentStatus}</Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant="primary">{o.orderStatus}</Badge>
                  </td>
                  <td className="p-4 text-right font-black text-emerald-700">
                    ৳{o.totalAmount.toFixed(2)}
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(o);
                        setNewOrderStatus(o.orderStatus);
                      }}
                      leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                    >
                      Update
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Update Order Status Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Update Status #${selectedOrder.id.slice(0, 8)}`}
        >
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
              <p className="font-bold text-slate-800">Customer: {selectedOrder.user?.name}</p>
              <p className="text-slate-600">Address: {selectedOrder.shippingAddress}</p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Set Order Status</label>
              <select
                value={newOrderStatus}
                onChange={(e) => setNewOrderStatus(e.target.value as OrderStatus)}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-sm font-semibold"
              >
                <option value="PENDING">PENDING</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <Button
              variant="primary"
              className="w-full mt-4"
              isLoading={updateStatusMutation.isPending}
              onClick={() =>
                updateStatusMutation.mutate({
                  id: selectedOrder.id,
                  orderStatus: newOrderStatus,
                })
              }
            >
              Update Order Status
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

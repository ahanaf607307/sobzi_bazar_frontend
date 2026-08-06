'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/services/productApi';
import { orderApi } from '@/services/orderApi';
import { userManagementApi } from '@/services/userManagementApi';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { Layers, ShoppingBag, ListOrdered, Users, DollarSign, TrendingUp } from 'lucide-react';

export default function DashboardOverviewPage() {
  const { data: categoriesData } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => productApi.getAllCategories(),
  });

  const { data: productsData } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => productApi.getAllProducts(),
  });

  const { data: ordersData } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => orderApi.getAllOrders(),
  });

  const { data: usersData } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => userManagementApi.getAllUsers(),
  });

  const categories = categoriesData?.data || [];
  const products = productsData?.data || [];
  const orders = ordersData?.data || [];
  const users = usersData?.data || [];

  const totalRevenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Console Dashboard</h1>
        <p className="text-xs text-slate-500 mt-1">
          Store overview metrics and active management statistics
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="flex items-center gap-4 bg-white">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Total Revenue</p>
            <p className="text-xl font-black text-slate-900">৳{totalRevenue.toFixed(2)}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 bg-white">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <ListOrdered className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Total Orders</p>
            <p className="text-xl font-black text-slate-900">{orders.length}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 bg-white">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Products Stock</p>
            <p className="text-xl font-black text-slate-900">{products.length}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4 bg-white">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold">Registered Users</p>
            <p className="text-xl font-black text-slate-900">{users.length}</p>
          </div>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-800">Recent Customer Orders</h3>

        {orders.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No recent orders.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-mono font-bold text-slate-700">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="p-3 font-medium text-slate-800">
                      {order.user?.name || 'Customer'}
                    </td>
                    <td className="p-3">
                      <Badge variant="primary">{order.orderStatus}</Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant="neutral">{order.paymentStatus}</Badge>
                    </td>
                    <td className="p-3 text-right font-black text-emerald-700">
                      ৳{order.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

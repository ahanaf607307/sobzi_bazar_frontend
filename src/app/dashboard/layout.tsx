'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { Spinner } from '@/components/ui/Spinner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  if (isLoading) return <Spinner size="lg" className="py-20" />;

  const isStaffOrAdmin =
    user?.role === 'SYSTEM_OWNER' ||
    user?.role === 'MANAGER' ||
    user?.role === 'STAFF';

  if (!isAuthenticated || !isStaffOrAdmin) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Access Denied</h2>
        <p className="text-sm text-slate-500">
          You do not have permission to access the management dashboard console.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100/70">
      <DashboardSidebar />
      <div className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</div>
    </div>
  );
}

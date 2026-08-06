'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  LayoutDashboard,
  Layers,
  ShoppingBag,
  ListOrdered,
  Users,
  UserPlus,
  ArrowLeft,
  Leaf,
} from 'lucide-react';
import { clsx } from 'clsx';

export const DashboardSidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useSelector((state: RootState) => state.auth);

  const isSystemOwner = user?.role === 'SYSTEM_OWNER';
  const isManagerOrOwner = isSystemOwner || user?.role === 'MANAGER';

  const menuItems = [
    {
      label: 'Overview',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['SYSTEM_OWNER', 'MANAGER', 'STAFF'],
    },
    {
      label: 'Categories',
      href: '/dashboard/categories',
      icon: Layers,
      roles: ['SYSTEM_OWNER', 'MANAGER', 'STAFF'],
    },
    {
      label: 'Products',
      href: '/dashboard/products',
      icon: ShoppingBag,
      roles: ['SYSTEM_OWNER', 'MANAGER', 'STAFF'],
    },
    {
      label: 'Orders',
      href: '/dashboard/orders',
      icon: ListOrdered,
      roles: ['SYSTEM_OWNER', 'MANAGER', 'STAFF'],
    },
    {
      label: 'Manage Users',
      href: '/dashboard/users',
      icon: Users,
      roles: ['SYSTEM_OWNER', 'MANAGER'],
    },
    {
      label: 'Create Staff/Manager',
      href: '/dashboard/staff',
      icon: UserPlus,
      roles: ['SYSTEM_OWNER', 'MANAGER'],
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-4 flex flex-col justify-between shrink-0 border-r border-slate-800">
      <div className="space-y-6">
        {/* Brand & Back to store */}
        <div className="space-y-3">
          <Link href="/dashboard" className="flex items-center gap-2.5 px-2 py-1">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white">
                Sobji<span className="text-emerald-400">Bazar</span>
              </span>
              <span className="block text-[9px] font-bold text-emerald-400 uppercase tracking-wider -mt-1">
                Dashboard
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors p-2 rounded-xl bg-slate-800/80 border border-slate-700/50"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            Back to Store Front
          </Link>
        </div>

        {/* User Card */}
        <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700/60">
          <p className="text-xs text-slate-400">Logged in as</p>
          <p className="text-sm font-bold text-white truncate">{user?.name}</p>
          <span className="inline-block mt-1 text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            {user?.role}
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            if (user?.role && !item.roles.includes(user.role)) return null;

            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="text-[11px] text-slate-500 text-center py-2">
        Sobji Bazar Management Console
      </div>
    </aside>
  );
};

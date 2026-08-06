'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { logout } from '@/redux/slices/authSlice';
import { toggleCartDrawer } from '@/redux/slices/cartSlice';
import { authApi } from '@/services/authApi';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import {
  ShoppingBag,
  Search,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Package,
  ListOrdered,
  Menu,
  X,
  Leaf,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { itemsCount } = useSelector((state: RootState) => state.cart);

  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isStaffOrAdmin =
    user?.role === 'SYSTEM_OWNER' ||
    user?.role === 'MANAGER' ||
    user?.role === 'STAFF';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?searchTerm=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      dispatch(logout());
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (err) {
      dispatch(logout());
      router.push('/login');
    }
  };

  return (
    <header className="sticky top-0 z-40 glass-nav transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-11 h-11 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition-transform">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
                Sobji<span className="text-emerald-600">Bazar</span>
              </span>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest -mt-1">
                Fresh & Organic
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md relative items-center"
          >
            <Search className="w-4 h-4 absolute left-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search fresh vegetables, fruits, herbs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-100/80 hover:bg-slate-100 border-0 rounded-full py-2.5 pl-11 pr-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </form>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 font-semibold text-sm text-slate-700">
            <Link
              href="/"
              className={`hover:text-emerald-600 transition-colors ${
                pathname === '/' ? 'text-emerald-600 font-bold' : ''
              }`}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`hover:text-emerald-600 transition-colors ${
                pathname.startsWith('/products') ? 'text-emerald-600 font-bold' : ''
              }`}
            >
              All Products
            </Link>
            <Link
              href="/categories"
              className={`hover:text-emerald-600 transition-colors ${
                pathname === '/categories' ? 'text-emerald-600 font-bold' : ''
              }`}
            >
              Categories
            </Link>
            {isAuthenticated && (
              <Link
                href="/orders"
                className={`hover:text-emerald-600 transition-colors ${
                  pathname.startsWith('/orders') ? 'text-emerald-600 font-bold' : ''
                }`}
              >
                My Orders
              </Link>
            )}
            {isStaffOrAdmin && (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-xl hover:bg-emerald-200 transition-colors text-xs font-bold"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            )}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <button
              onClick={() => dispatch(toggleCartDrawer())}
              className="relative p-3 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:text-emerald-600 hover:border-emerald-300 transition-all shadow-sm cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {itemsCount}
                </span>
              )}
            </button>

            {/* Auth Button / Profile Dropdown */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <Avatar src={user.avatarUrl} name={user.name} size="sm" />
                </button>

                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-scaleUp"
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase tracking-wider font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      My Profile
                    </Link>

                    <Link
                      href="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <ListOrdered className="w-4 h-4 text-slate-400" />
                      My Orders
                    </Link>

                    {isStaffOrAdmin && (
                      <Link
                        href="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-emerald-700 font-bold hover:bg-emerald-50 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors font-semibold"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search & Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-6 border-t border-slate-100 pt-4 space-y-4 animate-fadeIn">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-100 border-0 rounded-xl py-2 pl-11 pr-4 text-sm text-slate-800"
              />
            </form>
            <div className="flex flex-col gap-2 font-semibold text-sm text-slate-700">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-slate-100"
              >
                Home
              </Link>
              <Link
                href="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-slate-100"
              >
                All Products
              </Link>
              <Link
                href="/categories"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-slate-100"
              >
                Categories
              </Link>
              {isAuthenticated && (
                <Link
                  href="/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2 px-3 rounded-lg hover:bg-slate-100"
                >
                  My Orders
                </Link>
              )}
              {isStaffOrAdmin && (
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2 px-3 rounded-lg bg-emerald-100 text-emerald-800 font-bold"
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

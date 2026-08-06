'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, Phone, Mail, MapPin, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();

  if (pathname.startsWith('/dashboard')) {
    return null;
  }
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      {/* Features Bar */}
      <div className="border-b border-slate-800 bg-slate-950/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Same-Day Express Delivery</h4>
              <p className="text-xs text-slate-400">Fresh harvest straight to your home</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Organic Certified</h4>
              <p className="text-xs text-slate-400">Directly sourced from trusted farmers</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Easy Cash on Delivery</h4>
              <p className="text-xs text-slate-400">Inspect quality before paying</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white">
              <Leaf className="w-5 h-5" />
            </div>
            <span className="text-xl font-black text-white">
              Sobji<span className="text-emerald-400">Bazar</span>
            </span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your premier online destination for farm-fresh vegetables, organic produce, and daily kitchen essentials. Quality guaranteed.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
          <ul className="space-y-2 text-xs font-medium">
            <li><Link href="/" className="hover:text-emerald-400 transition-colors">Home Page</Link></li>
            <li><Link href="/products" className="hover:text-emerald-400 transition-colors">All Fresh Products</Link></li>
            <li><Link href="/categories" className="hover:text-emerald-400 transition-colors">Product Categories</Link></li>
            <li><Link href="/orders" className="hover:text-emerald-400 transition-colors">Track Orders</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Categories</h4>
          <ul className="space-y-2 text-xs font-medium">
            <li><Link href="/products?searchTerm=Leafy" className="hover:text-emerald-400 transition-colors">Leafy Greens</Link></li>
            <li><Link href="/products?searchTerm=Root" className="hover:text-emerald-400 transition-colors">Root Vegetables</Link></li>
            <li><Link href="/products?searchTerm=Organic" className="hover:text-emerald-400 transition-colors">Organic Herbs</Link></li>
            <li><Link href="/products?searchTerm=Fresh" className="hover:text-emerald-400 transition-colors">Seasonal Specials</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Get in Touch</h4>
          <ul className="space-y-3 text-xs text-slate-400">
            <li className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>123 Fresh Produce Way, Dhaka, Bangladesh</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>+880 1700 000 000</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>support@sobjibazar.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Sobji Bazar E-Commerce. All rights reserved. Designed with ❤️ for fresh living.
      </div>
    </footer>
  );
};

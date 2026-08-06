'use client';

import { ReduxProvider } from '@/redux/provider';
import { QueryProvider } from './QueryProvider';
import { Toaster } from 'react-hot-toast';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#064e3b',
              color: '#ffffff',
              borderRadius: '12px',
              padding: '12px 18px',
              fontSize: '14px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
            },
            error: {
              style: {
                background: '#7f1d1d',
                color: '#ffffff',
              },
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
        {children}
      </QueryProvider>
    </ReduxProvider>
  );
}

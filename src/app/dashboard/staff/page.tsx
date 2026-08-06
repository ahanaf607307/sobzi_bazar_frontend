'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StaffRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard/management');
  }, [router]);

  return null;
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/authStore';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (accessToken) {
      router.replace('/dashboard');
    }
  }, [accessToken, router]);

  if (accessToken) return null;

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-3xl font-bold text-orange-500 tracking-tight">Kudip</span>
          <p className="mt-1 text-sm text-gray-500">요리는 실험이다</p>
        </div>
        {children}
      </div>
    </div>
  );
}

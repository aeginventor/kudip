'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import * as authService from '@/services/auth';
import useAuthStore from '@/stores/authStore';

export function useSignup() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: authService.signup,
    onSuccess: (data) => {
      setAuth(data.data.accessToken, data.data.user);
      router.push('/dashboard');
    },
  });
}

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuth(data.data.accessToken, data.data.user);
      router.push('/dashboard');
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return () => {
    clearAuth();
    router.push('/login');
  };
}

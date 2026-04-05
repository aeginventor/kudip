import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  accessToken: string | null;
  user: Pick<User, 'id' | 'email' | 'nickname'> | null;
  setAuth: (accessToken: string, user: Pick<User, 'id' | 'email' | 'nickname'>) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      setAuth: (accessToken, user) => set({ accessToken, user }),
      clearAuth: () => set({ accessToken: null, user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;

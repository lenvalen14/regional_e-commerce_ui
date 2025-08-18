'use client';

import { Provider } from 'react-redux';
import { store } from '../../lib/store';
import { useEffect } from 'react';
import { setCredentials } from '@/features/auth/authSlice';

export function Providers({ children }: { children: React.ReactNode }) {
  // Rehydrate token/refreshToken từ localStorage để giữ phiên sau reload
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken') || undefined;
    if (token) {
      store.dispatch(setCredentials({ token, refreshToken }));
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
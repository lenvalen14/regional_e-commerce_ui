import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../lib/store';
import { useCart } from '../contexts/CartContext';

export function useCartSync() {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const { syncCartWithServer } = useCart();

  useEffect(() => {
    if (isAuthenticated && user?.userId) {
      // Delay sync to ensure all auth state is properly set
      const timeoutId = setTimeout(() => {
        syncCartWithServer();
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [isAuthenticated, user?.userId, syncCartWithServer]);
}

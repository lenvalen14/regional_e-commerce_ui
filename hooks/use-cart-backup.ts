import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../lib/store';
import { useCart } from '../contexts/CartContext';

export function useCartBackup() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const { state: cartState } = useCart();

  // Backup cart to localStorage when user is about to logout
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isAuthenticated && cartState.items.length > 0) {
        try {
          localStorage.setItem('cart_backup', JSON.stringify(cartState.items));
        } catch (error) {
          console.error('Error backing up cart:', error);
        }
      }
    };

    // Backup cart when authentication state changes from true to false
    if (!isAuthenticated && cartState.items.length > 0) {
      try {
        localStorage.setItem('cart', JSON.stringify(cartState.items));
        console.log('Cart backed up to localStorage');
      } catch (error) {
        console.error('Error backing up cart on logout:', error);
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isAuthenticated, cartState.items]);
}

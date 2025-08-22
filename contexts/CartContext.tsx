'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../lib/store';
import {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useSyncCartToServerMutation,
  useClearCartMutation
} from '../features/cart/cartApi';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
  quantity: number;
  // variant: string;
  image: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> & { quantity?: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'SYNC_FROM_SERVER'; payload: CartItem[] };

const cartReducer = (state: CartState, action: CartAction): CartState => {

  switch (action.type) {
    case 'ADD_ITEM': {
      const { quantity = 1, ...item } = action.payload;

      const existingItemIndex = state.items.findIndex(
        i => i.id === item.id
      );

      let newItems;
      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, { ...item, quantity }];
      }

      return {
        ...state,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0)
      };
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );

      return {
        ...state,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0)
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(
        item => !(item.id === action.payload.id)
      );

      return {
        ...state,
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0)
      };
    }

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0
      };

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload,
        total: action.payload.reduce((sum, item) => sum + item.price * item.quantity, 0),
        itemCount: action.payload.reduce((sum, item) => sum + item.quantity, 0)
      };

    case 'SYNC_FROM_SERVER':
      return {
        ...state,
        items: action.payload,
        total: action.payload.reduce((sum, item) => sum + item.price * item.quantity, 0),
        itemCount: action.payload.reduce((sum, item) => sum + item.quantity, 0)
      };

    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  syncCartWithServer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0
  });

  // Get current user from Redux store
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const {
    data: serverCart,
    refetch: refetchCart,
    error: cartError,
  } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [addToCartAPI] = useAddToCartMutation();
  const [updateCartItemAPI] = useUpdateCartItemMutation();
  const [removeCartItemAPI] = useRemoveCartItemMutation();
  const [clearCartAPI] = useClearCartMutation();
  const [syncCartToServer] = useSyncCartToServerMutation();

  // Load cart from localStorage on mount (only for non-authenticated users)
  useEffect(() => {
    if (!isAuthenticated) {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const cartItems = JSON.parse(savedCart);
          dispatch({ type: 'LOAD_CART', payload: cartItems });
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    } else {
      // User is authenticated, clear local cart immediately
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [isAuthenticated]);

  // Sync with server when user logs in
  useEffect(() => {
    if (isAuthenticated && user?.userId) {
      // Add a small delay to ensure all auth state is properly set
      const timeoutId = setTimeout(() => {
        syncCartWithServer();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [isAuthenticated, user?.userId]);

  // Save to localStorage for non-authenticated users only
  useEffect(() => {
    if (!isAuthenticated && state.items.length > 0) {
      try {
        localStorage.setItem('cart', JSON.stringify(state.items));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [state.items, isAuthenticated]);

  // Save to localStorage for non-authenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      try {
        localStorage.setItem('cart', JSON.stringify(state.items));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [state.items, isAuthenticated]);

  // Convert server cart format to local cart format
  const convertServerCartToLocal = (serverCartItems: any[]): CartItem[] => {
    return serverCartItems.map(item => {
      const product = item.product || {};
      const imageUrl = product.imageProductResponseList && product.imageProductResponseList.length > 0
        ? product.imageProductResponseList[0].imageUrl
        : '';

      return {
        id: product.productId || product.id || item.productId,
        name: product.productName || product.name || 'Unknown Product',
        price: product.price || 0,
        priceLabel: `${(product.price || 0).toLocaleString()}đ`,
        quantity: item.quantity || 1,
        image: imageUrl
      };
    });
  };

  const syncCartWithServer = async () => {
    if (!isAuthenticated || !user?.userId) {
      return;
    }

    try {
      localStorage.removeItem('cart');

      const serverCartResult = await refetchCart();

      if (serverCartResult.data?.data) {
        const serverCart = serverCartResult.data.data;
        const serverItems = convertServerCartToLocal(serverCart.items || []);

        // Load server cart only
        dispatch({ type: 'SYNC_FROM_SERVER', payload: serverItems });
      } else {
        // No server cart, start with empty cart
        dispatch({ type: 'CLEAR_CART' });
      }
    } catch (error) {
      console.error('Error syncing cart with server:', error);
      // On error, clear cart to avoid confusion
      dispatch({ type: 'CLEAR_CART' });
    }
  };

  const addItem = async (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    if (isAuthenticated && user?.userId) {
      // User is logged in - add to server
      try {
        const serverResponse = await addToCartAPI({
          productId: item.id,
          quantity: item.quantity || 1,
        }).unwrap();

        // Refetch cart to get updated data
        const updatedCartResult = await refetchCart();

        if (updatedCartResult.data?.data) {
          const updatedCart = updatedCartResult.data.data;
          const updatedItems = convertServerCartToLocal(updatedCart.items || []);
          dispatch({ type: 'SYNC_FROM_SERVER', payload: updatedItems });
        }
      } catch (error) {
        console.error('Error adding item to server cart:', error);
        // Don't fallback to local when user is authenticated
        // Just show the error and keep server cart state
      }
    } else {
      // User not authenticated - add to local storage
      dispatch({ type: 'ADD_ITEM', payload: item });
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;

    if (isAuthenticated && user?.userId) {
      try {
        // Find the cart item from current state
        const currentItem = state.items.find(item => item.id === id);
        if (currentItem) {
          // Note: We need proper cartItemId mapping here
          // For now, this is a simplified version
          await updateCartItemAPI({
            id: currentItem.id,
            data: { quantity }
          }).unwrap();

          // Refetch cart
          const updatedCartResult = await refetchCart();
          if (updatedCartResult.data?.data) {
            const updatedCart = updatedCartResult.data.data;
            const updatedItems = convertServerCartToLocal(updatedCart.items || []);
            dispatch({ type: 'SYNC_FROM_SERVER', payload: updatedItems });
          }
        }
      } catch (error) {
        console.error('Error updating cart item on server:', error);
        // Don't fallback - keep server state consistent
      }
    } else {
      // Local update for non-authenticated users
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    }
  };

  const removeItem = async (id: string) => {
    if (isAuthenticated && user?.userId) {
      try {
        const currentItem = state.items.find(item => item.id === id);
        if (currentItem) {
          await removeCartItemAPI(currentItem.id).unwrap();

          // Refetch cart
          const updatedCartResult = await refetchCart();
          if (updatedCartResult.data?.data) {
            const updatedCart = updatedCartResult.data.data;
            const updatedItems = convertServerCartToLocal(updatedCart.items || []);
            dispatch({ type: 'SYNC_FROM_SERVER', payload: updatedItems });
          }
        }
      } catch (error) {
        console.error('Error removing cart item from server:', error);
        // Don't fallback - keep server state consistent
      }
    } else {
      // Local removal for non-authenticated users
      dispatch({ type: 'REMOVE_ITEM', payload: { id } });
    }
  };

  const clearCart = async () => {
    if (isAuthenticated && user?.userId) {
      try {
        await clearCartAPI().unwrap();
        dispatch({ type: 'CLEAR_CART' });
      } catch (error) {
        console.error('Error clearing server cart:', error);
        // Still clear local state even if server fails
        dispatch({ type: 'CLEAR_CART' });
      }
    } else {
      // Local clear for non-authenticated users
      dispatch({ type: 'CLEAR_CART' });
    }
  };

  return (
    <CartContext.Provider value={{
      state,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      syncCartWithServer
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
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
  id: string; // productId
  cartItemId?: string; // cartItemId từ server
  name: string;
  price: number;
  priceLabel: string;
  quantity: number;
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

      const existingItemIndex = state.items.findIndex(i => i.id === item.id);
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
      const newItems = state.items.filter(item => item.id !== action.payload.id);

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

  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const { refetch: refetchCart } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [addToCartAPI] = useAddToCartMutation();
  const [updateCartItemAPI] = useUpdateCartItemMutation();
  const [removeCartItemAPI] = useRemoveCartItemMutation();
  const [clearCartAPI] = useClearCartMutation();

  // Load local cart if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const cartItems = JSON.parse(savedCart);
          dispatch({ type: 'LOAD_CART', payload: cartItems });
        }
      } catch {
        // ignore errors
      }
    } else {
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [isAuthenticated]);

  // Save to localStorage for guests
  useEffect(() => {
    if (!isAuthenticated) {
      try {
        localStorage.setItem('cart', JSON.stringify(state.items));
      } catch {
        // ignore
      }
    }
  }, [state.items, isAuthenticated]);

  const convertServerCartToLocal = (serverCartItems: any[]): CartItem[] => {
    return serverCartItems.map(item => {
      const product = item.product || {};
      const imageUrl = product.imageProductResponseList && product.imageProductResponseList.length > 0
        ? product.imageProductResponseList[0].imageUrl
        : (product.images && product.images.length > 0
          ? product.images[0].imageUrl
          : '/images/products-default.png');

      return {
        id: product.productId || product.id || item.productId,
        cartItemId: item.cartItemId,
        name: product.productName || product.name || 'Unknown Product',
        price: product.price || 0,
        priceLabel: `${(product.price || 0).toLocaleString()}đ`,
        quantity: item.quantity || 1,
        image: imageUrl
      };
    });
  };

  const syncCartWithServer = async () => {
    if (!isAuthenticated || !user?.userId) return;

    try {
      localStorage.removeItem('cart');
      const serverCartResult = await refetchCart();

      if (serverCartResult.data?.data) {
        const serverCart = serverCartResult.data.data;
        const serverItems = convertServerCartToLocal(serverCart.items || []);
        dispatch({ type: 'SYNC_FROM_SERVER', payload: serverItems });
      } else {
        dispatch({ type: 'CLEAR_CART' });
      }
    } catch {
      dispatch({ type: 'CLEAR_CART' });
    }
  };

  const addItem = async (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    if (isAuthenticated && user?.userId) {
      try {
        await addToCartAPI({
          productId: item.id,
          quantity: item.quantity || 1,
        }).unwrap();

        const updatedCartResult = await refetchCart();
        if (updatedCartResult.data?.data) {
          const updatedCart = updatedCartResult.data.data;
          const updatedItems = convertServerCartToLocal(updatedCart.items || []);
          dispatch({ type: 'SYNC_FROM_SERVER', payload: updatedItems });
        }
      } catch {
        // ignore
      }
    } else {
      dispatch({ type: 'ADD_ITEM', payload: item });
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;

    if (isAuthenticated && user?.userId) {
      try {
        const currentItem = state.items.find(item => item.id === id);
        if (currentItem) {
          await updateCartItemAPI({
            id: currentItem.id,
            data: { quantity }
          }).unwrap();

          const updatedCartResult = await refetchCart();
          if (updatedCartResult.data?.data) {
            const updatedCart = updatedCartResult.data.data;
            const updatedItems = convertServerCartToLocal(updatedCart.items || []);
            dispatch({ type: 'SYNC_FROM_SERVER', payload: updatedItems });
          }
        }
      } catch {
        // ignore
      }
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    }
  };

  const removeItem = async (id: string) => {
    if (isAuthenticated && user?.userId) {
      try {
        const currentItem = state.items.find(item => item.id === id);
        if (currentItem) {
          await removeCartItemAPI(currentItem.id).unwrap();

          const updatedCartResult = await refetchCart();
          if (updatedCartResult.data?.data) {
            const updatedCart = updatedCartResult.data.data;
            const updatedItems = convertServerCartToLocal(updatedCart.items || []);
            dispatch({ type: 'SYNC_FROM_SERVER', payload: updatedItems });
          }
        }
      } catch {
        // ignore
      }
    } else {
      dispatch({ type: 'REMOVE_ITEM', payload: { id } });
    }
  };

  const clearCart = async () => {
    if (isAuthenticated && user?.userId) {
      try {
        await clearCartAPI(user.userId).unwrap();
        dispatch({ type: 'CLEAR_CART' });
      } catch {
        dispatch({ type: 'CLEAR_CART' });
      }
    } else {
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

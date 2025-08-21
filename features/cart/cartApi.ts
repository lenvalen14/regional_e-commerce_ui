import { apiSlice } from '../../lib/api/apiSlice'

export interface CartItem {
  cartItemId: string
  quantity: number
  product: {
    productId: string
    productName: string
    price: number
    images?: Array<{ imageId: string; imageUrl: string }>
  }
}

export interface Cart {
  cartId: string
  user: {
    userId: string
    userName: string
    email: string
  }
  items: CartItem[]
}

export interface AddToCartRequest {
  productId: string
  quantity: number
  variant?: string
}

export interface UpdateCartItemRequest {
  quantity: number
}

export interface ApiResponse<T> {
  message: string
  code: number
  data: T
}

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<ApiResponse<Cart>, void>({
      query: () => `/my-cart`,
      providesTags: ['Cart'],
      transformErrorResponse: (response) => {
          console.error('Cart API Error:', response);
          return response;
      },
    }),

    // Add item to cart
    addToCart: builder.mutation<ApiResponse<Cart>, AddToCartRequest>({
      query: (cartData) => ({
        url: '/my-cart',
        method: 'POST',
        body: cartData,
      }),
      invalidatesTags: ['Cart'],
    }),

    // Update cart item quantity
    updateCartItem: builder.mutation<ApiResponse<CartItem>, { id: string; data: UpdateCartItemRequest }>({
      query: ({ id, data }) => ({
        url: `/my-cart/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Cart'],
    }),

    // Remove single item from cart
    removeCartItem: builder.mutation<ApiResponse<string>, string>({
      query: (itemId) => ({
        url: `/my-cart/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),

    // Remove multiple items from cart
    removeCartItems: builder.mutation<ApiResponse<Record<string, string>>, string[]>({
      query: (itemIds) => ({
        url: '/my-cart/cart-item',
        method: 'DELETE',
        body: itemIds,
      }),
      invalidatesTags: ['Cart'],
    }),

    // Clear all cart items for user
    clearCart: builder.mutation<ApiResponse<string>, void>({
      query: () => ({
        url: '/my-cart/cart-item/by-user',
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),

    // Sync local cart to server (for when user logs in)
    syncCartToServer: builder.mutation<ApiResponse<Cart>, { items: AddToCartRequest[] }>({
      queryFn: async ({ items }, { dispatch }) => {
        try {
          // Add each item to server cart
          for (const item of items) {
            await dispatch(cartApi.endpoints.addToCart.initiate(item)).unwrap()
          }
          
          // Return success - actual cart will be refetched via invalidation
          return { data: { message: 'Cart synced successfully', code: 200, data: {} as Cart } }
        } catch (error: any) {
          return { error: { status: 'FETCH_ERROR', error: error.message } }
        }
      },
      invalidatesTags: ['Cart'],
    }),
  }),
})

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useRemoveCartItemsMutation,
  useClearCartMutation,
  useSyncCartToServerMutation,
} = cartApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define types based on BE response
export interface OrderItem {
  productResponse: {
    productId: string;
    productName: string;
    description: string;
    price: number;
    rating: number | null;
    stockQuantity: number;
    category: {
      categoryId: string;
      categoryName: string;
      description: string;
      productCount: number;
    };
    region: {
      regionId: string;
      regionName: string;
    };
    imageProductResponseList: Array<{
      imageId: string;
      imageUrl: string;
    }>;
    deleted: boolean;
  };
  quantity: number;
  unitPrice: number;
}

export interface Order {
  orderId: string;
  userResponse: {
    userId: string;
    userName: string;
    email: string;
    phone: string;
    isActive: boolean;
  };
  addressResponse: {
    addressId: string;
    addressLine: string;
    province: string;
    phone: string;
    default: boolean;
  };
  orderItemResponses: OrderItem[];
  totalAmount: number;
  status: 'PENDING' | 'CONFIRM' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
  orderDate: number; // timestamp
  method: string;
  paymentMethod?: string;
}

export interface OrdersResponse {
  message: string;
  code: number;
  data: Order[];
  meta: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
  };
}

export interface UpdateOrderStatusRequest {
  status: 'PENDING' | 'CONFIRM' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
}

export interface CreateOrderRequest {
  addressId: string;
  method: 'CASH' | 'VNPAY';
  cartItemsId: string[];
}

export interface CreateOrderResponse {
  message: string;
  code: number;
  data: Order;
  meta?: any;
}

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1',
    prepareHeaders: (headers, { getState }) => {
      // Get token from Redux state
      const state = getState() as any;
      const token = state.auth?.token || localStorage.getItem('access_token');
      const user = state.auth?.user;
      
      console.log('Order API - Token:', token ? 'exists' : 'missing');
      console.log('Order API - User:', user);
      console.log('Order API - User Role:', user?.role);
      
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
    responseHandler: async (response) => {
      console.log('Order API Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (!response.ok) {
        const text = await response.text();
        console.error('Order API Error Response:', text);
        throw new Error(`API Error: ${response.status} - ${text}`);
      }
      
      return response.json();
    }
  }),
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    // Create new order
    createOrder: builder.mutation<CreateOrderResponse, CreateOrderRequest>({
      query: (orderData) => ({
        url: '/order',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Order'],
    }),

    // Get all orders with pagination and filters
    getOrders: builder.query<OrdersResponse, {
      page?: number;
      size?: number;
      status?: string;
    }>({
      query: ({ page = 0, size = 10, status }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          size: size.toString(),
        });
        
        if (status && status !== 'all') {
          params.append('status', status);
          return `/order/filter?${params.toString()}`;
        }
        
        return `/order/active?${params.toString()}`;
      },
      providesTags: ['Order'],
    }),

    // Get single order by ID
    getOrder: builder.query<{ data: Order }, string>({
      query: (orderId) => `/order/${orderId}`,
      providesTags: (result, error, orderId) => [
        { type: 'Order', id: orderId },
      ],
    }),

    // Update order status (Admin only)
    updateOrderStatus: builder.mutation<{ data: Order }, {
      orderId: string;
      status: UpdateOrderStatusRequest['status'];
    }>({
      query: ({ orderId, status }) => ({
        url: `/order/${orderId}/status`,
        method: 'PUT',
        params: { status },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        'Order',
        { type: 'Order', id: orderId },
      ],
    }),

    // Cancel order
    cancelOrder: builder.mutation<{ data: Order }, string>({
      query: (orderId) => ({
        url: `/order/${orderId}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, orderId) => [
        'Order',
        { type: 'Order', id: orderId },
      ],
    }),

    // Delete order
    deleteOrder: builder.mutation<{ data: boolean }, string>({
      query: (orderId) => ({
        url: `/order/${orderId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetOrderQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useDeleteOrderMutation,
} = orderApi;

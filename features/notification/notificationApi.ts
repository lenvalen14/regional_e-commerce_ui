import { apiSlice } from '@/lib/api/apiSlice'

export interface NotificationResponse {
  type: any
  notificationId: string
  userId: string
  title: string
  content: string
  isRead: boolean
  createdAt: string
}

export interface CreateNotificationRequest {
  userId: string
  type: 'order' | 'product' | 'system' | 'promotion' | 'review'
  title: string
  message: string
  metadata?: Record<string, any>
}

export interface UpdateNotificationRequest {
  isRead?: boolean
}

export interface NotificationStats {
  total: number
  unread: number
  read: number
}

function parseCreatedAt(arr: number[]): string {
  if (!Array.isArray(arr)) return new Date(arr).toISOString();
  const [year, month, day, hour, minute, second, nano] = arr;
  return new Date(year, month - 1, day, hour, minute, second, Math.floor(nano / 1e6)).toISOString();
}

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create notification
    createNotification: builder.mutation<NotificationResponse, CreateNotificationRequest>({
      query: (data) => ({
        url: '/notifications',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Notification'],
    }),

    // Get user notifications
    getUserNotifications: builder.query<NotificationResponse[], { page?: number; size?: number }>({
      query: ({ page = 0, size = 10 } = {}) => `/notifications/user?page=${page}&size=${size}`,
      transformResponse: (response: { data: any[] }) =>
        response.data.map((n) => ({
          ...n,
          createdAt: parseCreatedAt(n.createdAt),
        })),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ notificationId }) => ({ type: 'Notification' as const, id: notificationId })),
              { type: 'Notification', id: 'LIST' },
            ]
          : [{ type: 'Notification', id: 'LIST' }],
    }),

    // Get notification by ID
    getNotificationById: builder.query<NotificationResponse, string>({
      query: (notificationId) => `/notifications/${notificationId}`,
      providesTags: (result, error, notificationId) => [
        { type: 'Notification', id: notificationId },
      ],
    }),

    // Mark notification as read
    markAsRead: builder.mutation<void, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/mark-read`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, notificationId) => [
        { type: 'Notification', id: notificationId },
        { type: 'Notification', id: 'LIST' },
      ],
    }),

    // Mark all notifications as read
    markAllAsRead: builder.mutation<void, void>({
      query: () => ({
        url: '/notifications/user/mark-all-read',
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),

    // Delete notification
    deleteNotification: builder.mutation<void, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, notificationId) => [
        { type: 'Notification', id: notificationId },
        { type: 'Notification', id: 'LIST' },
      ],
    }),

    // Delete all user notifications
    deleteAllUserNotifications: builder.mutation<void, void>({
      query: () => ({
        url: '/notifications/user',
        method: 'DELETE',
      }),
      invalidatesTags: ['Notification'],
    }),

    // Get unread count
    getUnreadCount: builder.query<{ data: number }, void>({
      query: () => '/notifications/user/unread-count',
      providesTags: ['Notification'],
    }),
  }),
})

export const {
  useCreateNotificationMutation,
  useGetUserNotificationsQuery,
  useGetNotificationByIdQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllUserNotificationsMutation,
  useGetUnreadCountQuery,
} = notificationApi

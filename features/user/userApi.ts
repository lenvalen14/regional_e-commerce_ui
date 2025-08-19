import { apiSlice } from '../../lib/api/apiSlice'

export interface User {
  userId: string
  userName: string
  email: string
  phone: string
  isActive: boolean
}

export interface UserFormData {
  userName?: string
  email?: string
  phone?: string
  isActive?: boolean
}

export interface CreateUserData {
  userName: string
  email: string
  phone: string
  password: string
  isActive: boolean
}

export interface ApiResponse<T> {
  message: string
  code: number
  data: T
  meta?: {
    page: number
    size: number
    totalElements: number
    totalPages: number
    last: boolean
  }
}

export interface UsersResponse {
  users: User[]
  meta: {
    page: number
    size: number
    totalElements: number
    totalPages: number
    last: boolean
  }
}

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users with pagination
    getUsers: builder.query<ApiResponse<User[]>, { page: number; size: number }>({
      query: ({ page, size }) => `/users?page=${page}&size=${size}`,
      providesTags: ['Users'],
    }),

    // Create new user
    createUser: builder.mutation<ApiResponse<User>, CreateUserData>({
      query: (userData) => ({
        url: '/users/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Users'],
    }),

    // Update user
    updateUser: builder.mutation<ApiResponse<User>, { userId: string; userData: Partial<User> }>({
      query: ({ userId, userData }) => ({
        url: `/users/${userId}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['Users'],
    }),

    // Delete user
    deleteUser: builder.mutation<ApiResponse<void>, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi

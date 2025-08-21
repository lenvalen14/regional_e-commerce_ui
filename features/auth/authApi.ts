import { apiSlice } from '../../lib/api/apiSlice'
import { setCredentials, logout } from './authSlice'
import { jwtDecode } from 'jwt-decode';

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  userName: string
  email: string
  password: string
  phone: string
}

export interface AuthResponse {
  user: {
    userId: string
    email: string
    userName: string
    role: string
  }
  token: string
  refreshToken: string
}

interface ProfileApiResponse {
    code: number;
    message: string;
    data: UserProfile;
}

export interface UserProfile {
  userId: string;
  email: string;
  userName: string;
  phone: string;
  avatar: string;
  role: string
}

// Forgot password types
export interface RequestPasswordOtpRequest {
  email: string
}

export interface RequestPasswordOtpResponse {
  code: number
  message: string
}

export interface VerifyPasswordOtpRequest {
  email: string
  otp: number
}

export interface VerifyPasswordOtpResponse {
  code: number
  message: string
}

export interface ResetPasswordRequest {
  email: string
  password: string
  confirmPassword: string
}

export interface ResetPasswordResponse {
  code: number
  message: string
}

export interface UpdateProfileRequest {
    id: string;
    data: {
        userName?: string;
        email?: string;
        phone?: string;
    }
}

interface DecodedToken {
  role: string;
  userId: string;
  sub: string;
  exp: number;
}

interface LoginApiResponse {
  message: string;
  code: number;
  data: {
    token: string;
    refreshToken: string;
  };
}


export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginApiResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled
          const { token, refreshToken } = data.data

          const decoded: DecodedToken = jwtDecode(token)

          const userBase = {
            userId: decoded.userId,
            email: decoded.sub,
            userName: decoded.sub.split("@")[0],
            role: decoded.role,
          }

          dispatch(
            setCredentials({
              user: userBase,
              token,
              refreshToken,
            })
          )

          const profileRes = await dispatch(
            authApi.endpoints.getProfile.initiate(undefined, {
              forceRefetch: true,
            })
          ).unwrap()

          const user = profileRes?.data
            ? { ...userBase, ...profileRes.data }
            : userBase


          dispatch(
            setCredentials({
              user,
              token,
              refreshToken,
            })
          )
        } catch (err) {
          console.error("Login failed:", err)
        }
      },
    }),

    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/users/register',
        method: 'POST',
        body: userData,
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled
          dispatch(setCredentials(data))
        } catch (error) {
          // Handle register error
          console.error('Registration failed:', error)
        }
      },
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled
        } finally {
          dispatch(logout())
          dispatch(apiSlice.util.resetApiState())
        }
      },
      invalidatesTags: ['Auth', 'Cart', 'Order'],
    }),

    getProfile: builder.query<ProfileApiResponse, void>({
      query: () => '/users/profile',
      providesTags: ['Auth'],
    }),

     getUserById: builder.query<UserProfile, string>({
        query: (id) => `/users/${id}`,
        providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),

    refreshToken: builder.mutation<{ token: string }, { refreshToken: string }>({
      query: ({ refreshToken }) => ({
        url: '/auth/refresh',
        method: 'POST',
        body: { refreshToken },
      }),
    }),
    
    updateProfile: builder.mutation<UserProfile, UpdateProfileRequest>({
        query: ({ id, data }) => ({
            url: `/users/${id}`,
            method: 'PUT',
            body: data,
        }),
        // Chuẩn hóa về UserProfile nếu API trả về dạng bọc { code, message, data }
        transformResponse: (response: ProfileApiResponse) => response.data,
        invalidatesTags: (result, error, { id }) => ['Auth', { type: 'Users', id }],
    }),

    // Forgot password flow
    requestPasswordOtp: builder.mutation<RequestPasswordOtpResponse, RequestPasswordOtpRequest>({
      query: (body) => ({
        url: '/passwords/send-otp',
        method: 'POST',
        body,
      }),
    }),

    verifyPasswordOtp: builder.mutation<VerifyPasswordOtpResponse, VerifyPasswordOtpRequest>({
      query: (body) => ({
        url: '/passwords/verify-otp',
        method: 'POST',
        body,
      }),
    }),

    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: (body) => ({
        url: '/passwords/forgot-password',
        method: 'POST',
        body,
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useGetUserByIdQuery,
  useRefreshTokenMutation,
  useUpdateProfileMutation,
  useRequestPasswordOtpMutation,
  useVerifyPasswordOtpMutation,
  useResetPasswordMutation,
} = authApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../store'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
    prepareHeaders: (headers, { getState, endpoint }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }

      // Skip setting Content-Type for endpoints that need to send FormData
      const skipContentTypeEndpoints = ['createNews', 'createProduct', 'updateProduct']
      if (!skipContentTypeEndpoints.includes(endpoint)) {
        headers.set("Content-Type", "application/json")
      }
      return headers
    },
  }),
  tagTypes: ['Product', 'Cart', 'Order', 'Users', 'Auth', 'Address', 'Notification', 'Region', 'Category'],
  endpoints: (builder) => ({})
})
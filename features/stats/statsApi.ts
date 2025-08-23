import { apiSlice } from '../../lib/api/apiSlice'
import { User } from '../user'

export interface StatItem {
  value: number
  change: number
  unit: string
}

export interface OverviewStats {
  totalUsers: StatItem
  totalProducts: StatItem
  totalRevenue: StatItem
  pendingOrders: StatItem
}

export interface MonthlyRevenue {
  month: number
  year: number
  total: number
}

export interface Order {
  orderId: string
  userResponse: User
  totalAmount: number
  status: string
  orderDate: string
  updatedAt: string
}

export interface RevenueStats {
  revenues: MonthlyRevenue[]
  recentOrders: Order[]
}


export const statsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOverviewStats: builder.query<OverviewStats, void>({
      query: () => '/stats/overview',
      providesTags: ['Stats'],
    }),
    getRevenueStats: builder.query<RevenueStats, void>({
      query: () => '/stats/revenue',
      providesTags: ['Stats'],
    }),
  }),
})

export const { useGetOverviewStatsQuery, useGetRevenueStatsQuery } = statsApi

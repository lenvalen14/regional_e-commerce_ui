"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Star, TrendingUp, Users } from "lucide-react"
import { useGetGlobalReviewStatsQuery } from "@/features/review/reviewApi"

export default function ReviewStats() {
  const { data: stats, isLoading, isError } = useGetGlobalReviewStatsQuery()

  if (isLoading) {
    return <div className="text-center text-muted-foreground">Đang tải thống kê...</div>
  }

  if (isError || !stats) {
    return <div className="text-center text-red-500">Không thể tải dữ liệu</div>
  }

  // Map API response thành ratingCounts để truy cập dễ dàng
  const ratingCounts = {
    5: stats.fiveStarCount ?? 0,
    4: stats.fourStarCount ?? 0,
    3: stats.threeStarCount ?? 0,
    2: stats.twoStarCount ?? 0,
    1: stats.oneStarCount ?? 0,
  }

  // đảm bảo averageRating luôn là số
  const avg = typeof stats.averageRating === "number" ? stats.averageRating.toFixed(1) : "0.0"

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Tổng đánh giá */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng đánh giá</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalReviews}</div>
          <p className="text-xs text-muted-foreground">
            Từ {stats.uniqueCustomers} khách hàng
          </p>
        </CardContent>
      </Card>

      {/* Đánh giá TB */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Đánh giá TB</CardTitle>
          <Star className="h-4 w-4 text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{avg}/5</div>
          <p className="text-xs text-muted-foreground">
            {ratingCounts[5]} đánh giá 5 sao
          </p>
        </CardContent>
      </Card>

      {/* Đánh giá cao (4-5 sao) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Đánh giá cao</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {ratingCounts[5] + ratingCounts[4]}
          </div>
          <p className="text-xs text-muted-foreground">
            4-5 sao (
            {stats.totalReviews > 0
              ? Math.round(((ratingCounts[5] + ratingCounts[4]) / stats.totalReviews) * 100)
              : 0}
            %)
          </p>
        </CardContent>
      </Card>

      {/* Khách hàng */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.uniqueCustomers}</div>
          <p className="text-xs text-muted-foreground">Đã đánh giá sản phẩm</p>
        </CardContent>
      </Card>
    </div>
  )
}

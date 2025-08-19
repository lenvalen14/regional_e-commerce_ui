'use client'

import { useState, useEffect } from "react"
import ReviewStats from "./ReviewStats"
import ReviewSearch from "./ReviewSearch"
import ReviewList from "./ReviewList"

import {
  useGetReviewsByRatingAndCategoryQuery,
  useGetGlobalReviewStatsQuery,
  ReviewResponse,
} from "@/features/review/reviewApi"

// Define interfaces
interface SearchFilters {
  searchTerm: string
  rating: string
  category: string
}

export default function AdminReviewsPage() {
  const { refetch: refetchStats } = useGetGlobalReviewStatsQuery()
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    searchTerm: "",
    rating: "all",
    category: "all",
  })
  const [reviews, setReviews] = useState<ReviewResponse[]>([])
  const [filteredReviews, setFilteredReviews] = useState<ReviewResponse[]>([])

  const { data, isLoading, isError, refetch } =
    useGetReviewsByRatingAndCategoryQuery({
      rating:
        searchFilters.rating === "all"
          ? undefined
          : Number(searchFilters.rating),
      categoryId:
        searchFilters.category === "all"
          ? undefined
          : searchFilters.category,
      page: 0,
      size: 10,
    })

  // ✅ Cập nhật reviews khi có data mới
  useEffect(() => {
    if (isError) {
      setReviews([])
      setFilteredReviews([])
      return
    }

    if (data?.reviews) {
      setReviews(data.reviews)
      setFilteredReviews(data.reviews)
    }
  }, [data, isError])

  // ✅ In ra filter khi thay đổi + refetch API (cho rating/category)
  useEffect(() => {
    console.log("🔥 Filter thay đổi:", searchFilters)
    refetch()
  }, [searchFilters.rating, searchFilters.category, refetch])

  // ✅ Lọc theo searchTerm (chỉ filter local, không gọi API)
  useEffect(() => {
    if (!searchFilters.searchTerm) {
      setFilteredReviews(reviews)
    } else {
      const keyword = searchFilters.searchTerm.toLowerCase()
      setFilteredReviews(
        reviews.filter(
          (r) =>
            r.user.userName?.toLowerCase().includes(keyword) ||
            r.product.productName?.toLowerCase().includes(keyword) ||
            r.comment?.toLowerCase().includes(keyword)
        )
      )
    }
  }, [searchFilters.searchTerm, reviews])

  const handleSearchChange = (field: keyof SearchFilters, value: string) => {
    setSearchFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleReset = () => {
    setSearchFilters({ searchTerm: "", rating: "all", category: "all" })
  }

  if (isLoading) return <div>Đang tải...</div>

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Quản Lý Review Admin
        </h2>
      </div>

      {/* Thống kê */}
      <ReviewStats />

      {/* Bộ lọc */}
      <ReviewSearch
        searchFilters={searchFilters}
        onSearchChange={handleSearchChange}
        onReset={handleReset}
      />

      {/* Danh sách review */}
      <ReviewList
        reviews={filteredReviews}
        onDeleteSuccess={() => {
          // gọi refetch thủ công khi xóa xong
          refetchStats()
        }} />
    </div>
  )
}

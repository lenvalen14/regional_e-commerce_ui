"use client";

import { useState, useMemo } from "react";
import {
  useGetReviewsByProductQuery,
  ReviewResponse,
} from "@/features/review/reviewApi";
import { ArticleComments } from "@/components/products/ArticleComments";

// ⭐ Component hiển thị sao với rating thập phân
function StarRating({ rating, size = "w-4 h-4" }: { rating: number; size?: string }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const fillPercentage = Math.min(Math.max(rating - star + 1, 0), 1) * 100;
        return (
          <div key={star} className={`relative ${size}`}>
            <svg className={`${size} fill-gray-200 absolute`} viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <svg
              className={`${size} fill-yellow-400 absolute`}
              viewBox="0 0 24 24"
              style={{ clipPath: `inset(0 ${100 - fillPercentage}% 0 0)` }}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        );
      })}
    </div>
  );
}

// 🗓 Format ngày
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { data, isLoading, isError, refetch } = useGetReviewsByProductQuery({
    productId,
    page: 0,
    size: 500,
  });

  // Nếu lỗi hoặc không có data → fallback mảng rỗng
  const reviews = !isError && data?.reviews ? data.reviews : [];

  const [ratingFilter, setRatingFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("newest");

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

  // Thống kê phân bố rating (luôn hiển thị 5 → 1 sao, kể cả khi không có data)
  const ratingDistribution = useMemo(() => {
    return [5, 4, 3, 2, 1].map((rating) => {
      const count = reviews.filter((review) => review.rating === rating).length;
      const percentage =
        totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
      return { rating, count, percentage };
    });
  }, [reviews, totalReviews]);

  // Lọc + sắp xếp
  const filteredReviews = useMemo(() => {
    let filtered = [...reviews];
    if (ratingFilter !== "all") {
      filtered = filtered.filter(
        (review) => review.rating === parseInt(ratingFilter)
      );
    }
    filtered.sort((a, b) => {
      const dateA = new Date(a.createAt).getTime();
      const dateB = new Date(b.createAt).getTime();
      return timeFilter === "newest" ? dateB - dateA : dateA - dateB;
    });
    return filtered;
  }, [reviews, ratingFilter, timeFilter]);

  return (
    <div className="mt-8 border-t border-[#e0e0e0] pt-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bên trái: Thống kê rating */}
        <div className="lg:col-span-1">
          <div className="bg-gray-40 p-6 rounded-lg">
            <h3 className="font-nitti text-lg font-bold text-[#222] mb-4">
              Đánh giá của khách hàng
            </h3>

            {/* Overall rating */}
            <div className="flex items-center gap-2 mb-2">
              <StarRating rating={averageRating} />
              <span className="font-nitti font-bold text-[#222]">
                {averageRating.toFixed(1)} trên 5
              </span>
            </div>

            <p className="text-sm text-[#666] font-nitti mb-4">
              {totalReviews.toLocaleString()} đánh giá
            </p>

            {/* Rating distribution */}
            <div className="space-y-2">
              {ratingDistribution.map(({ rating, percentage, count }) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm font-nitti text-[#222] w-10">
                    {rating} sao
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-300 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-nitti text-[#222] w-8">
                    {count}
                  </span>
                </div>
              ))}
            </div>

            {isLoading && (
              <p className="text-sm text-gray-500 mt-2">Đang tải dữ liệu...</p>
            )}
            {isError && (
              <p className="text-sm text-red-500 mt-2">
                Chưa có đánh giá nào
              </p>
            )}
          </div>
        </div>

        {/* Form tạo review */}
        <div className="lg:col-span-2">
          <ArticleComments
            productId={productId}
            reviews={filteredReviews}
            refetch={refetch}
            isLoading={isLoading}
            isError={isError}
          />
        </div>
      </div>
    </div >
  );
}

export { StarRating };

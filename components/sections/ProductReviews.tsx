"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Component hiển thị sao với rating thập phân
function StarRating({ rating, size = "w-4 h-4" }: { rating: number; size?: string }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const fillPercentage = Math.min(Math.max(rating - star + 1, 0), 1) * 100;
        
        return (
          <div key={star} className={`relative ${size}`}>
            {/* Background star (gray) */}
            <svg className={`${size} fill-gray-200 absolute`} viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            
            {/* Foreground star (yellow) with clip-path for partial fill */}
            <svg 
              className={`${size} fill-yellow-400 absolute`} 
              viewBox="0 0 24 24"
              style={{
                clipPath: `inset(0 ${100 - fillPercentage}% 0 0)`
              }}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
        );
      })}
    </div>
  );
}

// Function format ngày
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  });
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

interface ProductReviewsProps {
  productId: string;
}

// Mock data reviews
const MOCK_REVIEWS: Review[] = [
  {
    id: "1",
    userName: "Trịnh Trần Phương Tuấn",
    rating: 5,
    comment: "Sản phẩm rất tuyệt vời, mỗi khi ăn tôi lại nhớ đến bé Sol nhà tôi!",
    date: "2024-01-15",
  },
  {
    id: "2", 
    userName: "Trần Nguyễn Thiên An",
    rating: 4,
    comment: "Đóng gói cẩn thận, hương vị làm tôi gợi nhớ mùa đông năm ấy anh ấy và tôi cùng đi ăn !",
    date: "2024-01-10"
  },
  {
    id: "3",
    userName: "Vũ Đinh Trọng Thắng", 
    rating: 5,
    comment: "Đặc sản ngon, ngọt ngào hơn cả band nhạc của tôi",
    date: "2024-01-08"
  },
  {
    id: "4",
    userName: "Soobin Hoàng Sơn", 
    rating: 4,
    comment: "Chất lượng tốt, mình cùng nhau dancing in the darkx3",
    date: "2024-01-05"
  },
  {
    id: "5",
    userName: "Hoàng Văn E", 
    rating: 5,
    comment: "Rất hài lòng với sản phẩm này!",
    date: "2024-01-03"
  },
  {
    id: "6",
    userName: "Vũ Thị F", 
    rating: 3,
    comment: "Sản phẩm tạm ổn, có thể cải thiện thêm.",
    date: "2024-01-01"
  },
  {
    id: "7",
    userName: "Đỗ Văn G", 
    rating: 5,
    comment: "Tuyệt vời! Sẽ giới thiệu cho bạn bè.",
    date: "2023-12-28"
  }
];

const RATING_FILTERS = [
  { value: "all", label: "Tất cả đánh giá" },
  { value: "5", label: "5 sao" },
  { value: "4", label: "4 sao" },
  { value: "3", label: "3 sao" },
  { value: "2", label: "2 sao" },
  { value: "1", label: "1 sao" }
];

const TIME_FILTERS = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" }
];

function ReviewItem({ review }: { review: Review }) {
  return (
    <div className="border-b border-[#f0f0f0] pb-6 last:border-b-0">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-[#8FBC8F] flex items-center justify-center text-white font-nitti font-bold">
          {review.userName.charAt(0)}
        </div>
        
        {/* Review Content */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-nitti font-bold text-[#222]">{review.userName}</h3>
            <StarRating rating={review.rating} />
            <span className="text-sm text-[#666] font-nitti">{formatDate(review.date)}</span>
          </div>
          <p className="text-[#4C5C4C] font-nitti leading-relaxed">{review.comment}</p>
        </div>
      </div>
    </div>
  );
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [ratingFilter, setRatingFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("newest");
  
  const reviews = MOCK_REVIEWS;
  
  // Tính toán thống kê rating
  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
  
  // Thống kê phân bố rating
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(review => review.rating === rating).length;
    const percentage = Math.round((count / totalReviews) * 100);
    return { rating, count, percentage };
  });

  // Lọc và sắp xếp reviews cho dialog
  const getFilteredReviews = () => {
    let filtered = reviews;
    
    // Lọc theo rating
    if (ratingFilter !== "all") {
      filtered = filtered.filter(review => review.rating === parseInt(ratingFilter));
    }
    
    // Sắp xếp theo thời gian
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return timeFilter === "newest" ? dateB - dateA : dateA - dateB;
    });
    
    return filtered;
  };

  // Hiển thị 4 đánh giá đầu tiên
  const displayedReviews = reviews.slice(0, 4);
  const filteredReviews = getFilteredReviews();

  return (
    <div className="mt-8 border-t border-[#e0e0e0] pt-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bên trái: Thống kê rating */}
        <div className="lg:col-span-1">
          <div className="bg-gray-40 p-6 rounded-lg">
            <h3 className="font-nitti text-lg font-bold text-[#222] mb-4">Đánh giá của khách hàng</h3>
            
            {/* Overall rating với sao thập phân */}
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
              {ratingDistribution.map(({ rating, count, percentage }) => (
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
                    {percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bên phải: Danh sách đánh giá (4 cái đầu) */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {displayedReviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </div>
          
          {/* Nút xem thêm - Dialog */}
          <div className="mt-6 text-center">
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-[#8FBC8F] hover:text-[#7CA87C] font-nitti font-bold tracking-widest transition-colors">
                  Xem thêm đánh giá ({totalReviews - 4} còn lại)
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-beaululo text-xl text-[#222] uppercase tracking-widest">
                    Tất cả đánh giá ({totalReviews})
                  </DialogTitle>
                </DialogHeader>
                
                {/* Bộ lọc */}
                <div className="flex gap-4 mb-6 pt-4">
                  <div className="flex-1">
                    <label className="block text-sm font-nitti font-bold text-[#222] mb-2">
                      Lọc theo đánh giá
                    </label>
                    <Select value={ratingFilter} onValueChange={setRatingFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {RATING_FILTERS.map((filter) => (
                          <SelectItem key={filter.value} value={filter.value}>
                            {filter.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-sm font-nitti font-bold text-[#222] mb-2">
                      Sắp xếp theo
                    </label>
                    <Select value={timeFilter} onValueChange={setTimeFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_FILTERS.map((filter) => (
                          <SelectItem key={filter.value} value={filter.value}>
                            {filter.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Danh sách đánh giá đã lọc */}
                <div className="space-y-6">
                  {filteredReviews.length > 0 ? (
                    filteredReviews.map((review) => (
                      <ReviewItem key={review.id} review={review} />
                    ))
                  ) : (
                    <p className="text-center text-[#666] font-nitti py-8">
                      Không có đánh giá nào phù hợp với bộ lọc
                    </p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}

export { StarRating };
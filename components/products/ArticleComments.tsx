'use client'

import { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { ThumbsUp, Send } from 'lucide-react'
import {
  useCreateReviewMutation,
  ReviewResponse,
} from '@/features/review/reviewApi'

// ⭐ Hiển thị rating bằng sao
function StarRating({ rating, size = "w-4 h-4" }: { rating: number; size?: string }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const fillPercentage = Math.min(Math.max(rating - star + 1, 0), 1) * 100
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
        )
      })}
    </div>
  )
}

interface ArticleCommentsProps {
  productId: string
  reviews: ReviewResponse[]
  refetch: () => void
  isLoading: boolean
  isError: boolean
}

export function ArticleComments({
  productId,
  reviews,
  refetch,
  isLoading,
  isError,
}: ArticleCommentsProps) {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  const [createReview, { isLoading: isPosting }] = useCreateReviewMutation()

  // Form state
  const [newComment, setNewComment] = useState('')
  const [rating, setRating] = useState(5)

  // Pagination state cho bình luận
  const [visibleCount, setVisibleCount] = useState(3)

  // Submit review
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      await createReview({
        productId,
        rating,
        comment: newComment,
      }).unwrap()

      setNewComment('')
      setRating(5)
      refetch() // 🔄 gọi lại từ ProductReviews
    } catch (err) {
      console.error('Error creating review', err)
    }
  }

  return (
    <section ref={ref} className="py-20 bg-white border-t border-[#e0e0e0]">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div
          className={`text-center mb-16 ${inView ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-700`}
        >
          <h3 className="text-2xl md:text-3xl font-beaululo text-[#222] mb-4 tracking-widest uppercase">
            Bình luận ({reviews.length})
          </h3>
          <div className="w-16 h-px bg-[#8FBC8F] mx-auto" />
        </div>

        {/* Comment Form */}
        <div
          className={`mb-16 ${inView ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-700 delay-200`}
        >
          <form
            onSubmit={handleSubmitComment}
            className="border border-[#e0e0e0] bg-white p-8 space-y-4"
          >
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-[#f5f5f5] rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Chia sẻ suy nghĩ của bạn..."
                  className="w-full p-4 border border-[#e0e0e0] focus:border-[#8FBC8F] focus:outline-none transition-colors duration-300 resize-none font-nitti"
                  rows={4}
                />

                {/* Rating Selector */}
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-sm text-gray-600">{rating}/5</span>
                </div>

                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={!newComment.trim() || isPosting}
                    className="bg-[#8FBC8F] text-white px-6 py-3 font-nitti text-sm tracking-widest uppercase hover:bg-[#7aa87a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {isPosting ? 'Đang gửi...' : 'Gửi'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Comments List */}
        {isLoading && (
          <p className="text-center text-gray-500">Đang tải bình luận...</p>
        )}
        {isError && (
          <p className="text-center text-gray-500">Hiện chưa có bình luận nào</p>
        )}

        <div className="space-y-12">
          {reviews.slice(0, visibleCount).map((review, index) => (
            <div
              key={review.reviewId}
              className={`${inView ? 'opacity-100' : 'opacity-0'
                } transition-opacity duration-700`}
              style={{ transitionDelay: `${(index + 1) * 300}ms` }}
            >
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-[#f5f5f5] rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <div className="bg-white border border-[#e0e0e0] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <h5 className="font-beaululo text-[#222] text-sm tracking-widest uppercase">
                          {review.user.userName}
                        </h5>
                        <span className="text-xs text-[#888] font-nitti">
                          {new Date(review.createAt).toLocaleString('vi-VN')}
                        </span>
                      </div>
                      <button className="flex items-center gap-1 text-xs text-[#888] hover:text-[#8FBC8F] transition-colors duration-300 font-nitti">
                        <ThumbsUp className="h-3 w-3" />
                        {0}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <StarRating rating={review.rating} />
                      <span className="text-sm font-nitti text-[#222]">
                        {review.rating}/5
                      </span>
                    </div>

                    <p className="text-[#444] leading-relaxed mb-4 font-nitti">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load more button */}
        {visibleCount < reviews.length && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setVisibleCount((prev) => prev + 3)}
              className="px-6 py-2 border border-[#8FBC8F] text-[#8FBC8F] font-nitti uppercase tracking-widest hover:bg-[#8FBC8F] hover:text-white transition-all duration-300"
            >
              Xem thêm bình luận
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

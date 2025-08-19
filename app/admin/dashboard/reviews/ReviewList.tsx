import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Star, User, Package, Trash2, Calendar, MessageSquare } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

import {
  useDeleteReviewMutation,
  ReviewResponse,
} from "@/features/review/reviewApi"

interface ReviewListProps {
  reviews: ReviewResponse[]
  onDeleteSuccess?: () => void
}

export default function ReviewList({ reviews, onDeleteSuccess }: ReviewListProps) {
  const { toast } = useToast()
  const [deleteReview] = useDeleteReviewMutation()
  const [localReviews, setLocalReviews] = useState<ReviewResponse[]>(reviews)

  // Đồng bộ khi props reviews thay đổi (ví dụ khi filter)
  useEffect(() => {
    setLocalReviews(reviews)
  }, [reviews])

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
        <span className="ml-1 text-sm font-medium text-gray-600">({rating}/5)</span>
      </div>
    )
  }

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReview(reviewId).unwrap()
      setLocalReviews((prev) =>
        prev.filter((review) => review.reviewId !== reviewId)
      )
      // toast({
      //   title: "Xóa thành công",
      //   description: "Đánh giá đã được xóa khỏi danh sách.",
      // })
      onDeleteSuccess?.()
      alert("Xóa review thành công!");
    } catch (err) {
      console.error("Lỗi khi xóa review:", err)
      // toast({
      //   title: "Lỗi",
      //   description: "Không thể xóa đánh giá, vui lòng thử lại.",
      //   variant: "destructive",
      // })
      alert("Có lỗi khi xóa review!");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách đánh giá ({localReviews.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {localReviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Không tìm thấy đánh giá nào</p>
            </div>
          ) : (
            localReviews.map((review) => (
              <div key={review.reviewId} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{review.user.userName}</h4>
                        <p className="text-sm text-gray-500">{review.user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {review.createAt}
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">{review.product.productName}</span>
                  </div>

                  {/* Rating and Title */}
                  <div className="space-y-2">
                    {renderStars(review.rating)}
                    <h5 className="font-medium text-gray-900">{review.comment}</h5>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="text-xs text-gray-500">
                      ID: {review.reviewId}
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Xóa
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xác nhận xóa đánh giá</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc chắn muốn xóa đánh giá này không? Hành động này không thể hoàn tác.
                              <br /><br />
                              <strong>Đánh giá:</strong> {review.comment}
                              <br />
                              <strong>Khách hàng:</strong> {review.user.userName}
                              <br />
                              <strong>Sản phẩm:</strong> {review.product.productName}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteReview(review.reviewId)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Xóa đánh giá
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

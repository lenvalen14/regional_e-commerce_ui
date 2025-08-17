import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Star, User, Package, Trash2, Calendar, MessageSquare } from "lucide-react"

interface Review {
  id: string
  customer: {
    name: string
    email: string
  }
  product: {
    id: string
    name: string
    category: string
  }
  rating: number
  title: string
  comment: string
  date: string
}

interface ReviewListProps {
  reviews: Review[]
  onDeleteReview: (reviewId: string) => void
}

export default function ReviewList({ reviews, onDeleteReview }: ReviewListProps) {
  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium text-gray-600">({rating}/5)</span>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách đánh giá ({reviews.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Không tìm thấy đánh giá nào</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{review.customer.name}</h4>
                        <p className="text-sm text-gray-500">{review.customer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {review.date}
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">{review.product.name}</span>
                    <Badge variant="outline" className="text-xs">{review.product.category}</Badge>
                  </div>

                  {/* Rating and Title */}
                  <div className="space-y-2">
                    {renderStars(review.rating)}
                    <h5 className="font-medium text-gray-900">{review.title}</h5>
                  </div>

                  {/* Comment */}
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="text-xs text-gray-500">
                      ID: {review.id}
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
                              <strong>Đánh giá:</strong> {review.title}
                              <br />
                              <strong>Khách hàng:</strong> {review.customer.name}
                              <br />
                              <strong>Sản phẩm:</strong> {review.product.name}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDeleteReview(review.id)}
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

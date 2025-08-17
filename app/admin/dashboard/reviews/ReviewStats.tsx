import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Star, TrendingUp, Users } from "lucide-react"

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

interface ReviewStatsProps {
  reviews: Review[]
}

export default function ReviewStats({ reviews }: ReviewStatsProps) {
  const totalReviews = reviews.length
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0"
  
  const ratingCounts = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  }

  const uniqueCustomers = new Set(reviews.map(r => r.customer.email)).size

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng đánh giá</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalReviews}</div>
          <p className="text-xs text-muted-foreground">
            Từ {uniqueCustomers} khách hàng
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Đánh giá TB</CardTitle>
          <Star className="h-4 w-4 text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{averageRating}/5</div>
          <p className="text-xs text-muted-foreground">
            {ratingCounts[5]} đánh giá 5 sao
          </p>
        </CardContent>
      </Card>

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
            4-5 sao ({Math.round(((ratingCounts[5] + ratingCounts[4]) / totalReviews) * 100)}%)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{uniqueCustomers}</div>
          <p className="text-xs text-muted-foreground">
            Đã đánh giá sản phẩm
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

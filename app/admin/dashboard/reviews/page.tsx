"use client"

import { useState } from "react"
import ReviewStats from "./ReviewStats"
import ReviewSearch from "./ReviewSearch"
import ReviewList from "./ReviewList"

// Define interfaces
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

interface SearchFilters {
  searchTerm: string
  rating: string
  category: string
}

// Sample reviews data
const initialReviewsData: Review[] = [
  {
    id: "RV001",
    customer: {
      name: "Nguyễn Thị Mai",
      email: "mainguyen@email.com"
    },
    product: {
      id: "SP001",
      name: "Bánh tráng nướng Tây Ninh",
      category: "Bánh kẹo"
    },
    rating: 5,
    title: "Rất ngon và chất lượng",
    comment: "Bánh tráng nướng rất thơm ngon, vị đậm đà đặc trưng của Tây Ninh. Đóng gói cẩn thận, giao hàng nhanh. Sẽ mua lại lần sau!",
    date: "20/03/2024"
  },
  {
    id: "RV002",
    customer: {
      name: "Trần Văn Hùng",
      email: "hungtran@email.com"
    },
    product: {
      id: "SP002",
      name: "Mắm ruốc Huế",
      category: "Gia vị"
    },
    rating: 4,
    title: "Mắm ruốc chất lượng tốt",
    comment: "Mắm ruốc có vị đậm đà, thơm ngon. Chỉ có điều hơi mặn so với khẩu vị của tôi. Nhưng nhìn chung vẫn rất hài lòng.",
    date: "19/03/2024"
  },
  {
    id: "RV003",
    customer: {
      name: "Lê Thị Hồng",
      email: "hongle@email.com"
    },
    product: {
      id: "SP003",
      name: "Chà bông Đà Lạt",
      category: "Thực phẩm khô"
    },
    rating: 3,
    title: "Tạm ổn",
    comment: "Chà bông có vị ngon nhưng hơi khô, không mềm như mong đợi. Giá cả hợp lý.",
    date: "18/03/2024"
  },
  {
    id: "RV004",
    customer: {
      name: "Phạm Minh Tuấn",
      email: "tuanpham@email.com"
    },
    product: {
      id: "SP004",
      name: "Bánh pía Sóc Trăng",
      category: "Bánh kẹo"
    },
    rating: 5,
    title: "Bánh pía ngon tuyệt vời",
    comment: "Bánh pía Sóc Trăng này quá ngon! Vỏ bánh mỏng giòn, nhân thập cẩm đậm đà. Đúng như những gì tôi đã ăn tại Sóc Trăng.",
    date: "17/03/2024"
  },
  {
    id: "RV005",
    customer: {
      name: "Ngô Thị Lan",
      email: "lanago@email.com"
    },
    product: {
      id: "SP005",
      name: "Nem nướng Nha Trang",
      category: "Thực phẩm khô"
    },
    rating: 2,
    title: "Không đúng như mong đợi",
    comment: "Nem nướng không thơm như quảng cáo, hơi khô và mặn. Có thể do vận chuyển lâu nên không còn tươi ngon.",
    date: "16/03/2024"
  },
  {
    id: "RV006",
    customer: {
      name: "Vũ Đình Nam",
      email: "namvu@email.com"
    },
    product: {
      id: "SP006",
      name: "Cà phê Buôn Ma Thuột",
      category: "Đồ uống"
    },
    rating: 5,
    title: "Cà phê thơm ngon đậm đà",
    comment: "Cà phê Buôn Ma Thuột nguyên chất, rang vừa tới, hương thơm đặc trưng. Pha lên rất ngon, đúng chuẩn cao nguyên.",
    date: "15/03/2024"
  },
  {
    id: "RV007",
    customer: {
      name: "Trương Thị Kim",
      email: "kimtruong@email.com"
    },
    product: {
      id: "SP007",
      name: "Kẹo dừa Bến Tre",
      category: "Bánh kẹo"
    },
    rating: 4,
    title: "Kẹo dừa thơm ngon",
    comment: "Kẹo dừa có vị béo ngậy, ngọt dịu, không quá ngọt. Đúng chuẩn kẹo dừa Bến Tre truyền thống.",
    date: "14/03/2024"
  },
  {
    id: "RV008",
    customer: {
      name: "Đặng Văn Long",
      email: "longdang@email.com"
    },
    product: {
      id: "SP008",
      name: "Tôm khô Cà Mau",
      category: "Thực phẩm khô"
    },
    rating: 5,
    title: "Tôm khô chất lượng cao",
    comment: "Tôm khô Cà Mau rất tươi ngon, thịt chắc, vị ngọt tự nhiên. Dùng nấu canh chua rất ngon.",
    date: "13/03/2024"
  }
]

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(initialReviewsData)
  const [filteredReviews, setFilteredReviews] = useState<Review[]>(initialReviewsData)
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    searchTerm: "",
    rating: "all",
    category: "all"
  })

  // Handle search and filter
  const handleSearch = (filters: SearchFilters) => {
    let filtered = reviews

    // Search by customer name, product name, or comment
    if (filters.searchTerm) {
      filtered = filtered.filter(review =>
        review.customer.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        review.product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        review.title.toLowerCase().includes(filters.searchTerm.toLowerCase())
      )
    }

    // Filter by rating
    if (filters.rating !== "all") {
      filtered = filtered.filter(review => review.rating.toString() === filters.rating)
    }

    // Filter by category
    if (filters.category !== "all") {
      filtered = filtered.filter(review => review.product.category === filters.category)
    }

    setFilteredReviews(filtered)
  }

  const handleSearchChange = (field: keyof SearchFilters, value: string) => {
    const newFilters = { ...searchFilters, [field]: value }
    setSearchFilters(newFilters)
    handleSearch(newFilters)
  }

  const handleReset = () => {
    const resetFilters = {
      searchTerm: "",
      rating: "all",
      category: "all"
    }
    setSearchFilters(resetFilters)
    setFilteredReviews(reviews)
  }

  // Handle delete review
  const handleDeleteReview = (reviewId: string) => {
    const updatedReviews = reviews.filter(review => review.id !== reviewId)
    const updatedFiltered = filteredReviews.filter(review => review.id !== reviewId)
    setReviews(updatedReviews)
    setFilteredReviews(updatedFiltered)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Quản Lý Đánh Giá</h2>
      </div>

      {/* Statistics */}
      <ReviewStats reviews={reviews} />

      {/* Search and Filters */}
      <ReviewSearch 
        searchFilters={searchFilters}
        onSearchChange={handleSearchChange}
        onReset={handleReset}
      />

      {/* Reviews List */}
      <ReviewList 
        reviews={filteredReviews}
        onDeleteReview={handleDeleteReview}
      />
    </div>
  )
}

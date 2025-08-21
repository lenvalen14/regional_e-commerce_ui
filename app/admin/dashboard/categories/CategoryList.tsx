"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, Package } from "lucide-react"
import { useGetCategoriesQuery, Category } from "@/features/category/categoryApi"

// interface Category {
//   id: number
//   name: string
//   description: string
//   productCount: number
//   status: string
//   image: string
// }

interface CategoryListProps {
  categories: Category[]
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
  onView?: (category: Category) => void
}

export default function CategoryList({ categories, onEdit, onDelete, onView }: CategoryListProps) {
  // const { data, isLoading, isError } = useGetCategoriesQuery({ page: 0, size: 20 })
  // const categories = data?.data || []

  // if (isLoading) return <p>Đang tải dữ liệu...</p>
  // if (isError) return <p>Lỗi khi tải dữ liệu danh mục</p>
  if (!categories || categories.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy danh mục</h3>
          <p className="text-gray-600">Không có danh mục nào phù hợp.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Card key={category.categoryId} className="overflow-hidden hover:shadow-lg transition-all duration-200 group">
          <CardContent className="p-6">
            {/* Category Content */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">
                  {category.categoryName}
                </h3>
                <Badge
                  // variant={category.status === "Active" ? "default" : "secondary"}
                  className=
                  // category.status === "Active"
                  "bg-green-100 text-green-800"
                // : "bg-gray-100 text-gray-800"
                // }
                >
                  {/* {category.status === "Active" ? "Hoạt động" : "Tạm dừng"} */}
                  Hoạt động
                </Badge>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
              {category.description || "Không có mô tả"}
            </p>

            {/* Product Count */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {category.productCount} sản phẩm
                </span>
              </div>

              {/* Product Count Badge */}
              <Badge
                variant="outline"
                className={
                  category.productCount === 0
                    ? "text-red-600 border-red-200"
                    : category.productCount > 20
                      ? "text-green-600 border-green-200"
                      : "text-blue-600 border-blue-200"
                }
              >
                {category.productCount === 0
                  ? "Trống"
                  : category.productCount > 20
                    ? "Nhiều SP"
                    : "Ít SP"
                }
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                {onView && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(category)}
                    className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(category)}
                  className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(category)}
                  className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Category ID */}
              <span className="text-xs text-gray-400">ID: {category.categoryId}</span>
            </div>
          </CardContent>
        </Card>
      ))
      }
    </div >
  )
}

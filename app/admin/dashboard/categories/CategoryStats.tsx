"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FolderOpen, Package, TrendingUp, AlertTriangle } from "lucide-react"
import { Category, useGetCategoriesQuery } from "@/features/category/categoryApi"

// interface Category {
//   id: number
//   name: string
//   description: string
//   productCount: number
//   status: string
//   image: string
// }


export default function CategoryStats() {

  const { data, isLoading, isError } = useGetCategoriesQuery({ page: 0, size: 20 })
  const categories = data?.data || []
  if (isLoading) {
    return <p>Đang tải dữ liệu...</p>
  }

  if (isError) {
    return <p>Lỗi khi tải dữ liệu danh mục</p>
  }
  // Calculate statistics
  const totalCategories = categories.length
  const totalProducts = categories.reduce((sum, c) => sum + (c.productCount || 0), 0)
  const categoriesWithoutProducts = categories.filter(c => c.productCount === 0).length
  const averageProductsPerCategory = totalCategories > 0 ? Math.round(totalProducts / totalCategories) : 0

  const topCategory = categories.reduce(
    (max, category) => (category.productCount > max.productCount ? category : max),
    { productCount: 0, categoryName: "Chưa có" }
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {/* Total Categories */}
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
            <FolderOpen className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{totalCategories}</p>
          <p className="text-sm text-gray-600">Tổng danh mục</p>

          {/* Breakdown */}
          <div className="flex items-center justify-center space-x-2 mt-3">
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              {totalCategories} hoạt động
            </Badge>
            {/* {inactiveCategories > 0 && (
              <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                {inactiveCategories} tạm dừng
              </Badge>
            )} */}
          </div>
        </CardContent>
      </Card>

      {/* Active Categories */}
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
            <FolderOpen className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{totalCategories}</p>
          <p className="text-sm text-gray-600">Đang hoạt động</p>

          {/* Percentage */}
          <div className="mt-3">
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              {totalCategories > 0 ? Math.round((totalCategories / totalCategories) * 100) : 0}% tổng số
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Total Products */}
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-3">
            <Package className="h-6 w-6 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{totalProducts}</p>
          <p className="text-sm text-gray-600">Tổng sản phẩm</p>

          {/* Average */}
          <div className="mt-3">
            <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
              TB: {averageProductsPerCategory} SP/danh mục
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Top Category */}
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{topCategory.productCount}</p>
          <p className="text-sm text-gray-600">Nhiều SP nhất</p>

          {/* Top category name */}
          <div className="mt-3">
            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 max-w-full truncate">
              {topCategory.categoryName}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Warning Card for Categories without Products */}
      {categoriesWithoutProducts > 0 && (
        <Card className="md:col-span-2 lg:col-span-4 border-amber-200 bg-amber-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-lg flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-amber-900 mb-1">
                  Danh mục không có sản phẩm
                </h4>
                <p className="text-sm text-amber-700 mb-3">
                  Có <strong>{categoriesWithoutProducts}</strong> danh mục chưa có sản phẩm nào.
                  Hãy thêm sản phẩm hoặc xem xét xóa các danh mục không sử dụng.
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories
                    .filter(c => c.productCount === 0)
                    .slice(0, 5) // Show max 5 categories
                    .map(category => (
                      <Badge
                        key={category.categoryId}
                        variant="outline"
                        className="bg-white text-amber-700 border-amber-300"
                      >
                        {category.categoryName}
                      </Badge>
                    ))}
                  {categoriesWithoutProducts > 5 && (
                    <Badge variant="outline" className="bg-white text-amber-700 border-amber-300">
                      +{categoriesWithoutProducts - 5} khác
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

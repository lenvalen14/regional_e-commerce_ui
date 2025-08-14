"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, FolderOpen } from "lucide-react"

// Sample categories data for Vietnamese specialties
const categoriesData = [
  {
    id: 1,
    name: "Bánh kẹo",
    description: "Các loại bánh và kẹo đặc sản",
    productCount: 45,
    status: "Active",
    image: "/banh-keo-category.png",
  },
  {
    id: 2,
    name: "Gia vị",
    description: "Gia vị và nước chấm truyền thống",
    productCount: 28,
    status: "Active",
    image: "/gia-vi-category.png",
  },
  {
    id: 3,
    name: "Thực phẩm khô",
    description: "Các loại thực phẩm sấy khô, chà bông",
    productCount: 32,
    status: "Active",
    image: "/thuc-pham-kho-category.png",
  },
  {
    id: 4,
    name: "Trái cây sấy",
    description: "Trái cây sấy dẻo các loại",
    productCount: 18,
    status: "Active",
    image: "/trai-cay-say-category.png",
  },
  {
    id: 5,
    name: "Nước mắm",
    description: "Nước mắm truyền thống các vùng miền",
    productCount: 12,
    status: "Inactive",
    image: "/nuoc-mam-category.png",
  },
]

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Quản Lý Danh Mục</h2>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Thêm danh mục mới
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoriesData.map((category) => (
          <Card key={category.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">{category.name}</h3>
                    <Badge
                      variant={category.status === "Active" ? "default" : "secondary"}
                      className={
                        category.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }
                    >
                      {category.status === "Active" ? "Hoạt động" : "Tạm dừng"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{category.productCount} sản phẩm</span>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <FolderOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{categoriesData.length}</p>
            <p className="text-sm text-gray-600">Tổng danh mục</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <FolderOpen className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {categoriesData.filter((c) => c.status === "Active").length}
            </p>
            <p className="text-sm text-gray-600">Đang hoạt động</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <FolderOpen className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {categoriesData.reduce((sum, c) => sum + c.productCount, 0)}
            </p>
            <p className="text-sm text-gray-600">Tổng sản phẩm</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

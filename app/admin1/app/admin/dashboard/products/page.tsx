"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react"

// Sample products data for Vietnamese specialties
const productsData = [
  {
    id: 1,
    name: "Bánh tráng nướng Tây Ninh",
    category: "Bánh kẹo",
    price: "45,000",
    stock: 150,
    status: "In Stock",
    image: "/banh-trang-nuong.png",
    description: "Bánh tráng nướng đặc sản Tây Ninh",
  },
  {
    id: 2,
    name: "Mắm ruốc Huế",
    category: "Gia vị",
    price: "85,000",
    stock: 75,
    status: "In Stock",
    image: "/mam-ruoc-hue.png",
    description: "Mắm ruốc truyền thống Huế",
  },
  {
    id: 3,
    name: "Chà bông Đà Lạt",
    category: "Thực phẩm khô",
    price: "120,000",
    stock: 0,
    status: "Out of Stock",
    image: "/cha-bong-dalat.png",
    description: "Chà bông heo thơm ngon Đà Lạt",
  },
  {
    id: 4,
    name: "Bánh pía Sóc Trăng",
    category: "Bánh kẹo",
    price: "65,000",
    stock: 25,
    status: "Low Stock",
    image: "/banh-pia-soc-trang.png",
    description: "Bánh pía đậu xanh Sóc Trăng",
  },
]

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Quản Lý Sản Phẩm</h2>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Thêm sản phẩm mới
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Lọc theo danh mục</Button>
            <Button variant="outline">Lọc theo trạng thái</Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productsData.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-square bg-gray-100 relative">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge
                  variant={
                    product.status === "In Stock"
                      ? "default"
                      : product.status === "Low Stock"
                        ? "secondary"
                        : "destructive"
                  }
                  className={
                    product.status === "In Stock"
                      ? "bg-green-100 text-green-800"
                      : product.status === "Low Stock"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }
                >
                  {product.status === "In Stock" ? "Còn hàng" : product.status === "Low Stock" ? "Sắp hết" : "Hết hàng"}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{product.category}</p>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-green-600">{product.price}đ</span>
                <span className="text-sm text-gray-500">Kho: {product.stock}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Eye className="h-4 w-4 mr-1" />
                  Xem
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Edit className="h-4 w-4 mr-1" />
                  Sửa
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

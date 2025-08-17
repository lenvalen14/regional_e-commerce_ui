"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye } from "lucide-react"

// Import components
import ProductSearch from "./ProductSearch"
import AddProductModal from "./AddProductModal"
import EditProductModal from "./EditProductModal"
import DeleteProductModal from "./DeleteProductModal"
import ViewProductModal from "./ViewProductModal"

// Define Product interface
interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
  status: string
  description: string
  region: string
}

interface SearchFilters {
  searchTerm: string
  category: string
  status: string
  region: string
}

// Sample products data for Vietnamese specialties
const initialProductsData: Product[] = [
  {
    id: 1,
    name: "Bánh tráng nướng Tây Ninh",
    category: "Bánh kẹo",
    price: 45000,
    stock: 150,
    status: "In Stock",
    description: "Bánh tráng nướng đặc sản Tây Ninh với hương vị thơm ngon, giòn tan được làm từ gạo tẻ cao cấp",
    region: "Tây Ninh"
  },
  {
    id: 2,
    name: "Mắm ruốc Huế",
    category: "Gia vị",
    price: 85000,
    stock: 75,
    status: "In Stock",
    description: "Mắm ruốc truyền thống Huế với hương vị đậm đà, được ủ theo phương pháp cổ truyền",
    region: "Huế"
  },
  {
    id: 3,
    name: "Chà bông Đà Lạt",
    category: "Thực phẩm khô",
    price: 120000,
    stock: 0,
    status: "Out of Stock",
    description: "Chà bông heo thơm ngon Đà Lạt được chế biến từ thịt heo tươi ngon nhất",
    region: "Đà Lạt"
  },
  {
    id: 4,
    name: "Bánh pía Sóc Trăng",
    category: "Bánh kẹo",
    price: 65000,
    stock: 25,
    status: "Low Stock",
    description: "Bánh pía đậu xanh Sóc Trăng với lớp vỏ mỏng, nhân đậu xanh ngọt thơm",
    region: "Sóc Trăng"
  },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProductsData)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProductsData)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Filter and search products
  const handleSearch = (filters: SearchFilters) => {
    let filtered = [...products]

    // Search by name or description
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      )
    }

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category)
    }

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(product => product.status === filters.status)
    }

    // Filter by region
    if (filters.region) {
      filtered = filtered.filter(product => product.region === filters.region)
    }

    setFilteredProducts(filtered)
  }

  // Reset search filters
  const handleResetSearch = () => {
    setFilteredProducts(products)
  }

  // Add new product
  const handleAddProduct = (newProduct: Product) => {
    const updatedProducts = [...products, newProduct]
    setProducts(updatedProducts)
    setFilteredProducts(updatedProducts)
  }

  // View product
  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product)
    setShowViewModal(true)
  }

  // Edit product
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setShowEditModal(true)
  }

  const handleUpdateProduct = (updatedProduct: Product) => {
    const updatedProducts = products.map(product =>
      product.id === updatedProduct.id ? updatedProduct : product
    )
    setProducts(updatedProducts)
    setFilteredProducts(updatedProducts.filter(product =>
      filteredProducts.some(filtered => filtered.id === product.id)
    ))
  }

  // Delete product
  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = (productId: number) => {
    const updatedProducts = products.filter(product => product.id !== productId)
    setProducts(updatedProducts)
    setFilteredProducts(updatedProducts.filter(product =>
      filteredProducts.some(filtered => filtered.id === product.id)
    ))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "In Stock": { label: "Còn hàng", className: "bg-green-100 text-green-800" },
      "Low Stock": { label: "Sắp hết", className: "bg-yellow-100 text-yellow-800" },
      "Out of Stock": { label: "Hết hàng", className: "bg-red-100 text-red-800" }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["Out of Stock"]
    
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Quản Lý Sản Phẩm</h2>
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm sản phẩm mới
        </Button>
      </div>

      {/* Search and Filters */}
      <ProductSearch
        onSearch={handleSearch}
        onReset={handleResetSearch}
        totalResults={filteredProducts.length}
      />

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square bg-gray-100 relative">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-4xl mb-2">📦</div>
                  <p className="text-xs">Chưa có hình ảnh</p>
                </div>
              </div>
              <div className="absolute top-2 right-2">
                {getStatusBadge(product.status)}
              </div>
              <div className="absolute top-2 left-2">
                <Badge variant="outline" className="bg-white/90">
                  {product.region}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{product.category}</p>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-green-600">{formatPrice(product.price)}đ</span>
                <span className="text-sm text-gray-500">Kho: {product.stock}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleViewProduct(product)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Xem
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleEditProduct(product)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Sửa
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteProduct(product)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {filteredProducts.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
            <p className="text-gray-500">Thử điều chỉnh bộ lọc hoặc thêm sản phẩm mới</p>
          </div>
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm sản phẩm đầu tiên
          </Button>
        </Card>
      )}

      {/* Modals */}
      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddProduct}
      />

      <EditProductModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onEdit={handleUpdateProduct}
        product={selectedProduct}
      />

      <DeleteProductModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleConfirmDelete}
        product={selectedProduct}
      />

      <ViewProductModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        product={selectedProduct}
      />
    </div>
  )
}

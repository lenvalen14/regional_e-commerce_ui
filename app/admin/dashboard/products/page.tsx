"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye, RefreshCw } from "lucide-react"

// Import components
import ProductSearch from "./ProductSearch"
import AddProductModal from "./AddProductModal"
import EditProductModal from "./EditProductModal"
import DeleteProductModal from "./DeleteProductModal"
import ViewProductModal from "./ViewProductModal"
import {
  CreateProductData,
  Product,
  ProductWithStatus,
  useCreateProductMutation,
  useGetProductsQuery,
  useRestoreProductMutation
} from "@/features/product/productApi"
import { useGetCategoriesQuery } from "@/features/category/categoryApi"
import { useGetRegionsQuery } from "@/features/region"
import { RestoreProductModal } from "./RestoreProductModal"

interface SearchFilters {
  searchTerm: string
  category: string
  status: string
  region: string
}

export default function ProductsPage() {
  const { data: productData, isLoading: prodLoading, isError: prodError, refetch } = useGetProductsQuery({ page: 0, size: 50 });
  const productsData = productData?.data || [];

  const { data: regionData, isLoading: regionLoading } = useGetRegionsQuery({ page: 0, size: 50 });
  const regions = [
    { categoryId: "all", categoryName: "Tất cả vùng miền" },
    ...(regionData?.data.map(r => ({
      categoryId: r.regionId,
      categoryName: r.regionName
    })) || [])
  ];

  const { data: categoryData, isLoading: catLoading } = useGetCategoriesQuery({ page: 0, size: 50 });
  const categories = [
    { categoryId: "all", categoryName: "Tất cả danh mục" },
    ...(categoryData?.data.map(c => ({
      categoryId: c.categoryId,
      categoryName: c.categoryName
    })) || [])
  ];

  const [filteredProducts, setFilteredProducts] = useState<ProductWithStatus[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showRestoreModal, setShowRestoreModal] = useState(false)

  const [createProduct] = useCreateProductMutation();
  const [restoreProduct] = useRestoreProductMutation()

  // Transform products with status
  const productsWithStatus = useMemo(() => {
    const getProductStatus = (stockQuantity: number): "Out of Stock" | "Low Stock" | "In Stock" => {
      if (stockQuantity === 0) return "Out of Stock";
      if (stockQuantity <= 20) return "Low Stock";
      return "In Stock";
    };

    return productsData.map(product => ({
      ...product,
      status: getProductStatus(product.stockQuantity)
    }));
  }, [productsData]);

  // Initialize filtered products
  useEffect(() => {
    setFilteredProducts(productsWithStatus)
  }, [productsWithStatus])

  // Filter and search products
  const handleSearch = (filters: SearchFilters) => {
    let filtered: ProductWithStatus[] = [...productsWithStatus]

    // Search by name or description
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(product =>
        product.productName.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      )
    }

    // Filter by category
    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter(product => product.category.categoryId === filters.category)
    }

    // Filter by status
    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter(product => product.status === filters.status)
    }

    // Filter by region
    if (filters.region && filters.region !== "all") {
      filtered = filtered.filter(product => product.region.regionId === filters.region)
    }

    setFilteredProducts(filtered)
  }

  // Reset search filters
  const handleResetSearch = () => {
    setFilteredProducts(productsWithStatus)
  }

  const handleAddProduct = async (data: FormData) => {
  try {
    const result = await createProduct(data).unwrap();
    if (result.data) {
      await refetch();
      setShowAddModal(false);
    }
  } catch (error) {
    console.error("Tạo sản phẩm thất bại", error);
  }
};

  // View product
  const handleViewProduct = (product: ProductWithStatus) => {
    const productForView: Product = {
      productId: product.productId,
      productName: product.productName,
      category: product.category,
      price: product.price,
      deleted: product.deleted,
      stockQuantity: product.stockQuantity,
      description: product.description,
      region: product.region,
      rating: product.rating || 0.0,
      imageProductResponseList: product.imageProductResponseList || []
    }
    setSelectedProduct(productForView)
    setShowViewModal(true)
  }

  // Edit product
  const handleEditProduct = (product: ProductWithStatus) => {
    const productForEdit: Product = {
      productId: product.productId,
      productName: product.productName,
      category: product.category,
      price: product.price,
      deleted: product.deleted,
      stockQuantity: product.stockQuantity,
      description: product.description,
      region: product.region,
      rating: product.rating || 0.0,
      imageProductResponseList: product.imageProductResponseList || []
    }
    setSelectedProduct(productForEdit)
    setShowEditModal(true)
  }

  const handleUpdateProduct = async (updatedProduct: Product) => {
    await refetch(); // Refresh the list to get updated data
    setShowEditModal(false);
  }

  const handleRestoreProduct = (product: ProductWithStatus) => {
    const productForRestore: Product = {
      productId: product.productId,
      productName: product.productName,
      category: product.category,
      price: product.price,
      deleted: product.deleted,
      stockQuantity: product.stockQuantity,
      description: product.description,
      region: product.region,
      rating: product.rating || 0.0,
      imageProductResponseList: product.imageProductResponseList || []
    }
    setSelectedProduct(productForRestore)
    setShowRestoreModal(true)
  }

  const confirmRestoreProduct = async (productId: string) => {
    try {
      await restoreProduct(productId).unwrap()
      await refetch() // Refresh the list
      setShowRestoreModal(false)
    } catch (err) {
      console.error("Restore failed", err)
    }
  }

  // Delete product
  const handleDeleteProduct = (product: ProductWithStatus) => {
    const productForDelete: Product = {
      productId: product.productId,
      productName: product.productName,
      category: product.category,
      price: product.price,
      deleted: product.deleted,
      stockQuantity: product.stockQuantity,
      description: product.description,
      region: product.region,
      rating: product.rating || 0.0,
      imageProductResponseList: product.imageProductResponseList || []
    }
    setSelectedProduct(productForDelete)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    await refetch() // Refresh the list
    setShowDeleteModal(false)
  }

  // Utility functions
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

  // Loading state
  if (prodLoading || catLoading || regionLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (prodError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">Có lỗi xảy ra khi tải dữ liệu</p>
          <Button onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Thử lại
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản Lý Sản Phẩm</h2>
          <p className="text-sm text-gray-500 mt-1">
            Tổng cộng: {productsWithStatus.length} sản phẩm
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm sản phẩm mới
          </Button>
        </div>
      </div>

     <ProductSearch
      onSearch={handleSearch}
      onReset={handleResetSearch}
      totalResults={filteredProducts.length}
    />

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.productId} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square bg-gray-100 relative">
              {!product.deleted && product.imageProductResponseList?.[0] ? (
                <img
                  src={product.imageProductResponseList[0].imageUrl}
                  alt={product.productName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/no-image.png"; // fallback
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <div className="text-4xl mb-2">📦</div>
                    <p className="text-xs">Chưa có hình ảnh</p>
                  </div>
                </div>
              )}

              <div className="absolute top-2 right-2">
                {getStatusBadge(product.status)}
              </div>
              <div className="absolute top-2 left-2">
                <Badge variant="outline" className="bg-white/90">
                  {product.region.regionName}
                </Badge>
              </div>
              
              {product.deleted && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <Badge className="bg-red-500 text-white">
                    Đã xóa
                  </Badge>
                </div>
              )}
            </div>

            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.productName}</h3>
              <p className="text-sm text-gray-500 mb-2">{product.category.categoryName}</p>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-green-600">{formatPrice(product.price)}đ</span>
                <span className="text-sm text-gray-500">Kho: {product.stockQuantity}</span>
              </div>
              <div className="flex items-center space-x-2">
                {product.deleted ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-green-600 hover:text-green-700"
                    onClick={() => handleRestoreProduct(product)}
                  >
                    Khôi phục
                  </Button>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {filteredProducts.length === 0 && !prodLoading && (
        <Card className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {productsWithStatus.length === 0 ? "Chưa có sản phẩm nào" : "Không tìm thấy sản phẩm"}
            </h3>
            <p className="text-gray-500">
              {productsWithStatus.length === 0 
                ? "Hãy thêm sản phẩm đầu tiên của bạn" 
                : "Thử điều chỉnh bộ lọc hoặc thêm sản phẩm mới"}
            </p>
          </div>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            {productsWithStatus.length === 0 ? "Thêm sản phẩm đầu tiên" : "Thêm sản phẩm mới"}
          </Button>
        </Card>
      )}

      {/* Modals */}
      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddProduct}
        categories={categoryData?.data || []}
        regions={regionData?.data || []}
        loading={catLoading || regionLoading}
      />

      <EditProductModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onEdit={handleUpdateProduct}
        product={selectedProduct}
        categories={categoryData?.data || []}
        regions={regionData?.data || []}
        loading={catLoading || regionLoading}
      />

      <DeleteProductModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleConfirmDelete}
        product={selectedProduct}
        refetchProducts={refetch}
      />

      {showRestoreModal && selectedProduct && (
        <RestoreProductModal
          product={selectedProduct}
          onClose={() => setShowRestoreModal(false)}
          onRestore={confirmRestoreProduct}
        />
      )}

      <ViewProductModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        product={selectedProduct}
      />
    </div>
  )
}
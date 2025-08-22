"use client"

import { useEffect, useMemo, useState } from "react"
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

// Define Product interface
// interface Product {
//   id: number
//   name: string
//   category: string
//   price: number
//   stock: number
//   status: string
//   description: string
//   region: string
// }

interface SearchFilters {
  searchTerm: string
  category: string
  status: string
  region: string
}

// Sample products data for Vietnamese specialties
// const initialProductsData: Product[] = [
//   {
//     id: 1,
//     name: "Bánh tráng nướng Tây Ninh",
//     category: "Bánh kẹo",
//     price: 45000,
//     stock: 150,
//     status: "In Stock",
//     description: "Bánh tráng nướng đặc sản Tây Ninh với hương vị thơm ngon, giòn tan được làm từ gạo tẻ cao cấp",
//     region: "Tây Ninh"
//   },
//   {
//     id: 2,
//     name: "Mắm ruốc Huế",
//     category: "Gia vị",
//     price: 85000,
//     stock: 75,
//     status: "In Stock",
//     description: "Mắm ruốc truyền thống Huế với hương vị đậm đà, được ủ theo phương pháp cổ truyền",
//     region: "Huế"
//   },
//   {
//     id: 3,
//     name: "Chà bông Đà Lạt",
//     category: "Thực phẩm khô",
//     price: 120000,
//     stock: 0,
//     status: "Out of Stock",
//     description: "Chà bông heo thơm ngon Đà Lạt được chế biến từ thịt heo tươi ngon nhất",
//     region: "Đà Lạt"
//   },
//   {
//     id: 4,
//     name: "Bánh pía Sóc Trăng",
//     category: "Bánh kẹo",
//     price: 65000,
//     stock: 25,
//     status: "Low Stock",
//     description: "Bánh pía đậu xanh Sóc Trăng với lớp vỏ mỏng, nhân đậu xanh ngọt thơm",
//     region: "Sóc Trăng"
//   },
// ]

export default function ProductsPage() {

  const { data: productData, isLoading: prodLoading, isError: prodError, refetch } = useGetProductsQuery({ page: 0, size: 20 });
  const productsData = productData?.data || [];

  const getProductStatus = (stockQuantity: number): "Out of Stock" | "Low Stock" | "In Stock" => {
    if (stockQuantity === 0) return "Out of Stock"
    if (stockQuantity > 0 && stockQuantity <= 20) return "Low Stock"
    return "In Stock"
  }

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

  const { data, isLoading, isError } = useGetRegionsQuery({ page: 0, size: 20 });
  const regions = [
    { id: "all", name: "Tất cả vùng miền" },
    ...(data?.data.map(r => ({
      id: r.regionId,
      name: r.regionName
    })) || [])
  ];

  const { data: categoryData, isLoading: catLoading, isError: catError } = useGetCategoriesQuery({ page: 0, size: 20 });
  const categories = [
    { id: "all", name: "Tất cả danh mục" },
    ...(categoryData?.data.map(c => ({
      id: c.categoryId,
      name: c.categoryName
    })) || [])
  ];

  // const [products, setProducts] = useState<Product[]>(initialProductsData)
  // const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProductsData)
  const [products, setProducts] = useState<ProductWithStatus[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductWithStatus[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<CreateProductData | null>(null)
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<Product | null>(null)
  const [filteredEditProducts, setFilteredEditProducts] = useState<Product[]>(productsWithStatus)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showRestoreModal, setShowRestoreModal] = useState(false)
  const [selectedProductForRestore, setSelectedProductForRestore] = useState<Product | null>(null)

  const [createProduct] = useCreateProductMutation();
  const [restoreProduct] = useRestoreProductMutation()

  // useEffect(() => {
  //   if (productsWithStatus.length === 0) return;

  //   // So sánh id để tránh setState vô hạn
  //   const currentIds = products.map(p => p.productId).join(',');
  //   const newIds = productsWithStatus.map(p => p.productId).join(',');

  //   if (currentIds !== newIds) {
  //     setProducts(productsWithStatus);
  //     setFilteredProducts(productsWithStatus);
  //   }
  // }, [productsWithStatus, products]);
  useEffect(() => {
    setProducts(productsWithStatus)
    setFilteredProducts(productsWithStatus)
  }, [productData])


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
    if (filters.status) {
      filtered = filtered.filter(product => product.status === filters.status)
    }

    // Filter by region
    if (filters.region && filters.region !== "all") {
      filtered = filtered.filter(product => product.region.regionId === filters.region)
    }

    setFilteredProducts(filtered)
  }

  const mapToCreateProductData = (product: ProductWithStatus): CreateProductData => ({
    // productId: product.productId,
    productName: product.productName,
    categoryId: product.category.categoryId,
    price: product.price,
    stockQuantity: product.stockQuantity,
    description: product.description,
    regionId: product.region.regionId
  })

  // Reset search filters
  const handleResetSearch = () => {
    setFilteredProducts(products)
  }

  // Add new product
  const handleAddProduct = async (data: CreateProductData & { images?: File[] }) => {
    try {
      const created = await createProduct(data).unwrap();
      const productWithStatus: ProductWithStatus = {
        ...created.data,
        status: getProductStatus(created.data.stockQuantity),
      };
      setProducts((prev) => [...prev, productWithStatus]);
      setFilteredProducts((prev) => [...prev, productWithStatus]);
      setShowAddModal(false);
    } catch (error) {
      console.error("Tạo sản phẩm thất bại", error);
    }
  };

  // View product
  const handleViewProduct = (product: ProductWithStatus) => {
    setSelectedProduct(mapToCreateProductData(product))
    setShowViewModal(true)
  }

  // Edit product
  // const handleEditProduct = (product: ProductWithStatus) => {
  //   setSelectedProduct(mapToCreateProductData(product))
  //   setShowEditModal(true)
  // }
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
    setSelectedProductForEdit(productForEdit)
    setShowEditModal(true)
  }

  // const handleUpdateProduct = (updatedProduct: Product) => {
  //   const updatedProducts = products.map(product =>
  //     product.productId === updatedProduct.productId ? updatedProduct : product
  //   )
  //   setProducts(updatedProducts)
  //   setFilteredProducts(updatedProducts.filter(product =>
  //     filteredProducts.some(filtered => filtered.productId === product.productId)
  //   ))
  // }


  const handleUpdateProduct = (updatedProduct: Product) => {
    const updatedProducts = products.map(product =>
      product.productId === updatedProduct.productId
        ? { ...updatedProduct, status: getProductStatus(updatedProduct.stockQuantity) }
        : product
    )
    setProducts(updatedProducts)
    setFilteredProducts(updatedProducts.filter(product =>
      filteredProducts.some(filtered => filtered.productId === product.productId)
    ))
  }

  const handleRestoreProduct = (product: Product) => {
    setSelectedProductForRestore(product)
    setShowRestoreModal(true)
  }

  const confirmRestoreProduct = async (productId: string) => {
    try {
      await restoreProduct(productId).unwrap()
      refetch() // gọi lại API để sync
    } catch (err) {
      console.error("Restore failed", err)
    }
  }

  // Delete product
  const handleDeleteProduct = (product: ProductWithStatus) => {
    setSelectedProduct(mapToCreateProductData(product))
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = (productId: string) => {
    const updatedProducts = products.filter(product => product.productId.toString() !== productId.toString())
    setProducts(updatedProducts)
    setFilteredProducts(updatedProducts.filter(product =>
      filteredProducts.some(filtered => filtered.productId === product.productId)
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
          <Card key={product.productId} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square bg-gray-100 relative">
              {product.imageProductResponseList?.[0] ? (
                <img
                  src={product.imageProductResponseList[0].imageUrl}
                  alt={product.productName}
                  className="w-full h-full object-cover"
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
        product={selectedProductForEdit}
        categories={categories}
        regions={regions}
        loading={catLoading || isLoading}
      />

      <DeleteProductModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleConfirmDelete}
        product={selectedProductForEdit}
        refetchProducts={refetch}
      />

      {showRestoreModal && selectedProductForRestore && (
        <RestoreProductModal
          product={selectedProductForRestore}
          onClose={() => setShowRestoreModal(false)}
          onRestore={confirmRestoreProduct}
        />
      )}


      <ViewProductModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        product={selectedProductForEdit}
      />
    </div>
  )
}

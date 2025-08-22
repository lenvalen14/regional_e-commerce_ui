import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Tag, Package, DollarSign } from "lucide-react"
import { Product } from "@/features/product/productApi"

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

interface ViewProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
}

export default function ViewProductModal({ isOpen, onClose, product }: ViewProductModalProps) {
  if (!product) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  const getStatusBadge = (stockQuantity: number) => {
    if (stockQuantity === 0) return <Badge className="bg-red-100 text-red-800">Hết hàng</Badge>
    if (stockQuantity <= 20) return <Badge className="bg-yellow-100 text-yellow-800">Sắp hết</Badge>
    return <Badge className="bg-green-100 text-green-800">Còn hàng</Badge>
  }

  // const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["Out of Stock"]

  // return (
  //   <Badge className={config.className}>
  //     {config.label}
  //   </Badge>
  // )


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi Tiết Sản Phẩm</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Image Placeholder */}
          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
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
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{product.productName}</h3>
              <div className="flex items-center space-x-2 mt-2">
                {getStatusBadge(product.stockQuantity)}
                <span className="text-sm text-gray-500">ID: {product.productId}</span>
              </div>
            </div>

            {/* Price and Stock */}
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">{formatPrice(product.price)}đ</p>
                  <p className="text-sm text-gray-500">Giá bán</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-semibold text-gray-900">{product.stockQuantity}</p>
                <p className="text-sm text-gray-500">Còn lại</p>
              </div>
            </div>

            {/* Category and Region */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                <Tag className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">{product.category.categoryName}</p>
                  <p className="text-xs text-blue-600">Danh mục</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg">
                <MapPin className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-900">{product.region.regionName}</p>
                  <p className="text-xs text-purple-600">Vùng miền</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Mô tả sản phẩm</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            </div>

            {/* Stock Warning */}
            {product.stockQuantity <= 20 && (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  ⚠️ <strong>Cảnh báo:</strong> Sản phẩm sắp hết hàng. Chỉ còn {product.stockQuantity} sản phẩm trong kho.
                </p>
              </div>
            )}

            {product.stockQuantity === 0 && (
              <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                <p className="text-red-800 text-sm">
                  ❌ <strong>Hết hàng:</strong> Sản phẩm hiện tại không còn trong kho.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end">
            <Button onClick={onClose} variant="outline">
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

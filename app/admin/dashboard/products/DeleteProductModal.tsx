import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"

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

interface DeleteProductModalProps {
  isOpen: boolean
  onClose: () => void
  onDelete: (productId: number) => void
  product: Product | null
}

export default function DeleteProductModal({ isOpen, onClose, onDelete, product }: DeleteProductModalProps) {
  const handleDelete = () => {
    if (product) {
      onDelete(product.id)
      onClose()
    }
  }

  if (!product) return null

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
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa Sản Phẩm</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.</p>
              
              <div className="bg-gray-50 p-4 rounded-md space-y-3">
                <h4 className="font-medium text-gray-900">Chi tiết sản phẩm:</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Tên:</span> {product.name}</p>
                  <p><span className="font-medium">Danh mục:</span> {product.category}</p>
                  <p><span className="font-medium">Vùng miền:</span> {product.region}</p>
                  <p><span className="font-medium">Giá:</span> {formatPrice(product.price)}đ</p>
                  <p><span className="font-medium">Số lượng kho:</span> {product.stock}</p>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Trạng thái:</span>
                    {getStatusBadge(product.status)}
                  </div>
                  <p><span className="font-medium">Mô tả:</span></p>
                  <p className="text-gray-600 bg-white p-2 rounded border text-xs">{product.description}</p>
                </div>
              </div>

              {product.stock > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ <strong>Cảnh báo:</strong> Sản phẩm này còn {product.stock} sản phẩm trong kho. 
                    Việc xóa có thể ảnh hưởng đến các đơn hàng đang chờ xử lý.
                  </p>
                </div>
              )}

              <div className="bg-red-50 border border-red-200 p-3 rounded-md">
                <p className="text-red-800 text-sm">
                  🗑️ <strong>Lưu ý:</strong> Sau khi xóa, tất cả dữ liệu liên quan đến sản phẩm này sẽ bị mất vĩnh viễn.
                </p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Xóa sản phẩm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

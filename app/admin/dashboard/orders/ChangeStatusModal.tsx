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
import { Package, Truck, CheckCircle, XCircle } from "lucide-react"

interface Order {
  id: string
  customer: {
    name: string
    email: string
    phone: string
  }
  items: {
    id: number
    name: string
    category: string
    price: number
    quantity: number
    subtotal: number
  }[]
  total: number
  status: string
  orderDate: string
  deliveryDate?: string
  shippingAddress: {
    street: string
    ward: string
    district: string
    city: string
  }
  paymentMethod: string
  notes?: string
}

interface ChangeStatusModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (orderId: string, newStatus: string) => void
  order: Order | null
  newStatus: string
}

const statusConfig = {
  Processing: { label: "Đang xử lý", color: "bg-yellow-100 text-yellow-800", icon: Package },
  Shipping: { label: "Đang giao", color: "bg-blue-100 text-blue-800", icon: Truck },
  Delivered: { label: "Đã giao", color: "bg-green-100 text-green-800", icon: CheckCircle },
  Cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-800", icon: XCircle },
}

export default function ChangeStatusModal({ isOpen, onClose, onConfirm, order, newStatus }: ChangeStatusModalProps) {
  if (!order || !newStatus) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  const currentStatusConfig = statusConfig[order.status as keyof typeof statusConfig]
  const newStatusConfig = statusConfig[newStatus as keyof typeof statusConfig]
  
  const CurrentIcon = currentStatusConfig.icon
  const NewIcon = newStatusConfig.icon

  const getStatusChangeMessage = (currentStatus: string, newStatus: string) => {
    if (newStatus === "Cancelled") {
      return {
        title: "Hủy Đơn Hàng",
        description: "Bạn có chắc chắn muốn hủy đơn hàng này?",
        warning: "Sau khi hủy, đơn hàng sẽ không thể khôi phục và khách hàng sẽ được thông báo."
      }
    }
    
    if (currentStatus === "Processing" && newStatus === "Shipping") {
      return {
        title: "Chuyển Sang Giao Hàng",
        description: "Đơn hàng sẽ được chuyển sang trạng thái đang giao hàng.",
        warning: "Khách hàng sẽ nhận được thông báo về việc đơn hàng đang được giao."
      }
    }
    
    if (currentStatus === "Shipping" && newStatus === "Delivered") {
      return {
        title: "Đánh Dấu Đã Giao",
        description: "Đơn hàng sẽ được đánh dấu là đã giao thành công.",
        warning: "Hãy chắc chắn rằng khách hàng đã nhận được hàng trước khi xác nhận."
      }
    }
    
    return {
      title: "Thay Đổi Trạng Thái",
      description: `Đơn hàng sẽ được chuyển từ "${currentStatusConfig.label}" sang "${newStatusConfig.label}".`,
      warning: "Thao tác này không thể hoàn tác."
    }
  }

  const statusMessage = getStatusChangeMessage(order.status, newStatus)

  const handleConfirm = () => {
    onConfirm(order.id, newStatus)
    onClose()
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{statusMessage.title}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>{statusMessage.description}</p>
              
              <div className="bg-gray-50 p-4 rounded-md space-y-3">
                <h4 className="font-medium text-gray-900">Thông tin đơn hàng:</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Mã đơn hàng:</span> #{order.id}</p>
                  <p><span className="font-medium">Khách hàng:</span> {order.customer.name}</p>
                  <p><span className="font-medium">Tổng tiền:</span> {formatPrice(order.total)}đ</p>
                  <p><span className="font-medium">Ngày đặt:</span> {order.orderDate}</p>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-4 p-4 bg-blue-50 rounded-md">
                <div className="text-center">
                  <Badge className={currentStatusConfig.color}>
                    <CurrentIcon className="h-3 w-3 mr-1" />
                    {currentStatusConfig.label}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">Hiện tại</p>
                </div>
                
                <div className="text-2xl text-gray-400">→</div>
                
                <div className="text-center">
                  <Badge className={newStatusConfig.color}>
                    <NewIcon className="h-3 w-3 mr-1" />
                    {newStatusConfig.label}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">Sau khi thay đổi</p>
                </div>
              </div>

              <div className={`border-l-4 p-3 rounded-md ${
                newStatus === "Cancelled" 
                  ? "bg-red-50 border-red-200" 
                  : "bg-yellow-50 border-yellow-200"
              }`}>
                <p className={`text-sm ${
                  newStatus === "Cancelled" ? "text-red-800" : "text-yellow-800"
                }`}>
                  <strong>Lưu ý:</strong> {statusMessage.warning}
                </p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={
              newStatus === "Cancelled"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }
          >
            Xác nhận
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

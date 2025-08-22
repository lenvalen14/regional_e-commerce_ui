import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Package, Truck, CheckCircle, XCircle, Calendar, CreditCard, User, Mail, Phone, MapPin } from "lucide-react"
import { Order } from "@/features/order/orderApi"

interface ViewOrderModalProps {
  isOpen: boolean
  onClose: () => void
  order: Order | null
  onStatusChange: (orderId: string, newStatus: 'PENDING' | 'CONFIRM' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED') => void
}

const statusConfig = {
  PENDING: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800", icon: Package },
  CONFIRM: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800", icon: Package },
  SHIPPED: { label: "Đang giao", color: "bg-blue-100 text-blue-800", icon: Truck },
  COMPLETED: { label: "Đã giao", color: "bg-green-100 text-green-800", icon: CheckCircle },
  CANCELLED: { label: "Đã hủy", color: "bg-red-100 text-red-800", icon: XCircle },
}

export default function ViewOrderModal({ isOpen, onClose, order, onStatusChange }: ViewOrderModalProps) {
  if (!order) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  const formatAddress = (address: typeof order.addressResponse) => {
    return `${address.addressLine}, ${address.province}`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('vi-VN')
  }

  const StatusIcon = statusConfig[order.status as keyof typeof statusConfig].icon

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case "PENDING":
        return "CONFIRM"
      case "CONFIRM":
        return "SHIPPED"
      case "SHIPPED":
        return "COMPLETED"
      default:
        return null
    }
  }

  const canCancel = order.status === "PENDING" || order.status === "CONFIRM"
  const nextStatus = getNextStatus(order.status)

  const handleStatusChange = (newStatus: 'PENDING' | 'CONFIRM' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED') => {
    onStatusChange(order.orderId, newStatus)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Chi Tiết Đơn Hàng #{order.orderId}</span>
            <Badge className={statusConfig[order.status as keyof typeof statusConfig].color}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig[order.status as keyof typeof statusConfig].label}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Ngày đặt:</span>
                <span>{formatDate(order.orderDate)}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <CreditCard className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Tổng tiền:</span>
                <span className="font-semibold text-green-600">{formatPrice(order.totalAmount)}đ</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Customer Info */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Thông tin khách hàng
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="font-medium">{order.userResponse.userName}</p>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-3 w-3" />
                <span>{order.userResponse.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-3 w-3" />
                <span>{order.userResponse.phone}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Địa chỉ giao hàng
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{formatAddress(order.addressResponse)}</p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Sản phẩm đã đặt
            </h4>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Sản phẩm</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Giá</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">SL</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItemResponses.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                            <img 
                              src={item.productResponse.imageProductResponseList?.[0]?.imageUrl || ''} 
                              alt={item.productResponse.productName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{item.productResponse.productName}</p>
                            <p className="text-sm text-gray-500">{item.productResponse.category?.categoryName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{formatPrice(item.unitPrice)}đ</td>
                      <td className="py-3 px-4">{item.quantity}</td>
                      <td className="py-3 px-4 text-right font-medium">
                        {formatPrice(item.unitPrice * item.quantity)}đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Total */}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Tổng cộng:</span>
              <span className="text-2xl font-bold text-green-600">{formatPrice(order.totalAmount)}đ</span>
            </div>
          </div>

          {/* Order Actions */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Hành động đơn hàng</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={order.status === "PENDING" ? "default" : "outline"}
                  className={order.status === "PENDING" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
                  onClick={() => order.status !== "PENDING" && handleStatusChange("PENDING")}
                  disabled={order.status === "PENDING" || order.status === "COMPLETED" || order.status === "CANCELLED"}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Chờ xác nhận
                </Button>

                <Button
                  variant={order.status === "CONFIRM" ? "default" : "outline"}
                  className={order.status === "CONFIRM" ? "bg-blue-600 hover:bg-blue-700" : ""}
                  onClick={() => order.status !== "CONFIRM" && handleStatusChange("CONFIRM")}
                  disabled={order.status === "CONFIRM" || order.status === "COMPLETED" || order.status === "CANCELLED"}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Đã xác nhận
                </Button>

                <Button
                  variant={order.status === "SHIPPED" ? "default" : "outline"}
                  className={order.status === "SHIPPED" ? "bg-blue-600 hover:bg-blue-700" : ""}
                  onClick={() => order.status !== "SHIPPED" && handleStatusChange("SHIPPED")}
                  disabled={order.status === "SHIPPED" || order.status === "COMPLETED" || order.status === "CANCELLED"}
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Đang giao
                </Button>

                <Button
                  variant={order.status === "COMPLETED" ? "default" : "outline"}
                  className={order.status === "COMPLETED" ? "bg-green-600 hover:bg-green-700" : ""}
                  onClick={() => order.status !== "COMPLETED" && handleStatusChange("COMPLETED")}
                  disabled={order.status === "COMPLETED" || order.status === "CANCELLED"}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Đã giao
                </Button>

                <Button
                  variant={order.status === "CANCELLED" ? "default" : "outline"}
                  className={order.status === "CANCELLED" ? "bg-red-600 hover:bg-red-700 text-white" : "text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"}
                  onClick={() => order.status !== "CANCELLED" && handleStatusChange("CANCELLED")}
                  disabled={order.status === "CANCELLED" || order.status === "COMPLETED"}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Đã hủy
                </Button>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-center pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

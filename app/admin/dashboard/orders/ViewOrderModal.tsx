import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapPin, Phone, Mail, Package, Truck, CheckCircle, XCircle, Calendar, User, CreditCard } from "lucide-react"

interface OrderItem {
  id: number
  name: string
  category: string
  price: number
  quantity: number
  subtotal: number
}

interface Order {
  id: string
  customer: {
    name: string
    email: string
    phone: string
  }
  items: OrderItem[]
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

interface ViewOrderModalProps {
  isOpen: boolean
  onClose: () => void
  order: Order | null
  onStatusChange: (orderId: string, newStatus: string) => void
}

const statusConfig = {
  Processing: { label: "Đang xử lý", color: "bg-yellow-100 text-yellow-800", icon: Package },
  Shipping: { label: "Đang giao", color: "bg-blue-100 text-blue-800", icon: Truck },
  Delivered: { label: "Đã giao", color: "bg-green-100 text-green-800", icon: CheckCircle },
  Cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-800", icon: XCircle },
}

export default function ViewOrderModal({ isOpen, onClose, order, onStatusChange }: ViewOrderModalProps) {
  if (!order) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  const formatAddress = (address: typeof order.shippingAddress) => {
    return `${address.street}, ${address.ward}, ${address.district}, ${address.city}`
  }

  const StatusIcon = statusConfig[order.status as keyof typeof statusConfig].icon

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case "Processing":
        return "Shipping"
      case "Shipping":
        return "Delivered"
      default:
        return null
    }
  }

  const canCancel = order.status === "Processing" || order.status === "Shipping"
  const nextStatus = getNextStatus(order.status)

  const handleStatusChange = (newStatus: string) => {
    onStatusChange(order.id, newStatus)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Chi Tiết Đơn Hàng #{order.id}</span>
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
                <span>{order.orderDate}</span>
              </div>
              {order.deliveryDate && (
                <div className="flex items-center space-x-2 text-sm">
                  <Truck className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Ngày giao:</span>
                  <span>{order.deliveryDate}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <CreditCard className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Thanh toán:</span>
                <span>{order.paymentMethod}</span>
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
              <p className="font-medium">{order.customer.name}</p>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-3 w-3" />
                <span>{order.customer.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-3 w-3" />
                <span>{order.customer.phone}</span>
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
              <p className="text-gray-700">{formatAddress(order.shippingAddress)}</p>
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
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.category}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">{formatPrice(item.price)}đ</td>
                      <td className="py-3 px-4">{item.quantity}</td>
                      <td className="py-3 px-4 text-right font-medium">{formatPrice(item.subtotal)}đ</td>
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
              <span className="text-2xl font-bold text-green-600">{formatPrice(order.total)}đ</span>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Ghi chú</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{order.notes}</p>
              </div>
            </div>
          )}

          {/* Order Actions */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Hành động đơn hàng</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={order.status === "Processing" ? "default" : "outline"}
                  className={order.status === "Processing" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
                  onClick={() => order.status !== "Processing" && handleStatusChange("Processing")}
                  disabled={order.status === "Processing"}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Đang xử lý
                </Button>

                <Button
                  variant={order.status === "Shipping" ? "default" : "outline"}
                  className={order.status === "Shipping" ? "bg-blue-600 hover:bg-blue-700" : ""}
                  onClick={() => order.status !== "Shipping" && handleStatusChange("Shipping")}
                  disabled={order.status === "Shipping"}
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Đang giao
                </Button>

                <Button
                  variant={order.status === "Delivered" ? "default" : "outline"}
                  className={order.status === "Delivered" ? "bg-green-600 hover:bg-green-700" : ""}
                  onClick={() => order.status !== "Delivered" && handleStatusChange("Delivered")}
                  disabled={order.status === "Delivered"}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Đã giao
                </Button>

                <Button
                  variant={order.status === "Cancelled" ? "default" : "outline"}
                  className={order.status === "Cancelled" ? "bg-red-600 hover:bg-red-700 text-white" : "text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"}
                  onClick={() => order.status !== "Cancelled" && handleStatusChange("Cancelled")}
                  disabled={order.status === "Cancelled"}
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

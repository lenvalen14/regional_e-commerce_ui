"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Package, Truck, CheckCircle, XCircle, FileText, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Import components
import OrderSearch from "./OrderSearch"
import ViewOrderModal from "./ViewOrderModal"
import ChangeStatusModal from "./ChangeStatusModal"

// Define interfaces
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

interface SearchFilters {
  searchTerm: string
  status: string
  dateRange: string
}

// Sample orders data with detailed information
const initialOrdersData: Order[] = [
  {
    id: "DH001",
    customer: {
      name: "Nguyễn Văn An",
      email: "nguyenvanan@email.com",
      phone: "0901234567"
    },
    items: [
      {
        id: 1,
        name: "Bánh tráng nướng Tây Ninh",
        category: "Bánh kẹo",
        price: 45000,
        quantity: 2,
        subtotal: 90000
      },
      {
        id: 2,
        name: "Mắm ruốc Huế",
        category: "Gia vị",
        price: 85000,
        quantity: 1,
        subtotal: 85000
      }
    ],
    total: 175000,
    status: "Delivered",
    orderDate: "15/03/2024",
    deliveryDate: "18/03/2024",
    shippingAddress: {
      street: "123 Nguyễn Huệ",
      ward: "Phường Bến Nghé",
      district: "Quận 1", 
      city: "TP.HCM"
    },
    paymentMethod: "COD",
    notes: "Giao hàng buổi chiều"
  },
  {
    id: "DH002",
    customer: {
      name: "Trần Thị Bình",
      email: "tranthibinh@email.com",
      phone: "0912345678"
    },
    items: [
      {
        id: 3,
        name: "Chà bông Đà Lạt",
        category: "Thực phẩm khô",
        price: 120000,
        quantity: 1,
        subtotal: 120000
      }
    ],
    total: 120000,
    status: "Shipping",
    orderDate: "16/03/2024",
    shippingAddress: {
      street: "456 Lê Lợi",
      ward: "Phường 7",
      district: "Quận 3",
      city: "TP.HCM"
    },
    paymentMethod: "Chuyển khoản",
    notes: "Khách hàng yêu cầu gọi trước 30 phút"
  },
  {
    id: "DH003",
    customer: {
      name: "Lê Minh Cường",
      email: "leminhcuong@email.com",
      phone: "0923456789"
    },
    items: [
      {
        id: 4,
        name: "Bánh pía Sóc Trăng",
        category: "Bánh kẹo",
        price: 65000,
        quantity: 2,
        subtotal: 130000
      },
      {
        id: 1,
        name: "Bánh tráng nướng Tây Ninh",
        category: "Bánh kẹo",
        price: 45000,
        quantity: 1,
        subtotal: 45000
      }
    ],
    total: 175000,
    status: "Processing",
    orderDate: "17/03/2024",
    shippingAddress: {
      street: "789 Trần Hưng Đạo",
      ward: "Phường 11",
      district: "Quận 5",
      city: "TP.HCM"
    },
    paymentMethod: "Ví điện tử"
  },
  {
    id: "DH004",
    customer: {
      name: "Phạm Thị Dung",
      email: "phamthidung@email.com",
      phone: "0934567890"
    },
    items: [
      {
        id: 2,
        name: "Mắm ruốc Huế",
        category: "Gia vị",
        price: 85000,
        quantity: 1,
        subtotal: 85000
      }
    ],
    total: 85000,
    status: "Cancelled",
    orderDate: "18/03/2024",
    shippingAddress: {
      street: "321 Võ Văn Tần",
      ward: "Phường 6",
      district: "Quận 3",
      city: "TP.HCM"
    },
    paymentMethod: "COD",
    notes: "Khách hàng hủy do thay đổi ý kiến"
  },
]

const statusConfig = {
  Processing: { label: "Đang xử lý", color: "bg-yellow-100 text-yellow-800", icon: Package },
  Shipping: { label: "Đang giao", color: "bg-blue-100 text-blue-800", icon: Truck },
  Delivered: { label: "Đã giao", color: "bg-green-100 text-green-800", icon: CheckCircle },
  Cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-800", icon: XCircle },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrdersData)
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(initialOrdersData)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [newStatus, setNewStatus] = useState("")

  // Filter and search orders
  const handleSearch = (filters: SearchFilters) => {
    let filtered = [...orders]

    // Search by order ID, customer name, or email
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchLower) ||
        order.customer.name.toLowerCase().includes(searchLower) ||
        order.customer.email.toLowerCase().includes(searchLower)
      )
    }

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(order => order.status === filters.status)
    }

    // Filter by date range (simplified for demo)
    if (filters.dateRange) {
      // In a real app, you would implement proper date filtering
      filtered = filtered
    }

    setFilteredOrders(filtered)
  }

  // Reset search filters
  const handleResetSearch = () => {
    setFilteredOrders(orders)
  }

  // View order details
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setShowViewModal(true)
  }

  // Status change functions
  const handleStatusChange = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, status: newStatus }
        // Add delivery date if marking as delivered
        if (newStatus === "Delivered" && !order.deliveryDate) {
          updatedOrder.deliveryDate = new Date().toLocaleDateString('vi-VN')
        }
        return updatedOrder
      }
      return order
    })
    
    setOrders(updatedOrders)
    setFilteredOrders(updatedOrders.filter(order =>
      filteredOrders.some(filtered => filtered.id === order.id)
    ))
  }

  const handleQuickStatusChange = (order: Order, newStatus: string) => {
    setSelectedOrder(order)
    setNewStatus(newStatus)
    setShowStatusModal(true)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  const formatAddress = (address: Order['shippingAddress']) => {
    if (!address) return ""
    return `${address.street}, ${address.ward}, ${address.district}, ${address.city}`
  }

  const getStatusCount = (status: string) => {
    return orders.filter(order => order.status === status).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Quản Lý Đơn Hàng</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {getStatusCount("Processing")}
            </p>
            <p className="text-sm text-gray-600">Đang xử lý</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Truck className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {getStatusCount("Shipping")}
            </p>
            <p className="text-sm text-gray-600">Đang giao</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {getStatusCount("Delivered")}
            </p>
            <p className="text-sm text-gray-600">Đã giao</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {getStatusCount("Cancelled")}
            </p>
            <p className="text-sm text-gray-600">Đã hủy</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <OrderSearch
        onSearch={handleSearch}
        onReset={handleResetSearch}
        totalResults={filteredOrders.length}
      />

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hàng ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Mã đơn hàng</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Khách hàng</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Sản phẩm</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Tổng tiền</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Trạng thái</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Ngày đặt</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const StatusIcon = statusConfig[order.status as keyof typeof statusConfig].icon
                  return (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-blue-600">#{order.id}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{order.customer.name}</p>
                          <p className="text-sm text-gray-500">{order.customer.email}</p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {formatAddress(order.shippingAddress)}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          {order.items.slice(0, 2).map((item) => (
                            <p key={item.id} className="text-gray-600">
                              {item.name} x{item.quantity}
                            </p>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-gray-400 text-xs">
                              +{order.items.length - 2} sản phẩm khác
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-green-600">{formatPrice(order.total)}đ</td>
                      <td className="py-3 px-4">
                        <Badge className={statusConfig[order.status as keyof typeof statusConfig].color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig[order.status as keyof typeof statusConfig].label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{order.orderDate}</td>
                      <td className="py-3 px-4">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewOrder(order)}
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Empty state */}
      {filteredOrders.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy đơn hàng</h3>
            <p className="text-gray-500">Thử điều chỉnh bộ lọc hoặc kiểm tra lại từ khóa tìm kiếm</p>
          </div>
        </Card>
      )}

      {/* Modals */}
      <ViewOrderModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        order={selectedOrder}
        onStatusChange={handleStatusChange}
      />

      <ChangeStatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onConfirm={handleStatusChange}
        order={selectedOrder}
        newStatus={newStatus}
      />
    </div>
  )
}

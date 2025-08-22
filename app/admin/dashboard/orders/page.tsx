"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Package, Truck, CheckCircle, XCircle, FileText, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'

// Import components
import OrderSearch from "./OrderSearch"
import ViewOrderModal from "./ViewOrderModal"
import ChangeStatusModal from "./ChangeStatusModal"

// Import API hooks
import { useGetOrdersQuery, useUpdateOrderStatusMutation, Order } from "@/features/order/orderApi"

interface SearchFilters {
  searchTerm: string
  status: string
  dateRange: string
}

// Status mapping from BE to FE display
const statusConfig = {
  PENDING: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800", icon: Package },
  CONFIRM: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800", icon: Package },
  SHIPPED: { label: "Đang giao", color: "bg-blue-100 text-blue-800", icon: Truck },
  COMPLETED: { label: "Đã giao", color: "bg-green-100 text-green-800", icon: CheckCircle },
  CANCELLED: { label: "Đã hủy", color: "bg-red-100 text-red-800", icon: XCircle },
}

export default function OrdersPage() {
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')
  
  const [showViewModal, setShowViewModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [newStatus, setNewStatus] = useState<'PENDING' | 'CONFIRM' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED'>('PENDING')

  // Get user info from Redux (không check quyền nữa)
  const { user, isAuthenticated, token } = useSelector((state: RootState) => state.auth)
  
  console.log('Current User:', { user, isAuthenticated, token: token ? 'exists' : 'missing' })

  // API calls - không skip authentication check
  const { 
    data: ordersResponse, 
    isLoading, 
    error,
    refetch 
  } = useGetOrdersQuery({
    page,
    size,
    status: statusFilter === 'all' ? undefined : statusFilter
  })

  // Debug log
  console.log('Orders Query:', {
    page,
    size, 
    statusFilter,
    isLoading,
    error,
    ordersResponse
  })

  const [updateOrderStatus] = useUpdateOrderStatusMutation()

  const orders = ordersResponse?.data || []
  const meta = ordersResponse?.meta

  // Filter orders locally by search term (since BE doesn't have search endpoint)
  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    return (
      order.orderId.toLowerCase().includes(searchLower) ||
      order.userResponse.userName.toLowerCase().includes(searchLower) ||
      order.userResponse.email.toLowerCase().includes(searchLower)
    )
  })

  // Filter and search orders
  const handleSearch = (filters: SearchFilters) => {
    setSearchTerm(filters.searchTerm)
    if (filters.status !== statusFilter) {
      setStatusFilter(filters.status === '' ? 'all' : filters.status)
      setPage(0) // Reset to first page when changing filters
    }
  }

  // Reset search filters
  const handleResetSearch = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setPage(0)
  }

  // View order details
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setShowViewModal(true)
  }

  // Status change functions
  const handleStatusChange = async (orderId: string, newStatus: 'PENDING' | 'CONFIRM' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED') => {
    try {
      await updateOrderStatus({ orderId, status: newStatus }).unwrap()
      // Refetch to get updated data
      refetch()
    } catch (error) {
      console.error('Failed to update order status:', error)
    }
  }

  const handleQuickStatusChange = (order: Order, newStatus: 'PENDING' | 'CONFIRM' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED') => {
    setSelectedOrder(order)
    setNewStatus(newStatus)
    setShowStatusModal(true)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  const formatAddress = (address: Order['addressResponse']) => {
    if (!address) return ""
    return `${address.addressLine}, ${address.province}`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('vi-VN')
  }

  const formatOrderId = (orderId: string) => {
    return orderId.substring(0, 8) + '...'
  }

  const getStatusCount = (status: string) => {
    return orders.filter(order => order.status === status).length
  }

  const getNextActions = (currentStatus: string) => {
    switch (currentStatus) {
      case 'PENDING':
        return [
          { status: 'CONFIRM', label: 'Xác nhận', color: 'text-blue-600' },
          { status: 'CANCELLED', label: 'Hủy đơn', color: 'text-red-600' }
        ]
      case 'CONFIRM':
        return [
          { status: 'SHIPPED', label: 'Giao hàng', color: 'text-blue-600' },
          { status: 'CANCELLED', label: 'Hủy đơn', color: 'text-red-600' }
        ]
      case 'SHIPPED':
        return [
          { status: 'COMPLETED', label: 'Hoàn thành', color: 'text-green-600' }
        ]
      default:
        return []
    }
  }

  // Bỏ check authentication và admin role - cho phép tất cả user truy cập

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải danh sách đơn hàng...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    console.error('Orders API Error:', error); // Log chi tiết lỗi
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-500 mb-2">Có lỗi xảy ra khi tải danh sách đơn hàng</p>
            <p className="text-sm text-gray-500 mb-4">
              {(error as any)?.data?.message || (error as any)?.message || 'Lỗi không xác định'}
            </p>
            <Button onClick={() => refetch()} className="mt-4">
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    )
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {getStatusCount('PENDING')}
            </p>
            <p className="text-sm text-gray-600">Chờ xác nhận</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {getStatusCount('CONFIRM')}
            </p>
            <p className="text-sm text-gray-600">Đã xác nhận</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Truck className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {getStatusCount('SHIPPED')}
            </p>
            <p className="text-sm text-gray-600">Đang giao</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {getStatusCount('COMPLETED')}
            </p>
            <p className="text-sm text-gray-600">Đã giao</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {getStatusCount('CANCELLED')}
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đơn hàng</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày đặt</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const config = statusConfig[order.status as keyof typeof statusConfig]
                  const StatusIcon = config.icon
                  const nextActions = getNextActions(order.status)

                  return (
                    <TableRow key={order.orderId}>
                      <TableCell className="font-medium">
                        <span className="text-blue-600">#{formatOrderId(order.orderId)}</span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.userResponse.userName}</p>
                          <p className="text-sm text-gray-500">{order.userResponse.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatPrice(order.totalAmount)}đ
                      </TableCell>
                      <TableCell>
                        <Badge className={config.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(order.orderDate)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {nextActions.length > 0 && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {nextActions.map((action) => (
                                  <DropdownMenuItem
                                    key={action.status}
                                    onClick={() => handleQuickStatusChange(order, action.status as any)}
                                    className={action.color}
                                  >
                                    {action.label}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {meta && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Trang {meta.page + 1} / {meta.totalPages} 
                ({meta.totalElements} đơn hàng)
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                >
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={meta.last}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Empty state */}
      {filteredOrders.length === 0 && !isLoading && (
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

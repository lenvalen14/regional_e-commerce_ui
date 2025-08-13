"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, Truck, Package, CheckCircle, XCircle } from "lucide-react"

// Sample orders data
const ordersData = [
  {
    id: "DH001",
    customer: "Nguyễn Văn An",
    products: ["Bánh tráng nướng", "Mắm ruốc Huế"],
    total: "130,000",
    status: "Delivered",
    date: "15/03/2024",
    address: "123 Nguyễn Huệ, Q1, TP.HCM",
  },
  {
    id: "DH002",
    customer: "Trần Thị Bình",
    products: ["Chà bông Đà Lạt"],
    total: "120,000",
    status: "Shipping",
    date: "16/03/2024",
    address: "456 Lê Lợi, Q3, TP.HCM",
  },
  {
    id: "DH003",
    customer: "Lê Minh Cường",
    products: ["Bánh pía Sóc Trăng", "Bánh tráng nướng"],
    total: "110,000",
    status: "Processing",
    date: "17/03/2024",
    address: "789 Trần Hưng Đạo, Q5, TP.HCM",
  },
  {
    id: "DH004",
    customer: "Phạm Thị Dung",
    products: ["Mắm ruốc Huế"],
    total: "85,000",
    status: "Cancelled",
    date: "18/03/2024",
    address: "321 Võ Văn Tần, Q3, TP.HCM",
  },
]

const statusConfig = {
  Processing: { label: "Đang xử lý", color: "bg-yellow-100 text-yellow-800", icon: Package },
  Shipping: { label: "Đang giao", color: "bg-blue-100 text-blue-800", icon: Truck },
  Delivered: { label: "Đã giao", color: "bg-green-100 text-green-800", icon: CheckCircle },
  Cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-800", icon: XCircle },
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Quản Lý Đơn Hàng</h2>
        <div className="flex space-x-2">
          <Button variant="outline">Xuất báo cáo</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {ordersData.filter((o) => o.status === "Processing").length}
            </p>
            <p className="text-sm text-gray-600">Đang xử lý</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Truck className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {ordersData.filter((o) => o.status === "Shipping").length}
            </p>
            <p className="text-sm text-gray-600">Đang giao</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {ordersData.filter((o) => o.status === "Delivered").length}
            </p>
            <p className="text-sm text-gray-600">Đã giao</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {ordersData.filter((o) => o.status === "Cancelled").length}
            </p>
            <p className="text-sm text-gray-600">Đã hủy</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo mã đơn hàng hoặc tên khách hàng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Lọc theo trạng thái</Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hàng ({ordersData.length})</CardTitle>
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
                {ordersData.map((order) => {
                  const StatusIcon = statusConfig[order.status as keyof typeof statusConfig].icon
                  return (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-blue-600">{order.id}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{order.customer}</p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">{order.address}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          {order.products.map((product, index) => (
                            <p key={index} className="text-gray-600">
                              {product}
                            </p>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-green-600">{order.total}đ</td>
                      <td className="py-3 px-4">
                        <Badge className={statusConfig[order.status as keyof typeof statusConfig].color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig[order.status as keyof typeof statusConfig].label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{order.date}</td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">
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
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, Mail, Phone, MapPin } from "lucide-react"

// Sample users data
const usersData = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    email: "nguyenvanan@email.com",
    phone: "0901234567",
    address: "Hà Nội",
    status: "Active",
    joinDate: "15/03/2024",
    orders: 12,
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    email: "tranthibinh@email.com",
    phone: "0912345678",
    address: "TP.HCM",
    status: "Active",
    joinDate: "20/02/2024",
    orders: 8,
  },
  {
    id: 3,
    name: "Lê Minh Cường",
    email: "leminhcuong@email.com",
    phone: "0923456789",
    address: "Đà Nẵng",
    status: "Inactive",
    joinDate: "10/01/2024",
    orders: 3,
  },
]

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Quản Lý Người Dùng</h2>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Thêm người dùng mới
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Lọc</Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng ({usersData.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Thông tin</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Liên hệ</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Địa chỉ</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Trạng thái</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Đơn hàng</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Ngày tham gia</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {usersData.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-medium text-sm">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-3 w-3 mr-1" />
                          {user.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-3 w-3 mr-1" />
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-3 w-3 mr-1" />
                        {user.address}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={user.status === "Active" ? "default" : "secondary"}
                        className={
                          user.status === "Active"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                        }
                      >
                        {user.status === "Active" ? "Hoạt động" : "Không hoạt động"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-medium">{user.orders}</td>
                    <td className="py-3 px-4 text-gray-600">{user.joinDate}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Mail, Phone, MapPin } from "lucide-react"

// Import components
import UserSearch from "./UserSearch"
import AddUserModal from "./AddUserModal"
import EditUserModal from "./EditUserModal"
import DeleteUserModal from "./DeleteUserModal"

// Define User interface
interface User {
  id: number
  name: string
  email: string
  phone: string
  address: string
  status: string
  joinDate: string
  orders: number
}

interface SearchFilters {
  searchTerm: string
}

// Sample users data
const initialUsersData: User[] = [
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
  const [users, setUsers] = useState<User[]>(initialUsersData)
  const [filteredUsers, setFilteredUsers] = useState<User[]>(initialUsersData)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Filter and search users
  const handleSearch = (filters: SearchFilters) => {
    let filtered = [...users]

    // Search by name, email, or phone
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phone.includes(searchLower)
      )
    }

    setFilteredUsers(filtered)
  }

  // Reset search filters
  const handleResetSearch = () => {
    setFilteredUsers(users)
  }

  // Add new user
  const handleAddUser = (newUser: User) => {
    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)
    setFilteredUsers(updatedUsers)
  }

  // Edit user
  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setShowEditModal(true)
  }

  const handleUpdateUser = (updatedUser: User) => {
    const updatedUsers = users.map(user =>
      user.id === updatedUser.id ? updatedUser : user
    )
    setUsers(updatedUsers)
    setFilteredUsers(updatedUsers.filter(user =>
      filteredUsers.some(filtered => filtered.id === user.id)
    ))
  }

  // Delete user
  const handleDeleteUser = (user: User) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = (userId: number) => {
    const updatedUsers = users.filter(user => user.id !== userId)
    setUsers(updatedUsers)
    setFilteredUsers(updatedUsers.filter(user =>
      filteredUsers.some(filtered => filtered.id === user.id)
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Quản Lý Người Dùng</h2>
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm người dùng mới
        </Button>
      </div>

      {/* Search and Filters */}
      <UserSearch
        onSearch={handleSearch}
        onReset={handleResetSearch}
        totalResults={filteredUsers.length}
      />

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng ({filteredUsers.length})</CardTitle>
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
                {filteredUsers.map((user) => (
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
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteUser(user)}
                        >
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

      {/* Modals */}
      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddUser}
      />

      <EditUserModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onEdit={handleUpdateUser}
        user={selectedUser}
      />

      <DeleteUserModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleConfirmDelete}
        user={selectedUser}
      />
    </div>
  )
}

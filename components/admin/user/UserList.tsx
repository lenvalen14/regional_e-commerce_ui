'use client';

import { Edit, Trash2, Mail, Phone, User as UserIcon } from "lucide-react"
import { User } from "./types"

interface UserListProps {
  users: User[]
  onEditUser: (user: User) => void
  onDeleteUser: (user: User) => void
}

export default function UserList({ users, onEditUser, onDeleteUser }: UserListProps) {
  // Get avatar initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Table Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-12 gap-4 items-center text-sm font-semibold text-gray-700">
          <div className="col-span-4">Người dùng</div>
          <div className="col-span-4">Thông tin liên hệ</div>
          <div className="col-span-2">Trạng thái</div>
          <div className="col-span-2 text-center">Hành động</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-100">
        {users.map((user) => (
          <div key={user.userId} className="px-6 py-5 hover:bg-gray-50/50 transition-all duration-200 group">
            <div className="grid grid-cols-12 gap-4 items-center">
              {/* User Info */}
              <div className="col-span-4 flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-white font-bold text-sm">
                    {getInitials(user.userName)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {user.userName}
                  </h3>
                  <p className="text-sm text-gray-500 font-mono">ID: {user.userId.slice(0, 8)}...</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="col-span-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-3 text-gray-400" />
                    <span className="truncate font-medium">{user.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-3 text-gray-400" />
                    <span className="font-medium">{user.phone}</span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="col-span-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                  user.isActive 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    user.isActive ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
                </span>
              </div>

              {/* Actions */}
              <div className="col-span-2 flex justify-center space-x-2">
                <button 
                  className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group/btn"
                  onClick={() => onEditUser(user)}
                  title="Chỉnh sửa"
                >
                  <Edit className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                </button>
                <button 
                  className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group/btn"
                  onClick={() => onDeleteUser(user)}
                  title="Xóa"
                >
                  <Trash2 className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

'use client';

import { Plus, Users } from "lucide-react"

interface UserStatsProps {
  totalUsers: number
  onAddUser: () => void
}

export default function UserStats({ totalUsers, onAddUser }: UserStatsProps) {
  return (
    <div className="mb-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quản Lý Người Dùng</h1>
              <p className="text-gray-600 mt-1 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Tổng cộng {totalUsers} người dùng
              </p>
            </div>
          </div>
          
          <button 
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            onClick={onAddUser}
          >
            <Plus className="h-5 w-5" />
            Thêm người dùng
          </button>
        </div>
      </div>
    </div>
  )
}

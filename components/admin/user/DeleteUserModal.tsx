'use client';

import { Trash2, AlertTriangle } from "lucide-react"
import { User } from "./types"

interface DeleteUserModalProps {
  isOpen: boolean
  user: User | null
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteUserModal({ 
  isOpen, 
  user, 
  onClose, 
  onConfirm 
}: DeleteUserModalProps) {
  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-center p-6 border-b border-gray-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Xác nhận xóa</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Bạn có chắc chắn muốn xóa người dùng{' '}
            <span className="font-semibold text-gray-900">{user.userName}</span>? 
            <br />
            <span className="text-sm text-gray-500">Hành động này không thể hoàn tác.</span>
          </p>
          
          {/* User Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">
                  {user.userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">{user.userName}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex space-x-3 p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Xóa người dùng
          </button>
        </div>
      </div>
    </div>
  )
}

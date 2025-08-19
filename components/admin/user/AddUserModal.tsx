'use client';

import { X } from "lucide-react"
import { UserFormData } from "./types"
import UserForm from "./UserForm"

interface AddUserModalProps {
  isOpen: boolean
  formData: UserFormData
  onClose: () => void
  onFormDataChange: (data: UserFormData) => void
  onSubmit: () => void
}

export default function AddUserModal({ 
  isOpen, 
  formData, 
  onClose, 
  onFormDataChange, 
  onSubmit 
}: AddUserModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Thêm người dùng mới</h3>
            <p className="text-sm text-gray-500 mt-1">Điền thông tin người dùng mới</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Form */}
        <div className="p-6">
          <UserForm 
            formData={formData}
            onFormDataChange={onFormDataChange}
            includePassword={true}
          />
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
            onClick={onSubmit}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            Thêm người dùng
          </button>
        </div>
      </div>
    </div>
  )
}

'use client';

import { UserFormData, ExtendedUserFormData } from "./types"

interface UserFormProps {
  formData: UserFormData | ExtendedUserFormData
  onFormDataChange: (data: UserFormData | ExtendedUserFormData) => void
  includePassword?: boolean
  showStatus?: boolean
}

export default function UserForm({ formData, onFormDataChange, includePassword = false, showStatus = true }: UserFormProps) {
  const handleInputChange = (field: keyof ExtendedUserFormData, value: string | boolean) => {
    onFormDataChange({ ...formData, [field]: value })
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên</label>
        <input
          type="text"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
          placeholder="Nhập họ và tên"
          value={formData.userName || ''}
          onChange={(e) => handleInputChange('userName', e.target.value)}
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
        <input
          type="email"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
          placeholder="Nhập địa chỉ email"
          value={formData.email || ''}
          onChange={(e) => handleInputChange('email', e.target.value)}
        />
      </div>
      
      {includePassword && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu</label>
          <input
            type="password"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
            placeholder="Nhập mật khẩu"
            value={(formData as ExtendedUserFormData).password || ''}
            onChange={(e) => handleInputChange('password', e.target.value)}
          />
        </div>
      )}
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
        <input
          type="tel"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
          placeholder="Nhập số điện thoại"
          value={formData.phone || ''}
          onChange={(e) => handleInputChange('phone', e.target.value)}
        />
      </div>
      
      {showStatus && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Trạng thái</label>
          <select
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
            value={formData.isActive === undefined ? 'true' : formData.isActive.toString()}
            onChange={(e) => handleInputChange('isActive', e.target.value === 'true')}
          >
            <option value="true">Hoạt động</option>
            <option value="false">Không hoạt động</option>
          </select>
        </div>
      )}
    </div>
  )
}

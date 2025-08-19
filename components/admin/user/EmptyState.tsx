'use client';

import { Users, Search, Filter } from "lucide-react"

interface EmptyStateProps {
  searchTerm: string
  statusFilter: string
  onClearFilters: () => void
}

export default function EmptyState({ searchTerm, statusFilter, onClearFilters }: EmptyStateProps) {
  const hasFilters = searchTerm || statusFilter !== 'all'
  
  return (
    <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
        {hasFilters ? (
          <Search className="h-10 w-10 text-gray-400" />
        ) : (
          <Users className="h-10 w-10 text-gray-400" />
        )}
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {hasFilters ? 'Không tìm thấy người dùng' : 'Chưa có người dùng nào'}
      </h3>
      
      <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
        {hasFilters 
          ? 'Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn để tìm thấy kết quả phù hợp'
          : 'Hệ thống chưa có người dùng nào. Hãy bắt đầu bằng cách thêm người dùng đầu tiên!'
        }
      </p>
      
      {hasFilters && (
        <button
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          <Filter className="h-4 w-4" />
          Xóa bộ lọc
        </button>
      )}
    </div>
  )
}

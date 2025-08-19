'use client';

import { Loader2 } from "lucide-react"

export default function LoadingState() {
  return (
    <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">Đang tải dữ liệu</h3>
      <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
        Vui lòng chờ trong giây lát, chúng tôi đang tải thông tin người dùng...
      </p>
    </div>
  )
}

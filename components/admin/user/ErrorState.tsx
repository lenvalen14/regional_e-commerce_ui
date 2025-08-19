'use client';

import { AlertCircle, RefreshCw } from "lucide-react"

interface ErrorStateProps {
  error: string
  onRetry: () => void
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="h-10 w-10 text-red-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">Đã xảy ra lỗi</h3>
      <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
        {error}
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
      >
        <RefreshCw className="h-4 w-4" />
        Thử lại
      </button>
    </div>
  )
}

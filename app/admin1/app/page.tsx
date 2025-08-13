export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-orange-50">
      <div className="text-center">
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-600 to-orange-500 rounded-full flex items-center justify-center mb-6">
          <span className="text-white font-bold text-2xl">ĐSQ</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Đặc Sản Quê</h1>
        <p className="text-gray-600 mb-8">Trang bán hàng đặc sản Việt Nam</p>
        <div className="space-x-4">
          <a
            href="/admin"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Trang quản lý
          </a>
        </div>
      </div>
    </div>
  )
}

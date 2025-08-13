"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Home, Users, Package, FolderOpen, ShoppingCart, Star, User, LogOut, Menu, X, Search, Bell } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

const sidebarItems = [
  { icon: Home, label: "Trang Chủ", href: "/admin/dashboard" },
  { icon: Users, label: "Quản Lý Người Dùng", href: "/admin/dashboard/users" },
  { icon: Package, label: "Quản Lý Sản Phẩm", href: "/admin/dashboard/products" },
  { icon: FolderOpen, label: "Quản Lý Danh Mục", href: "/admin/dashboard/categories" },
  { icon: ShoppingCart, label: "Quản Lý Đơn Hàng", href: "/admin/dashboard/orders" },
  { icon: Star, label: "Quản Lý Đánh Giá", href: "/admin/dashboard/reviews" },
  { icon: User, label: "Tài Khoản", href: "/admin/dashboard/account" },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const searchParams = useSearchParams()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar - Made sidebar truly fixed and sticky */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">ĐSQ</span>
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Đặc Sản Quê</h2>
                  <p className="text-xs text-gray-500">Admin Panel</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {sidebarItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </a>
              ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  // TODO: Implement logout logic
                  window.location.href = "/admin/login"
                }}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Đăng Xuất
              </Button>
            </div>
          </div>
        </div>

        {/* Main content - Fixed margin and removed excessive height constraints */}
        <div className="lg:ml-64">
          {/* Header - Made header also fixed for better UX */}
          <header className="sticky top-0 z-30 bg-white shadow-sm border-b">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                  <Menu className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-bold text-gray-900">TRANG QUẢN LÝ</h1>
              </div>

              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm">
                  <Search className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Bell className="h-5 w-5" />
                </Button>
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
              </div>
            </div>
          </header>

          {/* Page content - Removed fixed height and excessive padding */}
          <main className="p-4">{children}</main>
        </div>
      </div>
    </Suspense>
  )
}

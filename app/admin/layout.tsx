"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Home, Users, Package, FolderOpen, ShoppingCart, Star, User, LogOut, Menu, X, Search, Settings, ChevronLeft, ChevronRight } from "lucide-react"
import { usePathname } from "next/navigation"
import { Suspense } from "react"
import NotificationBell from "../../components/notification/NotificationBell"
import { useLogoutMutation } from '@/features/auth/authApi';
import { useRouter } from 'next/navigation';
import Link from "next/link"

const sidebarItems = [
  { icon: Home, label: "Trang Chủ", href: "/admin/dashboard" },
  { icon: Users, label: "Quản Lý Người Dùng", href: "/admin/dashboard/users" },
  { icon: Package, label: "Quản Lý Sản Phẩm", href: "/admin/dashboard/products" },
  { icon: FolderOpen, label: "Quản Lý Danh Mục", href: "/admin/dashboard/categories" },
  { icon: ShoppingCart, label: "Quản Lý Đơn Hàng", href: "/admin/dashboard/orders" },
  { icon: Star, label: "Quản Lý Đánh Giá", href: "/admin/dashboard/reviews" },
  { icon: User, label: "Tài Khoản", href: "/admin/dashboard/account" },
]

function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const pathname = usePathname()
  const [logout, { isLoading }] = useLogoutMutation();
  const router = useRouter();

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  const isActiveRoute = (href: string) => {
    if (href === "/admin/dashboard") {
      return pathname === href
    }
    return pathname?.startsWith(href)
  }

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      router.push('/auth');
    } catch (error) {
      console.error("Failed to log out:", error);
      // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-sm" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 shadow-lg transform transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          sidebarCollapsed ? "w-20" : "w-64"
        } ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
       {/* Logo Section */}
        <div
          className={`flex items-center border-b border-gray-100 ${
            sidebarCollapsed
              ? "justify-center p-5"
              : "justify-between px-6 py-5"
          }`}
        >
          {!sidebarCollapsed ? (
            <>
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">ĐSQ</span>
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Đặc Sản Quê</h2>
                  <p className="text-xs text-gray-500">Admin Panel</p>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden hover:bg-gray-100"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Link href="/" className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">ĐSQ</span>
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map((item) => (
            <div key={item.href} className="relative group">
              <a
                href={item.href}
                className={`flex items-center space-x-3 rounded-xl transition-all duration-300 ease-out no-underline ${
                  sidebarCollapsed ? "p-4 justify-center" : "px-4 py-3"
                } ${
                  isActiveRoute(item.href)
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActiveRoute(item.href) ? "text-blue-600" : ""}`} />
                {!sidebarCollapsed && (
                  <span className="font-medium transition-all duration-300 ease-out">{item.label}</span>
                )}
              </a>
              
              {/* Tooltip for collapsed state */}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out pointer-events-none whitespace-nowrap z-50 transform translate-x-2 group-hover:translate-x-0">
                  {item.label}
                  <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Collapse Toggle Button */}
        <div className="hidden lg:block absolute -right-3 top-20">
          <Button
            variant="outline"
            size="sm"
            className="h-6 w-6 p-0 bg-white border-gray-200 shadow-md hover:shadow-lg"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
          </Button>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-100 p-3">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-xl mb-2 transition-all duration-300 ease-out">
              <div className="w-8 h-8 bg-gray-300 rounded-lg flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1 transition-all duration-300 ease-out">
                <p className="font-medium text-gray-900 text-sm">Admin User</p>
                <p className="text-xs text-gray-500">admin@example.com</p>
              </div>
            </div>
          )}
          
          <Button
            variant="ghost"
            className={`w-full text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl ${
              sidebarCollapsed ? "p-4 justify-center" : "justify-start px-4 py-3"
            }`}
            onClick={handleLogout}
            disabled={isLoading}
          >
            <LogOut className="h-5 w-5" />
            {!sidebarCollapsed && <span className="ml-3 transition-all duration-300 ease-out">Đăng Xuất</span>}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"}`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="lg:hidden hover:bg-gray-100" 
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">TRANG QUẢN LÝ</h1>
                <p className="text-sm text-gray-600">Hệ thống quản lý tổng quan</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors w-64"
                />
              </div>

              {/* Notifications */}
              <NotificationBell />

              {/* Settings */}
              <Button variant="ghost" size="sm" className="hover:bg-gray-100 rounded-xl">
                <Settings className="h-5 w-5" />
              </Button>

              {/* Profile */}
              <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-xs">A</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-sm">ĐSQ</span>
          </div>
          <p className="text-gray-600 font-medium">Đang tải trang quản lý...</p>
        </div>
      </div>
    }>
      <DashboardLayoutContent>
        {children}
      </DashboardLayoutContent>
    </Suspense>
  )
}
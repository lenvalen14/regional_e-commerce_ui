import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin - Đặc Sản Quê",
  description: "Trang quản lý đặc sản Việt Nam",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-gray-50">{children}</div>
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement login logic
    console.log("Login attempt:", { email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-orange-50">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-600 to-orange-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">ĐSQ</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Đặc Sản Quê</h1>
          <p className="text-gray-600 mt-2">Trang quản lý hệ thống</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Đăng nhập</CardTitle>
            <CardDescription className="text-center">Nhập thông tin để truy cập trang quản lý</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@dacsanque.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Đăng nhập
              </Button>
            </form>
            {/* Nút đăng nhập nhanh */}
            <Button
              type="button"
              variant="outline"
              className="w-full mt-2"
              onClick={() => router.push("/admin/dashboard")}
            >
              Đăng nhập nhanh
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

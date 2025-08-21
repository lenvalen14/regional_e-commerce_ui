"use client"

import React, { useState } from "react"
import { Save, Check } from "lucide-react"
import { toast } from "sonner"

export default function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // call API change password ở đây
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("Mật khẩu xác nhận không khớp")
        setIsLoading(false)
        return
      }

      setIsSubmitted(true)
      toast.success("Đổi mật khẩu thành công")
    } catch (err) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow rounded-3xl p-6">
      {/* Title */}
      <h2 className="text-2xl font-semibold">Đổi mật khẩu</h2>
      <p className="text-gray-500 mb-6">
        Cập nhật mật khẩu mới để bảo mật tài khoản của bạn.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Mật khẩu hiện tại
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Nhập mật khẩu hiện tại"
            className="w-full rounded-full border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Mật khẩu mới
          </label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Nhập mật khẩu mới"
            className="w-full rounded-full border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Xác nhận mật khẩu
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Nhập lại mật khẩu mới"
            className="w-full rounded-full border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center gap-2 bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition w-fit ml-auto"
        >
          {isLoading ? (
            "Đang lưu..."
          ) : isSubmitted ? (
            <>
              <Check className="w-5 h-5" /> Đã lưu
            </>
          ) : (
            <>
              <Save className="w-5 h-5" /> Lưu thay đổi
            </>
          )}
        </button>
      </form>
    </div>
  )
}

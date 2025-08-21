"use client"

import React, { useState } from "react"
import { Lock, Eye, EyeOff, Save } from "lucide-react"

interface ChangePasswordProps {
	loading?: boolean
	onSubmit?: (currentPassword: string, newPassword: string, confirmPassword: string) => void
}

export default function ChangePassword({ loading = false, onSubmit }: ChangePasswordProps) {
	const [currentPassword, setCurrentPassword] = useState("")
	const [newPassword, setNewPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [showCurrent, setShowCurrent] = useState(false)
	const [showNew, setShowNew] = useState(false)
	const [showConfirm, setShowConfirm] = useState(false)

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (onSubmit) onSubmit(currentPassword, newPassword, confirmPassword)
	}

	return (
		<div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden w-full">
			{/* Header */}
			<div className="bg-gradient-to-r from-[#8FBC8F] to-[#7CA87C] p-6 flex items-center justify-between">
				<h3 className="font-nitti font-bold text-white text-lg tracking-wide">ĐỔI MẬT KHẨU</h3>
			</div>

			{/* Body */}
			<div className="p-6">
				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Current Password */}
					<div>
						<label className="block text-gray-700 font-nitti mb-1">Mật khẩu hiện tại</label>
						<div className="relative">
							<input
								type={showCurrent ? "text" : "password"}
								value={currentPassword}
								onChange={(e) => setCurrentPassword(e.target.value)}
								disabled={loading}
								className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]"
								placeholder="Nhập mật khẩu hiện tại"
							/>
							<button
								type="button"
								onClick={() => setShowCurrent(!showCurrent)}
								className="absolute right-3 top-2.5 text-gray-400"
							>
								{showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
							</button>
						</div>
					</div>

					{/* New Password */}
					<div>
						<label className="block text-gray-700 font-nitti mb-1">Mật khẩu mới</label>
						<div className="relative">
							<input
								type={showNew ? "text" : "password"}
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								disabled={loading}
								className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]"
								placeholder="Nhập mật khẩu mới"
							/>
							<button
								type="button"
								onClick={() => setShowNew(!showNew)}
								className="absolute right-3 top-2.5 text-gray-400"
							>
								{showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
							</button>
						</div>
					</div>

					{/* Confirm Password */}
					<div>
						<label className="block text-gray-700 font-nitti mb-1">Xác nhận mật khẩu</label>
						<div className="relative">
							<input
								type={showConfirm ? "text" : "password"}
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								disabled={loading}
								className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]"
								placeholder="Nhập lại mật khẩu mới"
							/>
							<button
								type="button"
								onClick={() => setShowConfirm(!showConfirm)}
								className="absolute right-3 top-2.5 text-gray-400"
							>
								{showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
							</button>
						</div>
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						disabled={loading}
						className="w-full inline-flex items-center justify-center gap-2 bg-[#8FBC8F] hover:bg-[#7CA87C] text-white px-4 py-2 rounded-lg transition-all disabled:opacity-60"
					>
						<Save className="w-4 h-4" />
						<span className="font-nitti">Đổi mật khẩu</span>
					</button>
				</form>

				{loading && (
					<div className="text-center py-4">
						<div className="w-12 h-12 rounded-full border-4 border-[#8FBC8F]/30 border-t-[#8FBC8F] animate-spin mx-auto" />
						<p className="text-gray-600 font-nitti mt-2">Đang xử lý...</p>
					</div>
				)}
			</div>
		</div>
	)
}

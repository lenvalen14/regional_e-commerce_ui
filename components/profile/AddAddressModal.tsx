import React, { useState, useEffect } from "react"
import { X, MapPin, Phone, Star } from "lucide-react"
import type { AddressResponse } from "./AddressList"

// --- DANH SÁCH 34 TỈNH THÀNH MỚI ---
const newVietnamProvinces = [
    "An Giang", "Bắc Ninh", "Cà Mau", "Cao Bằng", "Đắk Lắk", "Điện Biên",
    "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Tĩnh", "Hưng Yên", "Khánh Hoà",
    "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Nghệ An", "Ninh Bình",
    "Phú Thọ", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sơn La", "Tây Ninh",
    "Thái Nguyên", "Thanh Hóa", "TP. Cần Thơ", "TP. Đà Nẵng", "TP. Hà Nội",
    "TP. Hải Phòng", "TP. Hồ Chí Minh", "TP. Huế", "Tuyên Quang", "Vĩnh Long"
];

interface AddAddressModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (payload: Omit<AddressResponse, 'addressId'>) => void
    loading?: boolean
}

export default function AddAddressModal({ isOpen, onClose, onSubmit, loading = false }: AddAddressModalProps) {
    const [addressLine, setAddressLine] = useState("")
    const [province, setProvince] = useState("")
    const [phone, setPhone] = useState("")
    const [isDefault, setIsDefault] = useState(false)
    const [errors, setErrors] = useState<{ [k: string]: string }>({})

    useEffect(() => {
        if (!isOpen) {
            setAddressLine("")
            setProvince("")
            setPhone("")
            setIsDefault(false)
            setErrors({})
        }
    }, [isOpen])

    const validate = () => {
        const e: { [k: string]: string } = {}
        if (!addressLine.trim()) e.addressLine = "Vui lòng nhập địa chỉ chi tiết"
        if (!province.trim()) e.province = "Vui lòng chọn tỉnh/thành phố"
        if (!phone.trim()) e.phone = "Vui lòng nhập số điện thoại"
        else if (!/^[0-9]{9,11}$/.test(phone)) e.phone = "Số điện thoại không hợp lệ"
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleSubmit = () => {
        if (loading) return
        if (!validate()) return
        onSubmit({ addressLine, province, phone, isDefault })
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#8FBC8F] to-[#7CA87C] px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-nitti font-bold text-white text-lg tracking-wide">Thêm địa chỉ mới</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ chi tiết</label>
                        <input
                            type="text"
                            value={addressLine}
                            onChange={(e) => setAddressLine(e.target.value)}
                            placeholder="Số nhà, đường, phường/xã..."
                            className={`w-full px-4 py-3 rounded-lg border ${errors.addressLine ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-[#8FBC8F] focus:border-[#8FBC8F]`}
                        />
                        {errors.addressLine && <p className="text-sm text-red-600 mt-1">{errors.addressLine}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tỉnh/Thành phố</label>
                            <select
                                value={province}
                                onChange={(e) => setProvince(e.target.value)}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.province ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-[#8FBC8F] focus:border-[#8FBC8F] bg-white`}
                            >
                                <option value="" disabled>-- Chọn tỉnh/thành phố --</option>
                                {newVietnamProvinces.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                            {errors.province && <p className="text-sm text-red-600 mt-1">{errors.province}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="VD: 0901234567"
                                    className={`w-full pl-10 px-4 py-3 rounded-lg border ${errors.phone ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-[#8FBC8F] focus:border-[#8FBC8F]`}
                                />
                            </div>
                            {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                        </div>
                    </div>

                    <label className="inline-flex items-center gap-2 select-none">
                        <input
                            type="checkbox"
                            checked={isDefault}
                            onChange={(e) => setIsDefault(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-[#8FBC8F] focus:ring-[#8FBC8F]"
                        />
                        <span className="text-sm text-gray-700 flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-[#8FBC8F]" />
                            Đặt làm địa chỉ mặc định
                        </span>
                    </label>
                </div>

                {/* Footer */}
                <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition disabled:opacity-60"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg bg-[#8FBC8F] hover:bg-[#7CA87C] text-white transition disabled:opacity-60"
                    >
                        {loading ? "Đang xử lý..." : "Thêm địa chỉ"}
                    </button>
                </div>
            </div>
        </div>
    )
}

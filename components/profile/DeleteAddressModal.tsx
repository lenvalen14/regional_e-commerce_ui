import React from "react"
import { Trash2, MapPin, AlertTriangle } from "lucide-react"
import type { AddressResponse } from "./AddressList"

interface DeleteAddressModalProps {
	isOpen: boolean
	address: AddressResponse | null
	onClose: () => void
	onConfirm: (address: AddressResponse) => void
	loading?: boolean
}

export default function DeleteAddressModal({ isOpen, address, onClose, onConfirm, loading = false }: DeleteAddressModalProps) {
	if (!isOpen || !address) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
			<div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
				<div className="px-6 py-6 text-center">
					<div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
						<AlertTriangle className="w-8 h-8 text-red-600" />
					</div>
					<h3 className="font-nitti font-bold text-gray-900 text-lg mb-2">Xóa địa chỉ</h3>
					<p className="text-gray-600 mb-6">Bạn có chắc chắn muốn xóa địa chỉ này? Hành động này không thể hoàn tác.</p>
					<div className="p-4 rounded-lg bg-gray-50 border border-gray-100 text-left">
						<div className="flex items-start gap-3">
							<MapPin className="w-5 h-5 text-[#8FBC8F] mt-0.5" />
							<div>
								<p className="font-medium text-gray-900">{address.addressLine}</p>
								<p className="text-sm text-gray-600">{address.province} • {address.phone}</p>
							</div>
						</div>
					</div>
				</div>
				<div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
					<button onClick={onClose} disabled={loading} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition disabled:opacity-60">Hủy</button>
					<button onClick={() => onConfirm(address)} disabled={loading} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-60 inline-flex items-center gap-2">
						<Trash2 className="w-4 h-4" />
						Xóa địa chỉ
					</button>
				</div>
			</div>
		</div>
	)
}

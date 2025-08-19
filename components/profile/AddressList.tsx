import React from "react"
import { MapPin, Phone, Star, Edit2, Trash2, Plus } from "lucide-react"

export interface AddressResponse {
	addressId: string
	addressLine: string
	province: string
	phone: string
	isDefault: boolean
}

interface AddressListProps {
	addresses?: AddressResponse[] | null
	loading?: boolean
	onAdd?: () => void
	onEdit?: (address: AddressResponse) => void
	onDelete?: (address: AddressResponse) => void
	onSetDefault?: (address: AddressResponse) => void
}

export default function AddressList({
	addresses = [],
	loading = false,
	onAdd,
	onEdit,
	onDelete,
	onSetDefault,
}: AddressListProps) {

    const safeAddresses = addresses || [];

	return (
		<div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
			{/* Header */}
			<div className="bg-gradient-to-r from-[#8FBC8F] to-[#7CA87C] p-6 flex items-center justify-between">
				<h3 className="font-nitti font-bold text-white text-lg tracking-wide">
					ĐỊA CHỈ CỦA TÔI
				</h3>
				<button
					onClick={onAdd}
					disabled={loading}
					className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all disabled:opacity-60"
				>
					<Plus className="w-4 h-4" />
					<span className="font-nitti">Thêm địa chỉ</span>
				</button>
			</div>

			{/* Body */}
			<div className="p-6">
				{loading ? (
					<div className="text-center py-12">
						<div className="w-12 h-12 rounded-full border-4 border-[#8FBC8F]/30 border-t-[#8FBC8F] animate-spin mx-auto mb-4" />
						<p className="text-gray-600 font-nitti">Đang tải danh sách địa chỉ...</p>
					</div>
                // SỬA ĐỔI: Sử dụng biến an toàn đã kiểm tra
				) : safeAddresses.length === 0 ? (
					<div className="text-center py-12">
						<div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
							<MapPin className="w-7 h-7 text-gray-400" />
						</div>
						<h4 className="font-nitti font-semibold text-gray-900 mb-1">Chưa có địa chỉ nào</h4>
						<p className="text-gray-500 mb-4">Hãy thêm địa chỉ mới để thuận tiện cho việc giao hàng.</p>
						<button
							onClick={onAdd}
							className="inline-flex items-center gap-2 bg-[#8FBC8F] hover:bg-[#7CA87C] text-white px-4 py-2 rounded-lg transition-all"
						>
							<Plus className="w-4 h-4" />
							<span className="font-nitti">Thêm địa chỉ</span>
						</button>
					</div>
				) : (
					<>
						<ul className="space-y-4">
							{safeAddresses.map((addr) => (
								<li
									key={addr.addressId}
									className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-all"
								>
									<div className="flex items-start justify-between gap-4">
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-2">
												<MapPin className="w-4 h-4 text-[#8FBC8F]" />
												<p className="font-nitti font-semibold text-gray-900">
													{addr.addressLine}
												</p>
												{addr.isDefault && (
													<span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-[#8FBC8F]/10 text-[#8FBC8F] border border-[#8FBC8F]/30">
														<Star className="w-3 h-3 fill-[#8FBC8F] text-[#8FBC8F]" />
														Mặc định
													</span>
												)}
											</div>
											<div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600">
												<div className="flex items-center gap-2">
													<span className="text-gray-500">Tỉnh/TP:</span>
													<span className="font-medium">{addr.province}</span>
												</div>
												<div className="flex items-center gap-2">
													<Phone className="w-4 h-4 text-gray-400" />
													<span className="font-medium">{addr.phone}</span>
												</div>
											</div>
										</div>

										<div className="flex items-center gap-2">
											{!addr.isDefault && (
												<button
													onClick={() => onSetDefault?.(addr)}
													className="px-3 py-2 text-[#8FBC8F] hover:text-white border border-[#8FBC8F] hover:bg-[#8FBC8F] rounded-lg transition-all font-nitti"
												>
													Đặt mặc định
												</button>
											)}
											<button
												onClick={() => onEdit?.(addr)}
												className="inline-flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-[#8FBC8F] hover:bg-[#8FBC8F]/10 rounded-lg transition-all"
												title="Chỉnh sửa"
											>
												<Edit2 className="w-4 h-4" />
												<span className="font-nitti">Sửa</span>
											</button>
											<button
												onClick={() => onDelete?.(addr)}
												className="inline-flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
												title="Xóa"
											>
												<Trash2 className="w-4 h-4" />
												<span className="font-nitti">Xóa</span>
											</button>
										</div>
									</div>
								</li>
							))}
						</ul>
						<p className="text-xs text-gray-500 mt-4">Mẹo: Nên đặt 1 địa chỉ mặc định để việc đặt hàng nhanh hơn.</p>
					</>
				)}
			</div>
		</div>
	)
}
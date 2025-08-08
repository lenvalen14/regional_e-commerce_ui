import React from "react";
import { Eye } from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
}

interface OrderCardProps {
  order: Order;
  getStatusInfo: (status: string) => any;
  formatPrice: (price: number) => string;
  formatDate: (dateStr: string) => string;
}

export function OrderCard({ order, getStatusInfo, formatPrice, formatDate }: OrderCardProps) {
  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-nitti font-medium text-[#2F3E34] text-lg">
            Đơn hàng #{order.id}
          </h3>
          <p className="font-nitti text-sm text-gray-600 mt-1">
            Ngày đặt: {formatDate(order.date)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-nitti font-medium ${statusInfo.color}`}>
            <StatusIcon className="h-3 w-3" />
            {statusInfo.label}
          </span>
        </div>
      </div>
      {/* Order Items */}
      <div className="space-y-2 mb-4">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
            <div className="flex-1">
              <p className="font-nitti text-sm text-[#2F3E34]">{item.name}</p>
              <p className="font-nitti text-xs text-gray-600">Số lượng: {item.quantity}</p>
            </div>
            <p className="font-nitti text-sm font-medium text-[#2F3E34]">
              {formatPrice(item.price)}
            </p>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md font-nitti text-sm hover:bg-gray-50 transition-colors">
          <Eye className="h-4 w-4" />
          Xem chi tiết
        </button>
        <div className="text-right">
          <p className="font-nitti text-sm text-gray-600">Tổng tiền:</p>
          <p className="font-nitti text-lg font-bold text-[#2F3E34]">
            {formatPrice(order.total)}
          </p>
        </div>
      </div>
    </div>
  );
}

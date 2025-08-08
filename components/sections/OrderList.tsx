import React from "react";
import { Package } from "lucide-react";
import { OrderCard } from "./OrderCard";

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

interface OrderListProps {
  orders: Order[];
  getStatusInfo: (status: string) => any;
  formatPrice: (price: number) => string;
  formatDate: (dateStr: string) => string;
}

export function OrderList({ orders, getStatusInfo, formatPrice, formatDate }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="font-nitti text-gray-600">Không có đơn hàng nào</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          getStatusInfo={getStatusInfo}
          formatPrice={formatPrice}
          formatDate={formatDate}
        />
      ))}
    </div>
  );
}

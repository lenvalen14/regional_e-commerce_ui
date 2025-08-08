'use client';

import { useState } from "react";

import { SiteHeader } from "@/components/sections/Header";
import { OrderTabs } from "@/components/sections/OrderTabs";
import { OrderList } from "@/components/sections/OrderList";
import { Truck, CheckCircle, Clock, XCircle, Package } from "lucide-react";

const mockOrders = [
  {
    id: "DH001",
    date: "2024-08-05",
    status: "delivered",
    total: 450000,
    items: [
      { name: "Bánh tráng nướng Đà Lạt", quantity: 2, price: 150000 },
      { name: "Mắm ruốc Phan Thiết", quantity: 1, price: 150000 }
    ]
  },
  {
    id: "DH002", 
    date: "2024-08-04",
    status: "shipping",
    total: 320000,
    items: [
      { name: "Chà bông Hương Việt", quantity: 1, price: 180000 },
      { name: "Bánh đậu xanh Hải Dương", quantity: 2, price: 70000 }
    ]
  },
  {
    id: "DH003",
    date: "2024-08-02", 
    status: "processing",
    total: 280000,
    items: [
      { name: "Tôm khô Cà Mau", quantity: 1, price: 280000 }
    ]
  },
  {
    id: "DH004",
    date: "2024-08-01",
    status: "cancelled", 
    total: 200000,
    items: [
      { name: "Bánh tráng cuốn thịt heo", quantity: 1, price: 200000 }
    ]
  }
];

const getStatusInfo = (status: string) => {
  switch (status) {
    case "processing":
      return { 
        label: "Đang xử lý", 
        color: "text-yellow-600 bg-yellow-100",
        icon: Clock
      };
    case "shipping":
      return { 
        label: "Đang giao", 
        color: "text-blue-600 bg-blue-100",
        icon: Truck
      };
    case "delivered":
      return { 
        label: "Đã giao", 
        color: "text-green-600 bg-green-100",
        icon: CheckCircle
      };
    case "cancelled":
      return { 
        label: "Đã hủy", 
        color: "text-red-600 bg-red-100",
        icon: XCircle
      };
    default:
      return { 
        label: "Không xác định", 
        color: "text-gray-600 bg-gray-100",
        icon: Package
      };
  }
};

export default function OrdersPage() {
  const [selectedTab, setSelectedTab] = useState("all");

  const filteredOrders = selectedTab === "all" 
    ? mockOrders 
    : mockOrders.filter(order => order.status === selectedTab);

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-beaululo text-[#2F3E34] mb-8">Đơn hàng của tôi</h1>
          <OrderTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
          <OrderList
            orders={filteredOrders}
            getStatusInfo={getStatusInfo}
            formatPrice={formatPrice}
            formatDate={formatDate}
          />
        </div>
      </div>
    </div>
  );
}
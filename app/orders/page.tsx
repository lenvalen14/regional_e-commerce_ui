'use client';

import { useState } from "react";
import { SiteHeader } from "@/components/sections/Header";
import { Package, Eye, Truck, CheckCircle, Clock, XCircle } from "lucide-react";

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

const getStatusInfo = (status) => {
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

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-beaululo text-[#2F3E34] mb-8">Đơn hàng của tôi</h1>
          
          {/* Status Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="flex border-b border-gray-200">
              {[
                { key: "all", label: "Tất cả" },
                { key: "processing", label: "Đang xử lý" },
                { key: "shipping", label: "Đang giao" },
                { key: "delivered", label: "Đã giao" },
                { key: "cancelled", label: "Đã hủy" }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key)}
                  className={`px-6 py-3 font-nitti font-medium transition-colors ${
                    selectedTab === tab.key
                      ? 'text-[#8FBC8F] border-b-2 border-[#8FBC8F]'
                      : 'text-gray-600 hover:text-[#8FBC8F]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="font-nitti text-gray-600">Không có đơn hàng nào</p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
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
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
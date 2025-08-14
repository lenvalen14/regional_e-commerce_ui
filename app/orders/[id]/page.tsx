'use client';

import { use } from 'react';
import { SiteHeader } from "@/components/layout/Header";
import { SiteFooter } from "@/components/layout/Footer";
import { OrderStatusTracker } from "@/components/orders/OrderStatusTracker";
import { OrderDetailInfo } from "@/components/orders/OrderDetailInfo";
import { OrderActions } from "@/components/orders/OrderActions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>
}

// Mock data cho demo
const mockOrder = {
  id: "250812MNTGN423",
  date: "2025-08-12",
  status: "completed",
  total: 1105500,
  customerInfo: {
    name: "Phan Phạm Ngọc Thạch",
    phone: "0123456789",
    email: "pngthach@gmail.com",
    address: "123 Nguyễn Văn Linh, Phường Tân Phú, TP. Hồ Chí Minh"
  },
  paymentMethod: "COD",
  shippingMethod: "Giao hàng tiêu chuẩn",
  items: [
    {
      id: "1",
      name: "Bánh tráng nướng Tây Ninh",
      variant: "Hộp 500g",
      quantity: 2,
      price: 150000,
      image: "/images/products/banh-trang-nuong.jpg"
    },
    {
      id: "2", 
      name: "Mắm tôm Cà Mau",
      variant: "Hũ 250g",
      quantity: 1,
      price: 250000,
      image: "/images/products/mam-tom.jpg"
    },
    {
      id: "3",
      name: "Chà bông gà Đà Lạt", 
      variant: "Hũ 200g",
      quantity: 3,
      price: 180000,
      image: "/images/products/cha-bong-ga.jpg"
    }
  ],
  statusHistory: [
    {
      status: "confirmed",
      label: "Đơn Hàng Đã Đặt",
      date: "22:10 12-08-2025",
      completed: true
    },
    {
      status: "paid",
      label: "Đơn Hàng Đã Thanh Toán",
      amount: "1.105.500",
      date: "22:11 12-08-2025", 
      completed: true
    },
    {
      status: "shipping",
      label: "Đã Giao Cho ĐVVC",
      date: "10:48 13-08-2025",
      completed: true
    },
    {
      status: "delivered",
      label: "Đã Nhận Được Hàng",
      date: "13:02 14-08-2025",
      completed: true
    },
    {
      status: "rated",
      label: "Đánh Giá",
      date: "",
      completed: false
    }
  ]
};

export default function OrderDetailPage({ params }: Props) {
  const { id } = use(params);

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back button và header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/orders"
              className="flex items-center gap-2 text-gray-600 hover:text-[#8FBC8F] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-nitti">TRỞ LẠI</span>
            </Link>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>MÃ ĐƠN HÀNG: {mockOrder.id}</span>
              <span>|</span>
              <span className="text-[#E53935] font-medium">ĐƠN HÀNG ĐÃ HOÀN THÀNH</span>
            </div>
          </div>
        </div>

        {/* Order Status Tracker */}
        <div className="mb-8">
          <OrderStatusTracker statusHistory={mockOrder.statusHistory} />
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Info */}
          <div className="lg:col-span-2">
            <OrderDetailInfo order={mockOrder} />
          </div>
          
          {/* Actions */}
          <div className="lg:col-span-1">
            <OrderActions order={mockOrder} />
          </div>
        </div>
      </div>
      
      <SiteFooter />
    </div>
  );
}

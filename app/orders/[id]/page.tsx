'use client';

import { use } from 'react';
import { SiteHeader } from "@/components/layout/Header";
import { SiteFooter } from "@/components/layout/Footer";
import { OrderStatusTracker } from "@/components/orders/OrderStatusTracker";
import { OrderDetailInfo } from "@/components/orders/OrderDetailInfo";
import { OrderActions } from "@/components/orders/OrderActions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useGetOrderQuery } from "@/features/order/orderApi";

interface Props {
  params: Promise<{ id: string }>
}

export default function OrderDetailPage({ params }: Props) {
  const { id } = use(params);
  
  const { data: orderResponse, isLoading, error } = useGetOrderQuery(id);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#8FBC8F] mx-auto"></div>
            <p className="mt-4 text-gray-600 font-nitti">Đang tải thông tin đơn hàng...</p>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (error || !orderResponse?.data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center py-20">
            <p className="text-red-600 font-nitti">Không thể tải thông tin đơn hàng</p>
            <Link 
              href="/orders"
              className="mt-4 inline-block text-[#8FBC8F] hover:underline font-nitti"
            >
              ← Quay lại danh sách đơn hàng
            </Link>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const order = orderResponse.data;

  // Convert order data to match component interface
  const orderDetail = {
    id: order.orderId,
    date: new Date(order.orderDate).toISOString().split('T')[0],
    status: order.status.toLowerCase(),
    total: order.totalAmount,
    customerInfo: {
      name: order.userResponse.userName,
      phone: order.addressResponse.phone,
      email: order.userResponse.email,
      address: `${order.addressResponse.addressLine}, ${order.addressResponse.province}`
    },
    paymentMethod: order.status === 'PENDING' ? 'Chờ thanh toán' : 'COD',
    shippingMethod: 'Giao hàng tiêu chuẩn',
    items: order.orderItemResponses.map(item => ({
      id: item.productResponse.productId,
      name: item.productResponse.productName,
      variant: 'Mặc định', // Backend không có variant
      quantity: item.quantity,
      price: item.unitPrice,
      image: item.productResponse.imageProductResponseList?.[0]?.imageUrl || '/images/products-default.png'
    }))
  };

  // Mock status history for now - you can enhance this later
  const statusHistory = [
    {
      status: "confirmed",
      label: "Đơn Hàng Đã Đặt",
      date: new Date(order.orderDate).toLocaleDateString('vi-VN'),
      completed: true
    },
    {
      status: "paid",
      label: "Đơn Hàng Đã Thanh Toán",
      date: order.status !== 'PENDING' ? new Date(order.orderDate).toLocaleDateString('vi-VN') : '',
      completed: order.status !== 'PENDING'
    },
    {
      status: "shipping",
      label: "Đã Giao Cho ĐVVC",
      date: order.status === 'SHIPPED' || order.status === 'COMPLETED' ? '' : '',
      completed: order.status === 'SHIPPED' || order.status === 'COMPLETED'
    },
    {
      status: "delivered",
      label: "Đã Nhận Được Hàng",
      date: order.status === 'COMPLETED' ? '' : '',
      completed: order.status === 'COMPLETED'
    }
  ];

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
              <span>MÃ ĐƠN HÀNG: {orderDetail.id}</span>
            </div>
          </div>
        </div>

        {/* Order status tracker */}
        <div className="mb-8">
          <OrderStatusTracker statusHistory={statusHistory} />
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chi tiết đơn hàng */}
          <div className="lg:col-span-2">
            <OrderDetailInfo order={orderDetail} />
          </div>
          
          {/* Hành động */}
          <div className="lg:col-span-1">
            <OrderActions order={orderDetail} />
          </div>
        </div>
      </div>
      
      <SiteFooter />
    </div>
  );
}

'use client';


import { useState } from "react";
import { SiteHeader } from "@/components/layout/Header";
import { OrderTabs } from "@/components/orders/OrderTabs";
import { OrderList } from "@/components/orders/OrderList";
import { Truck, CheckCircle, Clock, XCircle, Package } from "lucide-react";
import { useGetOrdersQuery } from "@/features/order/orderApi";

const getStatusInfo = (status: string) => {
  switch (status) {
    case "PENDING":
      return { label: "Chờ xác nhận", color: "text-yellow-600 bg-yellow-100", icon: Clock };
    case "CONFIRM":
      return { label: "Đã xác nhận", color: "text-blue-600 bg-blue-100", icon: Truck };
    case "SHIPPED":
      return { label: "Đang giao", color: "text-blue-600 bg-blue-100", icon: Truck };
    case "COMPLETED":
      return { label: "Đã giao", color: "text-green-600 bg-green-100", icon: CheckCircle };
    case "CANCELLED":
      return { label: "Đã hủy", color: "text-red-600 bg-red-100", icon: XCircle };
    default:
      return { label: "Không xác định", color: "text-gray-600 bg-gray-100", icon: Package };
  }
};

export default function OrdersPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const { data, isLoading, isError, error } = useGetOrdersQuery({ page: 0, size: 20, status: selectedTab === "all" ? undefined : selectedTab });

  // Map dữ liệu từ BE về đúng props FE cần
  const orders = (data?.data || []).map(order => ({
    id: order.orderId,
    date: order.orderDate ? new Date(order.orderDate).toISOString() : '',
    status: order.status,
    total: order.totalAmount,
    items: (order.orderItemResponses || []).map(item => ({
      name: item.productResponse.productName,
      quantity: item.quantity,
      price: item.unitPrice
    }))
  }));

  // Sắp xếp đơn hàng mới nhất lên đầu
  const sortedOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const filteredOrders = sortedOrders;

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + 'đ';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  let showNoOrders = false;
  if (
    isError &&
    error &&
    typeof error === 'object' &&
    'data' in error &&
    error.data &&
    typeof error.data === 'object' &&
    'message' in error.data &&
    (error.data as { message?: string }).message === 'No orders found'
  ) {
    showNoOrders = true;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-beaululo text-[#2F3E34] mb-8">Đơn hàng của tôi</h1>
          <OrderTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
          {isLoading ? (
            <div className="text-center py-10 text-gray-500 font-nitti">Đang tải đơn hàng...</div>
          ) : showNoOrders ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9-4 9 4M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7" /></svg>
              <p className="font-nitti text-gray-600">Không có đơn hàng nào</p>
            </div>
          ) : isError ? null : (
            <OrderList
              orders={filteredOrders}
              getStatusInfo={getStatusInfo}
              formatPrice={formatPrice}
              formatDate={formatDate}
            />
          )}
          {/* Nếu là lỗi khác ngoài 404 thì mới hiện lỗi đỏ */}
          {!showNoOrders && isError && (
            <div className="text-center py-10 text-red-500 font-nitti">Không thể tải đơn hàng. Vui lòng thử lại sau.</div>
          )}
        </div>
      </div>
    </div>
  );
}
'use client';

import { SiteHeader } from "@/components/layout/Header";
import { SiteFooter } from "@/components/layout/Footer";
import { CheckoutForm } from "@/components/payment/CheckoutForm";
import { OrderSummary } from "@/components/payment/OrderSummary";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CheckoutPage() {
  const { state } = useCart();
  const router = useRouter();

  // Redirect nếu giỏ hàng trống
  useEffect(() => {
    if (state.items.length === 0) {
      router.push('/cart');
    }
  }, [state.items.length, router]);

  if (state.items.length === 0) {
    return null; // Hoặc loading spinner
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <a href="/cart" className="hover:text-[#8FBC8F]">Giỏ hàng</a>
          <span>›</span>
          <span className="text-[#2F3E34] font-medium">Thanh toán</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-beaululo text-[#2F3E34] tracking-widest mb-4">
            THANH TOÁN
          </h1>
          <p className="text-gray-600 font-nitti">
            Vui lòng điền đầy đủ thông tin để hoàn tất đơn hàng
          </p>
        </div>

        {/* Checkout Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form thanh toán */}
          <div className="lg:col-span-2">
            <CheckoutForm />
          </div>
          
          {/* Tóm tắt đơn hàng */}
          <div className="lg:col-span-1">
            <OrderSummary />
          </div>
        </div>
      </div>
      
      <SiteFooter />
    </div>
  );
}

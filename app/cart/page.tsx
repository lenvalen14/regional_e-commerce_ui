'use client';

import { SiteHeader } from "@/components/layout/Header";
import { SiteFooter } from "@/components/layout/Footer";
import { CartItems } from "@/components/cart/CartItems";
import { CartSummary } from "@/components/cart/CartSummary";
import { useCart } from "@/contexts/CartContext";

export default function CartPage() {
  const { state } = useCart();

  return (
    <>
      <SiteHeader />
      <main className="py-16 min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl md:text-4xl font-beaululo text-[#2F3E34] text-center mb-10 tracking-widest uppercase">
            Giỏ Hàng Của Bạn
          </h1>
          
          {state.items.length === 0 ? (
            // Khi giỏ hàng trống - hiển thị ở giữa màn hình
            <CartItems />
          ) : (
            // Khi có sản phẩm - dùng grid layout
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <CartItems />
              </div>
              <div className="lg:col-span-1">
                <CartSummary />
              </div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
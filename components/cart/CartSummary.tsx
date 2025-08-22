'use client';

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

export function CartSummary() {
  const { state } = useCart();

  const subtotal = state.total;
  const total = subtotal; // Không có phí vận chuyển

  if (state.items.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
      <h3 className="text-lg font-beaululo text-[#2F3E34] mb-6 tracking-widest uppercase">
        Tóm tắt đơn hàng
      </h3>

      <div className="space-y-4 mb-6">
        {/* Chi tiết từng sản phẩm */}
        <div className="space-y-3">
          {state.items.map((item) => (
            <div key={item.id} className="flex justify-between items-start font-nitti text-sm">
              <div className="flex-1 pr-2">
                <span className="text-[#2F3E34] font-medium">{item.name}</span>
                <div className="text-xs text-[#666] mt-1">
                  {item.quantity}
                </div>
              </div>
              <span className="text-[#2F3E34] font-medium whitespace-nowrap">
                {(item.price * item.quantity).toLocaleString()}đ
              </span>
            </div>
          ))}
        </div>

        <hr className="border-gray-200" />

        <div className="flex justify-between font-nitti">
          <span className="text-[#666]">Tạm tính:</span>
          <span className="text-[#2F3E34] font-medium">{subtotal.toLocaleString()}đ</span>
        </div>

        <hr className="border-gray-200" />

        <div className="flex justify-between font-nitti font-bold text-lg">
          <span className="text-[#2F3E34]">Tổng cộng:</span>
          <span className="text-[#E53935] text-xl">{total.toLocaleString()}đ</span>
        </div>
      </div>

      <div className="space-y-3">
        <Link
          href="/checkout"
          className="block w-full bg-[#8FBC8F] hover:bg-[#7CA87C] text-white py-3 rounded-full font-nitti font-bold tracking-widest transition-colors text-center"
        >
          Tiến hành thanh toán
        </Link>

        <Link
          href="/products"
          className="block w-full border border-[#8FBC8F] text-[#8FBC8F] hover:bg-[#8FBC8F] hover:text-white py-3 rounded-full font-nitti font-bold tracking-widest transition-colors text-center"
        >
          Tiếp tục mua sắm
        </Link>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-[#666] font-nitti">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>Thanh toán an toàn & bảo mật</span>
        </div>
      </div>
    </div>
  );
}
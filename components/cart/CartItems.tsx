'use client';

import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export function CartItems() {
  const { state, updateQuantity, removeItem } = useCart();

  if (state.items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="mb-6">
          <ShoppingBag className="h-16 w-16 text-[#888] mx-auto mb-4" />
          <p className="text-[#888] font-nitti text-lg mb-2">Giỏ hàng của bạn đang trống</p>
          <p className="text-[#666] font-nitti text-sm">Hãy thêm một số sản phẩm đặc sản để bắt đầu mua sắm!</p>
        </div>
        <Link
          href="/products"
          className="inline-block bg-[#8FBC8F] hover:bg-[#7CA87C] text-white px-8 py-3 rounded-full font-nitti font-bold tracking-widest transition-colors"
        >
          Khám phá sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-beaululo text-[#2F3E34] tracking-widest uppercase">
          Sản phẩm trong giỏ ({state.items.length})
        </h2>
      </div>

      {state.items.map((item) => (
        <Link
          key={item.id}
          href={`/products/${item.id}`}
          className="block bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-[#8FBC8F] cursor-pointer"
        >
          <div className="flex gap-4">
            <div className="w-24 h-24 relative flex-shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-nitti font-bold text-[#2F3E34] hover:text-[#8FBC8F] transition-colors">
                {item.name}
              </h3>
              {/* <p className="text-sm text-[#666] font-nitti mt-1">
                Phân loại: <span className="font-medium">{item.variant}</span>
              </p> */}
              <p className="text-lg font-nitti font-bold text-[#E53935] mt-2">
                {item.priceLabel}
              </p>
            </div>

            <div className="flex flex-col items-end justify-between">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeItem(item.id);
                }}
                className="text-red-500 hover:text-red-700 transition-colors p-1 z-10 relative"
                aria-label={`Xóa ${item.name}`}
              >
                <Trash2 className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 mt-4 z-10 relative">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    updateQuantity(item.id, item.quantity - 1);
                  }}
                  className="w-8 h-8 rounded border border-[#bbb] font-nitti text-lg transition-all duration-150 hover:bg-[#8FBC8F] hover:text-white hover:border-[#8FBC8F] disabled:opacity-50"
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-4 w-4 mx-auto" />
                </button>

                <span className="font-nitti text-base w-8 text-center font-medium">
                  {item.quantity}
                </span>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    updateQuantity(item.id, item.quantity + 1);
                  }}
                  className="w-8 h-8 rounded border border-[#bbb] font-nitti text-lg transition-all duration-150 hover:bg-[#8FBC8F] hover:text-white hover:border-[#8FBC8F]"
                >
                  <Plus className="h-4 w-4 mx-auto" />
                </button>
              </div>
            </div>
          </div>
        </Link>
      ))}

      <div className="pt-4">
        <Link
          href="/products"
          className="text-[#8FBC8F] hover:text-[#7CA87C] font-nitti font-medium transition-colors flex items-center gap-2"
        >
          ← Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
}
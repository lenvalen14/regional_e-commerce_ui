'use client';

import Link from "next/link";
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";

interface CartDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDropdown({ isOpen, onClose }: CartDropdownProps) {
  const { state, updateQuantity, removeItem } = useCart();

  return (
    <div className={`absolute right-0 top-full pt-2 w-96 z-50 transition-all duration-300 ease-in-out ${
      isOpen 
        ? 'opacity-100 visible transform translate-y-0' 
        : 'opacity-0 invisible transform -translate-y-2'
    }`}>
      {/* Invisible bridge để tạo vùng hover liền mạch */}
      <div className="h-2 w-full"></div>
      
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-beaululo text-[#2F3E34] font-medium tracking-widest uppercase">
            Giỏ hàng ({state.itemCount} sản phẩm)
          </h3>
        </div>

        {state.items.length === 0 ? (
          <div className="p-6 text-center">
            <ShoppingBag className="h-12 w-12 text-[#888] mx-auto mb-3" />
            <p className="text-[#888] font-nitti text-sm">Giỏ hàng trống</p>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="max-h-80 overflow-y-auto">
              {state.items.map((item, index) => (
                <Link
                  key={`${item.id}-${item.variant}`}
                  href={`/products/${item.id}`}
                  onClick={onClose}
                  className={`block p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
                    isOpen ? 'animate-fade-in-up' : ''
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex gap-3">
                    <div className="w-16 h-16 relative flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded transition-transform duration-200 hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = '/images/placeholder.jpg';
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-nitti font-medium text-[#2F3E34] text-sm truncate hover:text-[#8FBC8F] transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#666] font-nitti">
                        Phân loại: {item.variant}
                      </p>
                      <p className="text-sm font-nitti font-bold text-[#E53935] mt-1">
                        {item.priceLabel}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2 z-10 relative">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            updateQuantity(item.id, item.variant, item.quantity - 1);
                          }}
                          className="w-6 h-6 rounded border border-[#bbb] hover:bg-[#8FBC8F] hover:text-white hover:border-[#8FBC8F] disabled:opacity-50 flex items-center justify-center transition-all duration-200 hover:scale-110"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        
                        <span className="font-nitti text-sm w-6 text-center">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            updateQuantity(item.id, item.variant, item.quantity + 1);
                          }}
                          className="w-6 h-6 rounded border border-[#bbb] hover:bg-[#8FBC8F] hover:text-white hover:border-[#8FBC8F] flex items-center justify-center transition-all duration-200 hover:scale-110"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeItem(item.id, item.variant);
                      }}
                      className="text-red-500 hover:text-red-700 p-1 transition-all duration-200 hover:scale-110 z-10 relative"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </Link>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <span className="font-nitti text-[#666]">Tổng cộng:</span>
                <span className="font-nitti font-bold text-lg text-[#E53935]">
                  {state.total.toLocaleString()}đ
                </span>
              </div>
              
              <div className="space-y-2">
                <Link
                  href="/cart"
                  className="block w-full text-center border border-[#8FBC8F] text-[#8FBC8F] hover:bg-[#8FBC8F] hover:text-white py-2 rounded-full font-nitti font-medium text-sm tracking-widest transition-all duration-300 hover:scale-105"
                  onClick={onClose}
                >
                  Xem giỏ hàng
                </Link>
                
                <Link
                  href="/checkout"
                  className="block w-full text-center bg-[#8FBC8F] hover:bg-[#7CA87C] text-white py-2 rounded-full font-nitti font-bold text-sm tracking-widest transition-all duration-300 hover:scale-105"
                  onClick={onClose}
                >
                  Thanh toán
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
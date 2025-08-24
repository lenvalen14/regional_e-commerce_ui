'use client';

import { useCart } from "@/contexts/CartContext";

export function OrderSummary() {
  const { state } = useCart();
  
  const subtotal = state.total;
  const total = subtotal; // Không có phí vận chuyển

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
      <h3 className="text-xl font-beaululo text-[#2F3E34] mb-6 tracking-wider">
        TÓM TẮT ĐỚN HÀNG
      </h3>
      
      <div className="space-y-4 mb-6">
        {/* Chi tiết từng sản phẩm */}
        <div className="space-y-4">
          {state.items.map((item) => (
            <div key={item.id} className="flex gap-4">
              {/* Hình ảnh sản phẩm */}
              <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                <img 
                  src={item.image || '/images/products-default.png'} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Thông tin sản phẩm */}
              <div className="flex-1">
                <h4 className="font-nitti font-medium text-[#2F3E34] text-sm leading-tight">
                  {item.name}
                </h4>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-600">
                    Số lượng: {item.quantity}
                  </span>
                  <span className="font-nitti font-medium text-[#2F3E34]">
                    {(item.price * item.quantity).toLocaleString()}đ
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <hr className="border-gray-200" />
        
        {/* Tính toán */}
        <div className="space-y-3">
          <div className="flex justify-between font-nitti">
            <span className="text-gray-600">Tạm tính:</span>
            <span className="text-[#2F3E34]">{subtotal.toLocaleString()}đ</span>
          </div>
          
          <div className="flex justify-between font-nitti">
            <span className="text-gray-600">Phí vận chuyển:</span>
            <span className="text-[#8FBC8F]">Miễn phí</span>
          </div>
          
          <hr className="border-gray-200" />
          
          <div className="flex justify-between font-nitti font-bold text-lg">
            <span className="text-[#2F3E34]">Tổng cộng:</span>
            <span className="text-[#E53935] text-xl">{total.toLocaleString()}đ</span>
          </div>
        </div>
      </div>
      
      {/* Thông tin bảo mật */}
      <div className="pt-4 border-t border-gray-200">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 font-nitti">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Thanh toán an toàn & bảo mật</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 font-nitti">
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Đổi trả miễn phí trong 7 ngày</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 font-nitti">
            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            <span>Giao hàng nhanh toàn quốc</span>
          </div>
        </div>
      </div>
    </div>
  );
}

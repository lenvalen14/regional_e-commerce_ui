'use client';

import { useState } from "react";
import { CreditCard, Truck, MapPin, User, Mail, Phone } from "lucide-react";

export function CheckoutForm() {
  const [formData, setFormData] = useState({
    // Thông tin người nhận
    fullName: '',
    email: '',
    phone: '',
    
    // Địa chỉ giao hàng
    address: '',
    ward: '',
    city: '',
    note: '',
    
    // Phương thức thanh toán
    paymentMethod: 'cod',
    
    // Phương thức vận chuyển
    shippingMethod: 'standard'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý đặt hàng
    console.log('Order data:', formData);
    // Redirect đến trang xác nhận hoặc xử lý thanh toán
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Thông tin người nhận */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-[#8FBC8F]" />
          <h2 className="text-xl font-beaululo text-[#2F3E34] tracking-wider">
            THÔNG TIN NGƯỜI NHẬN
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-nitti font-medium text-[#2F3E34] mb-2">
              Họ và tên *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md font-nitti focus:outline-none focus:ring-2 focus:ring-[#8FBC8F] focus:border-[#8FBC8F]"
              placeholder="Nhập họ và tên"
            />
          </div>
          
          <div>
            <label className="block text-sm font-nitti font-medium text-[#2F3E34] mb-2">
              Số điện thoại *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md font-nitti focus:outline-none focus:ring-2 focus:ring-[#8FBC8F] focus:border-[#8FBC8F]"
              placeholder="Nhập số điện thoại"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-nitti font-medium text-[#2F3E34] mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md font-nitti focus:outline-none focus:ring-2 focus:ring-[#8FBC8F] focus:border-[#8FBC8F]"
              placeholder="Nhập email (không bắt buộc)"
            />
          </div>
        </div>
      </div>

      {/* Địa chỉ giao hàng */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="w-5 h-5 text-[#8FBC8F]" />
          <h2 className="text-xl font-beaululo text-[#2F3E34] tracking-wider">
            ĐỊA CHỈ GIAO HÀNG
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-nitti font-medium text-[#2F3E34] mb-2">
              Tỉnh/Thành phố *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md font-nitti focus:outline-none focus:ring-2 focus:ring-[#8FBC8F] focus:border-[#8FBC8F]"
              placeholder="Nhập tỉnh/thành phố"
            />
          </div>
          
          <div>
            <label className="block text-sm font-nitti font-medium text-[#2F3E34] mb-2">
              Phường/Xã *
            </label>
            <input
              type="text"
              name="ward"
              value={formData.ward}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md font-nitti focus:outline-none focus:ring-2 focus:ring-[#8FBC8F] focus:border-[#8FBC8F]"
              placeholder="Nhập phường/xã"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-nitti font-medium text-[#2F3E34] mb-2">
            Địa chỉ cụ thể *
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md font-nitti focus:outline-none focus:ring-2 focus:ring-[#8FBC8F] focus:border-[#8FBC8F]"
            placeholder="Số nhà, tên đường..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-nitti font-medium text-[#2F3E34] mb-2">
            Ghi chú đơn hàng
          </label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-md font-nitti focus:outline-none focus:ring-2 focus:ring-[#8FBC8F] focus:border-[#8FBC8F]"
            placeholder="Ghi chú cho người giao hàng (không bắt buộc)"
          />
        </div>
      </div>

      {/* Phương thức vận chuyển */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Truck className="w-5 h-5 text-[#8FBC8F]" />
          <h2 className="text-xl font-beaululo text-[#2F3E34] tracking-wider">
            PHƯƠNG THỨC VẬN CHUYỂN
          </h2>
        </div>
        
        <div className="space-y-3">
          <label className="flex items-center p-4 border border-gray-200 rounded-md hover:border-[#8FBC8F] cursor-pointer">
            <input
              type="radio"
              name="shippingMethod"
              value="standard"
              checked={formData.shippingMethod === 'standard'}
              onChange={handleInputChange}
              className="mr-3"
            />
            <div className="flex-1">
              <div className="font-nitti font-medium text-[#2F3E34]">
                Giao hàng tiêu chuẩn
              </div>
              <div className="text-sm text-gray-600">
                2-3 ngày làm việc • Miễn phí vận chuyển
              </div>
            </div>
            <div className="font-nitti font-bold text-[#8FBC8F]">
              Miễn phí
            </div>
          </label>
          
          <label className="flex items-center p-4 border border-gray-200 rounded-md hover:border-[#8FBC8F] cursor-pointer">
            <input
              type="radio"
              name="shippingMethod"
              value="express"
              checked={formData.shippingMethod === 'express'}
              onChange={handleInputChange}
              className="mr-3"
            />
            <div className="flex-1">
              <div className="font-nitti font-medium text-[#2F3E34]">
                Giao hàng nhanh
              </div>
              <div className="text-sm text-gray-600">
                1-2 ngày làm việc
              </div>
            </div>
            <div className="font-nitti font-bold text-[#E53935]">
              30,000đ
            </div>
          </label>
        </div>
      </div>

      {/* Phương thức thanh toán */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-5 h-5 text-[#8FBC8F]" />
          <h2 className="text-xl font-beaululo text-[#2F3E34] tracking-wider">
            PHƯƠNG THỨC THANH TOÁN
          </h2>
        </div>
        
        <div className="space-y-3">
          <label className="flex items-center p-4 border border-gray-200 rounded-md hover:border-[#8FBC8F] cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={formData.paymentMethod === 'cod'}
              onChange={handleInputChange}
              className="mr-3"
            />
            <div className="flex-1">
              <div className="font-nitti font-medium text-[#2F3E34]">
                Thanh toán khi nhận hàng (COD)
              </div>
              <div className="text-sm text-gray-600">
                Thanh toán bằng tiền mặt khi nhận hàng
              </div>
            </div>
          </label>
          
          <label className="flex items-center p-4 border border-gray-200 rounded-md hover:border-[#8FBC8F] cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="bank_transfer"
              checked={formData.paymentMethod === 'bank_transfer'}
              onChange={handleInputChange}
              className="mr-3"
            />
            <div className="flex-1">
              <div className="font-nitti font-medium text-[#2F3E34]">
                Chuyển khoản ngân hàng
              </div>
              <div className="text-sm text-gray-600">
                Chuyển khoản trước khi giao hàng
              </div>
            </div>
          </label>
          
          <label className="flex items-center p-4 border border-gray-200 rounded-md hover:border-[#8FBC8F] cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="momo"
              checked={formData.paymentMethod === 'momo'}
              onChange={handleInputChange}
              className="mr-3"
            />
            <div className="flex-1">
              <div className="font-nitti font-medium text-[#2F3E34]">
                Ví MoMo
              </div>
              <div className="text-sm text-gray-600">
                Thanh toán qua ví điện tử MoMo
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <button
          type="submit"
          className="w-full bg-[#8FBC8F] hover:bg-[#7CA87C] text-white py-4 rounded-full font-nitti font-bold text-lg tracking-widest transition-colors"
        >
          ĐẶT HÀNG NGAY
        </button>
        
        <p className="text-center text-sm text-gray-600 mt-4 font-nitti">
          Bằng cách đặt hàng, bạn đồng ý với{' '}
          <a href="/terms" className="text-[#8FBC8F] hover:underline">
            Điều khoản dịch vụ
          </a>{' '}
          và{' '}
          <a href="/privacy" className="text-[#8FBC8F] hover:underline">
            Chính sách bảo mật
          </a>{' '}
          của chúng tôi.
        </p>
      </div>
    </form>
  );
}

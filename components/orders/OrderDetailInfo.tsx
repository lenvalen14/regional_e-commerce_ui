'use client';

interface OrderItem {
  id: string;
  name: string;
  variant: string;
  quantity: number;
  price: number;
  image: string;
}

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  customerInfo: CustomerInfo;
  paymentMethod: string;
  shippingMethod: string;
  items: OrderItem[];
}

interface OrderDetailInfoProps {
  order: Order;
}

export function OrderDetailInfo({ order }: OrderDetailInfoProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = 0; // Miễn phí vận chuyển
  
  return (
    <div className="space-y-6">
      {/* Danh sách sản phẩm */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-beaululo text-[#2F3E34] mb-6 tracking-wider">
          ĐƠN HÀNG CỦA TÔI
        </h3>
        
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 border border-gray-100 rounded-lg">
              {/* Hình ảnh sản phẩm */}
              <div className="w-20 h-20 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                <img 
                  src={item.image || '/images/placeholder.jpg'} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Thông tin sản phẩm */}
              <div className="flex-1">
                <h4 className="font-nitti font-medium text-[#2F3E34] text-lg">
                  {item.name}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  Phân loại: {item.variant}
                </p>
                <p className="text-sm text-gray-600">
                  Số lượng: {item.quantity}
                </p>
              </div>
              
              {/* Giá */}
              <div className="text-right">
                <p className="font-nitti font-bold text-[#2F3E34] text-lg">
                  {formatPrice(item.price * item.quantity)}
                </p>
                <p className="text-sm text-gray-600">
                  {formatPrice(item.price)}/sản phẩm
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Tổng tiền */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="space-y-3">
            <div className="flex justify-between font-nitti">
              <span className="text-gray-600">Tạm tính:</span>
              <span className="text-[#2F3E34]">{formatPrice(subtotal)}</span>
            </div>
            
            <div className="flex justify-between font-nitti">
              <span className="text-gray-600">Phí vận chuyển:</span>
              <span className="text-[#2F3E34]">
                {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
              </span>
            </div>
            
            <div className="flex justify-between font-nitti font-bold text-xl pt-3 border-t border-gray-200">
              <span className="text-[#2F3E34]">Tổng cộng:</span>
              <span className="text-[#E53935]">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Thông tin giao hàng */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-beaululo text-[#2F3E34] mb-6 tracking-wider">
          THÔNG TIN GIAO HÀNG
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-nitti font-medium text-[#2F3E34] mb-3">
              Người nhận
            </h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Tên:</span> {order.customerInfo.name}</p>
              <p><span className="font-medium">SĐT:</span> {order.customerInfo.phone}</p>
              <p><span className="font-medium">Email:</span> {order.customerInfo.email}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-nitti font-medium text-[#2F3E34] mb-3">
              Địa chỉ giao hàng
            </h4>
            <p className="text-sm text-gray-600">
              {order.customerInfo.address}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
          <div>
            <h4 className="font-nitti font-medium text-[#2F3E34] mb-3">
              Phương thức thanh toán
            </h4>
            <p className="text-sm text-gray-600">
              {order.paymentMethod}
            </p>
          </div>
          
          <div>
            <h4 className="font-nitti font-medium text-[#2F3E34] mb-3">
              Phương thức vận chuyển
            </h4>
            <p className="text-sm text-gray-600">
              {order.shippingMethod}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

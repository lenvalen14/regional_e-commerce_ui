'use client';

import { useState } from "react";
import { useCancelOrderMutation } from "@/features/order/orderApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Star, MessageCircle, Phone, RefreshCw } from "lucide-react";

interface Order {
  id: string;
  status: string;
  total: number;
}

interface OrderActionsProps {
  order: Order;
}

export function OrderActions({ order }: OrderActionsProps) {
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();
  const router = useRouter();

  const handleRatingSubmit = () => {
    // Xử lý submit đánh giá
    console.log('Rating:', rating, 'Comment:', comment);
    setShowRating(false);
    // Hiển thị thông báo thành công
  };

  const isCompleted = order.status === 'completed';
  const canRate = isCompleted; // Có thể đánh giá khi đơn hàng hoàn thành

  const isPending = order.status === 'pending' || order.status === 'PENDING' || order.status === 'awaiting_confirmation';

  const handleCancelOrder = async () => {
    try {
      await cancelOrder(order.id).unwrap();
      toast.error('Huỷ đơn thất bại!');
      setShowCancelModal(false);
      router.refresh?.();
    } catch (err) {
      toast.success('Huỷ đơn hàng thành công!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Đánh giá sản phẩm */}
      {canRate && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-beaululo text-[#2F3E34] mb-4 tracking-wider">
            ĐÁNH GIÁ ĐƠN HÀNG
          </h3>
          
          {!showRating ? (
            <button
              onClick={() => setShowRating(true)}
              className="w-full bg-[#8FBC8F] hover:bg-[#7CA87C] text-white py-3 rounded-lg font-nitti font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Star className="w-5 h-5" />
              Đánh giá sản phẩm
            </button>
          ) : (
            <div className="space-y-4">
              {/* Rating stars */}
              <div>
                <label className="block text-sm font-nitti font-medium text-[#2F3E34] mb-2">
                  Đánh giá của bạn
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`w-8 h-8 ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400 transition-colors`}
                    >
                      <Star className="w-full h-full fill-current" />
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Comment */}
              <div>
                <label className="block text-sm font-nitti font-medium text-[#2F3E34] mb-2">
                  Nhận xét
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-nitti text-sm focus:outline-none focus:ring-2 focus:ring-[#8FBC8F] focus:border-[#8FBC8F]"
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                />
              </div>
              
              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleRatingSubmit}
                  disabled={rating === 0}
                  className="flex-1 bg-[#8FBC8F] hover:bg-[#7CA87C] disabled:bg-gray-300 text-white py-2 rounded-lg font-nitti font-medium transition-colors"
                >
                  Gửi đánh giá
                </button>
                <button
                  onClick={() => setShowRating(false)}
                  className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 py-2 rounded-lg font-nitti font-medium transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hành động khác */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-beaululo text-[#2F3E34] mb-4 tracking-wider">
          HÀNH ĐỘNG
        </h3>
        
        <div className="space-y-3">
          {/* Huỷ đơn hàng */}
          {isPending && (
            <>
              <button
                className="w-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-3 rounded-lg font-nitti font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                onClick={() => setShowCancelModal(true)}
                disabled={isCancelling}
              >
                <RefreshCw className="w-5 h-5" />
                {isCancelling ? 'Đang huỷ...' : 'Huỷ đơn hàng'}
              </button>

              {/* Modal xác nhận huỷ */}
              {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm animate-fade-in">
                    <h4 className="text-lg font-nitti font-medium mb-4 text-[#2F3E34]">Xác nhận huỷ đơn hàng</h4>
                    <p className="mb-6 text-gray-700">Bạn chắc chắn muốn huỷ đơn hàng này?</p>
                    <div className="flex gap-3">
                      <button
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-nitti font-medium transition-colors disabled:opacity-60"
                        onClick={handleCancelOrder}
                        disabled={isCancelling}
                      >
                        {isCancelling ? 'Đang huỷ...' : 'Xác nhận'}
                      </button>
                      <button
                        className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 py-2 rounded-lg font-nitti font-medium transition-colors"
                        onClick={() => setShowCancelModal(false)}
                        disabled={isCancelling}
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          
          {/* Liên hệ người bán */}
          <button className="w-full border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white py-3 rounded-lg font-nitti font-medium transition-colors flex items-center justify-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Chat với người bán
          </button>
          
          {/* Hotline hỗ trợ */}
          <button className="w-full border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white py-3 rounded-lg font-nitti font-medium transition-colors flex items-center justify-center gap-2">
            <Phone className="w-5 h-5" />
            Hotline: 1900-xxxx
          </button>
        </div>
      </div>

      {/* Thông tin hỗ trợ */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-nitti font-medium text-amber-800 mb-2">
          🛡️ Chính sách hỗ trợ
        </h4>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• Đổi trả miễn phí trong 7 ngày</li>
          <li>• Hoàn tiền 100% nếu sản phẩm lỗi</li>
          <li>• Hỗ trợ khách hàng 24/7</li>
          <li>• Bảo hành chất lượng sản phẩm</li>
        </ul>
      </div>
    </div>
  );
}

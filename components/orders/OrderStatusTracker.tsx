'use client';

import { Check, Package, CreditCard, Truck, Star, XCircle } from "lucide-react";

interface StatusStep {
  status: string;
  label: string;
  date: string;
  completed: boolean;
  amount?: string;
}

interface OrderStatusTrackerProps {
  statusHistory: StatusStep[];
}

export function OrderStatusTracker({ statusHistory }: OrderStatusTrackerProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return Package;
      case 'CONFIRM':
        return CreditCard;
      case 'SHIPPED':
        return Truck;
      case 'COMPLETED':
        return Check;
      case 'CANCELLED':
        return XCircle;
      default:
        return Package;
    }
  };

  // Tìm trạng thái hiện tại (bước cuối cùng có completed=true hoặc completed=false đầu tiên)
  let currentIndex = 0;
  for (let i = 0; i < statusHistory.length; i++) {
    if (statusHistory[i].completed) {
      currentIndex = i;
    }
  }
  // Nếu không có completed nào, lấy bước đầu tiên (PENDING)
  if (!statusHistory.some(s => s.completed)) {
    currentIndex = statusHistory.findIndex(s => s.status === 'PENDING');
    if (currentIndex === -1) currentIndex = 0;
  }

  // Tự động đánh completed cho các bước <= currentIndex
  const autoStatusHistory = statusHistory.map((step, idx) => ({
    ...step,
    completed: idx <= currentIndex
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-beaululo text-[#2F3E34] mb-6 tracking-wider">
        TRẠNG THÁI ĐƠN HÀNG
      </h3>
  <div className="flex items-center justify-center ml-50">
        {autoStatusHistory.map((step, index) => {
          const Icon = getStatusIcon(step.status);
          const isLast = index === autoStatusHistory.length - 1;
          return (
            <div key={step.status} className="flex items-center flex-1">
              {/* Icon và thông tin */}
              <div className="flex flex-col items-center">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                  step.completed 
                    ? 'bg-[#8FBC8F] border-[#8FBC8F] text-white' 
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}>
                  {step.completed ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                {/* Label */}
                <div className="mt-3 text-center">
                  <p className={`font-nitti text-sm font-medium ${
                    step.completed ? 'text-[#2F3E34]' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </p>
                  {step.amount && (
                    <p className="font-nitti text-xs text-[#8FBC8F] mt-1">
                      Toàn ({step.amount})
                    </p>
                  )}
                  {step.date && (
                    <p className="font-nitti text-xs text-gray-500 mt-1">
                      {step.date}
                    </p>
                  )}
                </div>
              </div>
              {/* Connecting line */}
              {!isLast && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  step.completed && autoStatusHistory[index + 1]?.completed
                    ? 'bg-[#8FBC8F]' 
                    : 'bg-gray-300'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

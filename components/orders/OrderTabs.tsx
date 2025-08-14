import React from "react";

interface OrderTabsProps {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

export function OrderTabs({ selectedTab, setSelectedTab }: OrderTabsProps) {
  const tabs = [
    { key: "all", label: "Tất cả" },
    { key: "processing", label: "Đang xử lý" },
    { key: "shipping", label: "Đang giao" },
    { key: "delivered", label: "Đã giao" },
    { key: "cancelled", label: "Đã hủy" }
  ];
  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key)}
            className={`px-6 py-3 font-nitti font-medium transition-colors ${
              selectedTab === tab.key
                ? 'text-[#8FBC8F] border-b-2 border-[#8FBC8F]'
                : 'text-gray-600 hover:text-[#8FBC8F]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

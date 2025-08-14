import React from "react";

export function ProfileSidebar() {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-[#8FBC8F] to-[#7CA87C] p-6">
        <h3 className="font-nitti font-bold text-white text-lg tracking-wide">
          TÀI KHOẢN
        </h3>
      </div>
      <div className="p-6">
        <ul className="space-y-4">
          <li>
            <button className="flex items-center w-full text-left p-3 rounded-lg bg-[#8FBC8F]/10 text-[#8FBC8F] font-nitti font-medium transition-all hover:bg-[#8FBC8F]/20">
              <div className="w-2 h-2 bg-[#8FBC8F] rounded-full mr-3"></div>
              Thông tin tài khoản
            </button>
          </li>
          <li>
            <button className="flex items-center w-full text-left p-3 rounded-lg text-gray-600 font-nitti hover:bg-gray-50 hover:text-[#8FBC8F] transition-all">
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
              Danh sách địa chỉ
            </button>
          </li>
          <li>
            <button className="flex items-center w-full text-left p-3 rounded-lg text-gray-600 font-nitti hover:bg-gray-50 hover:text-red-500 transition-all">
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
              Đăng xuất
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

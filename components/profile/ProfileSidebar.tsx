import React from "react";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "@/features/auth/authApi";

interface ProfileSidebarProps {
  active?: "profile" | "addresses" | "notifications";
  onSelect?: (view: "profile" | "addresses" | "notifications") => void;
}

export function ProfileSidebar({ active = "profile", onSelect }: ProfileSidebarProps) {
  const router = useRouter();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (_) {
      // ignore - state cleared in mutation finally
    } finally {
      router.push("/auth");
    }
  };

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
            <button
              onClick={() => onSelect?.("profile")}
              className={`flex items-center w-full text-left p-3 rounded-lg font-nitti font-medium transition-all ${
                active === "profile"
                  ? "bg-[#8FBC8F]/10 text-[#8FBC8F] hover:bg-[#8FBC8F]/20"
                  : "text-gray-600 hover:bg-gray-50 hover:text-[#8FBC8F]"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full mr-3 ${
                  active === "profile" ? "bg-[#8FBC8F]" : "bg-gray-400"
                }`}
              ></div>
              Thông tin tài khoản
            </button>
          </li>
          <li>
            <button
              onClick={() => onSelect?.("addresses")}
              className={`flex items-center w-full text-left p-3 rounded-lg font-nitti transition-all ${
                active === "addresses"
                  ? "bg-[#8FBC8F]/10 text-[#8FBC8F] hover:bg-[#8FBC8F]/20"
                  : "text-gray-600 hover:bg-gray-50 hover:text-[#8FBC8F]"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full mr-3 ${
                  active === "addresses" ? "bg-[#8FBC8F]" : "bg-gray-400"
                }`}
              ></div>
              Danh sách địa chỉ
            </button>
          </li>
          <li>
            <button
              onClick={() => onSelect?.("notifications")}
              className={`flex items-center w-full text-left p-3 rounded-lg font-nitti transition-all ${
                active === "notifications"
                  ? "bg-[#8FBC8F]/10 text-[#8FBC8F] hover:bg-[#8FBC8F]/20"
                  : "text-gray-600 hover:bg-gray-50 hover:text-[#8FBC8F]"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full mr-3 ${
                  active === "notifications" ? "bg-[#8FBC8F]" : "bg-gray-400"
                }`}
              ></div>
              Thông báo
            </button>
          </li>
          <li>
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="flex items-center w-full text-left p-3 rounded-lg text-gray-600 font-nitti hover:bg-gray-50 hover:text-red-500 transition-all disabled:opacity-50"
            >
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
              Đăng xuất
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

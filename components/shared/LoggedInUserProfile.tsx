'use client';

import { User, LogOut, Settings, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/authSlice";
import { useLogoutMutation } from "@/features/auth/authApi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export function LoggedInUserProfile() {
  const router = useRouter();
  const user = useSelector(selectCurrentUser);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (_) {
      // ignore
    } finally {
      setIsDropdownOpen(false);
      router.push('/auth');
    }
  };

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsDropdownOpen(true)}
      onMouseLeave={() => setIsDropdownOpen(false)}
    >
      <div className="relative flex items-center space-x-2 p-2 -m-2 transition-colors cursor-pointer group">
        {(user as any)?.avatar ? (
          <img 
            src={(user as any).avatar} 
            alt={user?.userName || user?.email || 'user'}
            className="h-8 w-8 rounded-full object-cover border-2 border-transparent group-hover:border-[#8FBC8F] transition-colors"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-[#8FBC8F] flex items-center justify-center border-2 border-transparent group-hover:border-[#7CA87C] transition-colors">
            <span className="text-white text-sm font-bold">
              {(user?.userName || user?.email || '?').charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <ChevronDown className="h-4 w-4 text-[#4C5C4C] group-hover:text-[#8FBC8F]" />
      </div>

      <div className={`absolute right-0 top-full pt-2 w-80 z-50 transition-all duration-300 ease-in-out ${
        isDropdownOpen 
          ? 'opacity-100 visible transform translate-y-0' 
          : 'opacity-0 invisible transform -translate-y-2'
      }`}>
        <div className="h-2 w-full"></div>
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              {(user as any)?.avatar ? (
                <img 
                  src={(user as any).avatar} 
                  alt={user?.userName || user?.email || 'user'}
                  className="h-12 w-12 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-[#8FBC8F] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg font-bold">
                    {(user?.userName || user?.email || '?').charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-nitti font-medium text-[#2F3E34] text-base leading-tight">
                  {user?.userName || user?.email}
                </p>
                <p className="font-nitti text-sm text-[#666] mt-1 break-all">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
          <div className="p-2 space-y-1">
            <Link href="/profile" className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 transition-colors group" onClick={() => setIsDropdownOpen(false)}>
              <User className="h-4 w-4 text-[#666] group-hover:text-[#8FBC8F] flex-shrink-0" />
              <span className="font-nitti text-sm text-[#2F3E34] group-hover:text-[#8FBC8F]">Hồ sơ cá nhân</span>
            </Link>
            <Link href="/orders" className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 transition-colors group" onClick={() => setIsDropdownOpen(false)}>
              <Settings className="h-4 w-4 text-[#666] group-hover:text-[#8FBC8F] flex-shrink-0" />
              <span className="font-nitti text-sm text-[#2F3E34] group-hover:text-[#8FBC8F]">Đơn hàng của tôi</span>
            </Link>
            <hr className="my-2" />
            <button onClick={handleLogout} disabled={isLoggingOut} className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 transition-colors group disabled:opacity-50">
              <LogOut className="h-4 w-4 text-[#666] group-hover:text-red-500 flex-shrink-0" />
              <span className="font-nitti text-sm text-[#2F3E34] group-hover:text-red-500">Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
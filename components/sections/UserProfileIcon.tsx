'use client';

import Link from "next/link";
import { User, LogIn, UserPlus, LogOut, Settings } from "lucide-react";
import { useState } from "react";

// Mock user state -thay thế bằng context thật
const useAuth = () => {
  // === MÃ GIẢ - COMMENT DÒNG NÀY ĐỂ QUAY LẠI TRẠNG THÁI CHƯA ĐĂNG NHẬP ===
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Đổi thành true để test
  
  // Bỏ comment dòng dưới để quay lại trạng thái bình thường
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [user, setUser] = useState(null);
  
  const mockUser = {
    name: "Phan Phạm Ngọc Thạch",
    email: "pngthach@gmail.com",
    avatar: "https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/528903336_615813391570470_6438716491300480355_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeFz--sDF4bm2KQkSuUf52Mz7h0KOAEMeUvuHQo4AQx5S__8YGrcurouDdlcNBr7pMMqfks4XcRcX9E1C2etnUYV&_nc_ohc=NDapKGjUWOYQ7kNvwH3CF_X&_nc_oc=AdmNAxjJlu__nLpCbGaihrl-G1jWWMozBiS-h7jk_j-STVP_bo9a1PUN1HIE6pGUWxA&_nc_zt=23&_nc_ht=scontent.fsgn2-7.fna&_nc_gid=O8aF1dmaMRx0Za8gOZovjw&oh=00_AfU2otB3VEm_HFLbo8Vz2rQfDi4qNn3cHPTr_924XGXghA&oe=689927F0"
  };

  return {
    isLoggedIn,
    user: isLoggedIn ? mockUser : null,
    login: () => setIsLoggedIn(true),
    logout: () => setIsLoggedIn(false)
  };
};

export function UserProfileIcon() {
  const { isLoggedIn, user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!isLoggedIn) {
    return (
      <div 
        className="relative"
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => setIsDropdownOpen(false)}
      >
        <div className="text-[#4C5C4C] hover:text-[#8FBC8F] p-2 -m-2 transition-colors cursor-pointer">
          <User className="h-6 w-6" />
        </div>

        <div className={`absolute right-0 top-full pt-2 w-48 z-50 transition-all duration-300 ease-in-out ${
          isDropdownOpen 
            ? 'opacity-100 visible transform translate-y-0' 
            : 'opacity-0 invisible transform -translate-y-2'
        }`}>
          <div className="h-2 w-full"></div>
          
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            <div className="p-3 border-b border-gray-200">
              <p className="font-nitti text-sm text-[#666] text-center">
                Chào mừng bạn đến với
              </p>
              <p className="font-beaululo text-[#2F3E34] text-sm text-center tracking-wider">
                Đặc Sản Việt
              </p>
            </div>
            
            <div className="p-3 space-y-2">
              <Link
                href="/auth"
                className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 transition-colors group"
                onClick={() => setIsDropdownOpen(false)}
              >
                <LogIn className="h-4 w-4 text-[#666] group-hover:text-[#8FBC8F]" />
                <span className="font-nitti text-sm text-[#2F3E34] group-hover:text-[#8FBC8F]">
                  Đăng nhập / Đăng ký
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // === TRẠNG THÁI ĐÃ ĐĂNG NHẬP ===
  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsDropdownOpen(true)}
      onMouseLeave={() => setIsDropdownOpen(false)}
    >
      {/* Avatar hoặc Initial Circle */}
      <div className="text-[#4C5C4C] hover:text-[#8FBC8F] p-2 -m-2 transition-colors cursor-pointer">
        {user?.avatar ? (
          // Avatar thật từ URL
          <img 
            src={user.avatar} 
            alt={user.name}
            className="h-8 w-8 rounded-full object-cover border-2 border-gray-200 hover:border-[#8FBC8F] transition-colors"
          />
        ) : (
          // Circle với chữ cái đầu khi không có avatar
          <div className="h-8 w-8 rounded-full bg-[#8FBC8F] flex items-center justify-center border-2 border-gray-200 hover:border-[#7CA87C] transition-colors">
            <span className="text-white text-sm font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Dropdown Menu  */}
      <div className={`absolute right-0 top-full pt-2 w-80 z-50 transition-all duration-300 ease-in-out ${
        isDropdownOpen 
          ? 'opacity-100 visible transform translate-y-0' 
          : 'opacity-0 invisible transform -translate-y-2'
      }`}>
        <div className="h-2 w-full"></div>
        
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {/* User Info Header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="h-12 w-12 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-[#8FBC8F] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-nitti font-medium text-[#2F3E34] text-base leading-tight">
                  {user?.name}
                </p>
                <p className="font-nitti text-sm text-[#666] mt-1 break-all">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
          
          {/* Menu Items */}
          <div className="p-2 space-y-1">
            <Link
              href="/profile"
              className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 transition-colors group"
              onClick={() => setIsDropdownOpen(false)}
            >
              <User className="h-4 w-4 text-[#666] group-hover:text-[#8FBC8F] flex-shrink-0" />
              <span className="font-nitti text-sm text-[#2F3E34] group-hover:text-[#8FBC8F]">
                Hồ sơ cá nhân
              </span>
            </Link>
            
            <Link
              href="/orders"
              className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 transition-colors group"
              onClick={() => setIsDropdownOpen(false)}
            >
              <Settings className="h-4 w-4 text-[#666] group-hover:text-[#8FBC8F] flex-shrink-0" />
              <span className="font-nitti text-sm text-[#2F3E34] group-hover:text-[#8FBC8F]">
                Đơn hàng của tôi
              </span>
            </Link>
            
            <hr className="my-2" />
            
            {/* === MÃ GIẢ - BUTTON TEST ĐĂNG XUẤT ===  */}
            <button
              onClick={() => {
                logout();
                setIsDropdownOpen(false);
                // window.location.reload(); // Uncomment để reload trang sau khi logout
              }}
              className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 transition-colors group"
            >
              <LogOut className="h-4 w-4 text-[#666] group-hover:text-red-500 flex-shrink-0" />
              <span className="font-nitti text-sm text-[#2F3E34] group-hover:text-red-500">
                Đăng xuất (Test)
              </span>
            </button>
            {}
          </div>
        </div>
      </div>
    </div>
  );
}
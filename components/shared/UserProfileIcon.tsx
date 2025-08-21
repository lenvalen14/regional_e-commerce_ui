'use client';

import Link from "next/link";
import { User, LogIn, LogOut, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectIsAuthenticated, selectCurrentToken } from "@/features/auth/authSlice";
import { useLogoutMutation } from "@/features/auth/authApi";
import { useRouter } from "next/navigation";

export function UserProfileIcon() {
  const router = useRouter();
  const isLoggedIn = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  console.log('User Profile Icon Rendered:', { isLoggedIn, user });

  const isAdmin = user?.userName === "Admin" || user?.role === "ADMIN";

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsDropdownOpen(true)}
      onMouseLeave={() => setIsDropdownOpen(false)}
    >
      <div className="relative flex items-center space-x-2 p-2 -m-2 transition-colors cursor-pointer group">
        {isClient && isLoggedIn ? (
          <>
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
          </>
        ) : (
          <User className="h-6 w-6 text-[#4C5C4C] hover:text-[#8FBC8F] transition-colors" />
        )}
      </div>

      <div className={`absolute right-0 top-full pt-2 w-80 z-50 transition-all duration-300 ease-in-out ${
        isDropdownOpen 
          ? 'opacity-100 visible transform translate-y-0' 
          : 'opacity-0 invisible transform -translate-y-2'
      }`}>
        <div className="h-2 w-full"></div>
        
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {/* User Info Header */}
          {isClient && isLoggedIn ? (
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
                      {(user?.userName || '?').charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-nitti font-medium text-[#2F3E34] text-base leading-tight">
                    {user?.userName}
                  </p>
                  <p className="font-nitti text-sm text-[#666] mt-1 break-all">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 border-b border-gray-200">
              <p className="font-nitti text-sm text-[#666] text-center">
                Chào mừng bạn đến với
              </p>
              <p className="font-beaululo text-[#2F3E34] text-sm text-center tracking-wider">
                Đặc Sản Việt
              </p>
            </div>
          )}

          {/* Menu Items */}
          <div className="p-2 space-y-1">
            {isClient && isLoggedIn ? (
              <>
                {isAdmin ? (
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 transition-colors group"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Settings className="h-4 w-4 text-[#666] group-hover:text-[#8FBC8F] flex-shrink-0" />
                    <span className="font-nitti text-sm text-[#2F3E34] group-hover:text-[#8FBC8F]">
                      Dashboard
                    </span>
                  </Link>
                ) : (
                  <>
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
                  </>
                )}
                
                <hr className="my-2" />
                
                <button
                  onClick={async () => {
                    try {
                      await logout().unwrap();
                    } catch (_) {
                      // ignore
                    } finally {
                      setIsDropdownOpen(false);
                      router.push('/auth');
                    }
                  }}
                  disabled={isLoggingOut}
                  className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 transition-colors group disabled:opacity-50"
                >
                  <LogOut className="h-4 w-4 text-[#666] group-hover:text-red-500 flex-shrink-0" />
                  <span className="font-nitti text-sm text-[#2F3E34] group-hover:text-red-500">
                    Đăng xuất
                  </span>
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 transition-colors group"
                onClick={() => setIsDropdownOpen(false)}
              >
                <LogIn className="h-4 w-4 text-[#666] group-hover:text-[#8FBC8F] flex-shrink-0" />
                <span className="font-nitti text-sm text-[#2F3E34] group-hover:text-[#8FBC8F]">
                  Đăng nhập / Đăng ký
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

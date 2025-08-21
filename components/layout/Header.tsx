'use client';

import Link from "next/link";
import { ShoppingBag, Menu, Search, X } from "lucide-react"; // Thêm icon X cho nút đóng
import { useCart } from "@/contexts/CartContext";
import { useState, useEffect } from "react";
import { CartDropdown } from "@/components/cart/CartDropdown";
import { UserProfileIcon } from "@/components/shared/UserProfileIcon";
import { SearchOverlay } from "@/components/shared/SearchOverlay";
import NotificationBell from "@/components/notification/NotificationBell";
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser } from '@/features/auth/authSlice';

export function SiteHeader() {
  const [isMounted, setIsMounted] = useState(false);
  const { state: cartState } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State cho mobile menu

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  const isAdmin = user?.role === "ADMIN";

  // Handle hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Hàm toggle cho cart, thân thiện hơn với cả mobile và desktop
  const toggleCart = () => setIsCartOpen(prev => !prev);

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-beaululo text-[#2F3E34]">
            Đặc Sản Việt
          </Link>

          {/* Nav cho Desktop */}
          <nav className="hidden md:flex gap-6 text-[#4C5C4C] font-nitti font-medium items-center">
            <Link href="/products" className="hover:text-[#8FBC8F] transition-colors">Sản phẩm</Link>
            <Link href="/news" className="hover:text-[#8FBC8F] transition-colors">Tin tức</Link>
            <Link href="/about" className="hover:text-[#8FBC8F] transition-colors">Giới thiệu</Link>
            <Link href="/contact" className="hover:text-[#8FBC8F] transition-colors">Liên hệ</Link>
          </nav>

          {/* Nhóm Icons bên phải */}
          <div className="flex items-center gap-4">
            {/* Search Icon */}
            <button
              className="text-[#4C5C4C] hover:text-[#8FBC8F] p-2 -m-2 transition-colors"
              aria-label="Tìm kiếm"
            >
              <Search className="h-6 w-6" />
            </button>

            {/* Placeholder for cart and notification */}
            <div className="relative">
              <button
                className="relative p-2 hover:bg-gray-100 rounded-full transition-all duration-300 text-[#4C5C4C] hover:text-[#8FBC8F]"
                aria-label="Giỏ hàng"
              >
                <ShoppingBag className="h-6 w-6" />
              </button>
            </div>

            {/* Placeholder for user profile */}
            <div className="h-9 w-9" />

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-[#4C5C4C] z-50"
              aria-label="Mở menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-beaululo text-[#2F3E34]">
            Đặc Sản Việt
          </Link>

          {/* Nav cho Desktop */}
          <nav className="hidden md:flex gap-6 text-[#4C5C4C] font-nitti font-medium items-center">
            <Link href="/products" className="hover:text-[#8FBC8F] transition-colors">Sản phẩm</Link>
            <Link href="/news" className="hover:text-[#8FBC8F] transition-colors">Tin tức</Link>
            <Link href="/about" className="hover:text-[#8FBC8F] transition-colors">Giới thiệu</Link>
            <Link href="/contact" className="hover:text-[#8FBC8F] transition-colors">Liên hệ</Link>
            {/* Link đặc biệt chỉ dành cho Admin */}
            {isAdmin && (
              <Link href="/admin/dashboard" className="text-red-600 hover:text-red-800 transition-colors">
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Nhóm Icons bên phải */}
          <div className="flex items-center gap-4">
            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-[#4C5C4C] hover:text-[#8FBC8F] p-2 -m-2 transition-colors"
              aria-label="Tìm kiếm"
            >
              <Search className="h-6 w-6" />
            </button>

            {/* Cart Icon và Notification chỉ ẩn với Admin nếu thực sự cần thiết */}
            {!isAdmin && (
              <>
                {/* Cart with Dropdown (chỉ dùng onClick) */}
                <div className="relative">
                  <button
                    onClick={toggleCart}
                    className="relative p-2 hover:bg-gray-100 rounded-full transition-all duration-300 text-[#4C5C4C] hover:text-[#8FBC8F]"
                    aria-label="Giỏ hàng"
                  >
                    <ShoppingBag className="h-6 w-6" />
                    {cartState.itemCount > 0 && (
                      <span className="absolute -top-0 -right-0 bg-[#E53935] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cartState.itemCount > 99 ? '99+' : cartState.itemCount}
                      </span>
                    )}
                  </button>
                  {/* Dropdown được điều khiển bởi isCartOpen */}
                  <CartDropdown
                    isOpen={isCartOpen}
                    onClose={() => setIsCartOpen(false)}
                  />
                </div>

                {/* Notification Bell (đặt đúng vị trí) */}
                {isAuthenticated && <NotificationBell />}
              </>
            )}
            
            {/* User Profile Icon luôn hiển thị */}
            <UserProfileIcon />

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(prev => !prev)} 
              className="md:hidden text-[#4C5C4C] z-50" // z-index để nó nổi lên trên
              aria-label="Mở menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel (ví dụ) */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4">
             <nav className="flex flex-col items-center gap-4 text-[#4C5C4C] font-nitti font-medium">
                <Link href="/products" className="hover:text-[#8FBC8F]" onClick={() => setIsMobileMenuOpen(false)}>Sản phẩm</Link>
                <Link href="/news" className="hover:text-[#8FBC8F]" onClick={() => setIsMobileMenuOpen(false)}>Tin tức</Link>
                <Link href="/about" className="hover:text-[#8FBC8F]" onClick={() => setIsMobileMenuOpen(false)}>Giới thiệu</Link>
                <Link href="/contact" className="hover:text-[#8FBC8F]" onClick={() => setIsMobileMenuOpen(false)}>Liên hệ</Link>
                {isAdmin && (
                  <Link href="/admin/dashboard" className="text-red-600 hover:text-red-800" onClick={() => setIsMobileMenuOpen(false)}>Admin Panel</Link>
                )}
             </nav>
          </div>
        )}
      </header>

      {/* Search Overlay vẫn giữ nguyên logic mở/đóng */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
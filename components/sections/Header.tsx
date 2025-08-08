'use client';

import Link from "next/link";
import { ShoppingBag, Menu, Search } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { CartDropdown } from "./CartDropdown";
import { UserProfileIcon } from "./UserProfileIcon";
import { SearchOverlay } from "./SearchOverlay";

export function SiteHeader() {
  const { state } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Thêm state này

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-beaululo text-[#2F3E34]">
            Đặc Sản Việt
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex gap-6 text-[#4C5C4C] font-nitti font-medium">
            <Link href="/products" className="hover:text-[#8FBC8F] transition-colors">
              Sản phẩm
            </Link>
            <Link href="/news" className="hover:text-[#8FBC8F] transition-colors">
              Tin tức
            </Link>
            <Link href="/about" className="hover:text-[#8FBC8F] transition-colors">
              Giới thiệu
            </Link>
            <Link href="/contact" className="hover:text-[#8FBC8F] transition-colors">
              Liên hệ
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            {/* Search Icon - Thay đổi này */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-[#4C5C4C] hover:text-[#8FBC8F] p-2 -m-2 transition-colors"
              aria-label="Tìm kiếm"
            >
              <Search className="h-6 w-6" />
            </button>

            {/* User Profile Icon with Dropdown */}
            <UserProfileIcon />

            {/* Cart with Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsCartOpen(true)}
              onMouseLeave={() => setIsCartOpen(false)}
            >
              <button 
                data-cart-icon  
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-all duration-300 group text-[#4C5C4C] hover:text-[#8FBC8F]"
              >
                <ShoppingBag className="h-6 w-6" />
                {state.itemCount > 0 && (
                  <span className="absolute -top-0 -right-0 bg-[#E53935] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {state.itemCount > 99 ? '99+' : state.itemCount}
                  </span>
                )}
              </button>

              <CartDropdown 
                isOpen={isCartOpen} 
                onClose={() => setIsCartOpen(false)} 
              />
            </div>

            {/* Mobile Menu */}
            <button className="md:hidden text-[#4C5C4C]">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <SearchOverlay 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
}

'use client';

import Link from "next/link";
import { ShoppingBag, Menu } from "lucide-react";

export function SiteHeader() {
  return (
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
          <Link href="/cart" className="text-[#4C5C4C] hover:text-[#8FBC8F]">
            <ShoppingBag className="h-6 w-6" />
          </Link>
          <button className="md:hidden text-[#4C5C4C]">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}

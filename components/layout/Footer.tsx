'use client';

import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-[#F0F5F0] text-[#2F3E34] py-10 mt-20 border-t border-[#D8D8D8]">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        {/* Thương hiệu */}
        <div>
          <h4 className="text-xl font-semibold font-beaululo mb-4">
            Đặc Sản Việt
          </h4>
          <p className="text-[#4C5C4C] font-nitti">
            Gìn giữ và lan toả tinh hoa đặc sản ba miền tới mọi miền đất nước và bạn bè quốc tế.
          </p>
        </div>

        {/* Điều hướng */}
        <div>
          <h5 className="font-semibold mb-3 font-beaululo">Liên kết nhanh</h5>
          <ul className="space-y-2 text-[#4C5C4C] font-nitti">
            <li><Link href="/products" className="hover:text-[#8FBC8F]">Sản phẩm</Link></li>
            <li><Link href="/news" className="hover:text-[#8FBC8F]">Tin tức</Link></li>
            <li><Link href="/about" className="hover:text-[#8FBC8F]">Giới thiệu</Link></li>
            <li><Link href="/contact" className="hover:text-[#8FBC8F]">Liên hệ</Link></li>
          </ul>
        </div>

        {/* Bản quyền */}
        <div>
          <h5 className="font-semibold mb-3 font-beaululo">Thông tin</h5>
          <p className="text-[#4C5C4C] font-nitti">
            © {new Date().getFullYear()} Đặc Sản Việt. All rights reserved.
          </p>
          <p className="mt-2 text-[#4C5C4C] font-nitti">
            Made with ❤️ in Vietnam.
          </p>
        </div>
      </div>
    </footer>
  );
}

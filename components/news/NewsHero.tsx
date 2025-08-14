'use client';

import { useState, useEffect } from 'react';
import { Calendar, User, Clock } from 'lucide-react';
import Link from 'next/link'; 

export function NewsHero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-[#8FBC8F] to-[#7AA87A] rounded-full opacity-10 animate-float" />
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-[#8FBC8F] to-[#7AA87A] rounded-full opacity-10 animate-float animation-delay-1000" />
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Left side - Content */}
          <div className="space-y-8 animate-slideInFromLeft">
            {/* Decorative border */}
            <div className="w-24 h-1 bg-[#8FBC8F] animate-expandWidth" />
            
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-beaululo text-[#222] leading-tight tracking-widest uppercase">
                <span className="block animate-fadeInUp">Tin Tức</span>
                <span className="block text-[#8FBC8F] animate-fadeInUp animation-delay-300">& Câu Chuyện</span>
              </h1>
              
              <p className="text-lg text-[#666] leading-relaxed font-nitti max-w-lg animate-fadeInUp animation-delay-600">
                Khám phá những câu chuyện thú vị về văn hóa ẩm thực Việt Nam, 
                cập nhật tin tức mới nhất về đặc sản từ khắp ba miền.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-12 pt-8 border-t border-[#e0e0e0] animate-fadeInUp animation-delay-900">
              <div className="text-center group">
                <div className="text-3xl font-bold text-[#222] font-beaululo tracking-widest group-hover:text-[#8FBC8F] transition-colors duration-300">50+</div>
                <div className="text-sm text-[#888] font-nitti uppercase tracking-wider mt-1">Bài viết</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-bold text-[#222] font-beaululo tracking-widest group-hover:text-[#8FBC8F] transition-colors duration-300">12</div>
                <div className="text-sm text-[#888] font-nitti uppercase tracking-wider mt-1">Chuyên mục</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-bold text-[#222] font-beaululo tracking-widest group-hover:text-[#8FBC8F] transition-colors duration-300">1000+</div>
                <div className="text-sm text-[#888] font-nitti uppercase tracking-wider mt-1">Lượt đọc</div>
              </div>
            </div>
          </div>

          {/* Right side - Featured Article Card */}
          <div className="lg:pl-8 animate-slideInFromRight">
            <div className="bg-white border border-[#e0e0e0] overflow-hidden group hover:shadow-lg hover:scale-105 transition-all duration-500">
              
              {/* Image / Placeholder */}
              <div className="aspect-[4/3] relative overflow-hidden bg-[#f8f8f8] group">
                {/* Hình ảnh */}
                <img 
                  src="/images/banh_chung.jpg" 
                  alt="Bánh chưng"
                  className="object-cover w-full h-full relative z-10"
                />

                {/* Overlay gradient chỉ hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20 opacity-0 group-hover:opacity-20 transition-opacity duration-500 z-20 pointer-events-none" />
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                {/* Title dưới ảnh */}
                <h3 className="text-xl font-beaululo text-[#222] text-center tracking-widest uppercase leading-tight">
                  Bí mật làm bánh chưng truyền thống
                </h3>

                {/* Meta info */}
                <div className="flex items-center gap-6 text-sm text-[#888] font-nitti">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>15 Dec 2024</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Admin</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>5 phút đọc</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[#666] leading-relaxed font-nitti">
                  Khám phá những bí quyết làm bánh chưng truyền thống từ các bà các mẹ miền Bắc, 
                  giữ nguyên hương vị đậm đà của Tết cổ truyền...
                </p>

                {/* Read more */}
                <Link 
                  href="/news/1" 
                  className="inline-flex items-center gap-2 text-[#8FBC8F] font-nitti font-bold uppercase tracking-widest text-sm hover:text-[#222] transition-colors duration-300 border-b border-[#8FBC8F] hover:border-[#222] pb-1 group"
                >
                  Đọc thêm
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

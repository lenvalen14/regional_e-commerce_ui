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
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-100 via-orange-50 to-red-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a574' fill-opacity='0.8'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-200 to-orange-300 rounded-full opacity-20 animate-float" />
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-red-200 to-pink-300 rounded-full opacity-20 animate-float animation-delay-1000" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-8 animate-slideInFromLeft">
            {/* Decorative border */}
            <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-orange-600 animate-expandWidth" />
            
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-serif text-amber-900 leading-tight">
                <span className="block animate-fadeInUp">Tin Tức</span>
                <span className="block text-orange-700 animate-fadeInUp animation-delay-300">& Câu Chuyện</span>
              </h1>
              
              <p className="text-xl text-amber-800 leading-relaxed animate-fadeInUp animation-delay-600">
                Khám phá những câu chuyện thú vị về văn hóa ẩm thực Việt Nam, 
                cập nhật tin tức mới nhất về đặc sản từ khắp ba miền.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-8 animate-fadeInUp animation-delay-900">
              <div className="text-center group">
                <div className="text-3xl font-bold text-amber-700 group-hover:text-orange-600 transition-colors duration-300">50+</div>
                <div className="text-sm text-amber-600 uppercase tracking-wider">Bài viết</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-bold text-amber-700 group-hover:text-orange-600 transition-colors duration-300">12</div>
                <div className="text-sm text-amber-600 uppercase tracking-wider">Chuyên mục</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-bold text-amber-700 group-hover:text-orange-600 transition-colors duration-300">1000+</div>
                <div className="text-sm text-amber-600 uppercase tracking-wider">Lượt đọc</div>
              </div>
            </div>
          </div>

          {/* Right side - Featured Article Card */}
          <div className="animate-slideInFromRight">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden group hover:shadow-3xl transition-all duration-500 hover:scale-105 border-4 border-amber-100">
              <div className="aspect-video bg-gradient-to-br from-amber-200 to-orange-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-2xl font-serif text-white text-center px-4">
                    Bí mật làm bánh chưng truyền thống
                  </h3>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4 text-sm text-amber-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>15 Dec 2024</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>Admin</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>5 phút đọc</span>
                  </div>
                </div>
                
                <p className="text-gray-600 leading-relaxed">
                  Khám phá những bí quyết làm bánh chưng truyền thống từ các bà các mẹ miền Bắc, 
                  giữ nguyên hương vị đậm đà của Tết cổ truyền...
                </p>
                
                <Link 
                  href="/news/1" 
                  className="text-amber-700 font-semibold hover:text-orange-600 transition-colors duration-300 flex items-center gap-2 group"
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
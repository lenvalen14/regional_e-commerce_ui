'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export function AboutHero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background với parallax */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#222]/100 to-[#8FBC8F]/100"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      />
      
      {/* Background pattern - Thay thế bằng pattern đơn giản hơn */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, white 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <div className="animate-fadeInUp">
          <h1 className="text-5xl md:text-7xl font-beaululo mb-6 tracking-widest uppercase">
            <span className="inline-block animate-slideInFromLeft animation-delay-200">Đặc</span>
            <span className="inline-block animate-slideInFromLeft animation-delay-400 text-[#8FBC8F] mx-2">Sản</span>
            <span className="inline-block animate-slideInFromLeft animation-delay-600">Việt</span>
          </h1>
          
          <div className="w-32 h-1 bg-[#8FBC8F] mx-auto mb-8 animate-expandWidth animation-delay-800" />
          
          <p className="text-xl md:text-2xl mb-4 animate-fadeInUp animation-delay-1000 font-nitti">
            Nơi lưu giữ tinh hoa ẩm thực Việt Nam
          </p>
          
          <p className="text-lg opacity-90 max-w-2xl mx-auto animate-fadeInUp animation-delay-1200 mb-16 font-nitti">
            Chúng tôi mang đến những đặc sản nguyên chất từ khắp mọi miền đất nước, 
            kết nối bạn với văn hóa và truyền thống Việt Nam qua từng món ăn.
          </p>
        </div>
      </div>

      {/* Scroll indicator - Di chuyển ra ngoài content và xuống dưới hơn */}
      <div className="absolute bottom-4 md:bottom-25 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <div className="flex flex-col items-center gap-2">
          <ChevronDown className="h-8 w-8 text-white/70" />
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-[#8FBC8F]/20 rounded-full animate-float" />
      <div className="absolute top-40 right-20 w-16 h-16 bg-[#8FBC8F]/30 rounded-full animate-float animation-delay-500" />
      <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-white/20 rounded-full animate-float animation-delay-1000" />
    </section>
  );
}
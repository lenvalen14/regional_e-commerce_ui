'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { ChevronDown, Target, Globe, Users, Zap, Award, MapPin, Heart } from 'lucide-react';

// AboutHero Component - Clean white background like NewsHero
export function AboutHero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* Decorative elements - similar to NewsHero */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-[#8FBC8F] to-[#7AA87A] rounded-full opacity-10 animate-float" />
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-[#8FBC8F] to-[#7AA87A] rounded-full opacity-10 animate-float animation-delay-1000" />
      
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Decorative border */}
          <div className="w-24 h-1 bg-[#8FBC8F] mx-auto animate-expandWidth" />
          
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-beaululo text-[#222] leading-tight tracking-widest uppercase">
              <span className="block animate-fadeInUp">Đặc Sản</span>
              <span className="block text-[#8FBC8F] animate-fadeInUp animation-delay-300">Việt Nam</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-[#666] leading-relaxed font-nitti max-w-3xl mx-auto animate-fadeInUp animation-delay-600">
              Nơi lưu giữ tinh hoa ẩm thực Việt Nam, kết nối bạn với văn hóa và truyền thống 
              qua từng món ăn đặc sản từ khắp ba miền đất nước.
            </p>
          </div>

          {/* Stats - inline style like NewsHero */}
          <div className="flex flex-wrap justify-center gap-8 lg:gap-16 pt-8 border-t border-[#e0e0e0] animate-fadeInUp animation-delay-900">
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-[#222] font-beaululo tracking-widest group-hover:text-[#8FBC8F] transition-colors duration-300">10K+</div>
              <div className="text-sm text-[#888] font-nitti uppercase tracking-wider mt-1">Khách hàng</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-[#222] font-beaululo tracking-widest group-hover:text-[#8FBC8F] transition-colors duration-300">50+</div>
              <div className="text-sm text-[#888] font-nitti uppercase tracking-wider mt-1">Đặc sản</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-[#222] font-beaululo tracking-widest group-hover:text-[#8FBC8F] transition-colors duration-300">63</div>
              <div className="text-sm text-[#888] font-nitti uppercase tracking-wider mt-1">Tỉnh thành</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl md:text-4xl font-bold text-[#222] font-beaululo tracking-widest group-hover:text-[#8FBC8F] transition-colors duration-300">99%</div>
              <div className="text-sm text-[#888] font-nitti uppercase tracking-wider mt-1">Hài lòng</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-6 w-6 text-[#888]" />
      </div>
    </section>
  );
}
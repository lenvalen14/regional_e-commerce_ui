'use client';

import { useInView } from 'react-intersection-observer';
import { Target, Globe, Users, Zap } from 'lucide-react';

export function AboutMission() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-[#2F3E34] to-[#1a2420] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#FFD700] rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#8FBC8F] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className={`${inView ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <span className="text-[#8FBC8F] font-semibold text-sm uppercase tracking-widest">
              Sứ mệnh & Tầm nhìn
            </span>
            <h2 className="text-4xl md:text-5xl font-beaululo text-white mt-4 mb-6">
              Hướng tới tương lai
            </h2>
            <div className="w-24 h-1 bg-[#FFD700] mx-auto" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Mission */}
          <div className={`${inView ? 'animate-slideInFromLeft' : 'opacity-0'}`}>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#FFD700] rounded-xl flex items-center justify-center mr-4">
                  <Target className="h-6 w-6 text-[#2F3E34]" />
                </div>
                <h3 className="text-2xl font-bold text-white">Sứ mệnh</h3>
              </div>
              
              <p className="text-gray-200 text-lg leading-relaxed mb-6">
                Chúng tôi cam kết mang đến cho mọi người những đặc sản Việt Nam chất lượng cao nhất, 
                góp phần bảo tồn và phát huy giá trị văn hóa ẩm thực dân tộc.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <Globe className="h-8 w-8 text-[#8FBC8F] mx-auto mb-2" />
                  <div className="text-sm text-gray-300">Kết nối toàn cầu</div>
                </div>
                <div className="text-center">
                  <Users className="h-8 w-8 text-[#8FBC8F] mx-auto mb-2" />
                  <div className="text-sm text-gray-300">Phục vụ cộng đồng</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Vision */}
          <div className={`${inView ? 'animate-slideInFromRight' : 'opacity-0'}`}>
            <div className="bg-gradient-to-br from-[#8FBC8F]/20 to-[#FFD700]/20 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#8FBC8F] rounded-xl flex items-center justify-center mr-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Tầm nhìn</h3>
              </div>
              
              <p className="text-gray-200 text-lg leading-relaxed mb-6">
                Trở thành nền tảng hàng đầu Việt Nam về đặc sản, nơi mọi người có thể tìm thấy 
                và trải nghiệm tinh hoa ẩm thực từ khắp ba miền đất nước.
              </p>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#FFD700] rounded-full mr-3" />
                  <span className="text-gray-200">Mở rộng ra toàn quốc</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#FFD700] rounded-full mr-3" />
                  <span className="text-gray-200">Phát triển bền vững</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-[#FFD700] rounded-full mr-3" />
                  <span className="text-gray-200">Đưa đặc sản Việt ra thế giới</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className={`${inView ? 'animate-fadeInUp animation-delay-800' : 'opacity-0'}`}>
            <h3 className="text-2xl font-bold text-white mb-6">
              Cùng chúng tôi lan tỏa tinh hoa ẩm thực Việt Nam
            </h3>
            <button className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#2F3E34] px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
              Khám phá ngay
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
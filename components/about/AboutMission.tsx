'use client';

import { useInView } from 'react-intersection-observer';
import { Target, Globe, Users, Zap } from 'lucide-react';

export function AboutMission() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <section ref={ref} className="py-20 bg-[#f8f8f8] relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#8FBC8F] rounded-full opacity-5" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#7CA87C] rounded-full opacity-5" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className={`${inView ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <span className="text-[#8FBC8F] font-semibold text-sm uppercase tracking-widest font-nitti">
              Sứ mệnh & Tầm nhìn
            </span>
            <h2 className="text-4xl md:text-5xl font-beaululo text-[#222] mt-4 mb-6 tracking-widest uppercase">
              Hướng tới tương lai
            </h2>
            <div className="w-24 h-1 bg-[#8FBC8F] mx-auto" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left side - Mission */}
          <div className={`${inView ? 'animate-slideInFromLeft' : 'opacity-0'}`}>
            <div className="bg-white rounded-2xl p-8 border border-[#e0e0e0] hover:shadow-lg transition-all duration-500">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#8FBC8F] rounded-xl flex items-center justify-center mr-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#222] font-nitti">Sứ mệnh</h3>
              </div>
              
              <p className="text-[#666] text-lg leading-relaxed mb-6 font-nitti">
                Chúng tôi cam kết mang đến cho mọi người những đặc sản Việt Nam chất lượng cao nhất, 
                góp phần bảo tồn và phát huy giá trị văn hóa ẩm thực dân tộc.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-[#f8f8f8] rounded-lg">
                  <Globe className="h-8 w-8 text-[#8FBC8F] mx-auto mb-2" />
                  <div className="text-sm text-[#666] font-nitti">Kết nối toàn cầu</div>
                </div>
                <div className="text-center p-4 bg-[#f8f8f8] rounded-lg">
                  <Users className="h-8 w-8 text-[#8FBC8F] mx-auto mb-2" />
                  <div className="text-sm text-[#666] font-nitti">Phục vụ cộng đồng</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Vision */}
          <div className={`${inView ? 'animate-slideInFromRight' : 'opacity-0'}`}>
            <div className="bg-white rounded-2xl p-8 border border-[#e0e0e0] hover:shadow-lg transition-all duration-500">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#8FBC8F] rounded-xl flex items-center justify-center mr-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#222] font-nitti">Tầm nhìn</h3>
              </div>
              
              <p className="text-[#666] text-lg leading-relaxed mb-6 font-nitti">
                Trở thành nền tảng hàng đầu Việt Nam về đặc sản, nơi mọi người có thể tìm thấy 
                và trải nghiệm tinh hoa ẩm thực từ khắp ba miền đất nước.
              </p>

              <div className="space-y-4">
                <div className="flex items-center p-3 bg-[#f8f8f8] rounded-lg">
                  <div className="w-2 h-2 bg-[#8FBC8F] rounded-full mr-3 flex-shrink-0" />
                  <span className="text-[#666] font-nitti">Mở rộng ra toàn quốc</span>
                </div>
                <div className="flex items-center p-3 bg-[#f8f8f8] rounded-lg">
                  <div className="w-2 h-2 bg-[#8FBC8F] rounded-full mr-3 flex-shrink-0" />
                  <span className="text-[#666] font-nitti">Phát triển bền vững</span>
                </div>
                <div className="flex items-center p-3 bg-[#f8f8f8] rounded-lg">
                  <div className="w-2 h-2 bg-[#8FBC8F] rounded-full mr-3 flex-shrink-0" />
                  <span className="text-[#666] font-nitti">Đưa đặc sản Việt ra thế giới</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className={`${inView ? 'animate-fadeInUp animation-delay-800' : 'opacity-0'}`}>
            <h3 className="text-2xl font-bold text-[#222] mb-6 font-nitti">
              Cùng chúng tôi lan tỏa tinh hoa ẩm thực Việt Nam
            </h3>
            <button className="bg-[#8FBC8F] hover:bg-[#7AA87A] text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-nitti">
              Khám phá ngay
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
'use client';

import { useInView } from 'react-intersection-observer';

export function AboutStory() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-white to-[#8FBC8F]/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text */}
          <div className={`space-y-6 ${inView ? 'animate-slideInFromLeft' : 'opacity-0'}`}>
            <div className="inline-block">
              <span className="text-[#8FBC8F] font-semibold text-sm uppercase tracking-widest font-nitti">
                Câu chuyện của chúng tôi
              </span>
              <div className="w-20 h-1 bg-[#8FBC8F] mt-2" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-beaululo text-[#222] leading-tight tracking-widest uppercase">
              Hành trình khởi nguồn từ 
              <span className="text-[#8FBC8F]"> tình yêu quê hương</span>
            </h2>
            
            <div className="space-y-4 text-[#4C5C4C] text-lg leading-relaxed font-nitti">
              <p>
                Sinh ra và lớn lên trên mảnh đất Việt Nam xinh đẹp, chúng tôi hiểu rằng 
                mỗi vùng miền đều có những đặc sản riêng biệt, mang trong mình câu chuyện 
                văn hóa và truyền thống của từng địa phương.
              </p>
              
              <p>
                Từ những tháng ngày đầu khởi nghiệp, chúng tôi đã đặt mục tiêu mang đến 
                cho mọi người những sản phẩm đặc sản chất lượng nhất, giữ nguyên hương vị 
                truyền thống và giá trị dinh dưỡng tự nhiên.
              </p>
              
              <p className="font-medium text-[#222] font-nitti">
                "Mỗi sản phẩm chúng tôi bán không chỉ là thực phẩm, mà là cả một câu chuyện 
                văn hóa, một phần di sản ẩm thực Việt Nam."
              </p>
            </div>
          </div>

          {/* Right side - Image collage */}
          <div className={`relative ${inView ? 'animate-slideInFromRight' : 'opacity-0'}`}>
            <div className="grid grid-cols-2 gap-4 h-[500px]">
              {/* Main large image */}
              <div className="col-span-2 row-span-2 bg-gradient-to-br from-[#8FBC8F] to-[#222] rounded-2xl overflow-hidden group hover:scale-105 transition-transform duration-500">
                <div className="w-full h-full bg-[url('/images/vietnam-culture.jpg')] bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              
              {/* Small decorative elements */}
              <div className="bg-[#8FBC8F] rounded-xl opacity-80 animate-pulse" />
              <div className="bg-[#7CA87C] rounded-xl opacity-60 animate-pulse animation-delay-500" />
            </div>
            
            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-[#8FBC8F] text-[#222] px-6 py-3 rounded-full font-bold shadow-lg animate-bounce font-nitti">
              Từ 2020
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
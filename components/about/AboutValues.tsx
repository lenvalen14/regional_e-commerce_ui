'use client';

import { useInView } from 'react-intersection-observer';
import { Leaf, Shield, Heart, Star } from 'lucide-react';

export function AboutValues() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const values = [
    {
      icon: Leaf,
      title: 'Tự nhiên nguyên chất',
      description: 'Cam kết mang đến những sản phẩm hoàn toàn tự nhiên, không chất bảo quản.',
      color: 'bg-green-50 text-green-600',
      iconBg: 'bg-green-600'
    },
    {
      icon: Shield,
      title: 'An toàn tuyệt đối',
      description: 'Quy trình kiểm tra chất lượng nghiêm ngặt, đảm bảo vệ sinh an toàn thực phẩm.',
      color: 'bg-blue-50 text-blue-600',
      iconBg: 'bg-blue-600'
    },
    {
      icon: Heart,
      title: 'Tình yêu quê hương',
      description: 'Mỗi sản phẩm được tuyển chọn với tình yêu và niềm tự hào về đất nước Việt Nam.',
      color: 'bg-red-50 text-red-600',
      iconBg: 'bg-red-600'
    },
    {
      icon: Star,
      title: 'Chất lượng hàng đầu',
      description: 'Chỉ chọn lựa những đặc sản chất lượng cao nhất từ các vùng miền, đảm bảo tiêu chuẩn quốc tế.',
      color: 'bg-yellow-50 text-yellow-600',
      iconBg: 'bg-yellow-600'
    },
  ];

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className={`${inView ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <span className="text-[#8FBC8F] font-semibold text-sm uppercase tracking-widest font-nitti">
              Giá trị cốt lõi
            </span>
            <h2 className="text-4xl md:text-5xl font-beaululo text-[#222] mt-4 mb-6 tracking-widest uppercase">
              Những điều chúng tôi tin tưởng
            </h2>
            <div className="w-24 h-1 bg-[#8FBC8F] mx-auto" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {values.map((value, index) => (
            <div
              key={index}
              className={`group hover:scale-105 transition-all duration-500 ${
                inView ? 'animate-slideInFromBottom' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="bg-white rounded-2xl p-8 border border-[#e0e0e0] hover:shadow-lg transition-all duration-500 h-full flex flex-col">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 ${value.iconBg} text-white rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                  <value.icon className="h-8 w-8" />
                </div>
                
                {/* Content */}
                <div className="flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-[#222] mb-4 group-hover:text-[#8FBC8F] transition-colors duration-300 font-nitti">
                    {value.title}
                  </h3>
                  
                  <p className="text-[#666] leading-relaxed flex-grow font-nitti">
                    {value.description}
                  </p>
                </div>

                {/* Bottom accent */}
                <div className="mt-6 pt-4 border-t border-[#f0f0f0]">
                  <div className={`w-8 h-1 ${value.iconBg} rounded-full group-hover:w-16 transition-all duration-300`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
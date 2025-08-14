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
      color: 'from-[#8FBC8F] to-[#7CA87C]'
    },
    {
      icon: Shield,
      title: 'An toàn tuyệt đối',
      description: 'Quy trình kiểm tra chất lượng nghiêm ngặt, đảm bảo vệ sinh an toàn thực phẩm.',
      color: 'from-[#8FBC8F] to-[#7CA87C]'
    },
    {
      icon: Heart,
      title: 'Tình yêu quê hương',
      description: 'Mỗi sản phẩm được tuyển chọn với tình yêu và niềm tự hào về đất nước Việt Nam.',
      color: 'from-[#8FBC8F] to-[#7CA87C]'
    },
    {
      icon: Star,
      title: 'Chất lượng hàng đầu',
      description: 'Chỉ chọn lựa những đặc sản chất lượng cao nhất từ các vùng miền, đảm bảo tiêu chuẩn quốc tế.',
      color: 'from-[#8FBC8F] to-[#7CA87C]'
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

        {/* Thêm items-stretch để tất cả cards có chiều cao bằng nhau */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
          {values.map((value, index) => (
            <div
              key={index}
              className={`group hover:scale-105 transition-all duration-500 h-full ${
                inView ? 'animate-slideInFromBottom' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Thêm h-full và flex flex-col để card chiếm toàn bộ chiều cao */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-500 border border-[#e0e0e0] relative overflow-hidden h-full flex flex-col">
                {/* Background gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${value.color} text-white rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                  <value.icon className="h-8 w-8" />
                </div>
                
                {/* Content - Thêm flex-grow để nội dung chiếm hết không gian còn lại */}
                <div className="flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-[#222] mb-4 group-hover:text-[#8FBC8F] transition-colors duration-300 font-nitti">
                    {value.title}
                  </h3>
                  
                  <p className="text-[#4C5C4C] leading-relaxed flex-grow font-nitti">
                    {value.description}
                  </p>
                </div>

                {/* Decorative element */}
                <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br from-[#e0e0e0] to-[#d0d0d0] rounded-full opacity-50 group-hover:scale-125 transition-transform duration-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
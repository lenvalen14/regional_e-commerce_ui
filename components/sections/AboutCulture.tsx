'use client';

import { useInView } from 'react-intersection-observer';

export function AboutCulture() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const regions = [
    {
      name: 'Miền Bắc',
      description: 'Tinh tế, thanh đạm với hương vị đậm đà của núi rừng Tây Bắc',
      specialties: ['Thịt trâu gác bếp', 'Mắc khén Hà Giang', 'Cốm xanh Vòng'],
      color: 'from-blue-500 to-indigo-600',
      image: '/images/north-vietnam.jpg'
    },
    {
      name: 'Miền Trung',
      description: 'Cay nồng, đậm đà với gia vị phong phú từ vùng đất Huế cố đô',
      specialties: ['Bánh tráng nướng', 'Mắm ruốc', 'Chả cá Nha Trang'],
      color: 'from-red-500 to-pink-600',
      image: '/images/central-vietnam.jpg'
    },
    {
      name: 'Miền Nam',
      description: 'Ngọt thanh, hài hòa với hương vị đồng bằng sông Cửu Long',
      specialties: ['Mắm nêm', 'Kẹo dừa Bến Tre', 'Khô cá sặc'],
      color: 'from-green-500 to-emerald-600',
      image: '/images/south-vietnam.jpg'
    },
  ];

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className={`${inView ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <span className="text-[#8FBC8F] font-semibold text-sm uppercase tracking-widest">
              Văn hóa ẩm thực
            </span>
            <h2 className="text-4xl md:text-5xl font-beaululo text-[#2F3E34] mt-4 mb-6">
              Ba miền - Một tinh hoa
            </h2>
            <div className="w-24 h-1 bg-[#8FBC8F] mx-auto mb-6" />
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Từ Bắc vào Nam, mỗi vùng miền Việt Nam đều có những đặc sản riêng biệt, 
              phản ánh văn hóa và lịch sử của từng địa phương.
            </p>
          </div>
        </div>

        <div className="space-y-16">
          {regions.map((region, index) => (
            <div
              key={index}
              className={`flex flex-col lg:flex-row items-center gap-12 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              } ${inView ? 'animate-slideInFromBottom' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 300}ms` }}
            >
              {/* Image */}
              <div className="lg:w-1/2 relative group">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <div className={`w-full h-80 bg-gradient-to-br ${region.color} opacity-90`}>
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-4xl font-beaululo text-white">
                        {region.name}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Floating decorative elements */}
                <div className={`absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br ${region.color} rounded-full opacity-70 animate-pulse`} />
                <div className={`absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-br ${region.color} rounded-full opacity-50 animate-pulse animation-delay-500`} />
              </div>

              {/* Content */}
              <div className="lg:w-1/2 space-y-6">
                <div>
                  <h3 className="text-3xl font-beaululo text-[#2F3E34] mb-4">
                    Đặc sản {region.name}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    {region.description}
                  </p>
                </div>

                {/* Specialties */}
                <div>
                  <h4 className="text-xl font-semibold text-[#2F3E34] mb-4">
                    Đặc sản nổi bật:
                  </h4>
                  <div className="space-y-3">
                    {region.specialties.map((specialty, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center group hover:scale-105 transition-transform duration-300"
                      >
                        <div className={`w-3 h-3 bg-gradient-to-br ${region.color} rounded-full mr-3 group-hover:scale-125 transition-transform duration-300`} />
                        <span className="text-gray-700 group-hover:text-[#2F3E34] transition-colors duration-300">
                          {specialty}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
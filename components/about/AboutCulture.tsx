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
      color: 'bg-blue-50 text-blue-600',
      accentColor: 'bg-blue-600',
      image: '/images/region-north.jpg'
    },
    {
      name: 'Miền Trung',
      description: 'Cay nồng, đậm đà với gia vị phong phú từ vùng đất Huế cố đô',
      specialties: ['Bánh tráng nướng', 'Mắm ruốc', 'Chả cá Nha Trang'],
      color: 'bg-red-50 text-red-600',
      accentColor: 'bg-red-600',
      image: '/images/region-central.png'
    },
    {
      name: 'Miền Nam',
      description: 'Ngọt thanh, hài hòa với hương vị đồng bằng sông Cửu Long',
      specialties: ['Mắm nêm', 'Kẹo dừa Bến Tre', 'Khô cá sặc'],
      color: 'bg-green-50 text-green-600',
      accentColor: 'bg-green-600',
      image: '/images/region-south.jpg'
    },
  ];

  return (
    <section ref={ref} className="py-20 bg-[#f8f8f8]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className={`${inView ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <span className="text-[#8FBC8F] font-semibold text-sm uppercase tracking-widest font-nitti">
              Văn hóa ẩm thực
            </span>
            <h2 className="text-4xl md:text-5xl font-beaululo text-[#222] mt-4 mb-6 tracking-widest uppercase">
              Ba miền - Một tinh hoa
            </h2>
            <div className="w-24 h-1 bg-[#8FBC8F] mx-auto mb-6" />
            <p className="text-lg text-[#666] max-w-3xl mx-auto font-nitti">
              Từ Bắc vào Nam, mỗi vùng miền Việt Nam đều có những đặc sản riêng biệt, 
              phản ánh văn hóa và lịch sử của từng địa phương.
            </p>
          </div>
        </div>

        <div className="space-y-16 max-w-6xl mx-auto">
          {regions.map((region, index) => (
            <div
              key={index}
              className={`flex flex-col lg:flex-row items-center gap-12 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              } ${inView ? 'animate-slideInFromBottom' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 300}ms` }}
            >
              {/* Image Card */}
              <div className="lg:w-1/2">
                <div className="bg-white rounded-2xl overflow-hidden border border-[#e0e0e0] hover:shadow-lg transition-all duration-500 group">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    {/* Image */}
                    <img
                      src={region.image} // đường dẫn ảnh thật
                      alt={region.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Region name overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                      <h3 className="text-2xl font-beaululo text-white tracking-wider">
                        {region.name}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="lg:w-1/2 space-y-6">
                <div>
                  <h3 className="text-3xl font-beaululo text-[#222] mb-4 tracking-wider uppercase">
                    Đặc sản {region.name}
                  </h3>
                  <p className="text-lg text-[#666] leading-relaxed mb-6 font-nitti">
                    {region.description}
                  </p>
                </div>

                {/* Specialties */}
                <div className="bg-white rounded-xl p-6 border border-[#e0e0e0]">
                  <h4 className="text-xl font-semibold text-[#222] mb-4 font-nitti">
                    Đặc sản nổi bật:
                  </h4>
                  <div className="space-y-3">
                    {region.specialties.map((specialty, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center p-3 bg-[#f8f8f8] rounded-lg hover:bg-[#f0f0f0] transition-colors duration-300 group"
                      >
                        <div className={`w-3 h-3 ${region.accentColor} rounded-full mr-4 flex-shrink-0 group-hover:scale-125 transition-transform duration-300`} />
                        <span className="text-[#666] font-nitti group-hover:text-[#222] transition-colors duration-300">
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
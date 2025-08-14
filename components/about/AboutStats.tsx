'use client';

import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';
import { Users, Award, MapPin, Heart } from 'lucide-react';

export function AboutStats() {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  const stats = [
    {
      icon: Users,
      number: 10000,
      suffix: '+',
      label: 'Khách hàng tin tưởng',
      color: 'text-blue-600'
    },
    {
      icon: Award,
      number: 50,
      suffix: '+',
      label: 'Đặc sản chính hiệu',
      color: 'text-[#8FBC8F]'
    },
    {
      icon: MapPin,
      number: 63,
      suffix: '',
      label: 'Tỉnh thành phủ sóng',
      color: 'text-orange-500'
    },
    {
      icon: Heart,
      number: 99,
      suffix: '%',
      label: 'Khách hàng hài lòng',
      color: 'text-red-500'
    },
  ];

  return (
    <section ref={ref} className="py-20 bg-[#2F3E34] relative overflow-hidden">
      {/* Background pattern - Thay thế SVG bằng pattern đơn giản */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 30px 30px, white 3px, transparent 0)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-beaululo text-white mb-6">
            Những con số ấn tượng
          </h2>
          <div className="w-24 h-1 bg-[#FFD700] mx-auto" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard 
              key={index}
              {...stat}
              delay={index * 200}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ icon: Icon, number, suffix, label, color, delay, inView }: any) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        const increment = number / 100;
        const counter = setInterval(() => {
          setCount(prev => {
            if (prev >= number) {
              clearInterval(counter);
              return number;
            }
            return Math.min(prev + increment, number);
          });
        }, 20);
        
        return () => clearInterval(counter);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [inView, number, delay]);

  return (
    <div 
      className={`text-center group hover:scale-110 transition-all duration-500 ${
        inView ? 'animate-fadeInUp' : 'opacity-0'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`inline-flex items-center justify-center w-16 h-16 ${color} bg-white rounded-full mb-4 group-hover:shadow-lg transition-shadow duration-300`}>
        <Icon className="h-8 w-8" />
      </div>
      
      <div className="text-4xl md:text-5xl font-bold text-white mb-2">
        {Math.floor(count)}{suffix}
      </div>
      
      <div className="text-gray-300 font-medium">
        {label}
      </div>
    </div>
  );
}
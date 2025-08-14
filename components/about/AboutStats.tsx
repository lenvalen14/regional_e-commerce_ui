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
      color: 'bg-blue-50 text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Award,
      number: 50,
      suffix: '+',
      label: 'Đặc sản chính hiệu',
      color: 'bg-green-50 text-[#8FBC8F]',
      bgColor: 'bg-green-50'
    },
    {
      icon: MapPin,
      number: 63,
      suffix: '',
      label: 'Tỉnh thành phủ sóng',
      color: 'bg-orange-50 text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Heart,
      number: 99,
      suffix: '%',
      label: 'Khách hàng hài lòng',
      color: 'bg-red-50 text-red-600',
      bgColor: 'bg-red-50'
    },
  ];

  return (
    <section ref={ref} className="py-20 bg-white relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-[#8FBC8F] to-[#7AA87A] rounded-full opacity-5" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-[#8FBC8F] to-[#7AA87A] rounded-full opacity-5" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[#8FBC8F] font-semibold text-sm uppercase tracking-widest font-nitti">
            Thành tựu
          </span>
          <h2 className="text-4xl md:text-5xl font-beaululo text-[#222] mt-4 mb-6 tracking-widest uppercase">
            Những con số ấn tượng
          </h2>
          <div className="w-24 h-1 bg-[#8FBC8F] mx-auto" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
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

// StatCard component for AboutStats
interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  number: number;
  suffix: string;
  label: string;
  color: string;
  bgColor: string;
  delay: number;
  inView: boolean;
}

function StatCard({ icon: Icon, number, suffix, label, color, bgColor, delay, inView }: StatCardProps) {
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
      className={`text-center group hover:scale-105 transition-all duration-500 ${
        inView ? 'animate-fadeInUp' : 'opacity-0'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="bg-white border border-[#e0e0e0] rounded-2xl p-8 hover:shadow-lg transition-all duration-500">
        <div className={`inline-flex items-center justify-center w-16 h-16 ${color} rounded-full mb-4 transition-all duration-300`}>
          <Icon className="h-8 w-8" />
        </div>
        
        <div className="text-2xl md:text-3xl font-bold text-[#222] mb-3 font-beaululo tracking-wide">
          {Math.floor(count)}{suffix}
        </div>
        
        <div className="text-sm text-[#666] font-medium font-nitti leading-tight">
          {label}
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Grid3X3, ChefHat, Landmark, MapPin, Heart, BookOpen, ScrollText, LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  'grid-3x3': Grid3X3,
  'chef-hat': ChefHat,
  'landmark': Landmark,
  'map-pin': MapPin,
  'heart': Heart,
  'book-open': BookOpen,
  'scroll-text': ScrollText,
};

export function NewsCategories() {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  const [activeCategory, setActiveCategory] = useState('Tất cả');

  const categories: Array<{
    name: string;
    count: number;
    icon: keyof typeof iconMap;
    color: string;
  }> = [
    { name: 'Tất cả', count: 45, icon: 'grid-3x3', color: 'from-blue-400 to-blue-600' },
    { name: 'Ẩm thực', count: 18, icon: 'chef-hat', color: 'from-orange-400 to-red-500' },
    { name: 'Văn hóa', count: 12, icon: 'landmark', color: 'from-purple-400 to-indigo-600' },
    { name: 'Du lịch', count: 8, icon: 'map-pin', color: 'from-green-400 to-teal-600' },
    { name: 'Sức khỏe', count: 7, icon: 'heart', color: 'from-emerald-400 to-green-600' },
    { name: 'Công thức', count: 15, icon: 'book-open', color: 'from-amber-400 to-orange-600' },
    { name: 'Lịch sử', count: 6, icon: 'scroll-text', color: 'from-slate-400 to-gray-600' },
  ];

  return (
    <section ref={ref} className="py-20 bg-[#f8f8f8] border-t border-[#e0e0e0]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <span className="text-[#8FBC8F] font-beaululo text-sm uppercase tracking-widest font-bold">
            Chủ đề
          </span>
          <h3 className={`text-3xl md:text-4xl font-beaululo text-[#222] mt-6 mb-8 tracking-widest uppercase ${inView ? 'animate-fadeInUp' : 'opacity-0'}`}>
            Khám phá theo danh mục
          </h3>
          <div className="w-16 h-px bg-[#8FBC8F] mx-auto" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {categories.map((category, index) => {
            const IconComponent = iconMap[category.icon];
            return (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`group relative flex flex-col items-center p-8 bg-white rounded-2xl border-2 transition-all duration-500 hover:shadow-xl hover:scale-105 ${
                  activeCategory === category.name
                    ? 'border-transparent shadow-xl scale-105'
                    : 'border-[#e0e0e0] hover:border-transparent'
                } ${inView ? 'animate-slideInFromBottom' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon with gradient background */}
                <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${category.color} mb-4 group-hover:scale-110 transition-transform duration-300 ${
                  activeCategory === category.name ? 'shadow-lg' : ''
                }`}>
                  <IconComponent className="h-6 w-6 text-white" strokeWidth={2} />
                  
                  {/* Glow effect for active state */}
                  {activeCategory === category.name && (
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${category.color} opacity-30 blur-md scale-110`} />
                  )}
                </div>
                
                {/* Category name */}
                <span className="font-beaululo text-sm uppercase tracking-widest font-bold mb-2 text-center text-[#222]">
                  {category.name}
                </span>
                
                {/* Count */}
                <span className={`text-xs px-3 py-1 rounded-full font-nitti font-bold transition-colors duration-300 ${
                  activeCategory === category.name
                    ? 'bg-gradient-to-r from-[#8FBC8F] to-[#7AA87A] text-white'
                    : 'bg-[#f0f0f0] text-[#666]'
                }`}>
                  {category.count}
                </span>

                {/* Subtle background glow for active state */}
                {activeCategory === category.name && (
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${category.color} opacity-5 -z-10`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Category description */}
        <div className="text-center mt-12">
          <p className="text-[#666] font-nitti max-w-2xl mx-auto">
            {activeCategory === 'Tất cả' 
              ? 'Khám phá tất cả các bài viết về ẩm thực và văn hóa Việt Nam'
              : `Khám phá các bài viết về ${activeCategory.toLowerCase()} một cách chi tiết và đầy đủ nhất`
            }
          </p>
        </div>
      </div>
    </section>
  );
}
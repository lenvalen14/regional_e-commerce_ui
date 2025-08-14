'use client';

import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

export function NewsCategories() {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  const [activeCategory, setActiveCategory] = useState('Tất cả');

  const categories = [
    { name: 'Tất cả', count: 45, icon: '📰' },
    { name: 'Ẩm thực', count: 18, icon: '🍜' },
    { name: 'Văn hóa', count: 12, icon: '🏛️' },
    { name: 'Du lịch', count: 8, icon: '🗺️' },
    { name: 'Sức khỏe', count: 7, icon: '💚' },
    { name: 'Công thức', count: 15, icon: '📖' },
    { name: 'Lịch sử', count: 6, icon: '📜' },
  ];

  return (
    <section ref={ref} className="py-16 bg-gradient-to-r from-amber-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className={`text-2xl font-serif text-amber-900 mb-6 ${inView ? 'animate-fadeInUp' : 'opacity-0'}`}>
            Khám phá theo chủ đề
          </h3>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category, index) => (
            <button
              key={category.name}
              onClick={() => setActiveCategory(category.name)}
              className={`group relative overflow-hidden px-6 py-3 rounded-full border-2 transition-all duration-300 ${
                activeCategory === category.name
                  ? 'bg-amber-600 text-white border-amber-600 shadow-lg scale-105'
                  : 'bg-white text-amber-700 border-amber-200 hover:border-amber-400 hover:scale-105'
              } ${inView ? 'animate-slideInFromBottom' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background gradient for active state */}
              <div className={`absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 transition-opacity duration-300 ${
                activeCategory === category.name ? 'opacity-100' : 'opacity-0'
              }`} />
              
              <div className="relative flex items-center gap-2">
                <span className="text-lg">{category.icon}</span>
                <span className="font-semibold">{category.name}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activeCategory === category.name
                    ? 'bg-white/20 text-white'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {category.count}
                </span>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
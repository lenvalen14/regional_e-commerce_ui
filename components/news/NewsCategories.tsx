'use client';

import { useState, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import {
  Grid3X3, ChefHat, Landmark, MapPin, Heart, BookOpen, ScrollText, LucideIcon
} from 'lucide-react';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { NewResponse, NewType } from "@/features/new/newApi";

import { formatDate } from '@/app/admin/dashboard/news/NewsItems';
import { getExcerpt } from '@/app/news/page';

// ===============================
// Icon Map
// ===============================
const iconMap: Record<string, LucideIcon> = {
  'grid-3x3': Grid3X3,
  'chef-hat': ChefHat,
  'landmark': Landmark,
  'map-pin': MapPin,
  'heart': Heart,
  'book-open': BookOpen,
  'scroll-text': ScrollText,
};

// ===============================
// Props
// ===============================
interface NewsCategoriesProps {
  news: NewResponse[];
}

export function NewsCategories({ news }: NewsCategoriesProps) {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  const [activeCategory, setActiveCategory] = useState<string>('Tất cả');

  // ===============================
  // Categories
  // ===============================
  const categories: Array<{
    name: string;
    type?: NewType;
    icon: keyof typeof iconMap;
    color: string;
  }> = [
      { name: 'Tất cả', icon: 'grid-3x3', color: 'from-blue-400 to-blue-600' },
      { name: 'Ẩm thực', type: 'AM_THUC', icon: 'chef-hat', color: 'from-orange-400 to-red-500' },
      { name: 'Văn hóa', type: 'VAN_HOA', icon: 'landmark', color: 'from-purple-400 to-indigo-600' },
      { name: 'Du lịch', type: 'DU_LICH', icon: 'map-pin', color: 'from-green-400 to-teal-600' },
      { name: 'Sức khỏe', type: 'SUC_KHOE', icon: 'heart', color: 'from-emerald-400 to-green-600' },
      { name: 'Công thức', type: 'CONG_THUC', icon: 'book-open', color: 'from-amber-400 to-orange-600' },
      { name: 'Lịch sử', type: 'LICH_SU', icon: 'scroll-text', color: 'from-slate-400 to-gray-600' },
    ];

  // Human-readable map
  const newTypeMap: Record<NewType, string> = {
    AM_THUC: "Ẩm thực",
    VAN_HOA: "Văn hóa",
    DU_LICH: "Du lịch",
    SUC_KHOE: "Sức khỏe",
    CONG_THUC: "Công thức",
    LICH_SU: "Lịch sử",
  };

  // ===============================
  // Filtered news (max 3)
  // ===============================
  const filteredNews = useMemo(() => {
    let result: NewResponse[] = [];

    if (activeCategory === 'Tất cả') {
      result = news;
    } else {
      const category = categories.find(c => c.name === activeCategory);
      result = news.filter(n => n.type === category?.type);
    }

    // sắp xếp mới nhất → cũ hơn
    result = result.sort(
      (a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
    );

    return result.slice(0, 3); // chỉ lấy 3 bài
  }, [activeCategory, news]);

  return (
    <section ref={ref} className="py-20 bg-[#f8f8f8] border-t border-[#e0e0e0]">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Title */}
        <div className="text-center mb-16">
          <span className="text-[#8FBC8F] font-beaululo text-sm uppercase tracking-widest font-bold">
            Chủ đề
          </span>
          <h3
            className={`text-3xl md:text-4xl font-beaululo text-[#222] mt-6 mb-8 tracking-widest uppercase ${inView ? 'animate-fadeInUp' : 'opacity-0'
              }`}
          >
            Khám phá theo danh mục
          </h3>
          <div className="w-16 h-px bg-[#8FBC8F] mx-auto" />
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {categories.map((category, index) => {
            const IconComponent = iconMap[category.icon];
            return (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`group relative flex flex-col items-center p-8 bg-white rounded-2xl border-2 transition-all duration-500 hover:shadow-xl hover:scale-105 ${activeCategory === category.name
                  ? 'border-transparent shadow-xl scale-105'
                  : 'border-[#e0e0e0] hover:border-transparent'
                  } ${inView ? 'animate-slideInFromBottom' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`relative p-4 rounded-2xl bg-gradient-to-br ${category.color} mb-4 group-hover:scale-110 transition-transform duration-300 ${activeCategory === category.name ? 'shadow-lg' : ''
                    }`}
                >
                  <IconComponent className="h-6 w-6 text-white" strokeWidth={2} />
                  {activeCategory === category.name && (
                    <div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${category.color} opacity-30 blur-md scale-110`}
                    />
                  )}
                </div>
                <span className="font-beaululo text-sm uppercase tracking-widest font-bold mb-2 text-center text-[#222]">
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* News list */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {filteredNews.map(newsItem => (
            <Link
              key={newsItem.newId}
              href={`/news/${newsItem.newId}`}
              className={`block group cursor-pointer ${inView ? 'animate-slideInFromBottom' : 'opacity-0'}`}
            // style={{ animationDelay: `${index * 150}ms` }}
            >
              <article className="flex flex-col">
                <div className="relative overflow-hidden aspect-[4/3] mb-6 bg-[#f8f8f8] group-hover:shadow-lg transition-all duration-500">
                  {newsItem.images && newsItem.images[0] && (
                    <img
                      src={newsItem.images[0].imageUrl}
                      alt={newsItem.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#8FBC8F] text-white px-3 py-1 text-xs font-beaululo uppercase tracking-widest font-bold">
                      {newsItem.type ? newTypeMap[newsItem.type] : "Khác"}
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <h3 className="font-beaululo text-lg text-[#222] group-hover:text-[#8FBC8F] transition-colors duration-300 leading-tight tracking-widest uppercase line-clamp-2">
                    {newsItem.title}
                  </h3>

                  <p className="text-[#666] leading-relaxed font-nitti line-clamp-3 text-sm">
                    {getExcerpt(newsItem.content)}
                  </p>

                  <div className="flex items-center justify-between text-xs text-[#888] font-nitti pt-4 border-t border-[#e0e0e0]">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>Admin</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(newsItem.createAt)}</span>
                      </div>
                    </div>

                    {/* <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{getReadTime(newsItem.content)}</span>
                    </div> */}
                  </div>

                  <div className="pt-4">
                    <div className="text-[#8FBC8F] font-nitti font-bold uppercase tracking-widest text-sm hover:text-[#222] transition-colors duration-300 border-b border-[#8FBC8F] hover:border-[#222] pb-1 inline-flex items-center gap-2 group">
                      Đọc thêm
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
          {filteredNews.length === 0 && (
            <p className="text-center text-gray-500 col-span-full">
              Chưa có bài viết nào.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

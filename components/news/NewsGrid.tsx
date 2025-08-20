'use client';

import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Calendar, User, Clock, ArrowRight, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { NewResponse } from '@/features/new/newApi';
import { formatDate } from '@/app/admin/dashboard/news/NewsItems';
import { getExcerpt } from '@/app/news/page';

interface NewsGridProps {
  articles: NewResponse[]; // nhận từ NewsPage
}

export function NewsGrid({ articles }: NewsGridProps) {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  if (!articles || articles.length === 0) return null;

  return (
    <section ref={ref} className="py-24 bg-white border-t border-[#e0e0e0]">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header with Search and Filter */}
        <div className={`mb-16 ${inView ? 'animate-fadeInUp' : 'opacity-0'}`}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-beaululo text-[#222] mb-4 tracking-widest uppercase">
                Tất cả bài viết
              </h2>
              <p className="text-[#666] font-nitti text-lg">Khám phá thêm nhiều câu chuyện thú vị</p>
              <div className="w-16 h-px bg-[#8FBC8F] mt-4" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#8FBC8F]" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 border border-[#e0e0e0] focus:border-[#8FBC8F] focus:outline-none transition-colors duration-300 w-full sm:w-72 font-nitti text-sm bg-white"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#8FBC8F]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-12 pr-10 py-3 border border-[#e0e0e0] focus:border-[#8FBC8F] focus:outline-none transition-colors duration-300 bg-white font-nitti text-sm appearance-none cursor-pointer"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="popular">Phổ biến</option>
                  <option value="trending">Thịnh hành</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 text-sm text-[#888] font-nitti">
            Hiển thị {articles.length} bài viết
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {articles.map((article, index) => (
            <Link
              key={article.newId}
              href={`/news/${article.newId}`}
              className={`block group cursor-pointer ${inView ? 'animate-slideInFromBottom' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <article className="flex flex-col">
                <div className="relative overflow-hidden aspect-[4/3] mb-6 bg-[#f8f8f8] group-hover:shadow-lg transition-all duration-500">
                  {article.images && article.images[0] && (
                    <img
                      src={article.images[0].imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#8FBC8F] text-white px-3 py-1 text-xs font-beaululo uppercase tracking-widest font-bold">
                      {article.category?.categoryName}
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <h3 className="font-beaululo text-lg text-[#222] group-hover:text-[#8FBC8F] transition-colors duration-300 leading-tight tracking-widest uppercase line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-[#666] leading-relaxed font-nitti line-clamp-3 text-sm">
                    {getExcerpt(article.content)}
                  </p>

                  <div className="flex items-center justify-between text-xs text-[#888] font-nitti pt-4 border-t border-[#e0e0e0]">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>Admin</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(article.createAt)}</span>
                      </div>
                    </div>

                    {/* <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{getReadTime(article.content)}</span>
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
        </div>

        {articles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#888] font-nitti text-lg">Không tìm thấy bài viết phù hợp.</p>
          </div>
        )}

        {articles.length > 0 && (
          <div className="text-center mt-16">
            <button className="bg-[#8FBC8F] text-white px-8 py-3 font-beaululo uppercase tracking-widest font-bold text-sm hover:bg-[#222] transform hover:scale-105 transition-all duration-300 border-2 border-[#8FBC8F] hover:border-[#222]">
              Xem thêm bài viết
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

'use client';

import { useInView } from 'react-intersection-observer';
import { Calendar, User, Clock } from 'lucide-react';
import Link from 'next/link';
import { NewResponse } from '@/features/new/newApi';
import { formatDate } from '@/app/admin/dashboard/news/NewsItems';
import { getExcerpt } from '@/app/news/page';

interface FeaturedNewsProps {
  articles: NewResponse[];
}

export function FeaturedNews({ articles }: FeaturedNewsProps) {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  if (!articles || articles.length === 0) return null;

  // Lấy bài chính (bài đầu tiên trong mảng) và các bài phụ
  const mainArticle = articles[0];
  const sideArticles = articles.slice(1);

  return (
    <section ref={ref} className="py-24 bg-white border-t border-[#e0e0e0]">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-20">
          <div className={`${inView ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <span className="text-[#8FBC8F] font-beaululo text-sm uppercase tracking-widest font-bold">
              Nổi bật
            </span>
            <h2 className="text-3xl md:text-4xl font-beaululo text-[#222] mt-6 mb-8 tracking-widest uppercase">
              Câu chuyện đặc biệt
            </h2>
            <div className="w-16 h-px bg-[#8FBC8F] mx-auto" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Featured Article */}
          <div className={`lg:col-span-2 ${inView ? 'animate-slideInFromLeft' : 'opacity-0'}`}>
            <Link href={`/news/${mainArticle.newId}`}>
              <article className="group cursor-pointer">
                <div className="relative overflow-hidden mb-8 border border-[#e0e0e0] group-hover:shadow-2xl transition-all duration-500">
                  {/* Image */}
                  {mainArticle.images && mainArticle.images[0] && (
                    <div className="aspect-[16/9] overflow-hidden relative">
                      <img
                        src={mainArticle.images[0].imageUrl}
                        alt={mainArticle.title}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <h3 className="text-2xl md:text-3xl font-beaululo text-[#222] group-hover:text-[#8FBC8F] transition-colors duration-300 leading-tight tracking-widest uppercase">
                    {mainArticle.title}
                  </h3>

                  <p className="text-[#666] text-lg leading-relaxed font-nitti">
                    {getExcerpt(mainArticle.content)}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-[#e0e0e0]">
                    <div className="flex items-center gap-6 text-sm text-[#888] font-nitti">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Admin</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(mainArticle.createAt)}</span>
                      </div>
                      {/* <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{getReadTime(mainArticle.content)}</span>
                      </div> */}
                    </div>

                    <div className="text-[#8FBC8F] font-nitti font-bold uppercase tracking-widest text-sm hover:text-[#222] transition-colors duration-300 border-b border-[#8FBC8F] hover:border-[#222] pb-1 flex items-center gap-2 group">
                      Đọc thêm
                      <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          </div>

          {/* Side Articles */}
          <div className="space-y-8">
            {sideArticles.map((article, index) => (
              <Link
                key={article.newId}
                href={`/news/${article.newId}`}
                className={`block group cursor-pointer ${inView ? 'animate-slideInFromRight' : 'opacity-0'}`}
                style={{ animationDelay: `${(index + 1) * 200}ms` }}
              >
                <article>
                  <div className="flex gap-6 p-6 border border-[#e0e0e0] hover:shadow-2xl transition-all duration-500 bg-white group-hover:scale-105">
                    {/* Image */}
                    {article.images && article.images[0] && (
                      <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded">
                        <img
                          src={article.images[0].imageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}

                    <div className="flex-1 space-y-3">
                      <span className="text-xs text-[#8FBC8F] font-beaululo font-bold uppercase tracking-widest">
                        {article.category?.categoryName}
                      </span>
                      <h4 className="font-beaululo text-[#222] group-hover:text-[#8FBC8F] transition-colors duration-300 leading-tight tracking-widest uppercase text-sm line-clamp-2">
                        {article.title}
                      </h4>
                      <p className="text-sm text-[#666] font-nitti line-clamp-2 leading-relaxed">
                        {getExcerpt(article.content, 100)}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-[#888] font-nitti">
                        <span>{formatDate(article.createAt)}</span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

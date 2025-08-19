'use client';

import { useInView } from 'react-intersection-observer';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { NewType, useGetAllNewsQuery } from '@/features/new/newApi';

// Human-readable map
const newTypeMap: Record<NewType, string> = {
  AM_THUC: "Ẩm thực",
  VAN_HOA: "Văn hóa",
  DU_LICH: "Du lịch",
  SUC_KHOE: "Sức khỏe",
  CONG_THUC: "Công thức",
  LICH_SU: "Lịch sử",
};

const formatDate = (timestamp: number | string | Date) => {
  const date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp);
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export function RelatedArticles() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const { data, isLoading } = useGetAllNewsQuery({});


  const relatedArticles = data?.data.slice(0, 3) || [];

  return (
    <section ref={ref} className="py-20 bg-white border-t border-[#e0e0e0]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className={`${inView ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}>
            <h2 className="text-2xl md:text-3xl font-beaululo text-[#222] mb-4 tracking-widest uppercase">
              Bài viết nổi bật khác
            </h2>
            <p className="text-[#666] font-nitti mb-6">
              Khám phá thêm những câu chuyện về văn hóa ẩm thực Việt Nam
            </p>
            <div className="w-24 h-px bg-[#8FBC8F] mx-auto" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {relatedArticles.map((article, index) => (
            <Link
              key={article.newId}
              href={`/news/${article.newId}`}
              className={`group block ${inView ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <article className="border border-[#e0e0e0] bg-white hover:border-[#8FBC8F] transition-all duration-300 group-hover:shadow-sm">
                {/* Image */}
                {/* <div className="aspect-[16/9] overflow-hidden relative">
                  <img
                    src={article.images[0].imageUrl}
                    alt={article.title}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                  />
                </div> */}
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={article.images[0].imageUrl}
                    alt={article.title}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#8FBC8F] text-white px-3 py-1 text-xs font-beaululo uppercase tracking-widest font-bold">
                      {article.type ? newTypeMap[article.type] : "Khác"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-4">
                  <h3 className="font-beaululo text-lg text-[#222] group-hover:text-[#8FBC8F] transition-colors duration-300 leading-tight tracking-widest uppercase">
                    {article.title}
                  </h3>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-[#888] font-nitti pt-4 border-t border-[#f0f0f0]">
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
                  </div>

                  {/* Read more */}
                  <div className="pt-4">
                    <div className="text-[#8FBC8F] font-nitti text-xs tracking-widest uppercase hover:text-[#7aa87a] transition-colors duration-300 flex items-center gap-2 group-hover:gap-3">
                      Đọc thêm
                      <ArrowRight className="h-3 w-3 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-16">
          <Link
            href="/news"
            className="inline-block border border-[#e0e0e0] text-[#666] px-8 py-3 font-nitti text-sm tracking-widest uppercase hover:border-[#8FBC8F] hover:text-[#8FBC8F] transition-colors duration-300"
          >
            Xem tất cả bài viết
          </Link>
        </div>
      </div>
    </section>
  );
}
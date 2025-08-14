'use client';

import { useInView } from 'react-intersection-observer';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function RelatedArticles() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const relatedArticles = [
    {
      id: 2,
      title: 'Bún bò Huế - Hồn cốt ẩm thực cung đình',
      excerpt: 'Câu chuyện về món bún bò Huế và những bí mật gia truyền từ cố đô Huế...',
      category: 'Văn hóa',
      author: 'Văn Hưng',
      date: '8 Dec 2024',
      readTime: '10 phút',
      image: '/images/bun-bo-hue.jpg'
    },
    {
      id: 3,
      title: 'Chè đậu xanh - Món tráng miệng truyền thống',
      excerpt: 'Bí quyết làm chè đậu xanh thơm ngon như của bà ngoại...',
      category: 'Công thức',
      author: 'Thu Hương',
      date: '5 Dec 2024',
      readTime: '5 phút',
      image: '/images/che.jpg'
    },
    {
      id: 4,
      title: 'Bánh mì Việt Nam - Từ đường phố đến thế giới',
      excerpt: 'Hành trình chinh phục thế giới của chiếc bánh mì Việt Nam...',
      category: 'Ẩm thực',
      author: 'Lan Anh',
      date: '3 Dec 2024',
      readTime: '7 phút',
      image: '/images/banh-mi.jpg'
    }
  ];

  return (
    <section ref={ref} className="py-20 bg-white border-t border-[#e0e0e0]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className={`${inView ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}>
            <h2 className="text-2xl md:text-3xl font-beaululo text-[#222] mb-4 tracking-widest uppercase">
              Bài viết liên quan
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
              key={article.id} 
              href={`/news/${article.id}`}
              className={`group block ${inView ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <article className="border border-[#e0e0e0] bg-white hover:border-[#8FBC8F] transition-all duration-300 group-hover:shadow-sm">
                {/* Image */}
                <div className="relative overflow-hidden aspect-[4/3]">
                  <div className="w-full h-full bg-[#f5f5f5] group-hover:bg-[#f0f0f0] transition-colors duration-300" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white text-[#666] px-3 py-1 text-xs font-nitti tracking-widest uppercase border border-[#e0e0e0]">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-4">
                  <h3 className="font-beaululo text-lg text-[#222] group-hover:text-[#8FBC8F] transition-colors duration-300 leading-tight tracking-widest uppercase">
                    {article.title}
                  </h3>
                  
                  <p className="text-[#666] leading-relaxed font-nitti text-sm line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-[#888] font-nitti pt-4 border-t border-[#f0f0f0]">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{article.date}</span>
                      </div>
                    </div>
                    <span>{article.readTime}</span>
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
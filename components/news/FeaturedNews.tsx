'use client';

import { useInView } from 'react-intersection-observer';
import { Calendar, User } from 'lucide-react';
import Link from 'next/link';

export function FeaturedNews() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const featuredArticles = [
    {
      id: 1,
      title: 'Nghệ thuật làm nước mắm Phú Quốc',
      excerpt: 'Tìm hiểu quy trình làm nước mắm truyền thống với hương vị đặc trưng của đảo ngọc Phú Quốc...',
      category: 'Ẩm thực',
      author: 'Minh An',
      date: '10 Dec 2024',
      readTime: '8 phút',
      image: '/images/nuoc_mam.jpg',
      featured: true
    },
    {
      id: 2,
      title: 'Chợ đêm Đà Lạt - Thiên đường đặc sản',
      excerpt: 'Khám phá những món đặc sản độc đáo chỉ có ở chợ đêm Đà Lạt...',
      category: 'Du lịch',
      author: 'Thu Hà',
      date: '8 Dec 2024',
      readTime: '6 phút',
      image: '/images/cho-dem-da-lat.jpg'
    },
    {
      id: 3,
      title: 'Bún bò Huế - Hồn cốt ẩm thực cung đình',
      excerpt: 'Câu chuyện về món bún bò Huế và những bí mật gia truyền...',
      category: 'Văn hóa',
      author: 'Văn Hưng',
      date: '5 Dec 2024',
      readTime: '10 phút',
      image: '/images/bun-bo-hue.jpg'
    }
  ];

  return (
    <section ref={ref} className="py-24 bg-white border-t border-[#e0e0e0]">
      <div className="container mx-auto px-4 max-w-6xl">
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
            <Link href={`/news/${featuredArticles[0].id}`}>
              <article className="group cursor-pointer">
                <div className="relative overflow-hidden mb-8 border border-[#e0e0e0] group-hover:shadow-2xl transition-all duration-500">
                  {/* Image */}
                  <div className="aspect-[16/9] overflow-hidden relative">
                    <img 
                      src={featuredArticles[0].image} 
                      alt={featuredArticles[0].title} 
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Category label */}
                    <div className="absolute top-6 left-6">
                      <span className="bg-[#8FBC8F] text-white px-4 py-2 text-sm font-beaululo uppercase tracking-widest font-bold">
                        {featuredArticles[0].category}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-2xl md:text-3xl font-beaululo text-[#222] group-hover:text-[#8FBC8F] transition-colors duration-300 leading-tight tracking-widest uppercase">
                    {featuredArticles[0].title}
                  </h3>
                  
                  <p className="text-[#666] text-lg leading-relaxed font-nitti">
                    {featuredArticles[0].excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-[#e0e0e0]">
                    <div className="flex items-center gap-6 text-sm text-[#888] font-nitti">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{featuredArticles[0].author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{featuredArticles[0].date}</span>
                      </div>
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
            {featuredArticles.slice(1).map((article, index) => (
              <Link 
                key={article.id}
                href={`/news/${article.id}`}
                className={`block group cursor-pointer ${inView ? 'animate-slideInFromRight' : 'opacity-0'}`}
                style={{ animationDelay: `${(index + 1) * 200}ms` }}
              >
                <article>
                  <div className="flex gap-6 p-6 border border-[#e0e0e0] hover:shadow-2xl transition-all duration-500 bg-white group-hover:scale-105">
                    
                    {/* Image */}
                    <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded">
                      <img 
                        src={article.image} 
                        alt={article.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <span className="text-xs text-[#8FBC8F] font-beaululo font-bold uppercase tracking-widest">
                        {article.category}
                      </span>
                      <h4 className="font-beaululo text-[#222] group-hover:text-[#8FBC8F] transition-colors duration-300 leading-tight tracking-widest uppercase text-sm line-clamp-2">
                        {article.title}
                      </h4>
                      <p className="text-sm text-[#666] font-nitti line-clamp-2 leading-relaxed">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-[#888] font-nitti">
                        <span>{article.date}</span>
                        <span>•</span>
                        <span>{article.readTime}</span>
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
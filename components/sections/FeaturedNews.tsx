'use client';

import { useInView } from 'react-intersection-observer';
import { Calendar, User, ArrowRight } from 'lucide-react';
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
      image: '/images/nuoc-mam.jpg',
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
      image: '/images/cho-da-lat.jpg'
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
    <section ref={ref} className="py-20 bg-white relative">
      {/* Decorative border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-200 via-orange-300 to-red-200" />
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className={`${inView ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <span className="text-amber-600 font-semibold text-sm uppercase tracking-widest">
              Nổi bật
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-amber-900 mt-4 mb-6">
              Câu chuyện đặc biệt
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-amber-600 to-orange-600 mx-auto" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Featured Article */}
          <div className={`lg:col-span-2 ${inView ? 'animate-slideInFromLeft' : 'opacity-0'}`}>
            <Link href={`/news/${featuredArticles[0].id}`}>
              <article className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl mb-6 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                  <div className="aspect-[16/10] bg-gradient-to-br from-amber-200 to-orange-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {featuredArticles[0].category}
                    </span>
                  </div>
                  <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-700" />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl md:text-3xl font-serif text-amber-900 group-hover:text-orange-700 transition-colors duration-300 leading-tight">
                    {featuredArticles[0].title}
                  </h3>
                  
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {featuredArticles[0].excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-amber-600">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{featuredArticles[0].author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{featuredArticles[0].date}</span>
                      </div>
                    </div>
                    
                    <div className="text-amber-700 font-semibold hover:text-orange-600 transition-colors duration-300 flex items-center gap-2 group">
                      Đọc thêm 
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          </div>

          {/* Side Articles */}
          <div className="space-y-6">
            {featuredArticles.slice(1).map((article, index) => (
              <Link 
                key={article.id}
                href={`/news/${article.id}`}
                className={`block group cursor-pointer ${inView ? 'animate-slideInFromRight' : 'opacity-0'}`}
                style={{ animationDelay: `${(index + 1) * 200}ms` }}
              >
                <article>
                  <div className="flex gap-4 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl hover:shadow-lg transition-all duration-300 border border-amber-100">
                    <div className="w-24 h-24 bg-gradient-to-br from-amber-200 to-orange-300 rounded-lg flex-shrink-0 overflow-hidden">
                      <div className="w-full h-full group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <span className="text-xs text-amber-600 font-semibold uppercase tracking-wider">
                        {article.category}
                      </span>
                      <h4 className="font-serif text-amber-900 group-hover:text-orange-700 transition-colors duration-300 leading-tight line-clamp-2">
                        {article.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-amber-600">
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
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
    <section ref={ref} className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className={`${inView ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <h2 className="text-3xl md:text-4xl font-serif text-amber-900 mb-4">
              Bài viết liên quan
            </h2>
            <p className="text-amber-700 max-w-2xl mx-auto">
              Khám phá thêm những câu chuyện thú vị khác về văn hóa ẩm thực Việt Nam
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-orange-600 mx-auto mt-6" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedArticles.map((article, index) => (
            <Link 
              key={article.id} 
              href={`/news/${article.id}`}
              className={`group block ${inView ? 'animate-slideInFromBottom' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-amber-100 group-hover:border-amber-300 group-hover:scale-105">
                {/* Image */}
                <div className="relative overflow-hidden aspect-video">
                  <div className="w-full h-full bg-gradient-to-br from-amber-200 to-orange-300 group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {article.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <h3 className="font-serif text-xl text-amber-900 group-hover:text-orange-700 transition-colors duration-300 leading-tight line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm text-amber-600">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{article.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Read more */}
                  <div className="pt-4 border-t border-amber-100">
                    <div className="text-amber-700 font-semibold hover:text-orange-600 transition-colors duration-300 flex items-center gap-2 group-hover:gap-3">
                      Đọc thêm 
                      <ArrowRight className="h-4 w-4 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
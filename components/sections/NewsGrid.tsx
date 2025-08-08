'use client';

import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Calendar, User, Clock, ArrowRight, Search, Filter } from 'lucide-react';
import Link from 'next/link';

export function NewsGrid() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const articles = [
    {
      id: 1,
      title: 'Bánh mì Việt Nam - Từ đường phố đến thế giới',
      excerpt: 'Câu chuyện về chiếc bánh mì Việt Nam và hành trình chinh phục thế giới...',
      category: 'Ẩm thực',
      author: 'Lan Anh',
      date: '12 Dec 2024',
      readTime: '7 phút',
      image: '/images/banh-mi.jpg',
      views: 1250
    },
    {
      id: 2,
      title: 'Phở - Linh hồn ẩm thực Việt',
      excerpt: 'Khám phá lịch sử và nghệ thuật nấu phở từ những quán phở cổ...',
      category: 'Văn hóa',
      author: 'Minh Tuấn',
      date: '10 Dec 2024',
      readTime: '12 phút',
      image: '/images/pho.jpg',
      views: 980
    },
    {
      id: 3,
      title: 'Chè đậu xanh - Món tráng miệng truyền thống',
      excerpt: 'Bí quyết làm chè đậu xanh thơm ngon như của bà ngoại...',
      category: 'Công thức',
      author: 'Thu Hương',
      date: '8 Dec 2024',
      readTime: '5 phút',
      image: '/images/che.jpg',
      views: 760
    },
    // Thêm nhiều articles khác...
  ];

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header with Search and Filter */}
        <div className={`mb-12 ${inView ? 'animate-fadeInUp' : 'opacity-0'}`}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-3xl font-serif text-amber-900 mb-2">
                Tất cả bài viết
              </h2>
              <p className="text-amber-600">Khám phá thêm nhiều câu chuyện thú vị</p>
            </div>

            <div className="flex gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border-2 border-amber-200 rounded-full focus:border-amber-400 focus:outline-none transition-colors duration-300 w-64"
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-10 pr-8 py-2 border-2 border-amber-200 rounded-full focus:border-amber-400 focus:outline-none transition-colors duration-300 bg-white"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="popular">Phổ biến</option>
                  <option value="trending">Thịnh hành</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <Link 
              key={article.id}
              href={`/news/${article.id}`}
              className={`block group cursor-pointer ${inView ? 'animate-slideInFromBottom' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <article>
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-amber-100 group-hover:border-amber-300 group-hover:scale-105">
                  {/* Image */}
                  <div className="relative overflow-hidden aspect-video">
                    <div className="w-full h-full bg-gradient-to-br from-amber-200 to-orange-300 group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {article.category}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <h3 className="font-serif text-xl text-amber-900 group-hover:text-orange-700 transition-colors duration-300 leading-tight line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>

                    {/* Meta info */}
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
                      
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>

                    {/* Read more button */}
                    <div className="pt-4 border-t border-amber-100">
                      <div className="text-amber-700 font-semibold hover:text-orange-600 transition-colors duration-300 flex items-center gap-2 group-hover:gap-3">
                        Đọc thêm 
                        <ArrowRight className="h-4 w-4 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:from-amber-700 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            Xem thêm bài viết
          </button>
        </div>
      </div>
    </section>
  );
}
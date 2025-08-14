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
    {
      id: 4,
      title: 'Bánh chưng - Tinh hoa ẩm thực Tết',
      excerpt: 'Khám phá nghệ thuật gói bánh chưng và ý nghĩa văn hóa sâu sắc...',
      category: 'Văn hóa',
      author: 'Hoàng Nam',
      date: '6 Dec 2024',
      readTime: '9 phút',
      image: '/images/banh-chung.jpg',
      views: 890
    },
    {
      id: 5,
      title: 'Cà phê sữa đá - Hương vị đặc trưng Sài Gòn',
      excerpt: 'Câu chuyện về ly cà phê sữa đá và văn hóa cà phê vỉa hè...',
      category: 'Ẩm thực',
      author: 'Mai Linh',
      date: '4 Dec 2024',
      readTime: '6 phút',
      image: '/images/ca-phe.jpg',
      views: 650
    },
    {
      id: 6,
      title: 'Nem nướng Nha Trang - Đặc sản biển cả',
      excerpt: 'Bí mật làm nem nướng Nha Trang thơm ngon đúng điệu...',
      category: 'Công thức',
      author: 'Văn Đức',
      date: '2 Dec 2024',
      readTime: '8 phút',
      image: '/images/nem-nuong.jpg',
      views: 720
    }
  ];

  // Filter articles based on search term
  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort articles
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.views - a.views;
      case 'trending':
        return b.views - a.views; // Same as popular for demo
      case 'newest':
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

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
              {/* Search */}
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

              {/* Sort */}
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

          {/* Results count */}
          <div className="mt-6 text-sm text-[#888] font-nitti">
            Hiển thị {sortedArticles.length} bài viết
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {sortedArticles.map((article, index) => (
            <Link 
              key={article.id}
              href={`/news/${article.id}`}
              className={`block group cursor-pointer ${inView ? 'animate-slideInFromBottom' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <article className="flex flex-col">
                {/* Image */}
                <div className="relative overflow-hidden aspect-[4/3] mb-6 bg-[#f8f8f8] group-hover:shadow-lg transition-all duration-500">
                  <div className="w-full h-full bg-gradient-to-br from-[#f0f0f0] to-[#e0e0e0] group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#8FBC8F] text-white px-3 py-1 text-xs font-beaululo uppercase tracking-widest font-bold">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                  <h3 className="font-beaululo text-lg text-[#222] group-hover:text-[#8FBC8F] transition-colors duration-300 leading-tight tracking-widest uppercase line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-[#666] leading-relaxed font-nitti line-clamp-3 text-sm">
                    {article.excerpt}
                  </p>

                  {/* Meta info */}
                  <div className="flex items-center justify-between text-xs text-[#888] font-nitti pt-4 border-t border-[#e0e0e0]">
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
                    
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  {/* Read more button */}
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

        {/* No results */}
        {sortedArticles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#888] font-nitti text-lg">Không tìm thấy bài viết phù hợp.</p>
          </div>
        )}

        {/* Load More */}
        {sortedArticles.length > 0 && (
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
'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { 
  Calendar, User, Clock, Eye, Heart, Share2, Bookmark, 
  ArrowLeft, Coffee, MessageCircle, ThumbsUp, Facebook, 
  Twitter, Link as LinkIcon
} from 'lucide-react';
import Link from 'next/link';

interface Props {
  articleId: string;
}

export function ArticleDetail({ articleId }: Props) {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const [scrollY, setScrollY] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(45);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Calculate reading progress
      const article = document.getElementById('article-content');
      if (article) {
        const articleTop = article.offsetTop;
        const articleHeight = article.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrolled = window.scrollY - articleTop + windowHeight;
        const progress = Math.min(Math.max(scrolled / articleHeight, 0), 1);
        setReadingProgress(progress * 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mock article data - trong thực tế sẽ fetch từ API
  const article = {
    id: articleId,
    title: 'Nghệ thuật làm nước mắm Phú Quốc - Tinh hoa từ đại dương',
    subtitle: 'Khám phá quy trình làm nước mắm truyền thống với hương vị đặc trưng của đảo ngọc Phú Quốc',
    author: {
      name: 'Minh An',
      avatar: '/images/author.jpg',
      bio: 'Nhà báo chuyên về ẩm thực và văn hóa Việt Nam'
    },
    category: 'Ẩm thực',
    publishDate: '10 Dec 2024',
    readTime: '8 phút đọc',
    views: 1250,
    image: '/images/nuoc-mam-hero.jpg',
    tags: ['Nước mắm', 'Phú Quốc', 'Ẩm thực', 'Truyền thống'],
    content: `
      <p>Nước mắm Phú Quốc không chỉ là một gia vị đơn thuần, mà là tinh hoa của biển cả, là tâm huyết của những người thợ làm nghề qua nhiều thế hệ. Trên đảo ngọc xinh đẹp này, nghệ thuật làm nước mắm đã trở thành một phần không thể thiếu trong đời sống và văn hóa của người dân địa phương.</p>

      <h2>Lịch sử hình thành</h2>
      <p>Nghề làm nước mắm ở Phú Quốc có từ rất lâu đời, được truyền từ thế hệ này sang thế hệ khác. Những gia đình làm nghề đầu tiên đã định cư tại đây từ thế kỷ 18, mang theo kinh nghiệm và bí quyết gia truyền từ miền Trung.</p>

      <h2>Quy trình sản xuất độc đáo</h2>
      <p>Việc sản xuất nước mắm Phú Quốc tuân theo một quy trình nghiêm ngặt và tỉ mỉ:</p>
      
      <h3>1. Chọn nguyên liệu</h3>
      <p>Cá cơm tươi là nguyên liệu chính, phải được đánh bắt trong ngày và vận chuyển về nhà máy trong vòng 6 giờ để đảm bảo độ tươi ngon.</p>

      <h3>2. Ướp muối</h3>
      <p>Tỷ lệ cá và muối biển được tính toán chính xác theo công thức bí truyền của từng gia đình. Muối biển Phú Quốc có độ mặn vừa phải, giúp tạo nên hương vị đặc trưng.</p>

      <h3>3. Lên men tự nhiên</h3>
      <p>Đây chính là bước quan trọng nhất, cần thời gian từ 12-18 tháng. Các thùng gỗ to được đặt ngoài trời, để cá lên men tự nhiên dưới tác động của thời tiết nhiệt đới.</p>

      <h2>Bí quyết tạo nên hương vị đặc biệt</h2>
      <p>Điều làm nên sự khác biệt của nước mắm Phú Quốc chính là:</p>
      
      <ul>
        <li><strong>Nguồn cá cơm tươi ngon:</strong> Vùng biển Phú Quốc có cá cơm chất lượng cao nhất Việt Nam</li>
        <li><strong>Khí hậu lý tưởng:</strong> Nắng gió biển tạo điều kiện lên men hoàn hảo</li>
        <li><strong>Tay nghề thủ công:</strong> Mọi công đoạn đều được làm thủ công bằng kinh nghiệm</li>
        <li><strong>Thời gian ủ đủ:</strong> Không vội vàng, để nước mắm lên men đủ thời gian</li>
      </ul>

      <h2>Ý nghĩa văn hóa</h2>
      <p>Nước mắm Phú Quốc không chỉ là sản phẩm kinh tế mà còn mang đậm giá trị văn hóa. Mỗi gia đình làm nghề đều có những câu chuyện, kỷ niệm gắn liền với nghề truyền thống này.</p>

      <blockquote>
        "Làm nước mắm không chỉ là nghề, mà là đam mê, là tình yêu với quê hương. Mỗi giọt nước mắm đều chứa đựng tâm huyết và kinh nghiệm của nhiều thế hệ" - Ông Nguyễn Văn Thành, nghệ nhân làm nước mắm 40 năm kinh nghiệm.
      </blockquote>

      <p>Ngày nay, nước mắm Phú Quốc đã được công nhận là sản phẩm có chỉ dẫn địa lý, được bảo hộ và xuất khẩu ra nhiều nước trên thế giới, góp phần quảng bá văn hóa ẩm thực Việt Nam.</p>
    `
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = (platform: string) => {
    // Logic share tùy theo platform
    console.log(`Sharing to ${platform}`);
  };

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-amber-100 z-50">
        <div 
          className="h-full bg-gradient-to-r from-amber-600 to-orange-600 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <article className="relative">
        {/* Hero Section */}
        <section className="relative h-[70vh] overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('/images/nuoc-mam-hero.jpg')`,
              transform: `translateY(${scrollY * 0.3}px)`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Back Button */}
          <div className="absolute top-8 left-8 z-20">
            <Link 
              href="/news"
              className="inline-flex items-center gap-2 bg-white/90 text-amber-900 px-4 py-2 rounded-full font-semibold hover:bg-white transition-all duration-300 backdrop-blur-sm group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
              Quay lại
            </Link>
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-end">
            <div className="container mx-auto px-4 pb-16">
              <div className="max-w-4xl">
                <div className={`space-y-6 ${inView ? 'animate-fadeInUp' : 'opacity-0'}`}>
                  {/* Category */}
                  <span className="inline-block bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {article.category}
                  </span>

                  {/* Title */}
                  <h1 className="text-4xl md:text-6xl font-serif text-white leading-tight">
                    {article.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-xl md:text-2xl text-amber-100 leading-relaxed max-w-3xl">
                    {article.subtitle}
                  </p>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-6 text-amber-200">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      <span>{article.author.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      <span>{article.publishDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      <span>{article.readTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      <span>{article.views.toLocaleString()} lượt đọc</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section ref={ref} className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-8">
                  {/* Author Info */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-amber-200 to-orange-300 rounded-full mx-auto" />
                      <div>
                        <h4 className="font-serif text-lg text-amber-900 mb-1">{article.author.name}</h4>
                        <p className="text-sm text-gray-600">{article.author.bio}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-4">
                    <button
                      onClick={handleLike}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        isLiked 
                          ? 'bg-red-500 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                      {likes} lượt thích
                    </button>

                    <button
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        isBookmarked 
                          ? 'bg-amber-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-amber-50 hover:text-amber-600'
                      }`}
                    >
                      <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
                      {isBookmarked ? 'Đã lưu' : 'Lưu bài viết'}
                    </button>
                  </div>

                  {/* Share */}
                  <div className="space-y-3">
                    <h5 className="font-semibold text-amber-900">Chia sẻ bài viết</h5>
                    <div className="flex gap-2">
                      {[
                        { icon: Facebook, color: 'bg-blue-600', platform: 'facebook' },
                        { icon: Twitter, color: 'bg-sky-500', platform: 'twitter' },
                        { icon: LinkIcon, color: 'bg-gray-600', platform: 'copy' }
                      ].map((social, index) => (
                        <button
                          key={index}
                          onClick={() => handleShare(social.platform)}
                          className={`${social.color} text-white p-3 rounded-xl hover:scale-110 transition-all duration-300`}
                        >
                          <social.icon className="h-5 w-5" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reading Time */}
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <div className="flex items-center gap-3">
                      <Coffee className="h-6 w-6 text-amber-600" />
                      <div>
                        <p className="font-semibold text-amber-900">Thời gian đọc</p>
                        <p className="text-sm text-amber-700">{article.readTime}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <div 
                  id="article-content"
                  className={`prose prose-lg prose-amber max-w-none ${inView ? 'animate-fadeInUp' : 'opacity-0'}`}
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* Tags */}
                <div className="mt-12 pt-8 border-t border-amber-100">
                  <h5 className="font-semibold text-amber-900 mb-4">Từ khóa</h5>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-amber-200 transition-colors duration-300 cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Call to Action */}
                <div className="mt-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 text-white text-center">
                  <h4 className="text-2xl font-serif mb-4">Bạn thích bài viết này?</h4>
                  <p className="mb-6 text-amber-100">Đăng ký nhận thông báo về những bài viết mới nhất từ chúng tôi</p>
                  <button className="bg-white text-amber-600 px-6 py-3 rounded-full font-semibold hover:bg-amber-50 transition-colors duration-300">
                    Đăng ký ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
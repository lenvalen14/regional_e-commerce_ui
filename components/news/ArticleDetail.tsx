'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Calendar, User, ArrowLeft, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { NewType, useGetNewsByIdQuery } from '@/features/new/newApi';
import { formatDate } from '@/app/admin/dashboard/news/NewsItems';

interface Props {
  articleId: string;
}

const newTypeMap: Record<NewType, string> = {
  AM_THUC: "Ẩm thực",
  VAN_HOA: "Văn hóa",
  DU_LICH: "Du lịch",
  SUC_KHOE: "Sức khỏe",
  CONG_THUC: "Công thức",
  LICH_SU: "Lịch sử",
};


export function ArticleDetail({ articleId }: Props) {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });
  const [scrollY, setScrollY] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const { data } = useGetNewsByIdQuery(articleId);
  const articleData = data?.data;

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      setScrollY(window.scrollY);
      const articleEl = document.getElementById('article-content');
      if (articleEl) {
        const { offsetTop, offsetHeight } = articleEl;
        const progress = Math.min(Math.max((window.scrollY - offsetTop + window.innerHeight) / offsetHeight, 0), 1);
        setReadingProgress(progress * 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMounted]);

  const article = {
    id: articleId,
    title: articleData?.title,
    author: { name: 'Admin', avatar: '/images/author.jpg', bio: 'Người Quản Lý Trang Web' },
    category: articleData?.type ? newTypeMap[articleData.type] : "Khác",
    publishDate: formatDate(articleData?.createAt || new Date()),
    image: articleData?.images[0].imageUrl,
    content: articleData?.content
  };

  const handleShare = (platform: string) => {
    const url = window.location.href; // Lấy URL bài viết hiện tại
    if (platform === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    if (platform === 'twitter') window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`, '_blank');
    if (platform === 'copy') { navigator.clipboard.writeText(url); alert('Link đã được sao chép!'); }
  };

  if (!isMounted) {
    return (
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 animate-pulse h-[70vh] bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-[#8FBC8F]/20 z-50">
        <div
          className="h-full bg-gradient-to-r from-[#8FBC8F] to-[#7CA87C] transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <article className="relative">
        {/* Hero Section */}
        <section className="relative h-[70vh] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('/images/nuoc-mam-hero.jpg')`,
              transform: isMounted ? `translateY(${scrollY * 0.3}px)` : undefined
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="absolute top-8 left-8 z-20">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 bg-white/90 text-[#222] px-4 py-2 rounded-full font-semibold hover:bg-white transition-all duration-300 backdrop-blur-sm"
            >
              <ArrowLeft className="h-5 w-5" /> Quay lại
            </Link>
          </div>

          <div className="relative z-10 h-full flex items-end">
            <div className="container mx-auto px-4 pb-16 max-w-4xl">
              <div className={`space-y-6 ${inView ? 'animate-fadeInUp' : 'opacity-0'}`}>
                <span className="inline-block bg-[#8FBC8F] text-white px-4 py-2 rounded-full text-sm uppercase tracking-widest">{article.category}</span>
                <h1 className="text-4xl md:text-6xl font-beaululo text-white leading-tight tracking-widest uppercase">{article.title}</h1>
                <div className="flex flex-wrap items-center gap-6 text-[#8FBC8F]">
                  <div className="flex items-center gap-2"><User className="h-5 w-5" /><span>{article.author.name}</span></div>
                  <div className="flex items-center gap-2"><Calendar className="h-5 w-5" /><span>{article.publishDate}</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section ref={ref} className="py-16 bg-white">
          <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar */}
            <div className="lg:col-span-1 sticky top-24 space-y-8">
              <div className="bg-gradient-to-br from-[#8FBC8F]/10 to-[#7CA87C]/10 rounded-2xl p-6 border border-[#8FBC8F]/20 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#8FBC8F] to-[#7CA87C] rounded-full mx-auto mb-2" />
                <h4 className="font-beaululo text-lg text-[#222] mb-1 uppercase">{article.author.name}</h4>
                <p className="text-sm text-[#4C5C4C]">{article.author.bio}</p>
              </div>

              <div className="space-y-3">
                <h5 className="font-semibold text-[#222]">Chia sẻ bài viết</h5>
                <div className="flex gap-2">
                  {[
                    { icon: Facebook, color: 'bg-blue-600', platform: 'facebook' },
                    { icon: Twitter, color: 'bg-sky-500', platform: 'twitter' },
                    { icon: LinkIcon, color: 'bg-[#8FBC8F]', platform: 'copy' }
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
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div
                id="article-content"
                className={`prose prose-lg max-w-none ${inView ? 'animate-fadeInUp' : 'opacity-0'}`}
                style={{ '--tw-prose-headings': '#222', '--tw-prose-body': '#4C5C4C' } as React.CSSProperties}
                dangerouslySetInnerHTML={{ __html: article.content || '' }}
              />

              {/* Call to Action */}
              <div className="mt-12 bg-gradient-to-r from-[#8FBC8F] to-[#7CA87C] rounded-2xl p-8 text-white text-center">
                <h4 className="text-2xl mb-4 uppercase">Bạn thích bài viết này?</h4>
                <p className="mb-6 text-white/90">Đăng ký nhận thông báo về những bài viết mới nhất từ chúng tôi</p>
                <Link href="/auth" className="inline-block bg-white text-[#8FBC8F] px-6 py-3 rounded-full hover:bg-[#f8f8f8] transition-colors duration-300">
                  Đăng ký ngay
                </Link>
              </div>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}

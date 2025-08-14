'use client';

import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Mail, Bell, Star } from 'lucide-react';

export function NewsletterSubscribe() {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribed(true);
    setEmail('');
  };

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-amber-900 via-orange-800 to-red-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.3'%3E%3Cpath d='M20 20c0-8.8 7.2-16 16-16s16 7.2 16 16-7.2 16-16 16-16-7.2-16-16zm44 44c0-8.8 7.2-16 16-16s16 7.2 16 16-7.2 16-16 16-16-7.2-16-16z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`space-y-8 ${inView ? 'animate-fadeInUp' : 'opacity-0'}`}>
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mb-6 animate-bounce">
              <Mail className="h-10 w-10 text-white" />
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight">
                Đăng ký nhận tin
              </h2>
              <p className="text-xl text-amber-100 max-w-2xl mx-auto leading-relaxed">
                Cập nhật những câu chuyện mới nhất về văn hóa ẩm thực Việt Nam 
                và khám phá các đặc sản độc đáo từ khắp ba miền.
              </p>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
              {[
                { icon: Bell, title: 'Tin tức mới nhất', desc: 'Cập nhật hàng tuần' },
                { icon: Star, title: 'Nội dung độc quyền', desc: 'Chỉ dành cho thành viên' },
                { icon: Mail, title: 'Hoàn toàn miễn phí', desc: 'Không spam, hủy bất cứ lúc nào' }
              ].map((benefit, index) => (
                <div 
                  key={index}
                  className={`text-center animate-slideInFromBottom animation-delay-${index * 200}`}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
                    <benefit.icon className="h-6 w-6 text-amber-200" />
                  </div>
                  <h4 className="text-white font-semibold mb-1">{benefit.title}</h4>
                  <p className="text-amber-200 text-sm">{benefit.desc}</p>
                </div>
              ))}
            </div>

            {/* Subscription Form */}
            {!isSubscribed ? (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email của bạn..."
                    required
                    className="flex-1 px-4 py-3 rounded-full border-2 border-amber-300 focus:border-white focus:outline-none transition-colors duration-300 text-amber-900"
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:from-amber-500 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex-shrink-0"
                  >
                    Đăng ký
                  </button>
                </div>
              </form>
            ) : (
              <div className="max-w-md mx-auto bg-green-500 text-white px-6 py-3 rounded-full font-semibold animate-fadeInUp">
                ✅ Cảm ơn bạn đã đăng ký!
              </div>
            )}

            <p className="text-amber-200 text-sm">
              Bằng cách đăng ký, bạn đồng ý với 
              <a href="#" className="text-white hover:text-amber-300 transition-colors duration-300"> Điều khoản sử dụng </a>
              và 
              <a href="#" className="text-white hover:text-amber-300 transition-colors duration-300"> Chính sách bảo mật </a>
              của chúng tôi.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
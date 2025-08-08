'use client';

import { useState } from 'react';
import { Send, User, Mail, MessageSquare, Phone } from 'lucide-react';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <Send className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-beaululo text-[#2F3E34] mb-2">
          Gửi thành công!
        </h3>
        <p className="text-gray-600">
          Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-500">
      <h3 className="text-2xl font-beaululo text-[#2F3E34] mb-6">
        Gửi thắc mắc cho chúng tôi
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div className="relative group">
          <label className="block text-sm font-medium text-[#2F3E34] mb-2">
            Tên của bạn *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-[#8FBC8F] transition-colors" />
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8FBC8F] focus:border-transparent transition-all duration-300 hover:border-[#8FBC8F]"
              placeholder="Nhập tên của bạn"
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="relative group">
          <label className="block text-sm font-medium text-[#2F3E34] mb-2">
            Email của bạn *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-[#8FBC8F] transition-colors" />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8FBC8F] focus:border-transparent transition-all duration-300 hover:border-[#8FBC8F]"
              placeholder="Nhập email của bạn"
            />
          </div>
        </div>

        {/* Phone Field */}
        <div className="relative group">
          <label className="block text-sm font-medium text-[#2F3E34] mb-2">
            Số điện thoại
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-[#8FBC8F] transition-colors" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8FBC8F] focus:border-transparent transition-all duration-300 hover:border-[#8FBC8F]"
              placeholder="Nhập số điện thoại của bạn"
            />
          </div>
        </div>

        {/* Message Field */}
        <div className="relative group">
          <label className="block text-sm font-medium text-[#2F3E34] mb-2">
            Nội dung *
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-[#8FBC8F] transition-colors" />
            <textarea
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8FBC8F] focus:border-transparent transition-all duration-300 hover:border-[#8FBC8F] resize-none"
              placeholder="Nhập nội dung tin nhắn của bạn..."
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#8FBC8F] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#7aa87a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Đang gửi...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Gửi tin nhắn
            </>
          )}
        </button>
      </form>
    </div>
  );
}
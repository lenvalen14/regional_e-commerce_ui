'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/layout/Header";
import { useLoginMutation, useRegisterMutation } from "@/features/auth/authApi";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
    phone: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const router = useRouter();
  
  // RTK Query mutations
  const [login, { isLoading: isLoginLoading, error: loginError }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading, error: registerError }] = useRegisterMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    
    try {
      if (isLogin) {
        // Handle Login
        await login({
          email: formData.email,
          password: formData.password
        }).unwrap();
        router.push('/profile');
        
      } else {
        // Handle Register
        if (formData.password !== formData.confirmPassword) {
          alert('Mật khẩu xác nhận không khớp!');
          return;
        }
        
        if (!agreeTerms) {
          alert('Vui lòng đồng ý với điều khoản dịch vụ!');
          return;
        }
        
        await register({
          email: formData.email,
          password: formData.password,
          userName: formData.name,
          phone: formData.phone
        }).unwrap();

        // Thay vì chuyển hướng, chuyển sang form đăng nhập
        setSuccessMessage('Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.');
        setIsLogin(true);
        // Giữ lại email đã nhập, xóa các trường khác
        setFormData(prev => ({
          ...prev,
          password: '',
          name: '',
          confirmPassword: '',
          phone: ''
        }));
      }
    } catch (error: any) {
      console.error('Failed to authenticate:', error);
    }
  };

  const getErrorMessage = () => {
    const error = isLogin ? loginError : registerError;
    if (error && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
      return (error.data as { message: string }).message;
    }
    return null;
  };

  return (
    <div 
      className="min-h-screen bg-gray-50 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('/images/lgbg.png')"
      }}
    >
      {/* Background Overlay để làm mờ background cho dễ đọc */}
      <div className="absolute inset-0 bg-white/50"></div>
      
      {/* Auth Content */}
      <div className="relative z-10 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-beaululo text-[#2F3E34]">
              {isLogin ? 'Đăng nhập' : 'Đăng ký'}
            </h1>
            <p className="mt-2 text-sm text-[#666] font-nitti">
              {isLogin ? 'Đăng nhập vào tài khoản của bạn' : 'Tạo tài khoản mới'}
            </p>
            <p className="mt-1 text-xs text-[#8FBC8F] font-nitti">
              Dành cho khách hàng và quản trị viên
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-6">
            {/* Success Message Display */}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-800 rounded-md text-sm font-nitti">
                {successMessage}
              </div>
            )}
            
            {/* Error Display */}
            {getErrorMessage() && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm font-nitti">
                {getErrorMessage()}
              </div>
            )}

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => {
                  setIsLogin(true);
                  setSuccessMessage('');
                  setFormData({ email: '', password: '', name: '', confirmPassword: '', phone: '' });
                }}
                className={`flex-1 py-2 text-center font-nitti font-medium transition-colors ${
                  isLogin 
                    ? 'text-[#8FBC8F] border-b-2 border-[#8FBC8F]' 
                    : 'text-[#666] hover:text-[#8FBC8F]'
                }`}
              >
                Đăng nhập
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  setSuccessMessage('');
                  setFormData({ email: '', password: '', name: '', confirmPassword: '', phone: '' });
                }}
                className={`flex-1 py-2 text-center font-nitti font-medium transition-colors ${
                  !isLogin 
                    ? 'text-[#8FBC8F] border-b-2 border-[#8FBC8F]' 
                    : 'text-[#666] hover:text-[#8FBC8F]'
                }`}
              >
                Đăng ký
              </button>
            </div>

            {/* Login Form */}
            {isLogin ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-nitti font-medium text-[#2F3E34] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md font-nitti text-sm focus:outline-none focus:ring-2 focus:ring-[#8FBC8F] focus:border-[#8FBC8F] transition-colors bg-white/80"
                    placeholder="Nhập email của bạn"
                    disabled={isLoginLoading}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-nitti font-medium text-[#2F3E34] mb-2">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md font-nitti text-sm focus:outline-none focus:ring-2 focus:ring-[#8FBC8F] focus:border-[#8FBC8F] transition-colors bg-white/80"
                    placeholder="Nhập mật khẩu"
                    disabled={isLoginLoading}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-gray-300 text-[#8FBC8F] focus:ring-[#8FBC8F]"
                      disabled={isLoginLoading}
                    />
                    <span className="ml-2 text-sm font-nitti text-[#666]">Ghi nhớ đăng nhập</span>
                  </label>
                  
                  <Link href="/forgot-password" className="text-sm font-nitti text-[#8FBC8F] hover:text-[#7CA87C] transition-colors">
                    Quên mật khẩu?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoginLoading}
                  className="w-full bg-[#8FBC8F] hover:bg-[#7CA87C] disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 rounded-md font-nitti font-bold tracking-widest transition-colors shadow-md"
                >
                  {isLoginLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-nitti font-medium text-[#2F3E34] mb-2">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md font-nitti text-sm focus:outline-none focus:ring-2 focus:ring-[#8FBC8F] focus:border-[#8FBC8F] transition-colors bg-white/80"
                    placeholder="Nhập họ và tên"
                    disabled={isRegisterLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-nitti font-medium text-[#2F3E34] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md font-nitti text-sm focus:outline-none focus:ring-2 focus:ring-[#8FBC8F] focus:border-[#8FBC8F] transition-colors bg-white/80"
                    placeholder="Nhập email của bạn"
                    disabled={isRegisterLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-nitti font-medium text-[#2F3E34] mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md font-nitti text-sm focus:outline-none focus:ring-2 focus:ring-[#8FBC8F] focus:border-[#8FBC8F] transition-colors bg-white/80"
                    placeholder="Nhập số điện thoại"
                    disabled={isRegisterLoading}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-nitti font-medium text-[#2F3E34] mb-2">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md font-nitti text-sm focus:outline-none focus:ring-2 focus:ring-[#8FBC8F] focus:border-[#8FBC8F] transition-colors bg-white/80"
                    placeholder="Nhập mật khẩu"
                    disabled={isRegisterLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-nitti font-medium text-[#2F3E34] mb-2">
                    Xác nhận mật khẩu
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md font-nitti text-sm focus:outline-none focus:ring-2 focus:ring-[#8FBC8F] focus:border-[#8FBC8F] transition-colors bg-white/80"
                    placeholder="Nhập lại mật khẩu"
                    disabled={isRegisterLoading}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    required
                    className="rounded border-gray-300 text-[#8FBC8F] focus:ring-[#8FBC8F]"
                    disabled={isRegisterLoading}
                  />
                  <span className="ml-2 text-sm font-nitti text-[#666]">
                    Tôi đồng ý với{' '}
                    <Link href="/terms" className="text-[#8FBC8F] hover:text-[#7CA87C] transition-colors">
                      Điều khoản dịch vụ
                    </Link>{' '}
                    và{' '}
                    <Link href="/privacy" className="text-[#8FBC8F] hover:text-[#7CA87C] transition-colors">
                      Chính sách bảo mật
                    </Link>
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isRegisterLoading}
                  className="w-full bg-[#8FBC8F] hover:bg-[#7CA87C] disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 rounded-md font-nitti font-bold tracking-widest transition-colors shadow-md"
                >
                  {isRegisterLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                </button>
              </form>
            )}

            {/* Social Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-[#666] font-nitti">Hoặc</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button 
                  type="button"
                  disabled={isLoginLoading || isRegisterLoading}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white/90 text-sm font-nitti text-[#2F3E34] hover:bg-white disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {isLogin ? 'Đăng nhập' : 'Đăng ký'} với Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

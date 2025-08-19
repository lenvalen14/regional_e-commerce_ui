'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoginMutation, useRegisterMutation } from "@/features/auth/authApi";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/authSlice";
import { toast } from "sonner";

interface DecodedToken {
  userId: string;
  sub: string; // email
  role: "ADMIN" | "CUSTOMER";
  userName: string;
  iat: number;
  exp: number;
}

interface FormData {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
  phone: string;
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    phone: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();

  const [login, { isLoading: isLoginLoading, error: loginError }] =
    useLoginMutation();
  const [register, { isLoading: isRegisterLoading, error: registerError }] =
    useRegisterMutation();

  /** Xử lý thay đổi input */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /** Reset form */
  const resetForm = () =>
    setFormData({ email: "", password: "", name: "", confirmPassword: "", phone: "" });

  /** Validate form đăng ký */
  const validateRegister = () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return false;
    }
    if (!agreeTerms) {
      toast.error("Vui lòng đồng ý với điều khoản dịch vụ!");
      return false;
    }
    return true;
  };

  /** Submit form */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");

    try {
      if (isLogin) {
        // --- ĐĂNG NHẬP ---
        const apiResult = await login({
          email: formData.email,
          password: formData.password,
        }).unwrap();

        const token = apiResult.data.token;
        const refreshToken = apiResult.data.refreshToken;

        if (!token) {
          toast.error("Đăng nhập thành công nhưng không tìm thấy token.");
          return;
        }

        const decodedToken: DecodedToken = jwtDecode(token);

        const user = {
          userId: decodedToken.userId,
          email: decodedToken.sub,
          userName: decodedToken.userName || decodedToken.sub,
          role: decodedToken.role,
        };

        // Lưu vào Redux
        dispatch(setCredentials({ user, token, refreshToken }));

        // Điều hướng
        decodedToken.role === "ADMIN"
          ? router.push("/admin/dashboard")
          : router.push("/");
      } else {
        // --- ĐĂNG KÝ ---
        if (!validateRegister()) return;

        await register({
          email: formData.email,
          password: formData.password,
          userName: formData.name,
          phone: formData.phone,
        }).unwrap();

        setSuccessMessage("Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.");
        setIsLogin(true);
        resetForm();
      }
    } catch (error: any) {
      console.error("Failed to authenticate:", error);
      const message =
        error?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
      toast.error(message);
    }
  };

  /** Lấy error message từ API */
  const getErrorMessage = () => {
    const error = isLogin ? loginError : registerError;
    if (
      error &&
      "data" in error &&
      error.data &&
      typeof error.data === "object" &&
      "message" in error.data
    ) {
      return (error.data as any).message;
    }
    return null;
  };

  return (
    <div
      className="min-h-screen bg-gray-50 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/images/lgbg.png')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/50"></div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-beaululo text-[#2F3E34]">
              {isLogin ? "Đăng nhập" : "Đăng ký"}
            </h1>
            <p className="mt-2 text-sm text-[#666] font-nitti">
              {isLogin
                ? "Đăng nhập vào tài khoản của bạn"
                : "Tạo tài khoản mới"}
            </p>
            <p className="mt-1 text-xs text-[#8FBC8F] font-nitti">
              Dành cho khách hàng và quản trị viên
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-6">
            {/* Thông báo */}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-800 rounded-md text-sm font-nitti">
                {successMessage}
              </div>
            )}
            {getErrorMessage() && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm font-nitti">
                {getErrorMessage()}
              </div>
            )}

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => {
                  setIsLogin(true);
                  setSuccessMessage("");
                  resetForm();
                }}
                className={`flex-1 py-2 text-center font-nitti font-medium transition-colors ${
                  isLogin
                    ? "text-[#8FBC8F] border-b-2 border-[#8FBC8F]"
                    : "text-[#666] hover:text-[#8FBC8F]"
                }`}
              >
                Đăng nhập
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  setSuccessMessage("");
                  resetForm();
                }}
                className={`flex-1 py-2 text-center font-nitti font-medium transition-colors ${
                  !isLogin
                    ? "text-[#8FBC8F] border-b-2 border-[#8FBC8F]"
                    : "text-[#666] hover:text-[#8FBC8F]"
                }`}
              >
                Đăng ký
              </button>
            </div>

            {/* Form */}
            {isLogin ? (
              // --- FORM LOGIN ---
              <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoginLoading}
                  placeholder="Nhập email của bạn"
                />
                <InputField
                  label="Mật khẩu"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoginLoading}
                  placeholder="Nhập mật khẩu"
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-gray-300 text-[#8FBC8F] focus:ring-[#8FBC8F]"
                      disabled={isLoginLoading}
                    />
                    <span className="ml-2 text-sm font-nitti text-[#666]">
                      Ghi nhớ đăng nhập
                    </span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-nitti text-[#8FBC8F] hover:text-[#7CA87C]"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>

                <SubmitButton
                  loading={isLoginLoading}
                  text="Đăng nhập"
                  loadingText="Đang đăng nhập..."
                />
              </form>
            ) : (
              // --- FORM REGISTER ---
              <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                  label="Họ và tên"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isRegisterLoading}
                  placeholder="Nhập họ và tên"
                />
                <InputField
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isRegisterLoading}
                  placeholder="Nhập email của bạn"
                />
                <InputField
                  label="Số điện thoại"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={isRegisterLoading}
                  placeholder="Nhập số điện thoại"
                />
                <InputField
                  label="Mật khẩu"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isRegisterLoading}
                  placeholder="Nhập mật khẩu"
                />
                <InputField
                  label="Xác nhận mật khẩu"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={isRegisterLoading}
                  placeholder="Nhập lại mật khẩu"
                />

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
                    Tôi đồng ý với{" "}
                    <Link href="/terms" className="text-[#8FBC8F] hover:text-[#7CA87C]">
                      Điều khoản dịch vụ
                    </Link>{" "}
                    và{" "}
                    <Link href="/privacy" className="text-[#8FBC8F] hover:text-[#7CA87C]">
                      Chính sách bảo mật
                    </Link>
                  </span>
                </div>

                <SubmitButton
                  loading={isRegisterLoading}
                  text="Đăng ký"
                  loadingText="Đang đăng ký..."
                />
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

              <div className="mt-6">
                <button
                  type="button"
                  disabled={isLoginLoading || isRegisterLoading}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white/90 text-sm font-nitti text-[#2F3E34] hover:bg-white disabled:bg-gray-100 transition-colors"
                >
                  <GoogleIcon />
                  {isLogin ? "Đăng nhập" : "Đăng ký"} với Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Input Field Component */
function InputField({ label, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-nitti font-medium text-[#2F3E34] mb-2">
        {label}
      </label>
      <input
        {...props}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-md font-nitti text-sm 
        focus:outline-none focus:ring-2 focus:ring-[#8FBC8F] focus:border-[#8FBC8F] 
        transition-colors bg-white/80"
      />
    </div>
  );
}

/** Submit Button Component */
function SubmitButton({
  loading,
  text,
  loadingText,
}: {
  loading: boolean;
  text: string;
  loadingText: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-[#8FBC8F] hover:bg-[#7CA87C] disabled:bg-gray-400 disabled:cursor-not-allowed 
      text-white py-2 rounded-md font-nitti font-bold tracking-widest transition-colors shadow-md"
    >
      {loading ? loadingText : text}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

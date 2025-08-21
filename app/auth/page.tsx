'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoginMutation, useRegisterMutation } from "@/features/auth/authApi";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/authSlice";
import { toast } from "sonner";
import { InputField, SubmitButton, GoogleIcon } from "./auth-components";

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () =>
    setFormData({ email: "", password: "", name: "", confirmPassword: "", phone: "" });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");

    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
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

        dispatch(setCredentials({ user, token, refreshToken }));

        decodedToken.role === "ADMIN"
          ? router.push("/admin/dashboard")
          : router.push("/");
      } else {
        // --- REGISTER LOGIC ---
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
      const message = error?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
      toast.error(message);
    }
  };

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
    <div className="min-h-screen relative overflow-hidden">
      {/* Blurred Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/background.png')",
          filter: "blur(3px)",
          transform: "scale(1.1)",
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-white/50"></div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4">
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
            {/* Notifications */}
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

            {/* Forms */}
            {isLogin ? (
              // --- LOGIN FORM ---
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
                    href="/auth/forgot-password"
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
              // --- REGISTER FORM ---
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
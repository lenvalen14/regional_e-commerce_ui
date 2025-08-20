'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { InputField, SubmitButton } from "../auth-components";
import { useRequestPasswordOtpMutation } from "@/features/auth/authApi";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [requestOtp, { isLoading }] = useRequestPasswordOtpMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await requestOtp({ email }).unwrap();
      toast.success("Mã OTP đã được gửi tới email của bạn");
      router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      const message = error?.data?.message || "Không thể gửi OTP. Vui lòng thử lại.";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/background.png')",
          filter: "blur(3px)",
          transform: "scale(1.1)",
        }}
      ></div>
      <div className="absolute inset-0 bg-white/50"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-beaululo text-[#2F3E34]">Quên mật khẩu</h1>
            <p className="mt-2 text-sm text-[#666] font-nitti">Nhập email để nhận mã OTP</p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="Email"
                type="email"
                name="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                disabled={isLoading}
                placeholder="Nhập email của bạn"
              />

              <SubmitButton loading={isLoading} text="Gửi OTP" loadingText="Đang gửi..." />
            </form>

            <div className="mt-6 text-center">
              <Link href="/auth" className="text-sm font-nitti text-[#8FBC8F] hover:text-[#7CA87C]">
                Quay lại đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



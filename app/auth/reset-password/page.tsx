'use client'

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { InputField, SubmitButton } from "../auth-components";
import { useResetPasswordMutation } from "@/features/auth/authApi";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const emailFromQuery = searchParams.get("email") || "";
  const [email, setEmail] = useState(emailFromQuery);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  useEffect(() => {
    setEmail(emailFromQuery);
  }, [emailFromQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
    try {
      await resetPassword({ email, password, confirmPassword }).unwrap();
      toast.success("Đặt lại mật khẩu thành công");
      router.push("/auth");
    } catch (error: any) {
      const message = error?.data?.message || "Không thể đặt lại mật khẩu";
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
            <h1 className="text-3xl font-beaululo text-[#2F3E34]">Đặt lại mật khẩu</h1>
            <p className="mt-2 text-sm text-[#666] font-nitti">Nhập mật khẩu mới cho tài khoản {email}</p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="Mật khẩu mới"
                type="password"
                name="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                disabled={isLoading}
                placeholder="Nhập mật khẩu mới"
              />
              <InputField
                label="Xác nhận mật khẩu mới"
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                placeholder="Nhập lại mật khẩu mới"
              />

              <SubmitButton loading={isLoading} text="Đặt lại mật khẩu" loadingText="Đang xử lý..." />
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



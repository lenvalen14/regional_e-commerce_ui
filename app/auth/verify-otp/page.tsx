'use client'

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useRequestPasswordOtpMutation, useVerifyPasswordOtpMutation } from "@/features/auth/authApi";

export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const emailFromQuery = searchParams.get("email") || "";
  const [email, setEmail] = useState(emailFromQuery);
  const [otp, setOtp] = useState("");
  const [counter, setCounter] = useState(60);
  const [verifyOtp, { isLoading }] = useVerifyPasswordOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useRequestPasswordOtpMutation();

  useEffect(() => {
    setEmail(emailFromQuery);
  }, [emailFromQuery]);

  useEffect(() => {
    if (counter <= 0) return;
    const id = setTimeout(() => setCounter((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [counter]);

  const formattedCounter = useMemo(() => `${Math.floor(counter / 60)}:${String(counter % 60).padStart(2, '0')}`, [counter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Thiếu email");
      return;
    }
    if (otp.length !== 6) {
      toast.error("Vui lòng nhập đủ 6 ký tự OTP");
      return;
    }
    try {
      const res = await verifyOtp({ email, otp: Number(otp) }).unwrap();
      toast.success("Xác thực OTP thành công");
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      const message = error?.data?.message || "Xác thực OTP thất bại";
      toast.error(message);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    try {
      await resendOtp({ email }).unwrap();
      toast.success("Đã gửi lại OTP");
      setCounter(60);
    } catch (error: any) {
      const message = error?.data?.message || "Không thể gửi lại OTP";
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
            <h1 className="text-3xl font-beaululo text-[#2F3E34]">Xác thực OTP</h1>
            <p className="mt-2 text-sm text-[#666] font-nitti">Nhập mã OTP đã gửi tới email</p>
            <p className="mt-1 text-xs text-[#8FBC8F] font-nitti">{email}</p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full bg-[#8FBC8F] hover:bg-[#7CA87C] text-white">
                {isLoading ? "Đang xác thực..." : "Xác nhận"}
              </Button>

              <div className="flex items-center justify-between text-sm font-nitti text-[#666]">
                <button type="button" onClick={handleResend} disabled={isResending || counter > 0} className="text-[#8FBC8F] hover:text-[#7CA87C] disabled:text-gray-400">
                  Gửi lại OTP
                </button>
                <span>Thời gian còn lại: {formattedCounter}</span>
              </div>
            </form>

            <div className="mt-6 text-center">
              <Link href="/auth/forgot-password" className="text-sm font-nitti text-[#8FBC8F] hover:text-[#7CA87C]">
                Nhập lại email
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



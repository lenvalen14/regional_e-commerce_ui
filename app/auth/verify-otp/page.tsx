'use client'

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useRequestPasswordOtpMutation, useVerifyPasswordOtpMutation } from "@/features/auth/authApi";

export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const emailFromQuery = searchParams.get("email") || "";
  const [email, setEmail] = useState(emailFromQuery);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [counter, setCounter] = useState(60);
  const [verifyOtp, { isLoading }] = useVerifyPasswordOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useRequestPasswordOtpMutation();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setEmail(emailFromQuery);
  }, [emailFromQuery]);

  useEffect(() => {
    if (counter <= 0) return;
    const id = setTimeout(() => setCounter((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [counter]);

  const formattedCounter = useMemo(
    () => `${Math.floor(counter / 60)}:${String(counter % 60).padStart(2, '0')}`,
    [counter]
  );

  const handleChange = (val: string, idx: number) => {
    if (!/^[0-9]?$/.test(val)) return; // chỉ cho số 0-9
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);

    // focus sang ô tiếp theo
    if (val && idx < otp.length - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Thiếu email");
      return;
    }
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.error("Vui lòng nhập đủ 6 ký tự OTP");
      return;
    }
    try {
      await verifyOtp({ email, otp: Number(otpValue) }).unwrap();
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
              {/* OTP Input */}
              <div className="flex justify-center gap-3">
                {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className="w-12 h-14 text-2xl font-bold text-center border-2 rounded-xl border-gray-300 
                            focus:border-[#8FBC8F] focus:ring-2 focus:ring-[#8FBC8F]/50 transition-all"
                />
              ))}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#8FBC8F] hover:bg-[#7CA87C] text-white"
              >
                {isLoading ? "Đang xác thực..." : "Xác nhận"}
              </Button>

              <div className="flex items-center justify-between text-sm font-nitti text-[#666]">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending || counter > 0}
                  className="text-[#8FBC8F] hover:text-[#7CA87C] disabled:text-gray-400"
                >
                  Gửi lại OTP
                </button>
                <span>Thời gian còn lại: {formattedCounter}</span>
              </div>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/auth/forgot-password"
                className="text-sm font-nitti text-[#8FBC8F] hover:text-[#7CA87C]"
              >
                Nhập lại email
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

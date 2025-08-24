"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function VNPayCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Lấy toàn bộ query string
    const search = window.location.search;
    if (!search) return;
    // Gọi ngầm tới BE để xác thực giao dịch
    (async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1"}/payment/vn-pay-callback${search}`;
        const res = await axios.get(apiUrl);
        if (
          res?.data?.code === 200 &&
          res?.data?.data?.status === "00" &&
          res?.data?.data?.message?.toLowerCase().includes("giao dịch thành công")
        ) {
          // Thành công: chuyển về trang chủ
          window.location.href = "/";
        } else {
          alert("Thanh toán thất bại hoặc không xác thực được giao dịch!");
          window.location.href = "/";
        }
      } catch (err) {
        alert("Có lỗi khi xác thực giao dịch!");
        window.location.href = "/";
      }
    })();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p className="text-lg font-bold text-green-700">Đang xác thực giao dịch VNPAY...</p>
      </div>
    </div>
  );
}

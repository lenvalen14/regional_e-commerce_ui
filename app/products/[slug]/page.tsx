"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { SiteHeader } from "@/components/sections/Header";
import { SiteFooter } from "@/components/sections/Footer";

const PRODUCTS = [
  {
    id: "cha-com",
    name: "Chả Cốm Hà Nội",
    region: "Miền Bắc",
    price: "120.000đ",
    description:
      "Chả cốm thơm ngon, dẻo dai từ cốm làng Vòng, kết hợp cùng thịt băm truyền thống. Món ăn đặc trưng của Hà Nội mỗi độ thu về.",
    image: "/images/com.jpg",
  },
  {
    id: "bun-bo",
    name: "Bún Bò Huế",
    region: "Miền Trung",
    price: "95.000đ",
    description:
      "Nước dùng đậm đà, cay nồng, hòa quyện giữa xả, mắm ruốc và thịt bò. Món đặc sản trứ danh của xứ Huế mộng mơ.",
    image: "/images/bun-bo.jpg",
  },
  {
    id: "banh-trang",
    name: "Bánh Tráng Trộn",
    region: "Miền Nam",
    price: "45.000đ",
    description:
      "Vị chua, cay, mặn, ngọt hòa quyện từ các nguyên liệu dân dã: bánh tráng, xoài, khô bò, rau răm. Món ăn vặt yêu thích khắp miền Nam.",
    image: "/images/banh-trang.jpg",
  }
];

const VARIANTS = ["Bột", "Phin giấy", "Túi lọc"];

export default function ProductDetailPage() {
  const params = useParams();
  const product = PRODUCTS.find((p) => p.id === params?.slug);
  const [variant, setVariant] = useState(VARIANTS[0]);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <div className="text-center py-20">Sản phẩm không tồn tại.</div>;
  }

  return (
    <>
      <SiteHeader />
      <main className="py-16 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Ảnh sản phẩm lớn */}
          <div className="flex flex-col items-center w-full">
            <div className="relative w-full aspect-square max-w-[420px] mx-auto">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            {/* Có thể thêm thumbnail ở đây sau */}
          </div>
          {/* Thông tin sản phẩm */}
          <div className="w-full flex flex-col gap-6">
            <h1 className="text-2xl md:text-4xl font-beaululo text-[#222] uppercase tracking-widest mb-2">{product.name}</h1>
            <p className="text-[#E53935] text-2xl font-nitti font-bold tracking-widest mb-4">{product.price}</p>
            {/* Chọn loại */}
            <div className="flex gap-2 mb-2">
              {VARIANTS.map((v) => (
                <button
                  key={v}
                  onClick={() => setVariant(v)}
                  className={`px-4 py-1 rounded border text-sm font-nitti tracking-widest transition-colors ${variant === v ? "bg-[#222] text-white border-[#222]" : "bg-white text-[#222] border-[#bbb] hover:border-[#222]"}`}
                >
                  {v}
                </button>
              ))}
            </div>
            {/* Số lượng */}
            <div className="flex items-center gap-2 mb-4">
              <span className="font-nitti text-sm">Số lượng:</span>
              <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="w-8 h-8 rounded border border-[#bbb] font-nitti text-lg">-</button>
              <span className="font-nitti text-base w-8 text-center">{quantity}</span>
              <button onClick={() => setQuantity(q => q+1)} className="w-8 h-8 rounded border border-[#bbb] font-nitti text-lg">+</button>
            </div>
            {/* Nút thêm vào giỏ */}
            <button className="bg-[#8FBC8F] hover:bg-[#7CA87C] text-white px-8 py-3 rounded-full text-base font-nitti font-bold tracking-widest transition-colors">
              Thêm vào giỏ hàng
            </button>
            {/* Mô tả */}
            <div className="mt-8">
              <h2 className="font-beaululo text-lg text-[#222] uppercase tracking-widest mb-2">Mô tả sản phẩm</h2>
              <p className="text-[#4C5C4C] font-nitti leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

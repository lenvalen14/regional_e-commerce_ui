'use client';

import Image from "next/image";
import Link from "next/link";

const FEATURED = [
  {
    id: "com",
    name: "Cốm Hà Nội",
    image: "/images/com.jpg",
    price: "20.000đ",
  },
  {
    id: "bun-bo",
    name: "Bún Bò Huế",
    image: "/images/bun-bo.jpg",
    price: "95.000đ",
  },
  {
    id: "banh-trang",
    name: "Bánh Tráng Trộn",
    image: "/images/banh-trang.jpg",
    price: "45.000đ",
  },
  {
    id: "cha-ca",
    name: "Chả Cá Lã Vọng",
    image: "/images/cha-ca.jpg",
    price: "150.000đ",
  },
  {
    id: "nem-chua",
    name: "Nem Chua Thanh Hóa",
    image: "/images/nem-chua.jpg",
    price: "60.000đ",
  },
  {
    id: "ca-phe",
    name: "Cà Phê Sữa Đá",
    image: "/images/ca-phe.jpg",
    price: "30.000đ",
  },
  {
    id: "pho",
    name: "Phở Bò Hà Nội",
    image: "/images/pho.jpg",
    price: "70.000đ",
  },
  {
    id: "banh-xeo",
    name: "Bánh Xèo Miền Trung",
    image: "/images/banh-xeo.jpg",
    price: "55.000đ",
  },
  {
    id: "che",
    name: "Chè Ba Màu",
    image: "/images/che.jpg",
    price: "25.000đ",
  },
  {
    id: "goi-du-du",
    name: "Gỏi Đu Đủ Khô Bò",
    image: "/images/goi-du-du.jpg",
    price: "50.000đ",
  }
];

export function FeaturedProducts() {
  return (
    <section className="py-16 bg-white min-h-screen">
      <h2 className="text-2xl md:text-3xl font-beaululo text-[#222] tracking-widest uppercase mb-10 text-center">ĐẶC SẢN NỔI BẬT</h2>
      <div className="px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full">
        {FEATURED.slice(0, 8).map((item) => (
          <Link
            key={item.id}
            href={`/products/${item.id}`}
            className="group block rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="relative w-full aspect-[4/3] bg-[#f5f5f5]">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="py-3 px-2">
              <h3 className="text-base font-nitti text-[#222] mb-1">{item.name}</h3>
              <p className="text-sm text-[#8FBC8F] font-nitti font-bold">{item.price}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-center mt-10">
        <Link href="/products" className="font-nitti px-8 py-2 rounded-full border border-[#bbb] text-[#222] hover:bg-[#F0F5F0] transition-colors text-base font-bold">
          Xem tất cả
        </Link>
      </div>
    </section>
  );
}
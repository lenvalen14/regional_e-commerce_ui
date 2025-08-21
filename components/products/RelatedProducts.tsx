"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  region: string;
  price: number;
  priceLabel: string;
  image: string;
  images?: string[]; // Thêm thuộc tính này
}

interface RelatedProductsProps {
  currentProductId: string;
  region?: string;
}

// Sử dụng data từ products/page.tsx
const ALL_PRODUCTS: Product[] = [
  {
    id: "cha-com",
    name: "Chả Cốm Hà Nội",
    region: "bac-bo",
    price: 120000,
    priceLabel: "120.000đ",
    image: "/images/com.jpg",
    images: ["/images/com.jpg", "/images/bun-bo.jpg"],
  },
  {
    id: "bun-bo",
    name: "Bún Bò Huế",
    region: "trung-bo",
    price: 95000,
    priceLabel: "95.000đ",
    image: "/images/bun-bo.jpg",
    images: ["/images/bun-bo.jpg", "/images/com.jpg"],
  },
  {
    id: "banh-trang",
    name: "Bánh Tráng Trộn",
    region: "nam-bo",
    price: 45000,
    priceLabel: "45.000đ",
    image: "/images/banh-trang.jpg",
    images: ["/images/banh-trang.jpg", "/images/com.jpg"],
  },
  {
    id: "bun-bo",
    name: "Bún Bò Huế",
    region: "trung-bo",
    price: 95000,
    priceLabel: "95.000đ",
    image: "/images/bun-bo.jpg",
    images: ["/images/bun-bo.jpg", "/images/com.jpg"],
  },
  {
    id: "banh-trang",
    name: "Bánh Tráng Trộn",
    region: "nam-bo",
    price: 45000,
    priceLabel: "45.000đ",
    image: "/images/banh-trang.jpg",
    images: ["/images/banh-trang.jpg", "/images/com.jpg"],
  },
  {
    id: "bun-bo",
    name: "Bún Bò Huế",
    region: "trung-bo",
    price: 95000,
    priceLabel: "95.000đ",
    image: "/images/bun-bo.jpg",
    images: ["/images/bun-bo.jpg", "/images/com.jpg"],
  },
];

export function RelatedProducts({ currentProductId, region }: RelatedProductsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Lọc sản phẩm liên quan (khác sản phẩm hiện tại)
  const relatedProducts = ALL_PRODUCTS
    .filter(product => product.id !== currentProductId)
    .slice(0, 5); // Lấy 5 sản phẩm

  return (
    <div className="mt-16 border-t border-[#e0e0e0] pt-16">
      <h2 className="font-beaululo text-xl text-[#222] uppercase tracking-widest mb-8 text-center">
        Sản phẩm liên quan
      </h2>

      <div className="flex justify-center items-start gap-2 max-w-none mx-auto px-2">
        {relatedProducts.map((product, idx) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group flex flex-col items-center text-center flex-shrink-0"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Product Image */}
            <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-3 group-hover:shadow-lg transition-shadow duration-200" style={{ width: '262px', height: '265px' }}>
              <Image
                src={
                  hoveredIndex === idx && product.images && product.images[1]
                    ? product.images[1]
                    : product.image
                }
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/com.jpg";
                }}
              />
            </div>

            {/* Product Info */}
            <div className="w-[320px]">
              <h3 className="font-nitti text-sm text-[#222] mb-1 group-hover:text-[#8FBC8F] transition-colors">
                {product.name}
              </h3>
              <p className="font-nitti text-sm font-bold text-[#E53935]">
                {product.priceLabel}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
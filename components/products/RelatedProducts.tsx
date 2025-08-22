"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetProductsByCategoryQuery } from "@/features/product/productApi";


interface RelatedProductsProps {
  currentProductId: string;
  // region?: string;
  categoryId: string;
}

// Sử dụng data từ products/page.tsx
// const ALL_PRODUCTS: Product[] = [
//   {
//     id: "cha-com",
//     name: "Chả Cốm Hà Nội",
//     region: "bac-bo",
//     price: 120000,
//     priceLabel: "120.000đ",
//     image: "/images/com.jpg",
//     images: ["/images/com.jpg", "/images/bun-bo.jpg"],
//   },
//   {
//     id: "bun-bo",
//     name: "Bún Bò Huế",
//     region: "trung-bo",
//     price: 95000,
//     priceLabel: "95.000đ",
//     image: "/images/bun-bo.jpg",
//     images: ["/images/bun-bo.jpg", "/images/com.jpg"],
//   },
//   {
//     id: "banh-trang",
//     name: "Bánh Tráng Trộn",
//     region: "nam-bo",
//     price: 45000,
//     priceLabel: "45.000đ",
//     image: "/images/banh-trang.jpg",
//     images: ["/images/banh-trang.jpg", "/images/com.jpg"],
//   },
//   {
//     id: "bun-bo",
//     name: "Bún Bò Huế",
//     region: "trung-bo",
//     price: 95000,
//     priceLabel: "95.000đ",
//     image: "/images/bun-bo.jpg",
//     images: ["/images/bun-bo.jpg", "/images/com.jpg"],
//   },
//   {
//     id: "banh-trang",
//     name: "Bánh Tráng Trộn",
//     region: "nam-bo",
//     price: 45000,
//     priceLabel: "45.000đ",
//     image: "/images/banh-trang.jpg",
//     images: ["/images/banh-trang.jpg", "/images/com.jpg"],
//   },
//   {
//     id: "bun-bo",
//     name: "Bún Bò Huế",
//     region: "trung-bo",
//     price: 95000,
//     priceLabel: "95.000đ",
//     image: "/images/bun-bo.jpg",
//     images: ["/images/bun-bo.jpg", "/images/com.jpg"],
//   },
// ];

export function RelatedProducts({ currentProductId, categoryId }: RelatedProductsProps) {
  const { data, isLoading, isError } = useGetProductsByCategoryQuery({ categoryId });
  const products = (data?.data || []).filter(p => p.productId !== currentProductId).slice(0, 5);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Lọc sản phẩm liên quan (khác sản phẩm hiện tại)
  // const relatedProducts = ALL_PRODUCTS
  //   .filter(product => product.id !== currentProductId && product.categoryId === categoryId)
  //   .slice(0, 5); // Lấy 5 sản phẩm

  return (
    <div className="mt-16 border-t border-[#e0e0e0] pt-16">
      <h2 className="font-beaululo text-xl text-[#222] uppercase tracking-widest mb-8 text-center">
        Sản phẩm liên quan
      </h2>

      <div className="flex justify-center items-start gap-2 max-w-none mx-auto px-2">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="animate-pulse bg-gray-100 rounded-lg w-[262px] h-[265px] mb-3" />
          ))
        ) : isError ? (
          <div className="text-center text-red-500">Không thể tải sản phẩm liên quan.</div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500">Không có sản phẩm liên quan.</div>
        ) : (
          products.map((product, idx) => (
            <Link
              key={product.productId}
              href={`/products/${product.productId}`}
              className="group flex flex-col items-center text-center flex-shrink-0"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Product Image */}
              <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-3 group-hover:shadow-lg transition-shadow duration-200" style={{ width: '262px', height: '265px' }}>
                <Image
                  src={
                    hoveredIndex === idx && product.imageProductResponseList?.[1]?.imageUrl
                      ? product.imageProductResponseList[1].imageUrl
                      : product.imageProductResponseList?.[0]?.imageUrl || "/images/products-default.png"
                  }
                  alt={product.productName}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                // onError={(e) => {
                //   (e.target as HTMLImageElement).src = "/images/com.jpg";
                // }}
                />
              </div>

              {/* Product Info */}
              <div className="w-[320px]">
                <h3 className="font-nitti text-sm text-[#222] mb-1 group-hover:text-[#8FBC8F] transition-colors">
                  {product.productName}
                </h3>
                <p className="font-nitti text-sm font-bold text-[#E53935]">
                  {product.price.toLocaleString()}đ
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
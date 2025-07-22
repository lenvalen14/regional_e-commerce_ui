"use client";

import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  region: string;
  price: number;
  priceLabel: string;
  image: string;
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
  },
  {
    id: "bun-bo",
    name: "Bún Bò Huế",
    region: "trung-bo",
    price: 95000,
    priceLabel: "95.000đ",
    image: "/images/bun-bo.jpg",
  },
  {
    id: "banh-trang",
    name: "Bánh Tráng Trộn",
    region: "nam-bo",
    price: 45000,
    priceLabel: "45.000đ",
    image: "/images/banh-trang.jpg",
  },
  {
    id: "bun-bo",
    name: "Bún Bò Huế",
    region: "trung-bo",
    price: 95000,
    priceLabel: "95.000đ",
    image: "/images/bun-bo.jpg",
  },
    {
    id: "banh-trang",
    name: "Bánh Tráng Trộn",
    region: "nam-bo",
    price: 45000,
    priceLabel: "45.000đ",
    image: "/images/banh-trang.jpg",
  },
    {
    id: "bun-bo",
    name: "Bún Bò Huế",
    region: "trung-bo",
    price: 95000,
    priceLabel: "95.000đ",
    image: "/images/bun-bo.jpg",
  },
];

export function RelatedProducts({ currentProductId, region }: RelatedProductsProps) {
  // Lọc sản phẩm liên quan (khác sản phẩm hiện tại)
  const relatedProducts = ALL_PRODUCTS
    .filter(product => product.id !== currentProductId)
    .slice(0, 5); // Lấy 5 sản phẩm

  return (
    <div className="mt-16 border-t border-[#e0e0e0] pt-12">
      <h2 className="font-beaululo text-xl text-[#222] uppercase tracking-widest mb-8 text-center">
        Sản phẩm liên quan
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {relatedProducts.map((product) => (
          <Link 
            key={product.id} 
            href={`/products/${product.id}`}
            className="group flex flex-col items-center text-center"
          >
            {/* Product Image */}
            <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3 group-hover:shadow-lg transition-shadow duration-200">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/com.jpg";
                }}
              />
            </div>
            
            {/* Product Info */}
            <div className="w-full">
              <h3 className="font-nitti text-sm text-[#222] mb-1 group-hover:text-[#8FBC8F] transition-colors line-clamp-2">
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
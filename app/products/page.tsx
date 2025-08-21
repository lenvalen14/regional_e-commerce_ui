"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SiteHeader } from "@/components/layout/Header";
import { SiteFooter } from "@/components/layout/Footer";
import { useGetRegionsQuery } from "@/features/region";
import { useGetCategoriesQuery } from "@/features/category/categoryApi";
import { useGetProductsQuery } from "@/features/product/productApi";

// const PRODUCTS = [
//   {
//     id: "cha-com",
//     name: "Chả Cốm Hà Nội",
//     region: "bac-bo",
//     category: "mon-chinh",
//     price: 120000,
//     priceLabel: "120.000đ",
//     image: "/images/com.jpg",
//   },
//   {
//     id: "bun-bo",
//     name: "Bún Bò Huế",
//     region: "trung-bo",
//     category: "mon-chinh",
//     price: 95000,
//     priceLabel: "95.000đ",
//     image: "/images/bun-bo.jpg",
//   },
//   {
//     id: "banh-trang",
//     name: "Bánh Tráng Trộn",
//     region: "nam-bo",
//     category: "do-an-vat",
//     price: 45000,
//     priceLabel: "45.000đ",
//     image: "/images/banh-trang.jpg",
//   },
//   {
//     id: "che-ba-mau",
//     name: "Chè Ba Màu",
//     region: "nam-bo",
//     category: "trang-mieng",
//     price: 35000,
//     priceLabel: "35.000đ",
//     image: "/images/che-ba-mau.jpg",
//   },
//   {
//     id: "nem-nuong",
//     name: "Nem Nướng Nha Trang",
//     region: "trung-bo",
//     category: "do-an-vat",
//     price: 85000,
//     priceLabel: "85.000đ",
//     image: "/images/nem-nuong.jpg",
//   },
//   {
//     id: "banh-chung",
//     name: "Bánh Chưng Truyền Thống",
//     region: "bac-bo",
//     category: "banh-keo",
//     price: 150000,
//     priceLabel: "150.000đ",
//     image: "/images/banh-chung.jpg",
//   },
//   {
//     id: "ca-phe-sua-da",
//     name: "Cà Phê Sữa Đá",
//     region: "nam-bo",
//     category: "do-uong",
//     price: 25000,
//     priceLabel: "25.000đ",
//     image: "/images/ca-phe.jpg",
//   },
//   {
//     id: "tra-sen",
//     name: "Trà Sen Hồ Tây",
//     region: "bac-bo",
//     category: "do-uong",
//     price: 180000,
//     priceLabel: "180.000đ",
//     image: "/images/tra-sen.jpg",
//   },
// ];

// const REGIONS = [
//   { id: "all", name: "Tất cả" },
//   { id: "bac-bo", name: "Miền Bắc" },
//   { id: "trung-bo", name: "Miền Trung" },
//   { id: "nam-bo", name: "Miền Nam" },
// ];

const PRICE_FILTERS = [
  { id: "1", label: "Dưới 50.000đ", min: 0, max: 50000 },
  { id: "2", label: "50.000đ - 100.000đ", min: 50000, max: 100000 },
  { id: "3", label: "100.000đ - 150.000đ", min: 100000, max: 150000 },
  { id: "4", label: "Trên 150.000đ", min: 150000, max: Infinity },
];

// const CATEGORIES = [
//   { id: "all", name: "Tất cả danh mục" },
//   { id: "mon-chinh", name: "Món chính" },
//   { id: "do-an-vat", name: "Đồ ăn vặt" },
//   { id: "trang-mieng", name: "Tráng miệng" },
//   { id: "banh-keo", name: "Bánh kẹo" },
//   { id: "do-uong", name: "Đồ uống" },
// ];

export default function ProductsPage() {

  const { data, isLoading, isError } = useGetRegionsQuery({ page: 0, size: 20 });
  const regions = [
    { id: "all", name: "Tất cả" },
    ...(data?.data.map(r => ({
      id: r.regionId,
      name: r.regionName
    })) || [])
  ];

  const { data: categoryData, isLoading: catLoading, isError: catError } = useGetCategoriesQuery({ page: 0, size: 20 });
  const categories = [
    { id: "all", name: "Tất cả danh mục" },
    ...(categoryData?.data.map(c => ({
      id: c.categoryId,
      name: c.categoryName
    })) || [])
  ];

  const { data: productData, isLoading: prodLoading, isError: prodError } = useGetProductsQuery({ page: 0, size: 20 });
  const products = productData?.data || [];


  const searchParams = useSearchParams();
  const router = useRouter();
  const regionParam = searchParams.get("region") || "all";

  const [selectedRegion, setSelectedRegion] = useState(regionParam);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Lọc sản phẩm
  let filtered = products.filter((p) =>
    selectedRegion === "all" ? true : p.region.regionId === selectedRegion
  );
  if (selectedPrices.length > 0) {
    filtered = filtered.filter((p) =>
      selectedPrices.some((pid) => {
        const pf = PRICE_FILTERS.find((f) => f.id === pid);
        return pf && p.price >= pf.min && p.price < pf.max;
      })
    );
  }
  if (selectedCategory !== "all") {
    filtered = filtered.filter((p) => p.category.categoryId === selectedCategory);
  }

  // Xử lý chọn miền
  function handleRegionChange(id: string) {
    setSelectedRegion(id);
    const params = new URLSearchParams(searchParams.toString());
    if (id === "all") {
      params.delete("region");
    } else {
      params.set("region", id);
    }
    router.replace(`?${params.toString()}`);
  }

  // Xử lý chọn giá
  function handlePriceChange(id: string) {
    setSelectedPrices((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  // Xử lý chọn danh mục
  function handleCategoryChange(id: string) {
    setSelectedCategory(id);
  }

  return (
    <>
      <SiteHeader />
      <main className="py-16 min-h-screen">
        {isLoading && <p>Đang tải sản phẩm...</p>}
        {isError && <p>Lỗi khi tải sản phẩm</p>}
        <div className="flex max-w-7xl mx-auto px-4 gap-10">
          {/* Filter sidebar */}
          <aside className="w-64 shrink-0 hidden md:block border-r border-[#e0e0e0] pr-6">
            <div className="mb-8">
              <h3 className="font-beaululo text-sm text-[#222] mb-4 tracking-widest uppercase">Lọc theo miền</h3>
              {isLoading && <p className="text-sm text-gray-500">Đang tải danh sách miền...</p>}
              {isError && <p className="text-sm text-red-500">Lỗi tải miền</p>}
              <ul className="space-y-2 font-nitti text-sm">
                {regions.map((r) => (
                  <li key={r.id}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="region"
                        checked={selectedRegion === r.id}
                        onChange={() => handleRegionChange(r.id)}
                        className="accent-[#8FBC8F]"
                      />
                      <span>{r.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-beaululo text-sm text-[#222] mb-4 tracking-widest uppercase">Giá sản phẩm</h3>
              <ul className="space-y-2 font-nitti text-sm">
                {PRICE_FILTERS.map((f) => (
                  <li key={f.id}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPrices.includes(f.id)}
                        onChange={() => handlePriceChange(f.id)}
                        className="accent-[#8FBC8F]"
                      />
                      <span>{f.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8">
              <h3 className="font-beaululo text-sm text-[#222] mb-4 tracking-widest uppercase">Danh mục sản phẩm</h3>
              {catLoading && <p className="text-sm text-gray-500">Đang tải...</p>}
              {catError && <p className="text-sm text-red-500">Lỗi tải danh mục</p>}
              <ul className="space-y-2 font-nitti text-sm">
                {categories.map((c) => (
                  <li key={c.id}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === c.id}
                        onChange={() => handleCategoryChange(c.id)}
                        className="accent-[#8FBC8F]"
                      />
                      <span>{c.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          {/* Product grid */}
          <div className="flex-1 pl-10">
            <h1 className="text-2xl md:text-4xl font-beaululo text-[#222] text-center mb-10 tracking-widest uppercase">
              Danh Sách Đặc Sản
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-12 gap-y-16">
              {filtered.slice(0, 8).length === 0 && (
                <div className="col-span-full text-center text-[#888] font-nitti py-20">
                  Không tìm thấy sản phẩm phù hợp.
                </div>
              )}
              {filtered.slice(0, 8).map((item) => (
                <Link
                  key={item.productId}
                  href={`/products/${item.productId}`}
                  className="group flex flex-col items-center"
                >
                  <div className="relative w-full aspect-square max-w-[220px] mx-auto">
                    <Image
                      src={item.imageProductResponseList?.[0]?.imageUrl || "/images/products-default.png"}
                      alt={item.productName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="mt-5 text-center">
                    <h3 className="text-base font-nitti text-[#222] font-bold uppercase tracking-widest mb-1 group-hover:underline transition-all">{item.productName}</h3>
                    <p className="text-base text-[#8FBC8F] font-nitti font-bold tracking-widest">{item.price.toLocaleString()}đ</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

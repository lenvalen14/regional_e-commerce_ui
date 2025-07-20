"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SiteHeader } from "@/components/sections/Header";
import { SiteFooter } from "@/components/sections/Footer";

const PRODUCTS = [
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
  // ...more products
];

const REGIONS = [
  { id: "all", name: "Tất cả" },
  { id: "bac-bo", name: "Miền Bắc" },
  { id: "trung-bo", name: "Miền Trung" },
  { id: "nam-bo", name: "Miền Nam" },
];

const PRICE_FILTERS = [
  { id: "1", label: "Dưới 50.000đ", min: 0, max: 50000 },
  { id: "2", label: "50.000đ - 100.000đ", min: 50000, max: 100000 },
  { id: "3", label: "100.000đ - 150.000đ", min: 100000, max: 150000 },
  { id: "4", label: "Trên 150.000đ", min: 150000, max: Infinity },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const regionParam = searchParams.get("region") || "all";

  const [selectedRegion, setSelectedRegion] = useState(regionParam);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);

  // Lọc sản phẩm
  let filtered = PRODUCTS.filter((p) =>
    selectedRegion === "all" ? true : p.region === selectedRegion
  );
  if (selectedPrices.length > 0) {
    filtered = filtered.filter((p) =>
      selectedPrices.some((pid) => {
        const pf = PRICE_FILTERS.find((f) => f.id === pid);
        return pf && p.price >= pf.min && p.price < pf.max;
      })
    );
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

  return (
    <>
      <SiteHeader />
      <main className="py-16 min-h-screen">
        <div className="flex max-w-7xl mx-auto px-4 gap-10">
          {/* Filter sidebar */}
          <aside className="w-64 shrink-0 hidden md:block border-r border-[#e0e0e0] pr-6">
            <div className="mb-8">
              <h3 className="font-beaululo text-sm text-[#222] mb-4 tracking-widest uppercase">Lọc theo miền</h3>
              <ul className="space-y-2 font-nitti text-sm">
                {REGIONS.map((r) => (
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
                  key={item.id}
                  href={`/products/${item.id}`}
                  className="group flex flex-col items-center"
                >
                  <div className="relative w-full aspect-square max-w-[220px] mx-auto">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="mt-5 text-center">
                    <h3 className="text-base font-nitti text-[#222] font-bold uppercase tracking-widest mb-1 group-hover:underline transition-all">{item.name}</h3>
                    <p className="text-base text-[#8FBC8F] font-nitti font-bold tracking-widest">{item.priceLabel}</p>
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

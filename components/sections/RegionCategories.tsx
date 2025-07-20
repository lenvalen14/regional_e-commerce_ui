'use client';

import Image from "next/image";
import Link from "next/link";

const REGIONS = [
  {
    id: "bac-bo",
    name: "Miền Bắc",
    image: "/images/region-north.jpg",
    description: "Vùng đất của cốm, phở, và hương vị truyền thống."
  },
  {
    id: "trung-bo",
    name: "Miền Trung",
    image: "/images/region-central.png",
    description: "Đậm đà, mặn mà như đất và người nơi đây."
  },
  {
    id: "nam-bo",
    name: "Miền Nam",
    image: "/images/region-south.jpg",
    description: "Phong phú, phóng khoáng và ngọt ngào."
  }
];

export function RegionCategories() {
  return (
    <section className="py-16 bg-white font-nitti">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-4xl font-beaululo text-[#222] tracking-widest uppercase mb-14">KHÁM PHÁ ĐẶC SẢN BA MIỀN</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {REGIONS.map((region) => (
            <Link
              key={region.id}
              href={`/products?region=${region.id}`}
              className="group block border border-[#bbb] rounded-lg overflow-hidden bg-white transition-all duration-200 hover:border-[#222] shadow-sm hover:shadow-md"
            >
              <div className="relative w-full aspect-[4/5] bg-[#f5f5f5]">
                <Image
                  src={region.image}
                  alt={region.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="py-6 px-2">
                <h3 className="text-2xl font-nitti text-[#222] mb-2 uppercase tracking-wide">{region.name}</h3>
                <p className="text-base text-[#444] opacity-80 font-nitti">{region.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

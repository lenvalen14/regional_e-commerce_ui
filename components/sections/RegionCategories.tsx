'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const REGIONS = [
	{
		id: "bac-bo",
		name: "Miền Bắc",
		image: "/images/region-north.jpg",
		description: "Vùng đất của cốm, phở, và hương vị truyền thống.",
	},
	{
		id: "trung-bo",
		name: "Miền Trung",
		image: "/images/region-central.png",
		description: "Đậm đà, mặn mà như đất và người nơi đây.",
	},
	{
		id: "nam-bo",
		name: "Miền Nam",
		image: "/images/region-south.jpg",
		description: "Phong phú, phóng khoáng và ngọt ngào.",
	},
];

export function RegionCategories() {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const handleCardClick = (index: number, e: React.MouseEvent) => {
        e.preventDefault();
        setSelectedIndex(selectedIndex === index ? null : index);
    };

    return (
        <section className="py-16 bg-white font-nitti">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-2xl md:text-4xl font-beaululo text-[#222] tracking-widest uppercase mb-14">
                    KHÁM PHÁ ĐẶC SẢN BA MIỀN
                </h2>
                <div className="relative flex justify-center items-center h-[500px] md:h-[600px]">
                    {/* Container cho cụm thẻ */}
                    <div 
                        className={`relative flex justify-center items-center transition-all duration-500 ${
                            selectedIndex !== null ? 'transform -translate-x-32 md:-translate-x-48' : ''
                        }`}
                        style={{
                            width: '400px',
                            height: '100%'
                        }}
                    >
                        {REGIONS.map((region, index) => {
                            const isSelected = selectedIndex === index;
                            let position = index;
                            let rotation = index * 20 - 20;
                            let translateY = index * -15;
                            
                            // Nếu có thẻ được chọn, sắp xếp lại vị trí
                            if (selectedIndex !== null) {
                                if (index === selectedIndex) {
                                    // Thẻ được chọn luôn ở vị trí giữa (position 1)
                                    position = 1;
                                    rotation = 0;
                                    translateY = -35; // Nâng cao hơn để nổi bật
                                } else {
                                    // Tạo mảng các index không được chọn và sắp xếp
                                    const otherIndices = [0, 1, 2].filter(i => i !== selectedIndex);
                                    const positionInOthers = otherIndices.indexOf(index);
                                    
                                    if (positionInOthers === 0) {
                                        // Thẻ đầu tiên trong số các thẻ còn lại
                                        position = 0;
                                        rotation = -20;
                                        translateY = 0;
                                    } else {
                                        // Thẻ thứ hai trong số các thẻ còn lại
                                        position = 2;
                                        rotation = 20;
                                        translateY = -30;
                                    }
                                }
                            }
                            
                            return (
                                <Link
                                    key={region.id}
                                    href={`/products?region=${region.id}`}
                                    onClick={(e) => handleCardClick(index, e)}
                                    className={`group absolute block border-2 rounded-lg overflow-hidden bg-white transition-all duration-300 shadow-sm hover:shadow-md w-74 md:w-90 ${
                                        isSelected 
                                            ? 'border-[#8FBC8F] hover:border-[#8FBC8F]' 
                                            : 'border-[#bbb] hover:border-[#8FBC8F]'
                                    }`}
                                    style={{
                                        transform: `rotate(${rotation}deg) translateY(${translateY}px)`,
                                        transformOrigin: 'bottom center',
                                        zIndex: isSelected ? 100 : REGIONS.length - index,
                                    }}
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
                                        <h3 className="text-2xl font-nitti text-[#222] mb-2 uppercase tracking-wide">
                                            {region.name}
                                        </h3>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Vùng hiển thị description */}
                    {selectedIndex !== null && (
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-80 md:w-130 p-6  animate-fade-in">
                            <div className="text-left">
                                <h3 className="text-3xl font-beaululo text-[#8FBC8F] mb-4 uppercase tracking-wide">
                                    {REGIONS[selectedIndex].name}
                                </h3>
                                <p className="text-lg text-[#666] leading-relaxed font-nitti">
                                    {REGIONS[selectedIndex].description}
                                </p>
                                <div className="mt-6">
                                    <Link
                                        href={`/products?region=${REGIONS[selectedIndex].id}`}
                                        className="inline-block bg-[#8FBC8F] text-white px-6 py-3 rounded-lg hover:bg-[#7aa87a] transition-colors duration-300 font-nitti uppercase tracking-wide"
                                    >
                                        Khám phá ngay
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateX(20px) translateY(-50%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0) translateY(-50%);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
            `}</style>
        </section>
    );
}

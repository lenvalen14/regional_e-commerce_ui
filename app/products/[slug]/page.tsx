"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { SiteHeader } from "@/components/sections/Header";
import { SiteFooter } from "@/components/sections/Footer";
import { ProductReviews, StarRating } from "@/components/sections/ProductReviews";
import { RelatedProducts } from "@/components/sections/RelatedProducts";
import { useCart } from "@/contexts/CartContext";
import { Check } from "lucide-react";

const PRODUCTS = [
  {
    id: "cha-com",
    name: "Chả Cốm Hà Nội",
    region: "Miền Bắc",
    price: "120.000đ",
    rating: 4.6,
    reviewCount: 16400,
    description:
      "Chả cốm thơm ngon, dẻo dai từ cốm làng Vòng, kết hợp cùng thịt băm truyền thống. Món ăn đặc trưng của Hà Nội mỗi độ thu về.",
    image: "/images/com.jpg",
    images: [
      "/images/com.jpg",
      "/images/bun-bo.jpg", // Sẽ fallback về com.jpg nếu không có
      "/images/bun-bo.jpg", // Sẽ fallback về com.jpg nếu không có
      "/images/com.jpg"  // Sẽ fallback về com.jpg nếu không có
    ]
  },
  {
    id: "bun-bo",
    name: "Bún Bò Huế",
    region: "Miền Trung",
    price: "95.000đ",
    rating: 4.5,
    reviewCount: 10200,
    description:
      "Nước dùng đậm đà, cay nồng, hòa quyện giữa xả, mắm ruốc và thịt bò. Món đặc sản trứ danh của xứ Huế mộng mơ.",
    image: "/images/bun-bo.jpg",
    images: [
      "/images/bun-bo.jpg",
      "/images/com.jpg",
      "/images/com.jpg",
      "/images/bun-bo.jpg"
    ]
  },
  {
    id: "banh-trang",
    name: "Bánh Tráng Trộn",
    region: "Miền Nam",
    price: "45.000đ",
    rating: 4.7,
    reviewCount: 9800,
    description:
      "Vị chua, cay, mặn, ngọt hòa quyện từ các nguyên liệu dân dã: bánh tráng, xoài, khô bò, rau răm. Món ăn vặt yêu thích khắp miền Nam.",
    image: "/images/banh-trang.jpg",
    images: [
      "/images/banh-trang.jpg",
       "/images/bun-bo.jpg",
       "/images/bun-bo.jpg",
      "/images/banh-trang.jpg"
    ]
  }
];

const VARIANTS = ["Bột", "Phin giấy", "Túi lọc"];

export default function ProductDetailPage() {
  const params = useParams();
  const product = PRODUCTS.find((p) => p.id === params?.slug);
  const [variant, setVariant] = useState(VARIANTS[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const { addItem } = useCart();

  // Theo dõi scroll để cập nhật active thumbnail
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      imageRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const imageTop = rect.top + scrollY;
          const imageBottom = imageTop + rect.height;
          
          // Nếu ảnh đang hiển thị trong viewport (ít nhất 50%)
          if (scrollY + windowHeight * 0.3 >= imageTop && scrollY + windowHeight * 0.7 <= imageBottom) {
            setSelectedImageIndex(index);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click thumbnail để scroll tới ảnh tương ứng
  const scrollToImage = (index: number) => {
    setSelectedImageIndex(index);
    if (imageRefs.current[index]) {
      imageRefs.current[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAdding(true);
    
    // Tạo hiệu ứng bay
    const createFlyingAnimation = () => {
      const button = document.querySelector('button:has(+ #flying-product)') as HTMLElement;
      const flyingProduct = document.getElementById('flying-product') as HTMLElement;
      const cartIcon = document.querySelector('[data-cart-icon]') as HTMLElement;
      
      if (!button || !flyingProduct || !cartIcon) return;
      
      const buttonRect = button.getBoundingClientRect();
      const cartRect = cartIcon.getBoundingClientRect();
      
      // Set vị trí ban đầu
      flyingProduct.style.left = `${buttonRect.left + buttonRect.width / 2 - 120}px`; // -120 thay vì -40 (to hơn 3 lần)
      flyingProduct.style.top = `${buttonRect.top + buttonRect.height / 2 - 120}px`;  // -120 thay vì -40
      flyingProduct.style.opacity = '1';
      flyingProduct.style.transform = 'scale(1)';
      
      // Animate đến cart (chậm hơn 10%)
      setTimeout(() => {
        flyingProduct.style.left = `${cartRect.left + cartRect.width / 2 - 120}px`; // -120 thay vì -40
        flyingProduct.style.top = `${cartRect.top + cartRect.height / 2 - 120}px`;   // -120 thay vì -40
        flyingProduct.style.transform = 'scale(0.3)';
        flyingProduct.style.opacity = '0.8';
      }, 110); // 110ms thay vì 100ms (chậm 10%)
      
      // Ẩn sau khi hoàn thành (chậm hơn 10%)
      setTimeout(() => {
        flyingProduct.style.opacity = '0';
        flyingProduct.style.transform = 'scale(0)';
      }, 1210); // 1210ms thay vì 1100ms (chậm 10%)
    };
    
    const priceNumber = parseInt(product.price.replace(/[^\d]/g, ''));
    
    try {
      // Bắt đầu animation
      createFlyingAnimation();
      
      // Delay để animation chạy trước
      setTimeout(() => {
        addItem({
          id: product.id,
          name: product.name,
          price: priceNumber,
          priceLabel: product.price,
          variant: variant,
          image: product.image,
          quantity: quantity
        });
        
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }, 600);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setTimeout(() => setIsAdding(false), 1200);
    }
  };

  if (!product) {
    return <div className="text-center py-20">Sản phẩm không tồn tại.</div>;
  }

  // Fallback về ảnh chính nếu ảnh detail không tồn tại
  const productImages = product.images || [product.image, product.image, product.image, product.image];
  const currentImage = productImages[selectedImageIndex];

  return (
    <>
      <SiteHeader />
      <main className="py-16 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 flex gap-8 items-start mb-16">
          {/* Image Gallery */}
          <div className="w-[840px] flex-shrink-0 relative">
            {/* Thumbnail Gallery - absolute + sticky */}
            <div className="absolute ml-[-90px] top-0 h-full flex items-start pointer-events-none">
              <div className="flex flex-col gap-3 sticky top-20 z-10 pointer-events-auto">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 shadow-lg ${
                      selectedImageIndex === index 
                        ? "border-[#8FBC8F] ring-2 ring-[#8FBC8F] ring-opacity-30 scale-110" 
                        : "border-white hover:border-[#8FBC8F]"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} - Ảnh ${index + 1}`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = product.image;
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
            {/* Main Images */}
            <div className="space-y-4 pl-20"> {/* pl-20 để tránh thumbnail gallery che ảnh */}
              {productImages.map((img, index) => (
                <div 
                  key={index} 
                  ref={(el) => { imageRefs.current[index] = el; }}
                  className="relative w-full h-[840px] rounded-lg overflow-hidden cursor-zoom-in group"
                  onClick={() => setLightboxIndex(index)}
                  tabIndex={0}
                  aria-label="Xem ảnh lớn"
                  role="button"
                  onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ") setLightboxIndex(index);
                  }}
                >
                  <Image
                    src={img}
                    alt={`${product.name} - Ảnh ${index + 1}`}
                    fill
                    className="object-contain transition-transform duration-200 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = product.image;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
          {/* Thông tin sản phẩm */}
          <div className="w-[490px] flex-shrink-0 sticky top-17">
            <div className="flex flex-col gap-6">
              <h1 className="text-2xl md:text-4xl font-beaululo text-[#222] uppercase tracking-widest mb-2">{product.name}</h1>
              {/* Rating và Reviews */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <StarRating rating={product.rating} size="w-6 h-6" />
                  <span className="text-2xl font-bold text-[#222]">{product.rating}</span>
                </div>
                <span className="text-[#bbb] mx-2">|</span>
                <span className="text-sm text-[#666] font-nitti">
                  {product.reviewCount.toLocaleString()} Đánh Giá
                </span>
              </div>

              <p className="text-[#E53935] text-2xl font-nitti font-bold tracking-widest mb-4">{product.price}</p>
              
              {/* Chọn loại */}
              <div className="flex gap-2.5 mb-2">
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
                <button
                  onClick={() => setQuantity(q => Math.max(1, q-1))}
                  className="w-8 h-8 rounded border border-[#bbb] font-nitti text-lg transition-all duration-150
                    hover:bg-[#8FBC8F] hover:text-white hover:border-[#8FBC8F] hover:scale-110
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FBC8F]"
                >-</button>
                <span className="font-nitti text-base w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q+1)}
                  className="w-8 h-8 rounded border border-[#bbb] font-nitti text-lg transition-all duration-150
                    hover:bg-[#8FBC8F] hover:text-white hover:border-[#8FBC8F] hover:scale-110
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FBC8F]"
                >+</button>
              </div>
              
              {/* Nút thêm vào giỏ */}
              <button 
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`relative overflow-hidden bg-[#8FBC8F] hover:bg-[#7CA87C] disabled:bg-[#bbb] text-white px-8 py-3 rounded-full text-base font-nitti font-bold tracking-widest transition-all duration-300 ${
                  showSuccess ? 'bg-green-600' : ''
                }`}
              >
                {isAdding ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang thêm...
                  </span>
                ) : showSuccess ? (
                  <span className="flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" />
                    Đã thêm vào giỏ!
                  </span>
                ) : (
                  'Thêm vào giỏ hàng'
                )}
              </button>

              {/* Flying Product Animation */}
              <div 
                id="flying-product"
                className="fixed pointer-events-none z-[9999] opacity-0 transition-all duration-1000 ease-out"
                style={{
                  width: '240px',   // 240px thay vì 80px (to hơn 3 lần)
                  height: '240px',  // 240px thay vì 80px (to hơn 3 lần)
                  transform: 'scale(0)',
                }}
              >
                <Image
                  src={currentImage}
                  alt={product.name}
                  fill
                  className="object-cover rounded-lg shadow-lg"
                />
              </div>
              
              {/* Mô tả */}
              <div className="mt-8">
                <h2 className="font-beaululo text-lg text-[#222] uppercase tracking-widest mb-2">Mô tả sản phẩm</h2>
                <p className="text-[#4C5C4C] font-nitti leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Phần dưới: Reviews full width */}
        <div className="max-w-6xl mx-auto px-4">
          <ProductReviews productId={product.id} />
          
          {/* Sản phẩm liên quan */}
          <RelatedProducts currentProductId={product.id} region={product.region} />
        </div>

        {/* Lightbox Modal */}
        {lightboxIndex !== null && (
          <div
            className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center"
            onClick={() => setLightboxIndex(null)}
            tabIndex={-1}
          >
            <div
              className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              <Image
                src={productImages[lightboxIndex]}
                alt={`${product.name} - Ảnh phóng to`}
                fill
                className="object-contain rounded-lg"
                style={{ position: "relative" }}
              />
              <button
                className="absolute top-2 right-2 bg-white/80 hover:bg-white text-black rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold shadow"
                onClick={() => setLightboxIndex(null)}
                aria-label="Đóng"
                tabIndex={0}
              >
                ×
              </button>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

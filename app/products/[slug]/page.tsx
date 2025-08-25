"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { SiteHeader } from "@/components/layout/Header";
import { SiteFooter } from "@/components/layout/Footer";
import { ProductReviews, StarRating } from "@/components/products/ProductReviews";
import { RelatedProducts } from "@/components/products/RelatedProducts";
import { useCart } from "@/contexts/CartContext";
import { Check } from "lucide-react";
import { ArticleComments } from "@/components/products/ArticleComments";
import { useGetProductQuery } from "@/features/product/productApi";
import {
    useGetReviewsByProductQuery
} from "@/features/review/reviewApi";


const VARIANTS = ["Bột", "Phin giấy", "Túi lọc"];

export default function ProductDetailPage() {
  const params = useParams();
  const { data, isLoading, isError } = useGetProductQuery(params?.slug as string);
  const product = data?.data;
  const { data: reviewData } = useGetReviewsByProductQuery({
      productId: product?.productId!,
      page: 0,
      size: 500,
  });

  const reviews = reviewData?.reviews ?? [];

  const reviewCount = reviews.length;
  const averageRating = product?.rating ?? 0;
  // const product = PRODUCTS.find((p) => p.id === params?.slug);
  // const [variant, setVariant] = useState(VARIANTS[0]);
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

    const priceNumber = product.price;

    try {
      // Bắt đầu animation
      createFlyingAnimation();

      // Delay để animation chạy trước
      setTimeout(() => {
        addItem({
          id: product.productId,
          name: product.productName,
          price: priceNumber,
          priceLabel: product.price.toString(),
          // variant: variant,
          image: product.imageProductResponseList?.[0]?.imageUrl || "images/products-default.png",
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
  // const productImages = product.image || [product.image, product.image, product.image, product.image];
  const productImages =
    product.imageProductResponseList?.map(img => img.imageUrl) || [];
  const currentImage = productImages[selectedImageIndex];

  if (isLoading) return <p>Đang tải...</p>;
  if (isError) return <p>Lỗi tải sản phẩm</p>;
  if (!data?.data) return <p>Không tìm thấy sản phẩm</p>;

  return (
    <>
      <SiteHeader />
      <main className="py-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 lg:gap-8 items-start mb-16">
          {/* Image Gallery */}
          <div className="lg:col-span-7 relative">
            {/* Thumbnail Gallery - absolute + sticky */}
            <div className="absolute ml-[-90px] top-0 h-full flex-col items-start pointer-events-none hidden lg:flex">
              <div className="flex flex-col gap-3 sticky top-24 z-10 pointer-events-auto">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 shadow-lg ${selectedImageIndex === index
                      ? "border-[#8FBC8F] ring-2 ring-[#8FBC8F] ring-opacity-30 scale-110"
                      : "border-white hover:border-[#8FBC8F]"
                      }`}
                  >
                    {/* <Image
                      src={img}
                      alt={`${product.name} - Ảnh ${index + 1}`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = product.image;
                      }}
                    /> */}
                    <Image
                      src={img}
                      alt={`${product.productName} - Ảnh ${index + 1}`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          product.imageProductResponseList?.[0]?.imageUrl || "/fallback.png";
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
            {/* Main Images */}
            <div className="space-y-4 lg:pl-20"> {/* pl-20 để tránh thumbnail gallery che ảnh */}
              {productImages.map((img, index) => (
                <div
                  key={index}
                  ref={(el) => { imageRefs.current[index] = el; }}
                  className="relative w-full aspect-square rounded-lg overflow-hidden cursor-zoom-in group"
                  onClick={() => setLightboxIndex(index)}
                  tabIndex={0}
                  aria-label="Xem ảnh lớn"
                  role="button"
                  onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ") setLightboxIndex(index);
                  }}
                >
                  {/* <Image
                    src={img}
                    alt={`${product.productName} - Ảnh ${index + 1}`}
                    fill
                    className="object-contain transition-transform duration-200 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = product.image;
                    }}
                  /> */}
                  <Image
                    src={img}
                    alt={`${product.productName} - Ảnh ${index + 1}`}
                    fill
                    className="object-contain transition-transform duration-200 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        product.imageProductResponseList?.[0]?.imageUrl || "/fallback.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
          {/* Thông tin sản phẩm */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="flex flex-col gap-6">
              <h1 className="text-2xl md:text-4xl font-beaululo text-[#222] uppercase tracking-widest mb-2">{product.productName}</h1>
              {/* Rating và Reviews */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <StarRating rating={averageRating} size="w-6 h-6" />
                  <span className="text-2xl font-bold text-[#222]">{averageRating.toFixed(1)}</span>
                </div>
                <span className="text-[#bbb] mx-2">|</span>
                <span className="text-sm text-[#666] font-nitti">
                  {reviewCount.toLocaleString()} Đánh Giá
                </span>
              </div>

              <p className="text-[#E53935] text-2xl font-nitti font-bold tracking-widest mb-4">{product.price}đ</p>

              {/* Chọn loại */}
              {/* <div className="flex gap-2.5 mb-2">
                {VARIANTS.map((v) => (
                  <button
                    key={v}
                    onClick={() => setVariant(v)}
                    className={`px-4 py-1 rounded border text-sm font-nitti tracking-widest transition-colors ${variant === v ? "bg-[#222] text-white border-[#222]" : "bg-white text-[#222] border-[#bbb] hover:border-[#222]"}`}
                  >
                    {v}
                  </button>
                ))}
              </div> */}

              {/* Số lượng */}
              <div className="flex flex-col gap-1 mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-nitti text-sm">Số lượng:</span>
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded border border-[#bbb] font-nitti text-lg transition-all duration-150
                      hover:bg-[#8FBC8F] hover:text-white hover:border-[#8FBC8F] hover:scale-110
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FBC8F]"
                    disabled={quantity <= 1}
                  >-</button>
                  <span className="font-nitti text-base w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => {
                      if (quantity < product.stockQuantity) {
                        setQuantity(q => q + 1);
                      }
                    }}
                    className="w-8 h-8 rounded border border-[#bbb] font-nitti text-lg transition-all duration-150
                      hover:bg-[#8FBC8F] hover:text-white hover:border-[#8FBC8F] hover:scale-110
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8FBC8F]"
                    disabled={quantity >= product.stockQuantity}
                  >+</button>
                </div>
                {quantity >= product.stockQuantity && product.stockQuantity > 0 && (
                  <span className="text-xs text-red-500 font-nitti mt-1">Đã đạt số lượng tối đa trong kho</span>
                )}
              </div>

              {/* Nút thêm vào giỏ hoặc hết hàng */}
              <button
                onClick={handleAddToCart}
                disabled={isAdding || product.stockQuantity === 0}
                className={`relative overflow-hidden bg-[#8FBC8F] hover:bg-[#7CA87C] disabled:bg-[#bbb] text-white px-8 py-3 rounded-full text-base font-nitti font-bold tracking-widest transition-all duration-300 ${showSuccess ? 'bg-green-600' : ''}`}
              >
                {product.stockQuantity === 0 ? (
                  <span className="flex items-center justify-center gap-2">
                    Đã hết hàng
                  </span>
                ) : isAdding ? (
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
                  alt={product.productName}
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
          <ProductReviews productId={product.productId} />

          {/* Sản phẩm liên quan */}
          <RelatedProducts currentProductId={product.productId}
            // region={product.region.regionName
            categoryId={product.category.categoryId}
          />
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
                alt={`${product.productName} - Ảnh phóng to`}
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

import { Hero } from "@/components/layout/Hero";
import { SiteHeader } from "@/components/layout/Header";
import { RegionCategories } from "@/components/shared/RegionCategories";
import { FeaturedProducts } from "@/components/products/FeaturedProducts";
// import { CulturalIntro } from "@/components/sections/CulturalIntro";
// import { NewsPreview } from "@/components/sections/NewsPreview";
import { SiteFooter } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <main className="text-[#4E342E]">
      <SiteHeader/>
      <Hero />
      <RegionCategories />
      <FeaturedProducts />
      {/* <CulturalIntro />
      <NewsPreview /> */}
      <SiteFooter />
    </main>
  );
}

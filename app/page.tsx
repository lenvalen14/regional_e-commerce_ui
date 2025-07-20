import { Hero } from "@/components/sections/Hero";
import { SiteHeader } from "@/components/sections/Header";
import { RegionCategories } from "@/components/sections/RegionCategories";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
// import { CulturalIntro } from "@/components/sections/CulturalIntro";
// import { NewsPreview } from "@/components/sections/NewsPreview";
import { SiteFooter } from "@/components/sections/Footer";

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

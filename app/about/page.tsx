'use client';

import { SiteHeader } from "@/components/sections/Header";
import { SiteFooter } from "@/components/sections/Footer";
import { AboutHero } from "@/components/sections/AboutHero";
import { AboutStory } from "@/components/sections/AboutStory";
import { AboutValues } from "@/components/sections/AboutValues";
import { AboutCulture } from "@/components/sections/AboutCulture";
import { AboutMission } from "@/components/sections/AboutMission";
import { AboutStats } from "@/components/sections/AboutStats";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      
      <main>
        {/* Hero Section với parallax effect */}
        <AboutHero />
        
        {/* Câu chuyện của chúng tôi */}
        <AboutStory />
        
        {/* Thống kê ấn tượng */}
        <AboutStats />
        
        {/* Giá trị cốt lõi */}
        <AboutValues />
        
        {/* Văn hóa Việt */}
        <AboutCulture />
        
        {/* Sứ mệnh */}
        <AboutMission />
      </main>

      <SiteFooter />
    </div>
  );
}
'use client';

import { SiteHeader } from "@/components/layout/Header";
import { SiteFooter } from "@/components/layout/Footer";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutStory } from "@/components/about/AboutStory";
import { AboutValues } from "@/components/about/AboutValues";
import { AboutCulture } from "@/components/about/AboutCulture";
import { AboutMission } from "@/components/about/AboutMission";
import { AboutStats } from "@/components/about/AboutStats";

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
'use client';

import { SiteHeader } from "@/components/layout/Header";
import { SiteFooter } from "@/components/layout/Footer";
import { NewsHero } from "@/components/news/NewsHero";
import { FeaturedNews } from "@/components/news/FeaturedNews";
import { NewsGrid } from "@/components/news/NewsGrid";
import { NewsCategories } from "@/components/news/NewsCategories";

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <SiteHeader />
      
      <main>
        {/* Hero Section */}
        <NewsHero />
        
        {/* Featured News */}
        <FeaturedNews />
        
        {/* Categories Filter */}
        <NewsCategories />
        
        {/* News Grid */}
        <NewsGrid />
        
      </main>

      <SiteFooter />
    </div>
  );
}
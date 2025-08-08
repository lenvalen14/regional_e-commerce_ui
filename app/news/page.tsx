'use client';

import { SiteHeader } from "@/components/sections/Header";
import { SiteFooter } from "@/components/sections/Footer";
import { NewsHero } from "@/components/sections/NewsHero";
import { FeaturedNews } from "@/components/sections/FeaturedNews";
import { NewsGrid } from "@/components/sections/NewsGrid";
import { NewsCategories } from "@/components/sections/NewsCategories";
import { NewsletterSubscribe } from "@/components/sections/NewsletterSubscribe";

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
        
        {/* Newsletter Subscribe */}
        <NewsletterSubscribe />
      </main>

      <SiteFooter />
    </div>
  );
}
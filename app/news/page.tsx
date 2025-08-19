'use client'

import { SiteHeader } from "@/components/layout/Header"
import { SiteFooter } from "@/components/layout/Footer"
import { NewsHero } from "@/components/news/NewsHero"
import { FeaturedNews } from "@/components/news/FeaturedNews"
import { NewsCategories } from "@/components/news/NewsCategories"
import { NewsGrid } from "@/components/news/NewsGrid"
import { NewResponse, useGetAllNewsQuery } from "@/features/new/newApi"

export default function NewsPage() {
  const { data, error, isLoading } = useGetAllNewsQuery({ page: 0, size: 6 })

  if (isLoading) return <div className="text-center py-10">Loading...</div>
  if (error) return <div className="text-center py-10 text-red-500">Failed to load news</div>


  const newsList: NewResponse[] = (data?.data || [])
    .slice()
    .sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime())

  const latestNews = newsList[0] // bài mới nhất
  const featuredNews = newsList.slice(1, 4)
  const otherNews = newsList.slice(4)

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <SiteHeader />

      <main>
        {/* Hero Section với bài mới nhất */}
        {latestNews && <NewsHero latestNews={latestNews} />}

        {/* Featured News (truyền 3 bài nổi bật: index 3,4,5) */}
        {featuredNews.length > 0 && <FeaturedNews articles={featuredNews} />}

        {/* Categories Filter */}
        {newsList.length > 0 && <NewsCategories news={newsList} />}

        {/* News Grid với danh sách còn lại */}
        {otherNews.length > 0 && <NewsGrid articles={otherNews} />}
      </main>

      <SiteFooter />
    </div>
  )
}

'use client';

import { use } from 'react';
import { SiteHeader } from "@/components/layout/Header";
import { SiteFooter } from "@/components/layout/Footer";
import { ArticleDetail } from "@/components/news/ArticleDetail";
import { RelatedArticles } from "@/components/news/RelatedArticles";

interface Props {
  params: Promise<{ id: string }>
}

export default function ArticleDetailPage({ params }: Props) {
  const { id } = use(params);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <SiteHeader />

      <main>
        <ArticleDetail articleId={id} />
        <RelatedArticles />
      </main>

      <SiteFooter />
    </div>
  );
}
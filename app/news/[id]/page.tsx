'use client';

import { use } from 'react';
import { SiteHeader } from "@/components/sections/Header";
import { SiteFooter } from "@/components/sections/Footer";
import { ArticleDetail } from "@/components/sections/ArticleDetail";
import { RelatedArticles } from "@/components/sections/RelatedArticles";
import { ArticleComments } from "@/components/sections/ArticleComments";

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
        <ArticleComments />
      </main>

      <SiteFooter />
    </div>
  );
}
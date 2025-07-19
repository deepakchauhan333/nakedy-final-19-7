import React from 'react';
import { Metadata } from 'next';
import { getCategories, getTools } from '@/lib/supabase';
import { Navigation } from '@/components/navigation';
import { CategoriesPage } from '@/components/pages/categories-page';
import { Category } from '@/lib/database.types';

export const metadata: Metadata = {
  title: 'AI Tool Categories - NakedifyAI.com',
  description: 'Browse all AI tool categories. Find the perfect category for your needs from chatbots to image generators.',
  openGraph: {
    title: 'AI Tool Categories - NakedifyAI.com',
    description: 'Browse all AI tool categories. Find the perfect category for your needs.',
    type: 'website',
  },
};

export const revalidate = 3600;

export default async function CategoriesPageRoute() {
  const [categories, allTools] = await Promise.all([
    getCategories(),
    getTools({ limit: 1000 })
  ]);

  // Count tools per category
  const categoriesWithCounts = categories.map((category: Category) => {
    const toolCount = allTools.filter(tool => tool.category === category.slug).length;
    return {
      ...category,
      toolCount
    };
  });

  return (
    <div className="min-h-screen">
      <Navigation />
      <CategoriesPage categories={categoriesWithCounts} />
    </div>
  );
}
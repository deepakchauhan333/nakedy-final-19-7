import React from 'react';
import { Metadata } from 'next';
import { getFastTools, getFastCategories, preloadCriticalData } from '@/lib/supabase-fast';
import { Navigation } from '@/components/navigation';
import { FastHomePage } from '@/components/pages/fast-home-page';

export const metadata: Metadata = {
  title: 'NakedifyAI.com - Best Adult AI Apps & Services Directory 2025',
  description: 'Discover the best NSFW AI tools, adult chatbots, image generators, and more. Comprehensive directory of AI-powered adult services with reviews and comparisons. Updated daily with the latest AI innovations.',
  keywords: [
    'NSFW AI tools', 'adult AI chatbots', 'AI image generators', 'adult AI services',
    'AI companions', 'NSFW image generation', 'AI roleplay', 'adult chatbots',
    'AI tools 2025', 'best AI apps', 'AI directory', 'artificial intelligence'
  ],
  openGraph: {
    title: 'NakedifyAI.com - Best Adult AI Apps & Services Directory 2025',
    description: 'Discover the best NSFW AI tools, adult chatbots, image generators, and more.',
    type: 'website',
    url: 'https://nakedifyai.com',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'NakedifyAI.com - Adult AI Tools Directory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NakedifyAI.com - Best Adult AI Apps & Services Directory 2025',
    description: 'Discover the best NSFW AI tools, adult chatbots, image generators, and more.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://nakedifyai.com',
  },
};

// Structured data for homepage
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'NakedifyAI.com',
  description: 'Comprehensive directory of adult AI tools and services',
  url: 'https://nakedifyai.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://nakedifyai.com/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
  mainEntity: {
    '@type': 'ItemList',
    name: 'Adult AI Tools Directory',
    description: 'Curated list of the best adult AI tools and services',
    numberOfItems: 500,
  },
};

export const revalidate = 3600; // ISR - revalidate every hour

export default async function Home() {
  // Preload critical data for performance
  await preloadCriticalData();
  
  const [tools, categories] = await Promise.all([
    getFastTools(20),
    getFastCategories(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen">
        <Navigation />
        <FastHomePage initialTools={tools} categories={categories} />
      </div>
    </>
  );
}
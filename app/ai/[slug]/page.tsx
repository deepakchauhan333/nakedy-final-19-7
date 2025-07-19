import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFastToolBySlug, incrementViewsFast, getAllFastToolSlugs } from '@/lib/supabase-fast';
import { generateToolSEO } from '@/lib/seo-utils';
import { Navigation } from '@/components/navigation';
import { FastToolDetailPage } from '@/components/pages/fast-tool-detail-page';
import { SemanticMain } from '@/components/ui/semantic-layout';

interface Props {
  params: { slug: string };
}

// Static generation for better performance
export async function generateStaticParams() {
  try {
    const slugs = await getAllFastToolSlugs();
    return slugs.slice(0, 100).map((slug) => ({ slug })); // Increased for better coverage
  } catch (error) {
    console.error('Error generating static params:', error);
    return [{ slug: 'chatgpt-plus' }, { slug: 'dall-e-3' }];
  }
}

// Dynamic SEO metadata generation
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const tool = await getFastToolBySlug(params.slug);
    
    if (!tool) {
      return {
        title: 'Tool Not Found - NakedifyAI.com',
        description: 'The requested AI tool could not be found.',
        robots: { index: false, follow: false },
      };
    }
    
    const seoData = generateToolSEO(tool);
    
    // Enhanced structured data for tool pages
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: tool.name,
      description: tool.description,
      url: tool.url,
      applicationCategory: 'AI Tool',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: tool.pricing === 'free' ? '0' : undefined,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
      aggregateRating: tool.rating ? {
        '@type': 'AggregateRating',
        ratingValue: tool.rating,
        reviewCount: tool.review_count || 1,
        bestRating: 5,
        worstRating: 1,
      } : undefined,
      author: {
        '@type': 'Organization',
        name: 'NakedifyAI.com',
        url: 'https://nakedifyai.com',
      },
    };
    
    return {
      ...seoData,
      other: {
        'application/ld+json': JSON.stringify(structuredData),
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Tool Not Found - NakedifyAI.com',
      description: 'The requested AI tool could not be found.',
      robots: { index: false, follow: false },
    };
  }
}

export const revalidate = 3600; // ISR for dynamic content

export default async function ToolDetailPageRoute({ params }: Props) {
  try {
    if (!params?.slug || typeof params.slug !== 'string') {
      notFound();
    }

    const tool = await getFastToolBySlug(params.slug);
    
    if (!tool) {
      notFound();
    }

    // Non-blocking view increment
    incrementViewsFast(tool.id);

    // Structured data for the specific tool
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: tool.name,
      description: tool.description,
      url: tool.url,
      applicationCategory: 'AI Tool',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: tool.pricing === 'free' ? '0' : undefined,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
      aggregateRating: tool.rating ? {
        '@type': 'AggregateRating',
        ratingValue: tool.rating,
        reviewCount: tool.review_count || 1,
        bestRating: 5,
        worstRating: 1,
      } : undefined,
      author: {
        '@type': 'Organization',
        name: 'NakedifyAI.com',
        url: 'https://nakedifyai.com',
      },
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <div className="min-h-screen">
          <Navigation />
          <SemanticMain>
            <FastToolDetailPage tool={tool} />
          </SemanticMain>
        </div>
      </>
    );
  } catch (error) {
    console.error('Error in ToolDetailPageRoute:', error);
    notFound();
  }
}
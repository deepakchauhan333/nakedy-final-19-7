import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFastToolsByCategory, getFastCategories } from '@/lib/supabase-fast';
import { generateCategorySEO } from '@/lib/seo-utils';
import { Navigation } from '@/components/navigation';
import { FastCategoryPage } from '@/components/pages/fast-category-page';
import { SemanticMain } from '@/components/ui/semantic-layout';

interface Props {
  params: { slug: string };
}

// Static generation for categories
export async function generateStaticParams() {
  try {
    const categories = await getFastCategories();
    return categories.map((category) => ({ slug: category.slug }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [{ slug: 'chatbots' }, { slug: 'image-generators' }];
  }
}

// Dynamic SEO for categories
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const [categories, tools] = await Promise.all([
      getFastCategories(),
      getFastToolsByCategory(params.slug, 1) // Just for count
    ]);

    const category = categories.find(cat => cat.slug === params.slug);
    
    if (!category) {
      return {
        title: 'Category Not Found - NakedifyAI.com',
        description: 'The requested category could not be found.',
        robots: { index: false, follow: false },
      };
    }

    const toolCount = tools.length;
    const seoData = generateCategorySEO(category, toolCount);
    
    // Enhanced structured data for category pages
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${category.name} AI Tools`,
      description: category.description || `Discover the best ${category.name.toLowerCase()} AI tools`,
      url: `https://nakedifyai.com/category/${category.slug}`,
      mainEntity: {
        '@type': 'ItemList',
        name: `${category.name} AI Tools`,
        description: `Curated list of ${category.name.toLowerCase()} AI tools`,
        numberOfItems: toolCount,
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://nakedifyai.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Categories',
            item: 'https://nakedifyai.com/categories',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: category.name,
            item: `https://nakedifyai.com/category/${category.slug}`,
          },
        ],
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
      title: 'Category Not Found - NakedifyAI.com',
      description: 'The requested category could not be found.',
      robots: { index: false, follow: false },
    };
  }
}

export const revalidate = 3600; // ISR

export default async function CategoryPageRoute({ params }: Props) {
  try {
    const [categories, tools] = await Promise.all([
      getFastCategories(),
      getFastToolsByCategory(params.slug, 100)
    ]);

    const category = categories.find(cat => cat.slug === params.slug);
    
    if (!category) {
      notFound();
    }

    // Structured data for the category
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${category.name} AI Tools`,
      description: category.description || `Discover the best ${category.name.toLowerCase()} AI tools`,
      url: `https://nakedifyai.com/category/${category.slug}`,
      mainEntity: {
        '@type': 'ItemList',
        name: `${category.name} AI Tools`,
        description: `Curated list of ${category.name.toLowerCase()} AI tools`,
        numberOfItems: tools.length,
        itemListElement: tools.slice(0, 10).map((tool, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'SoftwareApplication',
            name: tool.name,
            description: tool.description,
            url: `https://nakedifyai.com/ai/${tool.slug}`,
          },
        })),
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://nakedifyai.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Categories',
            item: 'https://nakedifyai.com/categories',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: category.name,
            item: `https://nakedifyai.com/category/${category.slug}`,
          },
        ],
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
            <FastCategoryPage category={category} tools={tools} />
          </SemanticMain>
        </div>
      </>
    );
  } catch (error) {
    console.error('Error loading category page:', error);
    notFound();
  }
}
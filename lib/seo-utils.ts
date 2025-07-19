// Enhanced SEO utilities for 2025 standards
export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
}

export function generateSEOTags(data: SEOData) {
  const baseUrl = 'https://nakedifyai.com';
  
  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords?.join(', '),
    authors: data.author ? [{ name: data.author }] : [{ name: 'NakedifyAI.com' }],
    creator: 'NakedifyAI.com',
    publisher: 'NakedifyAI.com',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: data.title,
      description: data.description,
      type: (data.type as any) || 'website',
      url: data.url ? `${baseUrl}${data.url}` : baseUrl,
      siteName: 'NakedifyAI.com',
      locale: 'en_US',
      images: data.image ? [{
        url: data.image,
        width: 1200,
        height: 630,
        alt: data.title,
        type: 'image/jpeg',
      }] : [{
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'NakedifyAI.com - Adult AI Tools Directory',
        type: 'image/jpeg',
      }],
      publishedTime: data.publishedTime,
      modifiedTime: data.modifiedTime,
      section: data.section,
    },
    twitter: {
      card: 'summary_large_image',
      site: '@nakedifyai',
      creator: '@nakedifyai',
      title: data.title,
      description: data.description,
      images: data.image ? [data.image] : [`${baseUrl}/og-image.jpg`],
    },
    alternates: {
      canonical: data.url ? `${baseUrl}${data.url}` : baseUrl,
    },
    other: {
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
      'apple-mobile-web-app-title': 'NakedifyAI',
      'application-name': 'NakedifyAI',
      'msapplication-TileColor': '#121212',
      'theme-color': '#121212',
    },
  };
}

export function generateToolSEO(tool: any) {
  const title = tool.seo_title || `${tool.name} - AI Tool Review & Guide | NakedifyAI.com`;
  const description = tool.seo_description || 
    `Discover ${tool.name}: ${tool.description.substring(0, 120)}... Read our comprehensive review, features, pricing, and user guide.`;
  
  // Generate rich keywords based on tool data
  const keywords = [
    tool.name,
    ...(tool.tags || []),
    tool.category?.replace('-', ' '),
    'AI tool',
    'artificial intelligence',
    tool.pricing,
    'review',
    'guide',
    '2025'
  ].filter(Boolean);

  return generateSEOTags({
    title,
    description,
    keywords,
    image: tool.screenshot_url,
    url: `/ai/${tool.slug}`,
    type: 'article',
    publishedTime: tool.created_at,
    modifiedTime: tool.updated_at,
    section: tool.category?.replace('-', ' '),
  });
}

export function generateCategorySEO(category: any, toolCount: number) {
  const title = `${category.name} AI Tools - Best ${category.name} Apps 2025 | NakedifyAI.com`;
  const description = `Discover ${toolCount} best ${category.name.toLowerCase()} AI tools and apps. ${category.description || `Compare features, pricing, and reviews of top ${category.name.toLowerCase()} AI solutions.`}`;
  
  const keywords = [
    `${category.name} AI tools`,
    `${category.name} AI apps`,
    `best ${category.name.toLowerCase()}`,
    category.name,
    'AI tools',
    'artificial intelligence',
    'directory',
    'comparison',
    'reviews',
    '2025'
  ];

  return generateSEOTags({
    title,
    description,
    keywords,
    url: `/category/${category.slug}`,
    type: 'website',
    section: category.name,
  });
}

export function generateBreadcrumbStructuredData(items: Array<{name: string, url: string}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://nakedifyai.com${item.url}`,
    })),
  };
}

export function generateFAQStructuredData(faqs: Array<{question: string, answer: string}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'NakedifyAI.com',
    description: 'Comprehensive directory of adult AI tools and services',
    url: 'https://nakedifyai.com',
    logo: 'https://nakedifyai.com/logo.png',
    sameAs: [
      'https://twitter.com/nakedifyai',
      'https://github.com/nakedifyai',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'contact@nakedifyai.com',
      availableLanguage: 'English',
    },
  };
}
import { MetadataRoute } from 'next';
import { getFastTools, getFastCategories } from '@/lib/supabase-fast';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://nakedifyai.com';
  
  try {
    // Get all published tools and categories
    const [tools, categories] = await Promise.all([
      getFastTools(1000),
      getFastCategories()
    ]);

    // Static pages with priority and change frequency
    const staticPages: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/categories`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      {
        url: `${baseUrl}/submit`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
    ];

    // Tool pages with dynamic priorities based on views and ratings
    const toolPages: MetadataRoute.Sitemap = tools.map((tool) => {
      // Calculate priority based on views and rating
      const viewScore = Math.min(tool.views / 10000, 0.3); // Max 0.3 from views
      const ratingScore = tool.rating ? (tool.rating / 5) * 0.2 : 0; // Max 0.2 from rating
      const basePriority = 0.8;
      const calculatedPriority = Math.min(basePriority + viewScore + ratingScore, 1.0);

      return {
        url: `${baseUrl}/ai/${tool.slug}`,
        lastModified: new Date(tool.updated_at || tool.created_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: Number(calculatedPriority.toFixed(2)),
      };
    });

    // Category pages with high priority
    const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Combine all pages and sort by priority
    const allPages = [...staticPages, ...toolPages, ...categoryPages];
    return allPages.sort((a, b) => (b.priority || 0) - (a.priority || 0));

  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return basic sitemap if database fails
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/categories`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
    ];
  }
}
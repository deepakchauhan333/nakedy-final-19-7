import { NextResponse } from 'next/server';
import { getFastTools, getFastCategories } from '@/lib/supabase-fast';

export async function GET() {
  try {
    const baseUrl = 'https://nakedifyai.com';
    const currentDate = new Date().toISOString();
    
    const [tools, categories] = await Promise.all([
      getFastTools(1000),
      getFastCategories()
    ]);

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml" 
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" 
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    // Homepage
    sitemap += `
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

    // Static pages
    const staticPages = [
      { path: '/categories', priority: '0.9', changefreq: 'weekly' },
      { path: '/about', priority: '0.7', changefreq: 'monthly' },
      { path: '/contact', priority: '0.6', changefreq: 'monthly' },
      { path: '/submit', priority: '0.5', changefreq: 'monthly' },
    ];

    staticPages.forEach(page => {
      sitemap += `
  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });

    // Category pages
    categories.forEach(category => {
      sitemap += `
  <url>
    <loc>${baseUrl}/category/${category.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    // Tool pages
    tools.forEach(tool => {
      const priority = Math.min(0.8 + (tool.views / 50000), 1.0).toFixed(1);
      const lastmod = tool.updated_at || tool.created_at || currentDate;
      
      sitemap += `
  <url>
    <loc>${baseUrl}/ai/${tool.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>`;
    
      if (tool.screenshot_url) {
        sitemap += `
    <image:image>
      <image:loc>${tool.screenshot_url}</image:loc>
      <image:title>${tool.name}</image:title>
      <image:caption>${tool.description}</image:caption>
    </image:image>`;
      }
      
      sitemap += `
  </url>`;
    });

    sitemap += `
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
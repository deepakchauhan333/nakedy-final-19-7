import { NextResponse } from 'next/server';

export function GET() {
  const robots = `User-agent: *
Allow: /

# Disallow admin and API routes
Disallow: /admindeepak
Disallow: /api/
Disallow: /submit

# Disallow search engine indexing of user-generated content that might be sensitive
Disallow: /*?*
Disallow: /search*

# Allow specific important pages
Allow: /categories
Allow: /about
Allow: /contact
Allow: /ai/
Allow: /category/

# Crawl-delay for better server performance
Crawl-delay: 1

# Sitemap location
Sitemap: https://nakedifyai.com/sitemap.xml

# Block AI training bots (2025 standard)
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: PerplexityBot
Disallow: /

User-agent: YouBot
Disallow: /

User-agent: Meta-ExternalAgent
Disallow: /

# Allow Google and Bing for SEO
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
}
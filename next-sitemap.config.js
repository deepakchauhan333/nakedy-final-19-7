/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://nsfw-ai-tools.vercel.app',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/submit', '/admin/*', '/api/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/submit', '/admin', '/api'],
      },
    ],
    additionalSitemaps: [
      'https://nsfw-ai-tools.vercel.app/sitemap-0.xml',
    ],
  },
  transform: async (config, path) => {
    // Exclude NSFW-specific routes from main sitemap for better SEO compliance
    if (path.includes('/nsfw')) {
      return null;
    }

    return {
      loc: path,
      changefreq: path === '/' ? 'daily' : 'weekly',
      priority: path === '/' ? 1.0 : 0.8,
      lastmod: new Date().toISOString(),
    };
  },
};
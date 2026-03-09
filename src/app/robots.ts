import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/profile/', '/checkout/', '/order-success/'],
    },
    sitemap: 'https://viraasat.store/sitemap.xml',
  };
}

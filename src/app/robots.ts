import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/api/',
      },
      {
        userAgent: 'Yeti',
        allow: '/',
        disallow: '/api/',
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: '/api/',
      },
    ],
    sitemap: 'https://www.kidsfever.xyz/sitemap.xml',
  };
}

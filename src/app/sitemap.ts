import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://antipyretic-dose.vercel.app';
  const lastModified = new Date();

  return [
    // Korean (default locale) - Home page
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1.0,
      alternates: {
        languages: {
          ko: baseUrl,
          en: `${baseUrl}/en`,
        },
      },
    },
    // English - Home page
    {
      url: `${baseUrl}/en`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1.0,
      alternates: {
        languages: {
          ko: baseUrl,
          en: `${baseUrl}/en`,
        },
      },
    },
    // Korean - FAQ page
    {
      url: `${baseUrl}/faq`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: {
          ko: `${baseUrl}/faq`,
          en: `${baseUrl}/en/faq`,
        },
      },
    },
    // English - FAQ page
    {
      url: `${baseUrl}/en/faq`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: {
        languages: {
          ko: `${baseUrl}/faq`,
          en: `${baseUrl}/en/faq`,
        },
      },
    },
  ];
}

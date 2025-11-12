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
    // Korean - Privacy Policy
    {
      url: `${baseUrl}/privacy`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          ko: `${baseUrl}/privacy`,
          en: `${baseUrl}/en/privacy`,
        },
      },
    },
    // English - Privacy Policy
    {
      url: `${baseUrl}/en/privacy`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          ko: `${baseUrl}/privacy`,
          en: `${baseUrl}/en/privacy`,
        },
      },
    },
    // Korean - About
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          ko: `${baseUrl}/about`,
          en: `${baseUrl}/en/about`,
        },
      },
    },
    // English - About
    {
      url: `${baseUrl}/en/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
      alternates: {
        languages: {
          ko: `${baseUrl}/about`,
          en: `${baseUrl}/en/about`,
        },
      },
    },
    // Korean - Contact
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: {
        languages: {
          ko: `${baseUrl}/contact`,
          en: `${baseUrl}/en/contact`,
        },
      },
    },
    // English - Contact
    {
      url: `${baseUrl}/en/contact`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: {
        languages: {
          ko: `${baseUrl}/contact`,
          en: `${baseUrl}/en/contact`,
        },
      },
    },
    // Korean - Terms
    {
      url: `${baseUrl}/terms`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: {
        languages: {
          ko: `${baseUrl}/terms`,
          en: `${baseUrl}/en/terms`,
        },
      },
    },
    // English - Terms
    {
      url: `${baseUrl}/en/terms`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
      alternates: {
        languages: {
          ko: `${baseUrl}/terms`,
          en: `${baseUrl}/en/terms`,
        },
      },
    },
  ];
}

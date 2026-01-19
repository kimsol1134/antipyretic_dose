import { NextResponse } from 'next/server';
import { faqDataEn } from '@/data/faq-data-en';

const SITE_URL = 'https://kidsfever.xyz';
const SITE_TITLE = "KidsFever - Children's Fever Medicine Dosage Calculator";
const SITE_DESCRIPTION =
  "Calculate accurate dosages for children's fever medicines (Tylenol, Motrin, Advil) by weight and age. Safe dosing intervals and maximum doses based on FDA and AAP guidelines.";

interface RSSItem {
  loc: string;
  title: string;
  description: string;
  pubDate: string;
  category?: string;
}

// Static pages list
const staticPages: RSSItem[] = [
  {
    loc: `${SITE_URL}/en`,
    title: "Children's Fever Medicine Dosage Calculator",
    description:
      'Calculate accurate Tylenol, Motrin, and Advil dosages based on your child\'s weight and age.',
    pubDate: new Date('2025-01-01').toUTCString(),
  },
  {
    loc: `${SITE_URL}/en/about`,
    title: 'About Our Service',
    description:
      "Learn about KidsFever children's fever medicine dosage calculator service.",
    pubDate: new Date('2025-01-01').toUTCString(),
  },
  {
    loc: `${SITE_URL}/en/faq`,
    title: 'Frequently Asked Questions',
    description:
      "Common questions and answers about children's fever medicine dosing.",
    pubDate: new Date('2025-01-01').toUTCString(),
  },
  {
    loc: `${SITE_URL}/en/contact`,
    title: 'Contact Us',
    description: 'Send us your questions about KidsFever service.',
    pubDate: new Date('2025-01-01').toUTCString(),
  },
  {
    loc: `${SITE_URL}/en/privacy`,
    title: 'Privacy Policy',
    description: 'Our privacy policy and data protection practices.',
    pubDate: new Date('2025-01-01').toUTCString(),
  },
  {
    loc: `${SITE_URL}/en/terms`,
    title: 'Terms of Service',
    description: 'Terms and conditions for using KidsFever service.',
    pubDate: new Date('2025-01-01').toUTCString(),
  },
];

// Convert FAQ items to RSS items
function getFAQItems(): RSSItem[] {
  return faqDataEn.map((faq) => ({
    loc: `${SITE_URL}/en/faq#${faq.id}`,
    title: faq.question,
    description: faq.shortAnswer,
    pubDate: new Date(faq.lastUpdated).toUTCString(),
    category: 'FAQ',
  }));
}

function generateRSS(): string {
  const buildDate = new Date().toUTCString();

  // Combine all content
  const faqItems = getFAQItems();
  const allItems = [...staticPages, ...faqItems];

  // Sort by pubDate descending
  allItems.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );

  const items = allItems
    .map(
      (item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.loc}</link>
      <description><![CDATA[${item.description}]]></description>
      <pubDate>${item.pubDate}</pubDate>
      <guid isPermaLink="true">${item.loc}</guid>${
        item.category ? `\n      <category><![CDATA[${item.category}]]></category>` : ''
      }
    </item>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title><![CDATA[${SITE_TITLE}]]></title>
    <link>${SITE_URL}/en</link>
    <description><![CDATA[${SITE_DESCRIPTION}]]></description>
    <language>en</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/en/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/opengraph-image.png</url>
      <title><![CDATA[${SITE_TITLE}]]></title>
      <link>${SITE_URL}/en</link>
    </image>
    ${items}
  </channel>
</rss>`;
}

export async function GET() {
  const rss = generateRSS();

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

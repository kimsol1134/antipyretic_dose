import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { faqData } from '@/data/faq-data';

const SITE_URL = 'https://www.kidsfever.xyz';
const SITE_TITLE = '키즈피버 - 소아 해열제 용량 계산기';
const SITE_DESCRIPTION =
  '어린이 체중과 나이에 맞는 정확한 해열제 용량을 계산해드립니다. 타이레놀, 챔프, 부루펜, 맥시부펜 등 한국에서 많이 사용되는 소아 해열제의 안전한 복용량을 확인하세요.';

interface RSSItem {
  loc: string;
  title: string;
  description: string;
  pubDate: string;
  category?: string;
}

// 정적 페이지 목록
const staticPages: RSSItem[] = [
  {
    loc: `${SITE_URL}/ko`,
    title: '소아 해열제 용량 계산기',
    description:
      '어린이 체중과 나이를 입력하면 타이레놀, 챔프, 부루펜, 맥시부펜의 정확한 복용량을 계산합니다.',
    pubDate: new Date('2025-01-01').toUTCString(),
  },
  {
    loc: `${SITE_URL}/ko/about`,
    title: '서비스 소개',
    description: '키즈피버 소아 해열제 용량 계산기 서비스에 대해 알아보세요.',
    pubDate: new Date('2025-01-01').toUTCString(),
  },
  {
    loc: `${SITE_URL}/ko/faq`,
    title: '자주 묻는 질문',
    description: '소아 해열제 복용과 용량 계산에 관한 자주 묻는 질문과 답변입니다.',
    pubDate: new Date('2025-01-01').toUTCString(),
  },
  {
    loc: `${SITE_URL}/ko/contact`,
    title: '문의하기',
    description: '키즈피버 서비스에 대한 문의사항을 보내주세요.',
    pubDate: new Date('2025-01-01').toUTCString(),
  },
  {
    loc: `${SITE_URL}/ko/privacy`,
    title: '개인정보처리방침',
    description: '키즈피버의 개인정보 처리 및 보호에 관한 정책입니다.',
    pubDate: new Date('2025-01-01').toUTCString(),
  },
  {
    loc: `${SITE_URL}/ko/terms`,
    title: '이용약관',
    description: '키즈피버 서비스 이용에 관한 약관입니다.',
    pubDate: new Date('2025-01-01').toUTCString(),
  },
];

// HTML 태그 제거 함수 (BR 태그는 개행으로 변환)
function stripHTML(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// 블로그 포스트 파싱
function getBlogPosts(): RSSItem[] {
  try {
    const blogPath = join(
      process.cwd(),
      'content/blog/projects/antipyretic-dose-calculator.md'
    );
    const content = readFileSync(blogPath, 'utf-8');

    // 간단한 frontmatter 파싱
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) return [];

    const frontmatter = frontmatterMatch[1];
    const titleMatch = frontmatter.match(/title:\s*(.+)/);
    const dateMatch = frontmatter.match(/date:\s*(.+)/);
    const excerptMatch = frontmatter.match(/excerpt:\s*(.+)/);

    if (!titleMatch || !dateMatch) return [];

    return [
      {
        loc: `${SITE_URL}/ko/blog/antipyretic-dose-calculator`,
        title: titleMatch[1].trim(),
        description: excerptMatch
          ? excerptMatch[1].trim()
          : '의료 안전성 중심 Next.js 애플리케이션',
        pubDate: new Date(dateMatch[1].trim()).toUTCString(),
        category: 'Blog',
      },
    ];
  } catch (error) {
    console.error('Error reading blog post:', error);
    return [];
  }
}

// FAQ 항목을 RSS 아이템으로 변환
function getFAQItems(): RSSItem[] {
  return faqData.map((faq) => ({
    loc: `${SITE_URL}/ko/faq#${faq.id}`,
    title: faq.question,
    description: faq.shortAnswer,
    pubDate: new Date(faq.lastUpdated).toUTCString(),
    category: 'FAQ',
  }));
}

function generateRSS(): string {
  const buildDate = new Date().toUTCString();

  // 모든 콘텐츠 합치기
  const blogPosts = getBlogPosts();
  const faqItems = getFAQItems();
  const allItems = [...staticPages, ...blogPosts, ...faqItems];

  // pubDate 기준 내림차순 정렬
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
    <link>${SITE_URL}</link>
    <description><![CDATA[${SITE_DESCRIPTION}]]></description>
    <language>ko</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/opengraph-image.png</url>
      <title><![CDATA[${SITE_TITLE}]]></title>
      <link>${SITE_URL}</link>
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

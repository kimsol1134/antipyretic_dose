import { NextResponse } from 'next/server';

const SITE_URL = 'https://www.kidsfever.xyz';
const SITE_TITLE = '키즈피버 - 소아 해열제 용량 계산기';
const SITE_DESCRIPTION =
  '어린이 체중과 나이에 맞는 정확한 해열제 용량을 계산해드립니다. 타이레놀, 챔프, 부루펜, 맥시부펜 등 한국에서 많이 사용되는 소아 해열제의 안전한 복용량을 확인하세요.';

interface PageInfo {
  loc: string;
  title: string;
  description: string;
  lastmod: string;
}

const pages: PageInfo[] = [
  {
    loc: `${SITE_URL}/ko`,
    title: '소아 해열제 용량 계산기',
    description:
      '어린이 체중과 나이를 입력하면 타이레놀, 챔프, 부루펜, 맥시부펜의 정확한 복용량을 계산합니다.',
    lastmod: new Date().toISOString(),
  },
  {
    loc: `${SITE_URL}/ko/about`,
    title: '서비스 소개',
    description: '키즈피버 소아 해열제 용량 계산기 서비스에 대해 알아보세요.',
    lastmod: new Date().toISOString(),
  },
  {
    loc: `${SITE_URL}/ko/faq`,
    title: '자주 묻는 질문',
    description: '소아 해열제 복용과 용량 계산에 관한 자주 묻는 질문과 답변입니다.',
    lastmod: new Date().toISOString(),
  },
  {
    loc: `${SITE_URL}/ko/contact`,
    title: '문의하기',
    description: '키즈피버 서비스에 대한 문의사항을 보내주세요.',
    lastmod: new Date().toISOString(),
  },
  {
    loc: `${SITE_URL}/ko/privacy`,
    title: '개인정보처리방침',
    description: '키즈피버의 개인정보 처리 및 보호에 관한 정책입니다.',
    lastmod: new Date().toISOString(),
  },
  {
    loc: `${SITE_URL}/ko/terms`,
    title: '이용약관',
    description: '키즈피버 서비스 이용에 관한 약관입니다.',
    lastmod: new Date().toISOString(),
  },
];

function generateRSS(): string {
  const pubDate = new Date().toUTCString();

  const items = pages
    .map(
      (page) => `
    <item>
      <title><![CDATA[${page.title}]]></title>
      <link>${page.loc}</link>
      <description><![CDATA[${page.description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${page.loc}</guid>
    </item>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${SITE_TITLE}]]></title>
    <link>${SITE_URL}</link>
    <description><![CDATA[${SITE_DESCRIPTION}]]></description>
    <language>ko</language>
    <lastBuildDate>${pubDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
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

import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const metadata: Metadata = {
  title: '어린이 해열제 복용량 계산기 | 타이레놀·챔프·부루펜 용량표 (체중별)',
  description:
    '어린이 해열제 복용량 계산기 | 체중별·나이별 타이레놀, 챔프, 부루펜, 맥시부펜 정확한 용량 즉시 계산. 안전한 복용 간격과 최대 용량 확인 (식약처 기준)',
  metadataBase: new URL('https://antipyretic-dose.vercel.app'),
  category: 'medical',
  creator: 'pinecone',
  publisher: 'pinecone',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: 'https://antipyretic-dose.vercel.app',
  },
  verification: {
    google: 'P43T628mnEgd-vtZnh8tPdOizYwrH_d688uJ4attLgY',
    other: {
      'naver-site-verification': '05b0dc19249d5a5e6d42f0832ab3a6671ed8bc0d',
      'google-adsense-account': 'ca-pub-5648788643644962',
    },
  },
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: '어린이 해열제 복용량 계산기 | 타이레놀·챔프·부루펜 용량표',
    description:
      '체중별·나이별 타이레놀, 챔프, 부루펜, 맥시부펜 정확한 용량 즉시 계산. 안전한 복용 간격과 최대 용량 확인 (식약처 기준)',
    url: 'https://antipyretic-dose.vercel.app',
    siteName: '어린이 해열제 복용량 계산기',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: '어린이 해열제 복용량 계산기',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '어린이 해열제 복용량 계산기 | 타이레놀·챔프·부루펜 용량표',
    description:
      '체중별·나이별 타이레놀, 챔프, 부루펜, 맥시부펜 정확한 용량 즉시 계산. 안전한 복용 간격과 최대 용량 확인 (식약처 기준)',
    images: ['/opengraph-image.png'],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': ['MedicalWebPage', 'WebApplication'],
    name: '어린이 해열제 복용량 계산기',
    alternateName: '소아 해열제 용량 계산기',
    description:
      '체중별·나이별 타이레놀, 챔프, 부루펜, 맥시부펜 정확한 복용량(mL)을 즉시 계산. 안전한 복용 간격과 최대 용량 확인 (식약처 기준)',
    url: 'https://antipyretic-dose.vercel.app',
    inLanguage: 'ko-KR',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web',
    keywords: [
      '어린이 해열제',
      '타이레놀 복용량',
      '챔프 시럽',
      '부루펜 용량',
      '맥시부펜 계산',
      '체중별 해열제',
      '소아 해열제',
      '아기 해열제',
      '해열제 계산기',
    ],
    medicalAudience: {
      '@type': 'MedicalAudience',
      audienceType: '부모 및 보호자',
    },
    author: {
      '@type': 'Person',
      name: 'pinecone',
      url: 'https://litt.ly/solkim',
    },
    publisher: {
      '@type': 'Person',
      name: 'pinecone',
    },
    datePublished: '2025-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    isPartOf: {
      '@type': 'WebSite',
      name: '어린이 해열제 복용량 계산기',
      url: 'https://antipyretic-dose.vercel.app',
    },
    about: {
      '@type': 'MedicalEntity',
      name: '어린이 해열제 복용량 계산',
      description:
        '타이레놀, 챔프, 부루펜, 맥시부펜 등 주요 어린이 해열제의 체중별, 나이별 정확한 복용량 계산',
    },
    citation: {
      '@type': 'CreativeWork',
      name: '식품의약품안전처 의약품개요정보(e약은요)',
      url: 'https://nedrug.mfds.go.kr',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'KRW',
    },
  };

  return (
    <html lang="ko">
      <body className="bg-gray-50 font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}

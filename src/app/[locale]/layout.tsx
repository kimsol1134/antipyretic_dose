import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Analytics } from '@vercel/analytics/next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { routing } from '@/i18n/routing';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';
import Footer from '@/app/components/Footer';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Root metadataBase 설정
const metadataBase = new URL('https://kidsfever.xyz');

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  // 한국어 기본 메타데이터 (영어는 나중에 추가)
  if (locale === 'ko') {
    return {
      title: '어린이 해열제 복용량 계산기 | 타이레놀·챔프·부루펜 용량표 (체중별)',
      description:
        '의사가 만든 어린이 해열제 복용량 계산기 | 체중별·나이별 타이레놀, 챔프, 부루펜, 맥시부펜 정확한 용량 즉시 계산. 안전한 복용 간격과 최대 용량 확인 (식약처 기준)',
      metadataBase,
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
        canonical: 'https://kidsfever.xyz',
        languages: {
          ko: 'https://kidsfever.xyz',
          en: 'https://kidsfever.xyz/en',
        },
      },
      verification: {
        google: 'P43T628mnEgd-vtZnh8tPdOizYwrH_d688uJ4attLgY',
        other: {
          'naver-site-verification': '05b0dc19249d5a5e6d42f0832ab3a6671ed8bc0d',
          'google-adsense-account': 'ca-pub-5648788643644962',
        },
      },
      icons: {
        icon: [
          { url: '/icon.png', sizes: '512x512', type: 'image/png' },
          { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
          { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
        ],
        apple: [
          { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
        ],
      },
      openGraph: {
        title: '어린이 해열제 복용량 계산기 | 타이레놀·챔프·부루펜 용량표',
        description:
          '의사가 만든 안전한 계산기 | 체중별·나이별 타이레놀, 챔프, 부루펜, 맥시부펜 정확한 용량 즉시 계산. 안전한 복용 간격과 최대 용량 확인 (식약처 기준)',
        url: 'https://kidsfever.xyz',
        siteName: '어린이 해열제 복용량 계산기',
        locale: 'ko_KR',
        type: 'website',
        images: [
          {
            url: 'https://kidsfever.xyz/opengraph-image.png',
            width: 1536,
            height: 768,
            alt: '어린이 해열제 복용량 계산기',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: '어린이 해열제 복용량 계산기 | 타이레놀·챔프·부루펜 용량표',
        description:
          '의사가 만든 안전한 계산기 | 체중별·나이별 타이레놀, 챔프, 부루펜, 맥시부펜 정확한 용량 즉시 계산. 안전한 복용 간격과 최대 용량 확인 (식약처 기준)',
        images: ['https://kidsfever.xyz/opengraph-image.png'],
      },
    };
  }

  // 영어 메타데이터
  return {
    title:
      "Children's Fever Medicine Dosage Calculator | Tylenol, Motrin, Advil Dosing Chart by Weight",
    description:
      "Accurate children's fever medicine dosage calculator by weight and age. Calculate Tylenol (acetaminophen), Motrin, and Advil (ibuprofen) doses instantly. Safe dosing intervals and maximum doses based on FDA and AAP guidelines.",
    metadataBase,
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
      canonical: 'https://kidsfever.xyz/en',
      languages: {
        ko: 'https://kidsfever.xyz',
        en: 'https://kidsfever.xyz/en',
      },
    },
    verification: {
      google: 'P43T628mnEgd-vtZnh8tPdOizYwrH_d688uJ4attLgY',
      other: {
        'naver-site-verification': '05b0dc19249d5a5e6d42f0832ab3a6671ed8bc0d',
        'google-adsense-account': 'ca-pub-5648788643644962',
      },
    },
    icons: {
      icon: [
        { url: '/icon.png', sizes: '512x512', type: 'image/png' },
        { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
    openGraph: {
      title:
        "Children's Fever Medicine Dosage Calculator | Tylenol, Motrin, Advil Dosing Chart",
      description:
        "Calculate accurate dosages for children's fever medicines by weight and age. Instant Tylenol, Motrin, and Advil dose calculation with safe dosing intervals (FDA/AAP guidelines).",
      url: 'https://kidsfever.xyz/en',
      siteName: "Children's Fever Medicine Dosage Calculator",
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: 'https://kidsfever.xyz/opengraph-image.png',
          width: 1536,
          height: 768,
          alt: "Children's Fever Medicine Dosage Calculator",
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title:
        "Children's Fever Medicine Dosage Calculator | Tylenol, Motrin, Advil Dosing Chart",
      description:
        "Calculate accurate dosages for children's fever medicines by weight and age. Instant Tylenol, Motrin, and Advil dose calculation with safe dosing intervals (FDA/AAP guidelines).",
      images: ['https://kidsfever.xyz/opengraph-image.png'],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // locale 유효성 검증
  if (!routing.locales.includes(locale as 'ko' | 'en')) {
    notFound();
  }

  const messages = await getMessages();

  // 한국어용 구조화 데이터
  const structuredData =
    locale === 'ko'
      ? {
          '@context': 'https://schema.org',
          '@type': ['MedicalWebPage', 'WebApplication'],
          name: '어린이 해열제 복용량 계산기',
          alternateName: '소아 해열제 용량 계산기',
          description:
            '의사가 만든 안전한 계산기 | 체중별·나이별 타이레놀, 챔프, 부루펜, 맥시부펜 정확한 복용량(mL)을 즉시 계산. 안전한 복용 간격과 최대 용량 확인 (식약처 기준)',
          url: 'https://kidsfever.xyz',
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
            name: 'Dr. pinecone (의사)',
            jobTitle: '의사',
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
            url: 'https://kidsfever.xyz',
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
        }
      : {
          '@context': 'https://schema.org',
          '@type': ['MedicalWebPage', 'WebApplication'],
          name: "Children's Fever Medicine Dosage Calculator",
          alternateName: 'Pediatric Fever Reducer Dosage Calculator',
          description:
            "Calculate accurate dosages for children's fever medicines (Tylenol, Motrin, Advil) by weight and age. Instant dose calculation with safe dosing intervals and maximum doses based on FDA and AAP guidelines.",
          url: 'https://kidsfever.xyz/en',
          inLanguage: 'en-US',
          applicationCategory: 'HealthApplication',
          operatingSystem: 'Web',
          keywords: [
            "children's fever medicine",
            'pediatric fever reducer',
            'Tylenol dosage',
            'acetaminophen dosing',
            'Motrin dosage',
            'Advil dosage',
            'ibuprofen dosing',
            'fever medicine calculator',
            'pediatric dosage calculator',
            'child fever medicine',
            'infant fever reducer',
            'dosage by weight',
            'FDA guidelines',
            'AAP recommendations',
          ],
          medicalAudience: {
            '@type': 'MedicalAudience',
            audienceType: 'Parents and Caregivers',
          },
          author: {
            '@type': 'Person',
            name: 'Dr. pinecone (의사)',
            jobTitle: '의사',
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
            name: "Children's Fever Medicine Dosage Calculator",
            url: 'https://kidsfever.xyz',
          },
          about: {
            '@type': 'MedicalEntity',
            name: "Children's Fever Medicine Dosage Calculation",
            description:
              "Accurate dosage calculation for major children's fever reducers including Tylenol (acetaminophen), Motrin, and Advil (ibuprofen) based on child's weight and age",
          },
          citation: [
            {
              '@type': 'CreativeWork',
              name: 'FDA Drug Information',
              url: 'https://www.fda.gov',
            },
            {
              '@type': 'CreativeWork',
              name: 'American Academy of Pediatrics (AAP) Guidelines',
              url: 'https://www.aap.org',
            },
          ],
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        };

  // WebSite 스키마 (사이트 전체 정보 - E-A-T 강화)
  const websiteSchema =
    locale === 'ko'
      ? {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          '@id': 'https://kidsfever.xyz/#website',
          url: 'https://kidsfever.xyz',
          name: '어린이 해열제 복용량 계산기',
          description:
            '의사가 만든 어린이 해열제 복용량 계산기 - 타이레놀, 챔프, 부루펜, 맥시부펜 용량표',
          publisher: {
            '@type': 'Person',
            '@id': 'https://kidsfever.xyz/#author',
            name: 'Dr. pinecone',
            jobTitle: '의사',
            url: 'https://litt.ly/solkim',
          },
          inLanguage: ['ko-KR', 'en-US'],
          copyrightYear: 2025,
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://kidsfever.xyz/faq?q={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
          },
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          '@id': 'https://kidsfever.xyz/#website',
          url: 'https://kidsfever.xyz',
          name: "Children's Fever Medicine Dosage Calculator",
          description:
            "Doctor-created children's fever medicine dosage calculator - Tylenol, Motrin, Advil dosing chart",
          publisher: {
            '@type': 'Person',
            '@id': 'https://kidsfever.xyz/#author',
            name: 'Dr. pinecone',
            jobTitle: 'Physician',
            url: 'https://litt.ly/solkim',
          },
          inLanguage: ['ko-KR', 'en-US'],
          copyrightYear: 2025,
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate:
                'https://kidsfever.xyz/en/faq?q={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
          },
        };

  // Organization/Person 스키마 (저자 정보 - E-A-T 강화)
  const authorSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://kidsfever.xyz/#author',
    name: 'Dr. pinecone',
    alternateName: locale === 'ko' ? '솔김 의사' : 'Dr. Sol Kim',
    jobTitle: locale === 'ko' ? '의사' : 'Physician',
    url: 'https://litt.ly/solkim',
    sameAs: ['https://litt.ly/solkim'],
    knowsAbout:
      locale === 'ko'
        ? ['소아과', '소아 약물 투여', '해열제', '아세트아미노펜', '이부프로펜']
        : [
            'Pediatrics',
            'Pediatric Pharmacology',
            'Antipyretics',
            'Acetaminophen',
            'Ibuprofen',
          ],
  };

  return (
    <html lang={locale}>
      <head>
        {/* 네이버 검색 최적화를 위한 추가 메타 태그 */}
        <meta property="og:image:width" content="1536" />
        <meta property="og:image:height" content="768" />
        {/* PWA 지원을 위한 메타 태그 */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta
          name="apple-mobile-web-app-title"
          content={
            locale === 'ko'
              ? '해열제 계산기'
              : 'Fever Med Calculator'
          }
        />
        <link rel="manifest" href="/manifest.webmanifest" />
        {/* 네이버 검색 최적화: shortcut icon (최우선 순위, 절대 경로) */}
        <link rel="shortcut icon" href="https://kidsfever.xyz/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />
        {/* RSS Feed Links */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title={
            locale === 'ko'
              ? '키즈피버 RSS 피드'
              : 'KidsFever RSS Feed'
          }
          href={locale === 'ko' ? '/rss.xml' : '/en/rss.xml'}
        />
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5648788643644962"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-gray-50 font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema) }}
        />
        <NextIntlClientProvider messages={messages}>
          <header className="sticky top-0 z-50 bg-white shadow-sm">
            <div className="container mx-auto px-4 py-3 flex justify-end">
              <LanguageSwitcher />
            </div>
          </header>
          {children}
          <Footer />
        </NextIntlClientProvider>
        <Analytics />
        <GoogleAnalytics gaId="G-BPSSHZSL1Z" />
      </body>
    </html>
  );
}

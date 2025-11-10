import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Analytics } from '@vercel/analytics/next';
import { routing } from '@/i18n/routing';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

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
        languages: {
          ko: 'https://antipyretic-dose.vercel.app',
          en: 'https://antipyretic-dose.vercel.app/en',
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
  }

  // 영어 메타데이터 (TODO: 영어 번역 추가 필요)
  return {
    title: "Children's Fever Medicine Dosage Calculator",
    description:
      "Calculate accurate dosages for children's fever medicines (Tylenol, Motrin, Advil) by weight and age. Based on FDA and AAP guidelines.",
    metadataBase: new URL('https://antipyretic-dose.vercel.app'),
    alternates: {
      canonical: 'https://antipyretic-dose.vercel.app/en',
      languages: {
        ko: 'https://antipyretic-dose.vercel.app',
        en: 'https://antipyretic-dose.vercel.app/en',
      },
    },
    openGraph: {
      locale: 'en_US',
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
        }
      : {
          '@context': 'https://schema.org',
          '@type': ['MedicalWebPage', 'WebApplication'],
          name: "Children's Fever Medicine Dosage Calculator",
          description:
            "Calculate accurate dosages for children's fever medicines by weight and age.",
          url: 'https://antipyretic-dose.vercel.app/en',
          inLanguage: 'en-US',
        };

  return (
    <html lang={locale}>
      <body className="bg-gray-50 font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}

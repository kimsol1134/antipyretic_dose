import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Analytics } from '@vercel/analytics/next';
import { routing } from '@/i18n/routing';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';
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

  // 영어 메타데이터
  return {
    title:
      "Children's Fever Medicine Dosage Calculator | Tylenol, Motrin, Advil Dosing Chart by Weight",
    description:
      "Accurate children's fever medicine dosage calculator by weight and age. Calculate Tylenol (acetaminophen), Motrin, and Advil (ibuprofen) doses instantly. Safe dosing intervals and maximum doses based on FDA and AAP guidelines.",
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
      canonical: 'https://antipyretic-dose.vercel.app/en',
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
      title:
        "Children's Fever Medicine Dosage Calculator | Tylenol, Motrin, Advil Dosing Chart",
      description:
        "Calculate accurate dosages for children's fever medicines by weight and age. Instant Tylenol, Motrin, and Advil dose calculation with safe dosing intervals (FDA/AAP guidelines).",
      url: 'https://antipyretic-dose.vercel.app/en',
      siteName: "Children's Fever Medicine Dosage Calculator",
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: '/opengraph-image.png',
          width: 1200,
          height: 630,
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
      images: ['/opengraph-image.png'],
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
          alternateName: 'Pediatric Fever Reducer Dosage Calculator',
          description:
            "Calculate accurate dosages for children's fever medicines (Tylenol, Motrin, Advil) by weight and age. Instant dose calculation with safe dosing intervals and maximum doses based on FDA and AAP guidelines.",
          url: 'https://antipyretic-dose.vercel.app/en',
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
            name: "Children's Fever Medicine Dosage Calculator",
            url: 'https://antipyretic-dose.vercel.app',
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

  return (
    <html lang={locale}>
      <body className="bg-gray-50 font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <NextIntlClientProvider messages={messages}>
          <header className="sticky top-0 z-50 bg-white shadow-sm">
            <div className="container mx-auto px-4 py-3 flex justify-end">
              <LanguageSwitcher />
            </div>
          </header>
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}

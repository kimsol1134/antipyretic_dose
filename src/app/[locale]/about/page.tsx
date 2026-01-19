import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (locale === 'ko') {
    return {
      title: '서비스 소개 | 어린이 해열제 복용량 계산기',
      description:
        '어린이 해열제 복용량 계산기의 미션, 주요 기능, 안전성, 제작자 정보. 식약처 기준 정확한 복용량 계산 도구.',
      keywords: [
        '어린이 해열제 계산기 소개',
        '타이레놀 복용량 계산기',
        '부루펜 용량 계산',
        '식약처 기준 해열제',
        '소아 해열제 안전성',
        '해열제 앱 개발자',
      ],
      robots: {
        index: true,
        follow: true,
      },
      alternates: {
        canonical: 'https://kidsfever.xyz/about',
        languages: {
          ko: 'https://kidsfever.xyz/about',
          en: 'https://kidsfever.xyz/en/about',
        },
      },
      openGraph: {
        title: '서비스 소개 | 어린이 해열제 복용량 계산기',
        description:
          '어린이 해열제 복용량 계산기의 미션, 주요 기능, 안전성, 제작자 정보',
        url: 'https://kidsfever.xyz/about',
        siteName: '어린이 해열제 복용량 계산기',
        locale: 'ko_KR',
        type: 'website',
        images: [
          {
            url: 'https://kidsfever.xyz/opengraph-image.png',
            width: 1200,
            height: 630,
            alt: '서비스 소개 | 어린이 해열제 복용량 계산기',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: '서비스 소개 | 어린이 해열제 복용량 계산기',
        description:
          '어린이 해열제 복용량 계산기의 미션, 주요 기능, 안전성, 제작자 정보',
        images: ['https://kidsfever.xyz/opengraph-image.png'],
      },
    };
  }

  return {
    title: 'About Us | Children\'s Fever Medicine Dosage Calculator',
    description:
      'Learn about Children\'s Fever Medicine Dosage Calculator: our mission, key features, safety standards, and creator information. FDA-based accurate dosage calculation tool.',
    keywords: [
      'children fever medicine calculator about',
      'tylenol dosage calculator',
      'motrin dose calculator',
      'FDA based dosing',
      'pediatric fever reducer safety',
      'medication calculator features',
    ],
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: 'https://kidsfever.xyz/en/about',
      languages: {
        ko: 'https://kidsfever.xyz/about',
        en: 'https://kidsfever.xyz/en/about',
      },
    },
    openGraph: {
      title: 'About Us | Children\'s Fever Medicine Dosage Calculator',
      description:
        'Learn about our mission, key features, safety standards, and creator information. FDA-based accurate dosage calculation tool.',
      url: 'https://kidsfever.xyz/en/about',
      siteName: "Children's Fever Medicine Dosage Calculator",
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: 'https://kidsfever.xyz/opengraph-image.png',
          width: 1200,
          height: 630,
          alt: 'About Us | Children\'s Fever Medicine Dosage Calculator',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'About Us | Children\'s Fever Medicine Dosage Calculator',
      description:
        'Learn about our mission, key features, safety standards, and creator information. FDA-based accurate dosage calculation tool.',
      images: ['https://kidsfever.xyz/opengraph-image.png'],
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('about');

  return (
    <main className="container mx-auto max-w-4xl p-4 pt-8 sm:pt-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-4">
        <Link href={locale === 'en' ? '/en' : '/'} className="hover:underline">
          {t('breadcrumb.home')}
        </Link>
        <span className="mx-2">›</span>
        <span>{t('breadcrumb.about')}</span>
      </nav>

      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          {t('title')}
        </h1>
        <p className="mt-3 text-base text-gray-600">{t('subtitle')}</p>
      </header>

      {/* Content */}
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100 space-y-6">
        {/* Mission */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t('sections.mission.title')}
          </h2>
          <p className="text-gray-700">{t('sections.mission.content')}</p>
        </section>

        {/* Features */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t('sections.features.title')}
          </h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
            {t.raw('sections.features.items').map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Safety */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t('sections.safety.title')}
          </h2>
          <p className="text-gray-700">{t('sections.safety.content')}</p>
        </section>

        {/* Disclaimer */}
        <section className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t('sections.disclaimer.title')}
          </h2>
          <p className="text-gray-700">{t('sections.disclaimer.content')}</p>
        </section>

        {/* Creator */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t('sections.creator.title')}
          </h2>
          <div className="flex items-center gap-4">
            <Image
              src="/images/profile.png"
              alt="pinecone profile"
              width={64}
              height={64}
              className="rounded-full"
            />
            <div>
              <p className="text-gray-700 mb-2">
                {t('sections.creator.content')}
              </p>
              <a
                href={t('sections.creator.link')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-semibold"
              >
                {t('sections.creator.link')} →
              </a>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t('sections.opensource.title')}
          </h2>
          <p className="text-gray-700">{t('sections.opensource.content')}</p>
        </section>
      </div>

      {/* CTA */}
      <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {locale === 'en' ? 'Try the Calculator' : '계산기 사용하기'}
        </h2>
        <p className="text-gray-700 mb-4">
          {locale === 'en'
            ? 'Calculate accurate dosages for your child now'
            : '지금 바로 아이의 정확한 복용량을 계산하세요'}
        </p>
        <Link
          href={locale === 'en' ? '/en' : '/'}
          className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          {locale === 'en' ? 'Go to Calculator →' : '계산기로 이동 →'}
        </Link>
      </div>
    </main>
  );
}

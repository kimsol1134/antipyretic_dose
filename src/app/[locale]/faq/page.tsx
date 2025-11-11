import { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import FAQList from '@/app/components/faq/FAQList';
import { faqData, categoryLabels } from '@/data/faq-data';
import { faqDataEn, categoryLabelsEn } from '@/data/faq-data-en';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (locale === 'ko') {
    return {
      title: '어린이 해열제 자주 묻는 질문 (FAQ) | 타이레놀·부루펜 복용 가이드',
      description:
        '타이레놀 복용 간격, 부루펜 차이, 해열제 교차 복용 등 부모들이 가장 궁금해하는 어린이 해열제 질문에 식약처 기준 답변을 확인하세요.',
      keywords: [
        '타이레놀 복용 간격',
        '부루펜 차이',
        '해열제 교차 복용',
        '아기 열 몇 도',
        '해열제 FAQ',
      ],
      openGraph: {
        title: '어린이 해열제 자주 묻는 질문 (FAQ)',
        description:
          '타이레놀, 부루펜 등 어린이 해열제 복용법 완벽 가이드 (식약처 기준)',
        url: 'https://antipyretic-dose.vercel.app/faq',
      },
    };
  }

  // English metadata
  return {
    title: "Children's Fever Medicine FAQ | Tylenol & Motrin Dosing Guide",
    description:
      "Get answers to common questions about children's fever medicine: Tylenol dosing intervals, Motrin vs Advil differences, alternating medicines, and more (FDA/AAP guidelines).",
    keywords: [
      'tylenol dosing interval',
      'motrin vs advil',
      'alternating fever medicine',
      'when to give fever medicine',
      'fever medicine faq',
    ],
    openGraph: {
      title: "Children's Fever Medicine FAQ",
      description:
        'Complete guide to children\'s Tylenol and Motrin dosing (FDA/AAP guidelines)',
      url: 'https://antipyretic-dose.vercel.app/en/faq',
    },
  };
}

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('faqPage');

  // Load appropriate FAQ data based on locale
  const currentFaqData = locale === 'en' ? faqDataEn : faqData;
  const currentCategoryLabels = locale === 'en' ? categoryLabelsEn : categoryLabels;
  const baseUrl =
    locale === 'en'
      ? 'https://antipyretic-dose.vercel.app/en'
      : 'https://antipyretic-dose.vercel.app';

  // FAQPage 구조화 데이터
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: currentFaqData.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.shortAnswer,
      },
    })),
  };

  // Breadcrumb 구조화 데이터
  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('breadcrumb.home'),
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('breadcrumb.faq'),
        item: `${baseUrl}/faq`,
      },
    ],
  };

  return (
    <>
      {/* 구조화 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

      <main className="container mx-auto max-w-4xl p-4 pt-8 sm:pt-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-4">
          <Link
            href={locale === 'en' ? '/en' : '/'}
            className="hover:underline"
          >
            {t('breadcrumb.home')}
          </Link>
          <span className="mx-2">›</span>
          <span>{t('breadcrumb.faq')}</span>
        </nav>

        {/* 헤더 */}
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            {t('title')}
          </h1>
          <p className="mt-3 text-base text-gray-600">{t('subtitle')}</p>
          <p className="mt-4 text-xs text-gray-500 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            {t('disclaimer')}
          </p>
        </header>

        {/* FAQ 리스트 */}
        <FAQList faqs={currentFaqData} categoryLabels={currentCategoryLabels} />

        {/* CTA */}
        <section className="mt-12 bg-blue-50 p-6 rounded-lg text-center border border-blue-200">
          <h2 className="text-xl font-bold mb-4 text-gray-900">
            {t('cta.title')}
          </h2>
          <p className="text-gray-600 mb-4">{t('cta.description')}</p>
          <Link
            href={locale === 'en' ? '/en' : '/'}
            className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {t('cta.button')}
          </Link>
        </section>

        {/* 추가 안내 */}
        <footer className="mt-12 text-center text-xs text-gray-500">
          <p>{t('footer.info')}</p>
          <p className="mt-2">{t('footer.lastUpdated')}</p>
        </footer>
      </main>
    </>
  );
}

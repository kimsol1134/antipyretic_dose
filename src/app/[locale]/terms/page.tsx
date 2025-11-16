import { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (locale === 'ko') {
    return {
      title: '이용약관 | 어린이 해열제 복용량 계산기',
      description:
        '어린이 해열제 복용량 계산기 이용약관. 서비스 사용 조건, 의료 면책 조항, 책임의 제한, 개인정보 보호 등.',
      robots: {
        index: true,
        follow: true,
      },
      alternates: {
        canonical: 'https://www.kidsfever.xyz/terms',
        languages: {
          ko: 'https://www.kidsfever.xyz/terms',
          en: 'https://www.kidsfever.xyz/en/terms',
        },
      },
    };
  }

  return {
    title: 'Terms of Service | Children\'s Fever Medicine Dosage Calculator',
    description:
      'Terms of Service for Children\'s Fever Medicine Dosage Calculator. Service conditions, medical disclaimer, limitation of liability, privacy, and more.',
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: 'https://www.kidsfever.xyz/en/terms',
      languages: {
        ko: 'https://www.kidsfever.xyz/terms',
        en: 'https://www.kidsfever.xyz/en/terms',
      },
    },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('terms');

  return (
    <main className="container mx-auto max-w-4xl p-4 pt-8 sm:pt-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-4">
        <Link href={locale === 'en' ? '/en' : '/'} className="hover:underline">
          {t('breadcrumb.home')}
        </Link>
        <span className="mx-2">›</span>
        <span>{t('breadcrumb.terms')}</span>
      </nav>

      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          {t('title')}
        </h1>
        <p className="mt-3 text-base text-gray-600">{t('subtitle')}</p>
        <p className="mt-2 text-sm text-gray-500">{t('lastUpdated')}</p>
      </header>

      {/* Content */}
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100 space-y-6">
        {/* 1. Acceptance */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t('sections.acceptance.title')}
          </h2>
          <p className="text-gray-700">{t('sections.acceptance.content')}</p>
        </section>

        {/* 2. Service */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t('sections.service.title')}
          </h2>
          <p className="text-gray-700">{t('sections.service.content')}</p>
        </section>

        {/* 3. Medical Disclaimer */}
        <section className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t('sections.medical.title')}
          </h2>
          <p className="text-gray-700 mb-2">{t('sections.medical.intro')}</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
            {t.raw('sections.medical.items').map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>

        {/* 4. Accuracy */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t('sections.accuracy.title')}
          </h2>
          <p className="text-gray-700">{t('sections.accuracy.content')}</p>
        </section>

        {/* 5. Liability */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t('sections.liability.title')}
          </h2>
          <p className="text-gray-700 mb-2">{t('sections.liability.content')}</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
            {t.raw('sections.liability.items').map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>

        {/* 6. Use Terms */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t('sections.useTerms.title')}
          </h2>
          <p className="text-gray-700 mb-2">{t('sections.useTerms.intro')}</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
            {t.raw('sections.useTerms.items').map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>

        {/* 7. Privacy */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t('sections.privacy.title')}
          </h2>
          <p className="text-gray-700">{t('sections.privacy.content')}</p>
        </section>

        {/* 8. Advertising */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t('sections.advertising.title')}
          </h2>
          <p className="text-gray-700">{t('sections.advertising.content')}</p>
        </section>

        {/* 9. Intellectual Property */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t('sections.intellectual.title')}
          </h2>
          <p className="text-gray-700">{t('sections.intellectual.content')}</p>
        </section>

        {/* 10. Changes */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t('sections.changes.title')}
          </h2>
          <p className="text-gray-700">{t('sections.changes.content')}</p>
        </section>

        {/* 11. Termination */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t('sections.termination.title')}
          </h2>
          <p className="text-gray-700">{t('sections.termination.content')}</p>
        </section>

        {/* 12. Law */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t('sections.law.title')}
          </h2>
          <p className="text-gray-700">{t('sections.law.content')}</p>
        </section>

        {/* 13. Contact */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t('sections.contact.title')}
          </h2>
          <p className="text-gray-700">{t('sections.contact.content')}</p>
        </section>
      </div>

      {/* Back to Home */}
      <div className="mt-8 text-center">
        <Link
          href={locale === 'en' ? '/en' : '/'}
          className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          {t('breadcrumb.home')} ←
        </Link>
      </div>
    </main>
  );
}

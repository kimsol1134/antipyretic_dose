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
      title: '개인정보 처리방침 | 어린이 해열제 복용량 계산기',
      description:
        '어린이 해열제 복용량 계산기의 개인정보 수집 및 사용 정책. Google Analytics, AdSense 사용 및 데이터 보안 정보.',
      robots: {
        index: true,
        follow: true,
      },
      alternates: {
        canonical: 'https://www.kidsfever.xyz/privacy',
        languages: {
          ko: 'https://www.kidsfever.xyz/privacy',
          en: 'https://www.kidsfever.xyz/en/privacy',
        },
      },
    };
  }

  return {
    title: 'Privacy Policy | Children\'s Fever Medicine Dosage Calculator',
    description:
      'Privacy Policy for Children\'s Fever Medicine Dosage Calculator. Information on data collection, Google Analytics, AdSense, and data security.',
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: 'https://www.kidsfever.xyz/en/privacy',
      languages: {
        ko: 'https://www.kidsfever.xyz/privacy',
        en: 'https://www.kidsfever.xyz/en/privacy',
      },
    },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('privacy');

  return (
    <main className="container mx-auto max-w-4xl p-4 pt-8 sm:pt-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-4">
        <Link href={locale === 'en' ? '/en' : '/'} className="hover:underline">
          {t('breadcrumb.home')}
        </Link>
        <span className="mx-2">›</span>
        <span>{t('breadcrumb.privacy')}</span>
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
        {/* 1. Overview */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t('sections.overview.title')}
          </h2>
          <p className="text-gray-700">{t('sections.overview.content')}</p>
        </section>

        {/* 2. Collection */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t('sections.collection.title')}
          </h2>
          <p className="text-gray-700 mb-2">{t('sections.collection.intro')}</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
            {t.raw('sections.collection.items').map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>

        {/* 3. Usage */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t('sections.usage.title')}
          </h2>
          <p className="text-gray-700 mb-2">{t('sections.usage.intro')}</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
            {t.raw('sections.usage.items').map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>

        {/* 4. Sharing */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t('sections.sharing.title')}
          </h2>
          <p className="text-gray-700 mb-2">{t('sections.sharing.content')}</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
            {t.raw('sections.sharing.items').map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>

        {/* 5. Cookies */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t('sections.cookies.title')}
          </h2>
          <p className="text-gray-700 mb-2">{t('sections.cookies.content')}</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
            {t.raw('sections.cookies.items').map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>

        {/* 6. Security */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t('sections.security.title')}
          </h2>
          <p className="text-gray-700 mb-2">{t('sections.security.content')}</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
            {t.raw('sections.security.items').map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>

        {/* 7. Third Party */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t('sections.thirdParty.title')}
          </h2>
          <p className="text-gray-700 mb-2">{t('sections.thirdParty.content')}</p>
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-800">
                {t('sections.thirdParty.google.title')}
              </h3>
              <p className="text-gray-700">
                {t('sections.thirdParty.google.content')}{' '}
                <a
                  href={t('sections.thirdParty.google.link')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {t('sections.thirdParty.google.link')}
                </a>
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                {t('sections.thirdParty.vercel.title')}
              </h3>
              <p className="text-gray-700">
                {t('sections.thirdParty.vercel.content')}{' '}
                <a
                  href={t('sections.thirdParty.vercel.link')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {t('sections.thirdParty.vercel.link')}
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* 8. Rights */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t('sections.rights.title')}
          </h2>
          <p className="text-gray-700 mb-2">{t('sections.rights.intro')}</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
            {t.raw('sections.rights.items').map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </section>

        {/* 9. Children */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t('sections.children.title')}
          </h2>
          <p className="text-gray-700">{t('sections.children.content')}</p>
        </section>

        {/* 10. Changes */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t('sections.changes.title')}
          </h2>
          <p className="text-gray-700">{t('sections.changes.content')}</p>
        </section>

        {/* 11. Contact */}
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

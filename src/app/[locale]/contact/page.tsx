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
      title: '문의하기 | 어린이 해열제 복용량 계산기',
      description:
        '어린이 해열제 복용량 계산기에 대한 문의, 피드백, 개선 제안을 보내주세요. 블로그 및 프로필을 통해 연락 가능합니다.',
      robots: {
        index: true,
        follow: true,
      },
      alternates: {
        canonical: 'https://antipyretic-dose.vercel.app/contact',
        languages: {
          ko: 'https://antipyretic-dose.vercel.app/contact',
          en: 'https://antipyretic-dose.vercel.app/en/contact',
        },
      },
    };
  }

  return {
    title: 'Contact Us | Children\'s Fever Medicine Dosage Calculator',
    description:
      'Contact us with questions, feedback, or suggestions about Children\'s Fever Medicine Dosage Calculator. Reach us via blog or profile.',
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: 'https://antipyretic-dose.vercel.app/en/contact',
      languages: {
        ko: 'https://antipyretic-dose.vercel.app/contact',
        en: 'https://antipyretic-dose.vercel.app/en/contact',
      },
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('contact');

  return (
    <main className="container mx-auto max-w-4xl p-4 pt-8 sm:pt-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-4">
        <Link href={locale === 'en' ? '/en' : '/'} className="hover:underline">
          {t('breadcrumb.home')}
        </Link>
        <span className="mx-2">›</span>
        <span>{t('breadcrumb.contact')}</span>
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
        {/* Intro */}
        <section>
          <p className="text-gray-700">{t('sections.intro.content')}</p>
        </section>

        {/* Contact Methods */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {t('sections.methods.title')}
          </h2>
          <div className="space-y-4">
            {/* Blog */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-gray-800 mb-2">
                {t('sections.methods.blog.title')}
              </h3>
              <p className="text-gray-700 mb-2">
                {t('sections.methods.blog.content')}
              </p>
              <a
                href={t('sections.methods.blog.link')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-semibold"
              >
                {t('sections.methods.blog.link')} →
              </a>
            </div>

            {/* Profile */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-gray-800 mb-2">
                {t('sections.methods.profile.title')}
              </h3>
              <p className="text-gray-700 mb-2">
                {t('sections.methods.profile.content')}
              </p>
              <a
                href={t('sections.methods.profile.link')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-semibold"
              >
                {t('sections.methods.profile.link')} →
              </a>
            </div>
          </div>
        </section>

        {/* Response Time */}
        <section className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t('sections.response.title')}
          </h2>
          <p className="text-gray-700">{t('sections.response.content')}</p>
        </section>

        {/* Feedback */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t('sections.feedback.title')}
          </h2>
          <p className="text-gray-700">{t('sections.feedback.content')}</p>
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

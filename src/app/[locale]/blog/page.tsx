import { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getBlogPostsForLocale } from '@/lib/blog';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (locale === 'ko') {
    return {
      title: '블로그 | 어린이 해열제 복용량 계산기',
      description:
        '의사 아빠가 전하는 어린이 발열 관리 가이드. 해열제 복용법, 발열 대처법, 의학적 근거 기반 육아 정보를 제공합니다.',
      keywords: [
        '어린이 해열제 블로그',
        '발열 관리',
        '타이레놀 복용법',
        '부루펜 용량',
        '육아 정보',
        '소아 건강',
      ],
      robots: {
        index: true,
        follow: true,
      },
      alternates: {
        canonical: 'https://kidsfever.xyz/blog',
        languages: {
          ko: 'https://kidsfever.xyz/blog',
          en: 'https://kidsfever.xyz/en/blog',
        },
      },
      openGraph: {
        title: '블로그 | 어린이 해열제 복용량 계산기',
        description:
          '의사 아빠가 전하는 어린이 발열 관리 가이드',
        url: 'https://kidsfever.xyz/blog',
        siteName: '어린이 해열제 복용량 계산기',
        locale: 'ko_KR',
        type: 'website',
      },
    };
  }

  return {
    title: "Blog | Children's Fever Medicine Dosage Calculator",
    description:
      "Expert parenting guides on children's fever management. Evidence-based information on fever medicine dosing, fever care, and pediatric health.",
    keywords: [
      'children fever blog',
      'fever management',
      'tylenol dosing guide',
      'motrin dosage',
      'parenting tips',
      'pediatric health',
    ],
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: 'https://kidsfever.xyz/en/blog',
      languages: {
        ko: 'https://kidsfever.xyz/blog',
        en: 'https://kidsfever.xyz/en/blog',
      },
    },
    openGraph: {
      title: "Blog | Children's Fever Medicine Dosage Calculator",
      description:
        "Expert parenting guides on children's fever management",
      url: 'https://kidsfever.xyz/en/blog',
      siteName: "Children's Fever Medicine Dosage Calculator",
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('blog');
  const posts = getBlogPostsForLocale(locale);

  return (
    <main className="container mx-auto max-w-4xl p-4 pt-8 sm:pt-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-4">
        <Link href={locale === 'en' ? '/en' : '/'} className="hover:underline">
          {locale === 'en' ? 'Home' : '홈'}
        </Link>
        <span className="mx-2">›</span>
        <span>{locale === 'en' ? 'Blog' : '블로그'}</span>
      </nav>

      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          {locale === 'en' ? 'Blog' : '블로그'}
        </h1>
        <p className="mt-3 text-base text-gray-600">
          {locale === 'en'
            ? 'Evidence-based guides on children\'s fever management by a doctor dad'
            : '의사 아빠가 전하는 의학적 근거 기반 발열 관리 가이드'}
        </p>
      </header>

      {/* Blog Posts List */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">
            {locale === 'en' ? 'No posts yet.' : '아직 게시물이 없습니다.'}
          </p>
        ) : (
          posts.map((post) => (
            <article
              key={post.slug}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <Link href={`${locale === 'en' ? '/en' : ''}/blog/${post.slug}`}>
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-blue-600 font-medium">
                    {post.category}
                  </span>
                  <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {post.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                    <span>{post.author}</span>
                    <span>•</span>
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString(
                        locale === 'en' ? 'en-US' : 'ko-KR',
                        { year: 'numeric', month: 'long', day: 'numeric' }
                      )}
                    </time>
                  </div>
                </div>
              </Link>
            </article>
          ))
        )}
      </div>

      {/* CTA */}
      <section className="mt-12 bg-blue-50 p-6 rounded-lg text-center border border-blue-200">
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          {locale === 'en' ? 'Calculate Dosage Now' : '복용량 계산하기'}
        </h2>
        <p className="text-gray-600 mb-4">
          {locale === 'en'
            ? 'Need to calculate your child\'s fever medicine dosage?'
            : '아이의 해열제 복용량이 궁금하신가요?'}
        </p>
        <Link
          href={locale === 'en' ? '/en' : '/'}
          className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          {locale === 'en' ? 'Go to Calculator →' : '계산기 바로가기 →'}
        </Link>
      </section>
    </main>
  );
}

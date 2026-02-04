import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllBlogSlugs, getBlogPostBySlug } from '@/lib/blog';
import { parseMarkdownToHtml } from '@/lib/markdown';
import BlogReadTracker from '@/app/components/blog/BlogReadTracker';

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getBlogPostBySlug(slug, locale);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const baseUrl = 'https://kidsfever.xyz';
  const url = locale === 'en' ? `${baseUrl}/en/blog/${slug}` : `${baseUrl}/blog/${slug}`;

  return {
    title: `${post.title} | 어린이 해열제 복용량 계산기`,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: url,
      languages: {
        ko: `${baseUrl}/blog/${slug}`,
        en: `${baseUrl}/en/blog/${slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      siteName: '어린이 해열제 복용량 계산기',
      locale: locale === 'en' ? 'en_US' : 'ko_KR',
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.dateModified || post.date,
      authors: [post.author],
      images: [
        {
          url: 'https://kidsfever.xyz/opengraph-image.png',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: ['https://kidsfever.xyz/opengraph-image.png'],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = getBlogPostBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  const parsedContent = await parseMarkdownToHtml(post.content);

  // Article 구조화 데이터
  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    author: {
      '@type': 'Person',
      name: post.author,
      jobTitle: '의사',
      url: 'https://litt.ly/solkim',
    },
    datePublished: post.date,
    dateModified: post.dateModified || post.date,
    publisher: {
      '@type': 'Person',
      name: 'solkim',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://kidsfever.xyz/blog/${post.slug}`,
    },
    keywords: post.keywords.join(', '),
  };

  // Breadcrumb 구조화 데이터
  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: locale === 'en' ? 'Home' : '홈',
        item: locale === 'en' ? 'https://kidsfever.xyz/en' : 'https://kidsfever.xyz',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: locale === 'en' ? 'Blog' : '블로그',
        item: locale === 'en' ? 'https://kidsfever.xyz/en/blog' : 'https://kidsfever.xyz/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://kidsfever.xyz/blog/${post.slug}`,
      },
    ],
  };

  // FAQ 구조화 데이터
  const faqStructuredData =
    post.faqs && post.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      {/* 구조화 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      {faqStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />
      )}

      <BlogReadTracker slug={slug} />

      <main className="container mx-auto max-w-4xl p-4 pt-8 sm:pt-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-4">
          <Link href={locale === 'en' ? '/en' : '/'} className="hover:underline">
            {locale === 'en' ? 'Home' : '홈'}
          </Link>
          <span className="mx-2">›</span>
          <Link href={`${locale === 'en' ? '/en' : ''}/blog`} className="hover:underline">
            {locale === 'en' ? 'Blog' : '블로그'}
          </Link>
          <span className="mx-2">›</span>
          <span className="text-gray-400 truncate max-w-[200px] inline-block align-bottom">
            {post.title}
          </span>
        </nav>

        {/* Article */}
        <article className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100">
          {/* Header */}
          <header className="mb-8">
            <span className="text-xs text-blue-600 font-medium">{post.category}</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
              {post.title}
            </h1>
            <p className="text-gray-600 mt-3">{post.description}</p>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-4 pt-4 border-t">
              <span className="font-medium">{post.author}</span>
              <span>•</span>
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString(
                  locale === 'en' ? 'en-US' : 'ko-KR',
                  { year: 'numeric', month: 'long', day: 'numeric' }
                )}
              </time>
              {post.dateModified && post.dateModified !== post.date && (
                <>
                  <span>•</span>
                  <span className="text-gray-400">
                    {locale === 'en' ? 'Updated: ' : '수정일: '}
                    <time dateTime={post.dateModified}>
                      {new Date(post.dateModified).toLocaleDateString(
                        locale === 'en' ? 'en-US' : 'ko-KR',
                        { year: 'numeric', month: 'long', day: 'numeric' }
                      )}
                    </time>
                  </span>
                </>
              )}
            </div>
          </header>

          {/* Content */}
          <div
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{
              __html: parsedContent,
            }}
          />

          {/* FAQ Section */}
          {post.faqs && post.faqs.length > 0 && (
            <section className="mt-10 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {locale === 'en' ? 'Frequently Asked Questions' : '자주 묻는 질문'}
              </h2>
              <div className="space-y-4">
                {post.faqs.map((faq, index) => (
                  <details
                    key={index}
                    className="group border border-gray-200 rounded-lg"
                  >
                    <summary className="flex items-center justify-between cursor-pointer p-4 font-semibold text-gray-900 hover:bg-gray-50 rounded-lg">
                      <span>{faq.question}</span>
                      <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="px-4 pb-4 text-gray-700 leading-relaxed">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Medical Disclaimer */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>⚠️ {locale === 'en' ? 'Medical Disclaimer:' : '의료 면책 조항:'}</strong>{' '}
              {locale === 'en'
                ? 'This article is for general informational purposes only and does not replace medical advice. Always consult your child\'s doctor for health decisions.'
                : '본 글의 내용은 일반적인 정보 제공 목적이며, 의학적 조언을 대체하지 않습니다. 아이의 건강에 대한 결정은 반드시 담당 의사와 상담하시기 바랍니다.'}
            </p>
          </div>
        </article>

        {/* CTA */}
        <section className="mt-8 bg-blue-50 p-6 rounded-lg text-center border border-blue-200">
          <h2 className="text-xl font-bold mb-4 text-gray-900">
            {locale === 'en' ? 'Calculate Dosage Now' : '해열제 복용량 계산하기'}
          </h2>
          <p className="text-gray-600 mb-4">
            {locale === 'en'
              ? 'Get accurate dosage for your child\'s fever medicine'
              : '아이의 체중과 나이에 맞는 정확한 복용량을 계산하세요'}
          </p>
          <Link
            href={locale === 'en' ? '/en' : '/'}
            className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {locale === 'en' ? 'Go to Calculator →' : '계산기 바로가기 →'}
          </Link>
        </section>

        {/* Back to Blog */}
        <div className="mt-6 text-center">
          <Link
            href={`${locale === 'en' ? '/en' : ''}/blog`}
            className="text-blue-600 hover:underline"
          >
            ← {locale === 'en' ? 'Back to Blog' : '블로그로 돌아가기'}
          </Link>
        </div>
      </main>
    </>
  );
}

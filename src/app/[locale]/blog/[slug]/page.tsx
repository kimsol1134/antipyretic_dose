import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllBlogSlugs, getBlogPostBySlug } from '@/lib/blog';

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
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const baseUrl = 'https://www.kidsfever.xyz';
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
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

// 마크다운 파서 - 테이블, 이미지, 코드 블록 지원
function parseMarkdown(content: string): string {
  let result = content;

  // 이미지 처리 (가장 먼저)
  result = result.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" class="w-full rounded-lg my-6 shadow-md" loading="lazy" />'
  );

  // 코드 블록 (```)
  result = result.replace(
    /```([\s\S]*?)```/g,
    '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4 text-sm"><code>$1</code></pre>'
  );

  // 테이블 처리
  result = result.replace(
    /\|(.+)\|\n\|[-| ]+\|\n((?:\|.+\|\n?)+)/g,
    (match, header, body) => {
      const headerCells = header.split('|').filter((c: string) => c.trim());
      const headerRow = `<thead><tr>${headerCells.map((c: string) => `<th class="border border-gray-300 px-4 py-2 bg-gray-50 font-semibold text-left">${c.trim()}</th>`).join('')}</tr></thead>`;
      
      const bodyRows = body.trim().split('\n').map((row: string) => {
        const cells = row.split('|').filter((c: string) => c.trim());
        return `<tr>${cells.map((c: string) => `<td class="border border-gray-300 px-4 py-2">${c.trim()}</td>`).join('')}</tr>`;
      }).join('');
      
      return `<table class="w-full border-collapse my-6 text-sm">${headerRow}<tbody>${bodyRows}</tbody></table>`;
    }
  );

  // Headers
  result = result.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-gray-900 mt-6 mb-3">$1</h3>');
  result = result.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-900 mt-8 mb-4">$1</h2>');
  result = result.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h1>');

  // Bold
  result = result.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');

  // Italic
  result = result.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Blockquotes
  result = result.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 text-gray-700 italic">$1</blockquote>');

  // Unordered lists - 연속된 항목을 ul로 감싸기
  result = result.replace(/((?:^- .+$\n?)+)/gm, (match) => {
    const items = match.trim().split('\n').map(item => {
      const content = item.replace(/^- /, '');
      return `<li class="ml-4 mb-1">${content}</li>`;
    }).join('');
    return `<ul class="list-disc pl-5 my-4">${items}</ul>`;
  });

  // Numbered lists
  result = result.replace(/((?:^\d+\. .+$\n?)+)/gm, (match) => {
    const items = match.trim().split('\n').map(item => {
      const content = item.replace(/^\d+\. /, '');
      return `<li class="ml-4 mb-1">${content}</li>`;
    }).join('');
    return `<ol class="list-decimal pl-5 my-4">${items}</ol>`;
  });

  // Links
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-blue-600 hover:underline">$1</a>'
  );

  // Horizontal rules
  result = result.replace(/^---$/gm, '<hr class="my-8 border-gray-200" />');

  // Paragraphs (double newlines)
  result = result.replace(/\n\n/g, '</p><p class="text-gray-700 leading-relaxed mb-4">');

  // Single line breaks
  result = result.replace(/\n/g, '<br />');

  return result;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const parsedContent = parseMarkdown(post.content);

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
    dateModified: post.date,
    publisher: {
      '@type': 'Person',
      name: 'pinecone',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.kidsfever.xyz/blog/${post.slug}`,
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
        item: locale === 'en' ? 'https://www.kidsfever.xyz/en' : 'https://www.kidsfever.xyz',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: locale === 'en' ? 'Blog' : '블로그',
        item: locale === 'en' ? 'https://www.kidsfever.xyz/en/blog' : 'https://www.kidsfever.xyz/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://www.kidsfever.xyz/blog/${post.slug}`,
      },
    ],
  };

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
            <div className="flex items-center gap-3 text-sm text-gray-500 mt-4 pt-4 border-t">
              <span className="font-medium">{post.author}</span>
              <span>•</span>
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString(
                  locale === 'en' ? 'en-US' : 'ko-KR',
                  { year: 'numeric', month: 'long', day: 'numeric' }
                )}
              </time>
            </div>
          </header>

          {/* Content */}
          <div
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{
              __html: `<p class="text-gray-700 leading-relaxed mb-4">${parsedContent}</p>`,
            }}
          />

          {/* Medical Disclaimer */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>⚠️ 의료 면책 조항:</strong> 본 글의 내용은 일반적인 정보 제공 목적이며,
              의학적 조언을 대체하지 않습니다. 아이의 건강에 대한 결정은 반드시 담당 의사와
              상담하시기 바랍니다.
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

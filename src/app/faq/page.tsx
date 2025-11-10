import { Metadata } from 'next';
import Link from 'next/link';
import FAQList from '@/app/components/faq/FAQList';
import { faqData } from '@/data/faq-data';

export const metadata: Metadata = {
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

export default function FAQPage() {
  // FAQPage 구조화 데이터
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((faq) => ({
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
        name: '홈',
        item: 'https://antipyretic-dose.vercel.app',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '자주 묻는 질문',
        item: 'https://antipyretic-dose.vercel.app/faq',
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
          <Link href="/" className="hover:underline">
            홈
          </Link>
          <span className="mx-2">›</span>
          <span>자주 묻는 질문</span>
        </nav>

        {/* 헤더 */}
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            어린이 해열제 자주 묻는 질문
          </h1>
          <p className="mt-3 text-base text-gray-600">
            타이레놀, 부루펜 등 어린이 해열제 복용법에 대한 정확한 정보를
            확인하세요
          </p>
          <p className="mt-4 text-xs text-gray-500 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            ⚠️ 본 FAQ는 일반적인 참고 자료입니다. 실제 투약 전 반드시 의사·약사와
            상담하세요.
          </p>
        </header>

        {/* FAQ 리스트 */}
        <FAQList faqs={faqData} />

        {/* CTA */}
        <section className="mt-12 bg-blue-50 p-6 rounded-lg text-center border border-blue-200">
          <h2 className="text-xl font-bold mb-4 text-gray-900">
            정확한 복용량이 궁금하신가요?
          </h2>
          <p className="text-gray-600 mb-4">
            체중과 나이만 입력하면 각 제품별 정확한 복용량(mL)을 즉시
            계산해드립니다.
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            복용량 계산기 사용하기 →
          </Link>
        </section>

        {/* 추가 안내 */}
        <footer className="mt-12 text-center text-xs text-gray-500">
          <p>
            본 정보는 식품의약품안전처 허가사항 및 의료기관 가이드라인을 참고한
            일반적인 정보 제공 목적의 콘텐츠입니다.
          </p>
          <p className="mt-2">
            최종 업데이트: 2025-11-10
          </p>
        </footer>
      </main>
    </>
  );
}

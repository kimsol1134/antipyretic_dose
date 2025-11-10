'use client';

import { useMemo } from 'react';
import { FAQItem, categoryLabels } from '@/data/faq-data';
import FAQAccordion from './FAQAccordion';

export default function FAQList({ faqs }: { faqs: FAQItem[] }) {
  // 우선순위 정렬
  const sortedFAQs = useMemo(() => {
    return [...faqs].sort((a, b) => a.priority - b.priority);
  }, [faqs]);

  // 카테고리별 그룹화
  const faqsByCategory = useMemo(() => {
    const grouped = sortedFAQs.reduce(
      (acc, faq) => {
        if (!acc[faq.category]) {
          acc[faq.category] = [];
        }
        acc[faq.category].push(faq);
        return acc;
      },
      {} as Record<string, FAQItem[]>
    );
    return grouped;
  }, [sortedFAQs]);

  return (
    <div>
      {/* 카테고리별 FAQ */}
      {Object.entries(faqsByCategory).map(([category, categoryFAQs]) => (
        <section key={category} className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-500">
            {categoryLabels[category as keyof typeof categoryLabels]}
          </h2>
          <div className="space-y-4">
            {categoryFAQs.map((faq) => (
              <FAQAccordion key={faq.id} faq={faq} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

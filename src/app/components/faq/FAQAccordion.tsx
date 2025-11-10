'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQItem } from '@/data/faq-data';
import SourceBadge from '../shared/SourceBadge';

export default function FAQAccordion({ faq }: { faq: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      id={faq.id}
      className="border rounded-lg bg-white shadow-sm hover:shadow-md transition"
    >
      {/* 질문 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left"
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-semibold text-gray-900 pr-4">
          {faq.question}
        </h3>
        <ChevronDown
          className={`flex-shrink-0 w-5 h-5 text-gray-500 transform transition ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* 핵심 답변 (항상 표시) */}
      <div className="px-4 pb-2">
        <p className="text-base text-gray-800 font-medium bg-blue-50 p-3 rounded border-l-4 border-blue-500">
          {faq.shortAnswer}
        </p>
      </div>

      {/* 상세 설명 (접기/펼치기) */}
      {isOpen && (
        <div className="px-4 pb-4">
          {/* 상세 내용 */}
          <div
            className="prose prose-sm max-w-none mt-4"
            dangerouslySetInnerHTML={{ __html: faq.detailedAnswer }}
          />

          {/* 출처 */}
          <div className="mt-6 pt-4 border-t">
            <p className="text-xs text-gray-700 font-semibold mb-2">
              📚 참고 출처:
            </p>
            <ul className="space-y-2">
              {faq.sources.map((source, i) => (
                <li key={i} className="text-xs text-gray-600">
                  <SourceBadge type={source.type} />
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline ml-2"
                  >
                    {source.name}
                  </a>
                  {source.description && (
                    <span className="text-gray-500 ml-1">
                      ({source.description})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* 관련 FAQ */}
          {faq.relatedFAQs && faq.relatedFAQs.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-gray-700 font-semibold mb-2">
                🔗 관련 질문:
              </p>
              <div className="flex flex-wrap gap-2">
                {faq.relatedFAQs.map((relatedId) => (
                  <a
                    key={relatedId}
                    href={`#${relatedId}`}
                    className="text-xs text-blue-600 hover:underline bg-blue-50 px-3 py-1 rounded"
                    onClick={() => setIsOpen(false)}
                  >
                    이동 →
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* 면책 조항 */}
          <div className="mt-4 pt-4 border-t bg-gray-50 p-3 rounded">
            <p className="text-xs text-gray-500">
              ⚠️ <strong>면책 조항</strong>: {faq.medicalDisclaimer}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              최종 업데이트: {faq.lastUpdated}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

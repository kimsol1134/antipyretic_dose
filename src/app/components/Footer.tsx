'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function Footer() {
  const params = useParams();
  const locale = params.locale as string;
  const isKorean = locale === 'ko' || !locale;

  const baseUrl = isKorean ? '' : '/en';

  const mainLinks = isKorean
    ? [
        { href: `${baseUrl}/`, label: '계산기', title: '어린이 해열제 복용량 계산기' },
        { href: `${baseUrl}/blog`, label: '블로그', title: '발열 관리 가이드' },
        { href: `${baseUrl}/faq`, label: 'FAQ', title: '자주 묻는 질문' },
        { href: `${baseUrl}/about`, label: '소개', title: '서비스 소개' },
        { href: `${baseUrl}/contact`, label: '문의', title: '문의하기' },
      ]
    : [
        { href: `${baseUrl}/`, label: 'Calculator', title: "Children's Fever Medicine Dosage Calculator" },
        { href: `${baseUrl}/blog`, label: 'Blog', title: 'Fever Management Guide' },
        { href: `${baseUrl}/faq`, label: 'FAQ', title: 'Frequently Asked Questions' },
        { href: `${baseUrl}/about`, label: 'About', title: 'About Us' },
        { href: `${baseUrl}/contact`, label: 'Contact', title: 'Contact Us' },
      ];

  const legalLinks = isKorean
    ? [
        { href: `${baseUrl}/privacy`, label: '개인정보처리방침' },
        { href: `${baseUrl}/terms`, label: '이용약관' },
      ]
    : [
        { href: `${baseUrl}/privacy`, label: 'Privacy Policy' },
        { href: `${baseUrl}/terms`, label: 'Terms of Service' },
      ];

  const medicineLinks = isKorean
    ? [
        { keyword: '타이레놀 복용량', url: `${baseUrl}/` },
        { keyword: '부루펜 용량', url: `${baseUrl}/` },
        { keyword: '챔프 시럽', url: `${baseUrl}/` },
        { keyword: '맥시부펜', url: `${baseUrl}/` },
        { keyword: '해열제 교차 복용', url: `${baseUrl}/faq` },
      ]
    : [
        { keyword: 'Tylenol Dosage', url: `${baseUrl}/` },
        { keyword: 'Motrin Dosage', url: `${baseUrl}/` },
        { keyword: 'Advil Dosing', url: `${baseUrl}/` },
        { keyword: 'Acetaminophen Calculator', url: `${baseUrl}/` },
        { keyword: 'Alternating Medicines', url: `${baseUrl}/faq` },
      ];

  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-16">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Main Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">
              {isKorean ? '빠른 링크' : 'Quick Links'}
            </h3>
            <ul className="space-y-2">
              {mainLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    title={link.title}
                    className="text-gray-600 hover:text-blue-600 hover:underline transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Medicine Keywords (for SEO internal linking) */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">
              {isKorean ? '인기 검색어' : 'Popular Searches'}
            </h3>
            <ul className="space-y-2">
              {medicineLinks.map((item) => (
                <li key={item.keyword}>
                  <Link
                    href={item.url}
                    className="text-gray-600 hover:text-blue-600 hover:underline transition text-sm"
                  >
                    {item.keyword}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Info */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">
              {isKorean ? '법적 정보' : 'Legal'}
            </h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-blue-600 hover:underline transition text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Citation & Trust Signals */}
        <div className="border-t border-gray-200 pt-6 mb-6">
          <p className="text-xs text-gray-500 text-center">
            {isKorean
              ? '본 계산기는 식품의약품안전처 의약품개요정보(e약은요)를 기반으로 제작되었습니다. 모든 복용량 정보는 참고용이며, 실제 투약 시 반드시 의사 또는 약사와 상담하시기 바랍니다.'
              : 'This calculator is based on FDA and AAP guidelines. All dosage information is for reference only. Always consult a doctor or pharmacist before administering medication.'}
          </p>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()}{' '}
            {isKorean
              ? '어린이 해열제 복용량 계산기'
              : "Children's Fever Medicine Dosage Calculator"}
            {' | '}
            <a
              href="https://litt.ly/solkim"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 hover:underline"
            >
              Dr. pinecone
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

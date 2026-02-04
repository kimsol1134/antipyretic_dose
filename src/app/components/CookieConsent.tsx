'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const params = useParams();
  const locale = params.locale as string;
  const isKorean = locale === 'ko' || !locale;
  const baseUrl = isKorean ? '' : '/en';

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-gray-200 shadow-lg p-4">
      <div className="container mx-auto max-w-4xl flex flex-col sm:flex-row items-center gap-4">
        <p className="text-sm text-gray-700 flex-1">
          {isKorean
            ? '이 웹사이트는 서비스 개선과 광고를 위해 쿠키를 사용합니다. '
            : 'This website uses cookies for service improvement and advertising. '}
          <Link
            href={`${baseUrl}/privacy`}
            className="text-blue-600 hover:underline"
          >
            {isKorean ? '개인정보처리방침' : 'Privacy Policy'}
          </Link>
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            {isKorean ? '거부' : 'Decline'}
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
          >
            {isKorean ? '동의' : 'Accept'}
          </button>
        </div>
      </div>
    </div>
  );
}

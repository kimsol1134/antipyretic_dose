'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { GA_MEASUREMENT_ID, pageview } from '@/lib/analytics';

/**
 * Google Analytics 4 스크립트 컴포넌트
 *
 * 환경 변수가 설정되지 않으면 렌더링하지 않음
 * 개발 환경에서는 콘솔에 경고 메시지 표시
 */
export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 페이지 변경 시 페이지뷰 이벤트 전송
  useEffect(() => {
    if (!GA_MEASUREMENT_ID) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          '[GA4] NEXT_PUBLIC_GA_MEASUREMENT_ID is not set. Analytics disabled.'
        );
      }
      return;
    }

    const url = pathname + searchParams.toString();
    pageview(url);
  }, [pathname, searchParams]);

  // GA_MEASUREMENT_ID가 없으면 렌더링하지 않음
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      {/* Google Analytics gtag.js 스크립트 */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    PartnersCoupang?: {
      G: new (config: {
        id: number;
        trackingCode: string;
        template: string;
        width: string;
        height: string;
      }) => void;
    };
  }
}

const COUPANG_CONFIG = {
  id: 936910,
  trackingCode: 'AF3034941',
  template: 'carousel',
  timeout: 5000,
} as const;

const BANNER_SIZES = {
  mobile: { width: '320', height: '100' },
  desktop: { width: '728', height: '90' },
} as const;

export default function CoupangBanner() {
  const [bannerError, setBannerError] = useState(false);

  useEffect(() => {
    // 스크립트 로드 확인
    if (window.PartnersCoupang) {
      initBanner(window.innerWidth < 768);
      return;
    }

    // 스크립트 동적 로드
    const script = document.createElement('script');
    script.src = 'https://ads-partners.coupang.com/g.js';
    script.async = true;
    script.onload = () => initBanner(window.innerWidth < 768);
    script.onerror = () => setBannerError(true);
    document.head.appendChild(script);

    // 타임아웃: 로드 안되면 에러 처리
    const timeout = setTimeout(() => {
      if (!window.PartnersCoupang) {
        setBannerError(true);
      }
    }, COUPANG_CONFIG.timeout);

    return () => clearTimeout(timeout);
  }, []);

  const initBanner = (isMobileView: boolean) => {
    if (!window.PartnersCoupang) return;

    try {
      const sizes = isMobileView ? BANNER_SIZES.mobile : BANNER_SIZES.desktop;
      new window.PartnersCoupang.G({
        id: COUPANG_CONFIG.id,
        trackingCode: COUPANG_CONFIG.trackingCode,
        template: COUPANG_CONFIG.template,
        width: sizes.width,
        height: sizes.height,
      });
    } catch (error) {
      console.warn('[CoupangBanner] Initialization failed:', error);
      setBannerError(true);
    }
  };

  // 배너 로드 실패 → 아무것도 표시 안함 (계산기 기능 영향 없음)
  if (bannerError) return null;

  return (
    <div className="w-full flex justify-center my-6">
      {/* 쿠팡 배너 스크립트가 자동으로 광고를 삽입할 컨테이너 */}
    </div>
  );
}

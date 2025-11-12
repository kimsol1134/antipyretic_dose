'use client';

import { useEffect, useState, useRef } from 'react';

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
    __coupangBannerInitialized?: boolean;
  }
}

const COUPANG_CONFIG = {
  id: 936910,
  trackingCode: 'AF3034941',
  template: 'carousel',
  timeout: 5000,
  containerId: 'coupang-banner-container',
} as const;

const BANNER_SIZES = {
  mobile: { width: '320', height: '100' },
  desktop: { width: '728', height: '90' },
} as const;

export default function CoupangBanner() {
  const [bannerError, setBannerError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 전역 플래그로 중복 초기화 방지
    if (window.__coupangBannerInitialized) return;

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

    return () => {
      clearTimeout(timeout);
      // cleanup: 쿠팡 배너가 생성한 모든 요소 제거
      cleanupBanner();
    };
  }, []);

  const cleanupBanner = () => {
    // 컨테이너 내부 정리
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    // 쿠팡 스크립트가 생성한 iframe, ins 태그 등 모두 제거
    const container = document.getElementById(COUPANG_CONFIG.containerId);
    if (container) {
      // iframe 제거
      const iframes = container.querySelectorAll('iframe');
      iframes.forEach((iframe) => iframe.remove());

      // ins 태그 제거
      const insElements = container.querySelectorAll('ins');
      insElements.forEach((ins) => ins.remove());

      // 기타 자식 요소 모두 제거
      container.innerHTML = '';
    }

    // 전역 플래그 리셋
    window.__coupangBannerInitialized = false;
  };

  const initBanner = (isMobileView: boolean) => {
    if (!window.PartnersCoupang || window.__coupangBannerInitialized) return;

    try {
      // 기존 배너 완전히 제거
      cleanupBanner();

      const sizes = isMobileView ? BANNER_SIZES.mobile : BANNER_SIZES.desktop;
      new window.PartnersCoupang.G({
        id: COUPANG_CONFIG.id,
        trackingCode: COUPANG_CONFIG.trackingCode,
        template: COUPANG_CONFIG.template,
        width: sizes.width,
        height: sizes.height,
      });

      // 초기화 완료 플래그 설정
      window.__coupangBannerInitialized = true;
    } catch (error) {
      console.warn('[CoupangBanner] Initialization failed:', error);
      setBannerError(true);
    }
  };

  // 배너 로드 실패 → 아무것도 표시 안함 (계산기 기능 영향 없음)
  if (bannerError) return null;

  return (
    <div
      id={COUPANG_CONFIG.containerId}
      ref={containerRef}
      className="w-full flex justify-center my-6"
    >
      {/* 쿠팡 배너 스크립트가 자동으로 광고를 삽입할 컨테이너 */}
    </div>
  );
}

/**
 * Google Analytics 4 설정 및 이벤트 추적 유틸리티
 *
 * 환경 변수:
 * - NEXT_PUBLIC_GA_MEASUREMENT_ID: Google Analytics 4 측정 ID (G-XXXXXXXXXX)
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// 타입 정의
export type GtagEvent = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

// Google Analytics가 로드되었는지 확인
export const isGAEnabled = (): boolean => {
  return typeof window !== 'undefined' &&
         typeof window.gtag !== 'undefined' &&
         !!GA_MEASUREMENT_ID;
};

/**
 * 페이지뷰 이벤트 전송
 * Next.js 페이지 전환 시 자동으로 호출됨
 */
export const pageview = (url: string): void => {
  if (!isGAEnabled()) return;

  window.gtag('config', GA_MEASUREMENT_ID!, {
    page_path: url,
  });
};

/**
 * 커스텀 이벤트 전송
 * @param event 이벤트 객체
 */
export const event = ({ action, category, label, value }: GtagEvent): void => {
  if (!isGAEnabled()) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// 특정 이벤트 추적 함수들

/**
 * 계산 버튼 클릭 추적
 */
export const trackCalculation = (weight: number, ageValue: number, ageUnit: string): void => {
  event({
    action: 'calculate_dosage',
    category: 'Calculator',
    label: `Weight: ${weight}kg, Age: ${ageValue}${ageUnit}`,
  });
};

/**
 * 결과 표시 추적
 */
export const trackResultsDisplayed = (productCount: number): void => {
  event({
    action: 'results_displayed',
    category: 'Calculator',
    label: `Products: ${productCount}`,
    value: productCount,
  });
};

/**
 * FAQ 아코디언 열기/닫기 추적
 */
export const trackFAQToggle = (question: string, isOpen: boolean): void => {
  event({
    action: isOpen ? 'faq_opened' : 'faq_closed',
    category: 'FAQ',
    label: question,
  });
};

/**
 * 언어 전환 추적
 */
export const trackLanguageSwitch = (fromLang: string, toLang: string): void => {
  event({
    action: 'language_switch',
    category: 'Navigation',
    label: `${fromLang} → ${toLang}`,
  });
};

/**
 * 유사 제품 클릭 추적
 */
export const trackSimilarProductClick = (productName: string, ingredient: string): void => {
  event({
    action: 'similar_product_click',
    category: 'Product',
    label: `${productName} (${ingredient})`,
  });
};

/**
 * 관련 제품 클릭 추적 (미국)
 */
export const trackRelatedProductClick = (productName: string): void => {
  event({
    action: 'related_product_click',
    category: 'Product',
    label: productName,
  });
};

/**
 * 외부 링크 클릭 추적
 */
export const trackOutboundLink = (url: string, label?: string): void => {
  event({
    action: 'outbound_link_click',
    category: 'Navigation',
    label: label || url,
  });
};

/**
 * 쿠팡 배너 노출 추적
 */
export const trackCoupangBannerImpression = (): void => {
  event({
    action: 'coupang_banner_impression',
    category: 'Advertisement',
    label: 'Coupang Partners Banner',
  });
};

/**
 * AdSense 광고 노출 추적 (향후 사용)
 */
export const trackAdSenseImpression = (adSlot: string): void => {
  event({
    action: 'adsense_impression',
    category: 'Advertisement',
    label: adSlot,
  });
};

// Window 타입 확장 (gtag 함수)
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}

/**
 * Analytics helper for privacy-safe event tracking
 *
 * IMPORTANT: This module categorizes sensitive data (weight, age) to protect user privacy.
 * Never track exact values - only ranges/categories.
 */

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'js',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
  }
}

/**
 * Categorize weight into privacy-safe ranges
 */
export const getWeightCategory = (weight: number): string => {
  if (weight < 5) return 'under_5kg';
  if (weight < 10) return '5-10kg';
  if (weight < 15) return '10-15kg';
  if (weight < 20) return '15-20kg';
  if (weight < 30) return '20-30kg';
  return 'over_30kg';
};

/**
 * Categorize age into privacy-safe ranges
 */
export const getAgeCategory = (
  ageValue: number,
  ageUnit: 'years' | 'months'
): string => {
  const ageInMonths = ageUnit === 'years' ? ageValue * 12 : ageValue;

  if (ageInMonths < 6) return 'under_6months';
  if (ageInMonths < 12) return '6-12months';
  if (ageInMonths < 24) return '1-2years';
  if (ageInMonths < 60) return '2-5years';
  if (ageInMonths < 144) return '5-12years';
  return 'over_12years';
};

/**
 * Track custom events to Google Analytics
 */
export const trackEvent = (
  eventName: string,
  params?: Record<string, unknown>
): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

/**
 * Track dosage calculation event (called when user submits form)
 */
export const trackDosageCalculation = (
  weight: number,
  ageValue: number,
  ageUnit: 'years' | 'months',
  resultCount: number
): void => {
  trackEvent('dosage_calculation', {
    weight_category: getWeightCategory(weight),
    age_category: getAgeCategory(ageValue, ageUnit),
    result_count: resultCount,
  });
};

/**
 * Track when user views external drug information
 */
export const trackDrugInfoView = (productName: string): void => {
  trackEvent('drug_info_view', {
    product_name: productName,
  });
};

/**
 * Track FAQ interaction (open/close)
 */
export const trackFAQInteraction = (
  faqId: string,
  action: 'open' | 'close'
): void => {
  trackEvent('faq_interaction', {
    faq_id: faqId,
    action,
  });
};

/**
 * Track blog reading progress via scroll milestones
 */
export const trackBlogRead = (
  slug: string,
  readPercentage: 25 | 50 | 75 | 100
): void => {
  trackEvent('blog_read', {
    blog_slug: slug,
    read_percentage: readPercentage,
  });
};

/**
 * Track when user expands similar products section
 */
export const trackSimilarProductsExpanded = (productId: string): void => {
  trackEvent('similar_products_expanded', {
    product_id: productId,
  });
};

'use client';

import Image from 'next/image';
import React, { useMemo, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  DOSAGE_RESULTS_MIN_HEIGHT_CLASS,
  ML_ROUNDING_DECIMALS,
} from '@/lib/constants';
import {
  useDosageResults,
  useDosageStatus,
} from '@/store/dosage-store';
import type { SimilarProductsMap, DosageResult, Product, RelatedProductsMapUS, RelatedProduct, NextDoseInfo } from '@/lib/types';
import type { EasyDrugItem } from '@/lib/easy-drug';
import { trackDrugInfoView, trackSimilarProductsExpanded } from '@/lib/analytics';
import { Alert } from './ui/Alert';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

type DosageResultDisplayProps = {
  similarProductsMap: SimilarProductsMap;
  relatedProductsMap?: RelatedProductsMapUS;
};

type GroupedResult = {
  groupKey: string;
  results: DosageResult[];
  primaryResult: DosageResult;
};

function formatMl(value: number): string {
  return value.toFixed(ML_ROUNDING_DECIMALS);
}

function formatClockTime(ms: number, locale: string): string {
  const date = new Date(ms);
  return date.toLocaleTimeString(locale === 'en' ? 'en-US' : 'ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDuration(minutes: number, locale: string): string {
  if (minutes < 60) {
    return locale === 'en' ? `${minutes} min` : `${minutes}분`;
  }
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (locale === 'en') {
    return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
  }
  return m === 0 ? `${h}시간` : `${h}시간 ${m}분`;
}

function getProductName(product: Product, locale: string): string {
  return locale === 'en' && product.nameEn ? product.nameEn : product.name;
}

function getIngredientName(product: Product, locale: string): string {
  return locale === 'en' && product.ingredientEn
    ? product.ingredientEn
    : product.ingredient;
}

function getProductImage(product: Product, locale: string): string {
  return locale === 'en' && product.imageEn ? product.imageEn : product.image;
}

export default function DosageResultDisplay({
  similarProductsMap,
  relatedProductsMap,
}: DosageResultDisplayProps) {
  const t = useTranslations('result');
  const tValidation = useTranslations('validation.product');
  const locale = useLocale();
  const results = useDosageResults();
  const status = useDosageStatus();
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(
    new Set()
  );

  // 같은 성분 + 농도의 제품들을 그룹으로 묶기
  const groupedResults = useMemo(() => {
    const groups = new Map<string, GroupedResult>();

    results.forEach((result) => {
      const groupKey = `${result.product.ingredient}_${result.product.strength_mg_per_ml}`;

      if (!groups.has(groupKey)) {
        groups.set(groupKey, {
          groupKey,
          results: [result],
          primaryResult: result,
        });
      } else {
        groups.get(groupKey)!.results.push(result);
      }
    });

    return Array.from(groups.values());
  }, [results]);

  const toggleSimilarProducts = (productId: string) => {
    setExpandedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
        trackSimilarProductsExpanded(productId);
      }
      return next;
    });
  };

  return (
    <div className={`mt-8 space-y-4 ${DOSAGE_RESULTS_MIN_HEIGHT_CLASS}`}>
      {status === 'calculated' && results.length > 0 && (
        <>
          <h2 className="text-2xl font-bold text-center">{t('title')}</h2>
          {groupedResults.map((group) => {
            const result = group.primaryResult;

            return (
              <Card key={group.groupKey}>
                {/* 성분 및 농도 정보 */}
                <div className="mb-4 pb-3 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {getIngredientName(result.product, locale)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {t('concentration')}: {result.product.strength_mg_per_ml} mg/mL
                  </p>
                </div>

                {/* 제품 이미지들 */}
                <div className="flex flex-wrap gap-6 mb-4">
                  {group.results.map((r) => (
                    <div key={r.product.id} className="flex flex-col items-center">
                      <div className="w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white shadow-md p-3">
                        <Image
                          src={getProductImage(r.product, locale)}
                          alt={`${getProductName(r.product, locale)} - ${getIngredientName(r.product, locale)} ${r.product.strength_mg_per_ml}mg/mL ${locale === 'en' ? 'children\'s fever medicine' : '어린이 해열제'}`}
                          width={240}
                          height={240}
                          className="object-contain max-w-full max-h-full"
                        />
                      </div>
                      <p className="text-sm font-bold text-gray-800 mt-3 text-center max-w-[200px] sm:max-w-[240px]">
                        {getProductName(r.product, locale)}
                      </p>
                    </div>
                  ))}
                </div>

                {result.status === 'success' && result.recommended_ml !== null && result.min_ml !== null && result.max_ml !== null && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    {/* 권장 복용량 */}
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-1">{t('dosage.recommended')}</p>
                      <p className="text-5xl font-extrabold text-blue-600">
                        {formatMl(result.recommended_ml)} mL
                      </p>
                    </div>

                    {/* 복용 가능 범위 */}
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 mb-1">{t('dosage.range')}</p>
                      <p className="text-xl font-semibold text-gray-700">
                        {formatMl(result.min_ml)} ~ {formatMl(result.max_ml)} mL
                      </p>
                    </div>

                    {/* 복용 간격 및 횟수 */}
                    <div className="flex flex-wrap gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">{t('dosage.interval')}:</span>
                        <span className="text-base font-semibold text-gray-900">
                          {result.product.interval_hours} {t('dosage.hours')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">{t('dosage.maxDaily')}:</span>
                        <span className="text-base font-semibold text-gray-900">
                          {result.product.max_doses_per_day} {t('dosage.times')}
                        </span>
                      </div>
                    </div>

                    {/* 하루 최대 용량 */}
                    {result.max_daily_ml !== null && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <p className="text-sm text-red-600 font-medium">
                          {t('warning.maxDailyDose')} <span className="text-lg font-bold">{formatMl(result.max_daily_ml)} mL</span>
                        </p>
                      </div>
                    )}

                    {/* 경고 메시지 */}
                    {result.message && (
                      <p className="mt-3 text-sm text-yellow-700 font-medium bg-yellow-50 p-2 rounded">
                        ℹ️ {result.message}
                      </p>
                    )}

                    {result.nextDose && (
                      <NextDoseBanner
                        info={result.nextDose}
                        ingredientKey={result.product.ingredient}
                        locale={locale}
                      />
                    )}
                  </div>
                )}

                {result.status === 'age_block' && (
                  <Alert variant="warning">
                    {tValidation('ageTooYoung', { minAge: result.product.min_age_months })}
                  </Alert>
                )}

                {result.status === 'error' && (
                  <Alert variant="error">
                    {result.message.includes('농도') || result.message.includes('concentration')
                      ? tValidation('concentrationZero')
                      : result.message}
                  </Alert>
                )}

                {/* 한국 버전: e약은요 API 유사 제품 */}
                {result.status === 'success' && locale === 'ko' && (
                  <SimilarProductsSection
                    productId={result.product.id}
                    productName={result.product.name}
                    items={similarProductsMap[result.product.id] ?? []}
                    isExpanded={expandedProducts.has(result.product.id)}
                    onToggle={() => toggleSimilarProducts(result.product.id)}
                  />
                )}

                {/* 영어 버전: 하드코딩된 관련 제품 */}
                {result.status === 'success' && locale === 'en' && relatedProductsMap && (
                  <RelatedProductsSectionUS
                    items={getRelatedProductsForResult(result, relatedProductsMap)}
                  />
                )}
              </Card>
            );
          })}

          <Alert variant="warning" className="mt-6">
            {t('warning.checkConcentration')}
          </Alert>
        </>
      )}
    </div>
  );
}

type SimilarProductsSectionProps = {
  productId: string;
  productName: string;
  items: EasyDrugItem[];
  isExpanded: boolean;
  onToggle: () => void;
};

function SimilarProductsSection({
  productName,
  items,
  isExpanded,
  onToggle,
}: SimilarProductsSectionProps) {
  const t = useTranslations('result.similarProducts');
  const locale = useLocale();
  const buttonLabel = isExpanded ? t('hide') : t('show');

  const handleToggle = () => {
    if (!isExpanded) {
      trackDrugInfoView(productName);
    }
    onToggle();
  };

  return (
    <div className="mt-5 border-t border-gray-200 pt-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="text-lg font-semibold text-gray-800">{t('title')}</h4>
        <Button
          type="button"
          className="w-full sm:w-auto"
          onClick={handleToggle}
        >
          {buttonLabel}
        </Button>
      </div>

      {!isExpanded && (
        <p className="mt-2 text-sm text-gray-500">
          {t('description')}
        </p>
      )}

      {isExpanded && (
        <div className="mt-4 space-y-3">
          {items.length === 0 ? (
            <p className="text-sm text-gray-500">
              {t('notFound')}
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.itemSeq}
                className="rounded-lg border border-gray-200 bg-gray-50 p-3"
              >
                <div className="flex flex-row items-center gap-3">
                  {item.itemImage && (
                    <Image
                      src={item.itemImage}
                      alt={`${item.itemName} ${locale === 'en' ? 'product image' : '제품 이미지'}`}
                      width={60}
                      height={60}
                      unoptimized
                      className="h-15 w-15 rounded-lg border border-gray-200 bg-white object-contain flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-gray-800 truncate">
                      {item.itemName}
                    </p>
                    {item.entpName && (
                      <p className="text-sm text-gray-600 mt-1">
                        {item.entpName}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// 헬퍼 함수: 결과에 대한 관련 제품 가져오기
function getRelatedProductsForResult(
  result: DosageResult,
  relatedProductsMap: RelatedProductsMapUS
): RelatedProduct[] {
  const ingredientMap: Record<string, string> = {
    '아세트아미노펜': 'acetaminophen',
    'Acetaminophen': 'acetaminophen',
    '이부프로펜': 'ibuprofen',
    'Ibuprofen': 'ibuprofen',
  };

  const ingredient = ingredientMap[result.product.ingredient] ||
                     ingredientMap[result.product.ingredientEn || ''];
  const key = `${ingredient}_${result.product.strength_mg_per_ml}`;

  return relatedProductsMap[key] ?? [];
}

// 미국 시장 관련 제품 섹션
function RelatedProductsSectionUS({ items }: { items: RelatedProduct[] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (items.length === 0) return null;

  return (
    <div className="mt-5 border-t border-gray-200 pt-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-semibold text-gray-800">
          Related Products (Same Strength)
        </h4>
        <Button
          type="button"
          className="text-sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Hide' : 'Show'} ({items.length})
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-white"
            >
              <span
                className={`px-2 py-1 text-xs font-bold rounded ${
                  item.type === 'generic'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {item.type.toUpperCase()}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600">{item.strength}</p>
                {item.note && (
                  <p className="text-xs text-gray-500 mt-1 italic">💡 {item.note}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">{item.manufacturer}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type NextDoseBannerProps = {
  info: NextDoseInfo;
  ingredientKey: string;
  locale: string;
};

function NextDoseBanner({ info, locale }: NextDoseBannerProps) {
  const t = useTranslations('result.nextDose');

  if (info.status === 'wait') {
    return (
      <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-3">
        <p className="text-sm font-semibold text-amber-800">
          ⏰ {t('waitTitle')}
        </p>
        <p className="mt-1 text-base font-bold text-amber-900">
          {formatClockTime(info.nextDoseAtMs, locale)}
        </p>
        <p className="mt-1 text-xs text-amber-700">
          {t('waitDetail', { duration: formatDuration(info.minutesUntilNext, locale) })}
        </p>
      </div>
    );
  }

  if (info.status === 'ready') {
    return (
      <div className="mt-4 rounded-lg border border-green-300 bg-green-50 p-3">
        <p className="text-sm font-semibold text-green-800">
          ✅ {t('readyTitle')}
        </p>
        <p className="mt-1 text-xs text-green-700">{t('readyDetail')}</p>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-lg border border-blue-300 bg-blue-50 p-3">
      <p className="text-sm font-semibold text-blue-800">
        🔄 {t('differentTitle')}
      </p>
      <p className="mt-1 text-xs text-blue-700">{t('differentDetail')}</p>
    </div>
  );
}

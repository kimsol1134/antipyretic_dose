'use client';

import Image from 'next/image';
import React, { useMemo, useState } from 'react';
import {
  DOSAGE_RESULTS_MIN_HEIGHT_CLASS,
  ML_ROUNDING_DECIMALS,
} from '@/lib/constants';
import {
  useDosageResults,
  useDosageStatus,
} from '@/store/dosage-store';
import type { SimilarProductsMap, DosageResult } from '@/lib/types';
import type { EasyDrugItem } from '@/lib/easy-drug';
import { Alert } from './ui/Alert';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

type DosageResultDisplayProps = {
  similarProductsMap: SimilarProductsMap;
};

type GroupedResult = {
  groupKey: string;
  results: DosageResult[];
  primaryResult: DosageResult;
};

function formatMl(value: number): string {
  return value.toFixed(ML_ROUNDING_DECIMALS);
}

export default function DosageResultDisplay({
  similarProductsMap,
}: DosageResultDisplayProps) {
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
      }
      return next;
    });
  };

  return (
    <div className={`mt-8 space-y-4 ${DOSAGE_RESULTS_MIN_HEIGHT_CLASS}`}>
      {status === 'calculated' && results.length > 0 && (
        <>
          <h2 className="text-2xl font-bold text-center">계산 결과</h2>
          {groupedResults.map((group) => {
            const result = group.primaryResult;

            return (
              <Card key={group.groupKey}>
                {/* 성분 및 농도 정보 */}
                <div className="mb-4 pb-3 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {result.product.ingredient}
                  </h3>
                  <p className="text-sm text-gray-500">
                    농도: {result.product.strength_mg_per_ml} mg/mL
                  </p>
                </div>

                {/* 제품 이미지들 */}
                <div className="flex flex-wrap gap-6 mb-4">
                  {group.results.map((r) => (
                    <div key={r.product.id} className="flex flex-col items-center">
                      <div className="w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white shadow-md p-3">
                        <Image
                          src={r.product.image}
                          alt={r.product.name}
                          width={240}
                          height={240}
                          className="object-contain max-w-full max-h-full"
                        />
                      </div>
                      <p className="text-sm font-bold text-gray-800 mt-3 text-center max-w-[200px] sm:max-w-[240px]">
                        {r.product.name}
                      </p>
                    </div>
                  ))}
                </div>

                {result.status === 'success' && result.min_ml !== null && result.max_ml !== null && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    {/* 1회 복용량 */}
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-1">1회 복용량</p>
                      <p className="text-4xl font-extrabold text-blue-600">
                        {formatMl(result.min_ml)} ~ {formatMl(result.max_ml)} mL
                      </p>
                    </div>

                    {/* 복용 간격 및 횟수 */}
                    <div className="flex flex-wrap gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">복용 간격:</span>
                        <span className="text-base font-semibold text-gray-900">
                          {result.product.interval_hours}시간
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">1일 최대:</span>
                        <span className="text-base font-semibold text-gray-900">
                          {result.product.max_doses_per_day}회
                        </span>
                      </div>
                    </div>

                    {/* 하루 최대 용량 */}
                    {result.max_daily_ml !== null && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <p className="text-sm text-red-600 font-medium">
                          ⚠️ 하루 최대 복용량: <span className="text-lg font-bold">{formatMl(result.max_daily_ml)} mL</span>
                        </p>
                      </div>
                    )}

                    {/* 경고 메시지 */}
                    {result.message && (
                      <p className="mt-3 text-sm text-yellow-700 font-medium bg-yellow-50 p-2 rounded">
                        ℹ️ {result.message}
                      </p>
                    )}
                  </div>
                )}

                {result.status === 'age_block' && (
                  <Alert variant="warning">{result.message}</Alert>
                )}

                {result.status === 'error' && (
                  <Alert variant="error">{result.message}</Alert>
                )}

                {result.status === 'success' && (
                  <SimilarProductsSection
                    productId={result.product.id}
                    items={similarProductsMap[result.product.id] ?? []}
                    isExpanded={expandedProducts.has(result.product.id)}
                    onToggle={() => toggleSimilarProducts(result.product.id)}
                  />
                )}
              </Card>
            );
          })}

          <Alert variant="warning" className="mt-6">
            <span className="font-bold">중요:</span> 가지고 계신 약의 이름과
            농도(예: 160mg/5mL)를 꼭 확인하세요. 다른 감기약의 &apos;아세트아미노펜&apos; /
            &apos;이부프로펜&apos; 성분 중복을 꼭 확인하세요.
          </Alert>
        </>
      )}
    </div>
  );
}

type SimilarProductsSectionProps = {
  productId: string;
  items: EasyDrugItem[];
  isExpanded: boolean;
  onToggle: () => void;
};

function SimilarProductsSection({
  items,
  isExpanded,
  onToggle,
}: SimilarProductsSectionProps) {
  const buttonLabel = isExpanded ? '유사 약품 숨기기' : '유사 약품 보기';

  return (
    <div className="mt-5 border-t border-gray-200 pt-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="text-lg font-semibold text-gray-800">유사 약품 정보</h4>
        <Button
          type="button"
          className="w-full sm:w-auto"
          onClick={onToggle}
        >
          {buttonLabel}
        </Button>
      </div>

      {!isExpanded && (
        <p className="mt-2 text-sm text-gray-500">
          성분과 농도가 같은 어린이용 해열제를 확인해보세요.
        </p>
      )}

      {isExpanded && (
        <div className="mt-4 space-y-3">
          {items.length === 0 ? (
            <p className="text-sm text-gray-500">
              성분과 농도가 같은 유사 약품을 찾지 못했습니다.
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
                      alt={`${item.itemName} 이미지`}
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

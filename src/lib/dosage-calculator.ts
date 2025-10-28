import {
  ML_ROUNDING_DECIMALS,
  MONTHS_PER_YEAR,
} from './constants';
import type { DosageInput, DosageResult, Product } from './types';

function roundMl(value: number): number {
  const factor = 10 ** ML_ROUNDING_DECIMALS;
  return Math.round(value * factor) / factor;
}

function calculateSingleDosage(
  weightKg: number,
  ageMonths: number,
  product: Product
): Omit<DosageResult, 'product'> {
  if (ageMonths < product.min_age_months) {
    return {
      status: 'age_block',
      min_ml: null,
      max_ml: null,
      max_single_ml: null,
      max_daily_ml: null,
      message: `${product.min_age_months}개월 미만 영아는 의사 상담이 필요합니다.`,
    };
  }

  // 농도 검증
  if (product.strength_mg_per_ml <= 0) {
    console.error(`[안전 오류] 제품 ${product.id}의 농도가 0 이하입니다.`);
    return {
      status: 'error',
      min_ml: null,
      max_ml: null,
      max_single_ml: null,
      max_daily_ml: null,
      message: '제품 데이터 오류 (농도 0).',
    };
  }

  // 최소 용량 계산 (mg)
  let minMg = weightKg * product.min_dose_mg_per_kg;
  // 최대 용량 계산 (mg)
  let maxMg = weightKg * product.max_dose_mg_per_kg;

  let statusMessage: string | null = null;

  // 최대 단회 용량 제한 확인
  if (maxMg > product.max_single_mg) {
    maxMg = product.max_single_mg;
    statusMessage = '1회 최대 용량으로 조정됨';
  }
  if (minMg > product.max_single_mg) {
    minMg = product.max_single_mg;
  }

  // mL로 변환
  const minMl = minMg / product.strength_mg_per_ml;
  const maxMl = maxMg / product.strength_mg_per_ml;
  const maxSingleMl = product.max_single_mg / product.strength_mg_per_ml;

  // 하루 최대 용량 계산 (mg → mL)
  let maxDailyMg = weightKg * product.max_daily_mg_per_kg;
  let maxDailyMl = maxDailyMg / product.strength_mg_per_ml;

  // 이부프로펜과 덱시부프로펜의 경우 30kg 미만 소아는 25mL로 제한
  if ((product.ingredient === '이부프로펜' || product.ingredient === '덱시부프로펜') && weightKg < 30) {
    maxDailyMl = Math.min(maxDailyMl, 25);
  }

  // 유한성 검증
  if (!Number.isFinite(minMl) || !Number.isFinite(maxMl) || !Number.isFinite(maxSingleMl) || !Number.isFinite(maxDailyMl)) {
    console.error(
      `[안전 오류] 제품 ${product.id} 계산 결과가 유한하지 않습니다`
    );
    return {
      status: 'error',
      min_ml: null,
      max_ml: null,
      max_single_ml: null,
      max_daily_ml: null,
      message: '계산 오류 (유한하지 않은 값).',
    };
  }

  return {
    status: 'success',
    min_ml: roundMl(minMl),
    max_ml: roundMl(maxMl),
    max_single_ml: roundMl(maxSingleMl),
    max_daily_ml: roundMl(maxDailyMl),
    message: statusMessage,
  };
}

export function calculateAllDosages(
  input: DosageInput,
  products: Product[]
): DosageResult[] {
  const ageMonths =
    input.ageUnit === 'years'
      ? input.age * MONTHS_PER_YEAR
      : input.age;

  return products.map((product) => {
    const result = calculateSingleDosage(input.weight, ageMonths, product);
    return {
      product,
      ...result,
    };
  });
}

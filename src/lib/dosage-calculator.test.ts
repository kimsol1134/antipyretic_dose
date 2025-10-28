import { describe, expect, it } from 'vitest';
import productsData from '../../data/products.json';
import { calculateAllDosages } from './dosage-calculator';
import type { DosageInput, Product } from './types';

const products = productsData as Product[];

const findProduct = (id: string): Product => {
  const product = products.find((item) => item.id === id);
  if (!product) {
    throw new Error(`Test product with id ${id} was not found.`);
  }
  return product;
};

describe('calculateAllDosages', () => {
  it('returns age_block when patient age is below product minimum', () => {
    const ibuprofen = findProduct('brufen_susp_100_5_kr');
    const input: DosageInput = { weight: 7, age: 3, ageUnit: 'months' };

    const [result] = calculateAllDosages(input, [ibuprofen]);

    expect(result.status).toBe('age_block');
    expect(result.min_ml).toBeNull();
    expect(result.max_ml).toBeNull();
    expect(result.max_daily_ml).toBeNull();
    expect(result.message).toBe('6개월 미만 영아는 의사 상담이 필요합니다.');
  });

  it('caps dosage at product max_single_mg and returns warning message', () => {
    const tylenol = findProduct('tylenol_susp_100ml_kr');
    const input: DosageInput = { weight: 70, age: 36, ageUnit: 'months' };

    const [result] = calculateAllDosages(input, [tylenol]);

    expect(result.status).toBe('success');
    expect(result.max_ml).toBeCloseTo(20.3, 1);
    expect(result.message).toBe('1회 최대 용량으로 조정됨');
  });

  it('guards against products with zero or negative strength', () => {
    const tylenol = findProduct('tylenol_susp_100ml_kr');
    const invalidStrengthProduct: Product = {
      ...tylenol,
      id: 'invalid_strength_product',
      strength_mg_per_ml: 0,
    };
    const input: DosageInput = { weight: 10, age: 12, ageUnit: 'months' };

    const [result] = calculateAllDosages(input, [invalidStrengthProduct]);

    expect(result.status).toBe('error');
    expect(result.min_ml).toBeNull();
    expect(result.max_ml).toBeNull();
    expect(result.max_daily_ml).toBeNull();
    expect(result.message).toBe('제품 데이터 오류 (농도 0).');
  });

  it('converts years to months before performing calculations', () => {
    const tylenol = findProduct('tylenol_susp_100ml_kr');
    const inputYears: DosageInput = { weight: 15, age: 2, ageUnit: 'years' };
    const inputMonths: DosageInput = { weight: 15, age: 24, ageUnit: 'months' };

    const [yearsResult] = calculateAllDosages(inputYears, [tylenol]);
    const [monthsResult] = calculateAllDosages(inputMonths, [tylenol]);

    expect(yearsResult.status).toBe('success');
    expect(monthsResult.status).toBe('success');
    expect(yearsResult.min_ml).toBe(monthsResult.min_ml);
    expect(yearsResult.max_ml).toBe(monthsResult.max_ml);
    expect(yearsResult.max_daily_ml).toBe(monthsResult.max_daily_ml);
    expect(yearsResult.message).toBe(monthsResult.message);
  });

  it('calculates daily maximum dosage correctly', () => {
    const tylenol = findProduct('tylenol_susp_100ml_kr');
    const input: DosageInput = { weight: 10, age: 12, ageUnit: 'months' };

    const [result] = calculateAllDosages(input, [tylenol]);

    expect(result.status).toBe('success');
    // 10kg × 75 mg/kg = 750mg
    // 750mg ÷ 32 mg/mL = 23.4375 mL
    expect(result.max_daily_ml).toBeCloseTo(23.4, 1);
  });

  it('limits ibuprofen daily maximum to 25mL for children under 30kg', () => {
    const ibuprofen = findProduct('brufen_susp_100_5_kr');
    const input: DosageInput = { weight: 20, age: 24, ageUnit: 'months' };

    const [result] = calculateAllDosages(input, [ibuprofen]);

    expect(result.status).toBe('success');
    // 20kg × 40 mg/kg = 800mg
    // 800mg ÷ 20 mg/mL = 40 mL (계산값)
    // 하지만 30kg 미만이므로 25mL로 제한됨
    expect(result.max_daily_ml).toBe(25);
  });

  it('limits dexibuprofen daily maximum to 25mL for children under 30kg', () => {
    const dexibuprofen = findProduct('maxibufen_susp_12_1_kr');
    const input: DosageInput = { weight: 20, age: 24, ageUnit: 'months' };

    const [result] = calculateAllDosages(input, [dexibuprofen]);

    expect(result.status).toBe('success');
    // 20kg × 28 mg/kg = 560mg
    // 560mg ÷ 12 mg/mL = 46.7 mL (계산값)
    // 하지만 30kg 미만이므로 25mL로 제한됨
    expect(result.max_daily_ml).toBe(25);
  });
});

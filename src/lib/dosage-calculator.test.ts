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
    expect(result.recommended_ml).toBeNull();
    expect(result.min_ml).toBeNull();
    expect(result.max_ml).toBeNull();
    expect(result.max_daily_ml).toBeNull();
    expect(result.message).toBe('6개월 미만 영아는 의사 상담이 필요합니다.');
  });

  it('calculates recommended dose as rounded mid-point of min and max', () => {
    const tylenol = findProduct('tylenol_susp_100ml_kr');
    const input: DosageInput = { weight: 10, age: 12, ageUnit: 'months' };

    const [result] = calculateAllDosages(input, [tylenol]);

    // 타이레놀: 10-15 mg/kg, 중간값 12.5 mg/kg (정수 반올림 하지 않음)
    // 10kg × 12.5mg/kg = 125mg
    // 125mg ÷ 32mg/mL = 3.90625mL → 4mL (정수 반올림)
    expect(result.status).toBe('success');
    expect(result.recommended_ml).toBe(4);
    expect(result.min_ml).toBeCloseTo(3.1, 1);
    expect(result.max_ml).toBeCloseTo(4.7, 1);
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

  it('returns nextDose null when last-dose input is not provided', () => {
    const tylenol = findProduct('tylenol_susp_100ml_kr');
    const input: DosageInput = { weight: 10, age: 12, ageUnit: 'months' };

    const [result] = calculateAllDosages(input, [tylenol]);

    expect(result.nextDose).toBeNull();
  });
});

describe('calculateAllDosages · next-dose awareness', () => {
  const findProductLocal = (id: string): Product => {
    const product = products.find((item) => item.id === id);
    if (!product) throw new Error(`missing ${id}`);
    return product;
  };

  const NOW = new Date('2026-04-22T02:00:00+09:00').getTime();
  const baseInput = { weight: 15, age: 36, ageUnit: 'months' as const };

  it('marks tylenol as "wait" when same-ingredient dose was 1 hour ago', () => {
    const tylenol = findProductLocal('tylenol_susp_100ml_kr');
    const lastDoseAtMs = NOW - 1 * 60 * 60 * 1000; // 1 hour ago
    const input: DosageInput = {
      ...baseInput,
      lastDoseIngredient: 'acetaminophen',
      lastDoseAtMs,
    };

    const [result] = calculateAllDosages(input, [tylenol], NOW);

    expect(result.nextDose?.status).toBe('wait');
    // interval 4h, elapsed 1h → 3h = 180 minutes remaining
    expect(result.nextDose?.minutesUntilNext).toBe(180);
    expect(result.nextDose?.nextDoseAtMs).toBe(lastDoseAtMs + 4 * 60 * 60 * 1000);
  });

  it('marks tylenol as "ready" when same-ingredient dose interval elapsed', () => {
    const tylenol = findProductLocal('tylenol_susp_100ml_kr');
    const lastDoseAtMs = NOW - 5 * 60 * 60 * 1000; // 5 hours ago > 4h interval
    const input: DosageInput = {
      ...baseInput,
      lastDoseIngredient: 'acetaminophen',
      lastDoseAtMs,
    };

    const [result] = calculateAllDosages(input, [tylenol], NOW);

    expect(result.nextDose?.status).toBe('ready');
    expect(result.nextDose?.minutesUntilNext).toBe(0);
  });

  it('marks ibuprofen as "different_ingredient" when last dose was acetaminophen', () => {
    const ibuprofen = findProductLocal('brufen_susp_100_5_kr');
    const lastDoseAtMs = NOW - 30 * 60 * 1000; // 30 min ago
    const input: DosageInput = {
      ...baseInput,
      lastDoseIngredient: 'acetaminophen',
      lastDoseAtMs,
    };

    const [result] = calculateAllDosages(input, [ibuprofen], NOW);

    expect(result.nextDose?.status).toBe('different_ingredient');
    expect(result.nextDose?.minutesUntilNext).toBe(0);
  });

  it('rejects future lastDoseAt gracefully (returns null)', () => {
    const tylenol = findProductLocal('tylenol_susp_100ml_kr');
    const lastDoseAtMs = NOW + 10 * 60 * 1000; // 10 min in the future
    const input: DosageInput = {
      ...baseInput,
      lastDoseIngredient: 'acetaminophen',
      lastDoseAtMs,
    };

    const [result] = calculateAllDosages(input, [tylenol], NOW);

    expect(result.nextDose).toBeNull();
  });

  it('handles dexibuprofen 6-hour interval correctly', () => {
    const dexi = findProductLocal('maxibufen_susp_12_1_kr');
    const lastDoseAtMs = NOW - 2 * 60 * 60 * 1000; // 2 hours ago
    const input: DosageInput = {
      ...baseInput,
      lastDoseIngredient: 'dexibuprofen',
      lastDoseAtMs,
    };

    const [result] = calculateAllDosages(input, [dexi], NOW);

    expect(result.nextDose?.status).toBe('wait');
    // 6h - 2h = 4h = 240 minutes
    expect(result.nextDose?.minutesUntilNext).toBe(240);
  });
});

import { z } from 'zod';
import {
  INGREDIENT_STRENGTH_MAP,
  INGREDIENT_STRENGTH_MAP_EN,
  MAX_WEIGHT_KG,
} from './constants';

export const productSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    nameEn: z.string().min(1).optional(),
    ingredient: z.string().min(1),
    ingredientEn: z.string().min(1).optional(),
    markets: z.array(z.enum(['ko', 'en'])).min(1, '최소 하나의 시장을 지정해야 합니다.'),
    strength_mg_per_ml: z.number().positive('농도는 0보다 커야 합니다.'),
    min_dose_mg_per_kg: z.number().positive('최소 용량은 0보다 커야 합니다.'),
    max_dose_mg_per_kg: z.number().positive('최대 용량은 0보다 커야 합니다.'),
    min_age_months: z.number().int().min(0),
    max_single_mg: z.number().positive(),
    max_daily_mg_per_kg: z.number().positive('하루 최대 용량은 0보다 커야 합니다.'),
    interval_hours: z.number().positive(),
    max_doses_per_day: z.number().positive(),
    image: z.string().min(1),
    imageEn: z.string().min(1).optional(),
    fdaApproved: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // 검증 1: 한국어 성분명 + 농도 일치
      const { ingredient, strength_mg_per_ml } = data;
      const expectedStrengths =
        INGREDIENT_STRENGTH_MAP[ingredient as keyof typeof INGREDIENT_STRENGTH_MAP];
      if (expectedStrengths && expectedStrengths.length > 0) {
        return expectedStrengths.includes(strength_mg_per_ml);
      }
      return true;
    },
    {
      message:
        '성분명과 mL당 농도(strength_mg_per_ml)가 일치하지 않습니다. 데이터 오류를 확인하세요.',
    }
  )
  .refine(
    (data) => {
      // 검증 2: 영어 성분명 + 농도 일치 (있는 경우)
      if (!data.ingredientEn) return true;
      const expectedStrengths =
        INGREDIENT_STRENGTH_MAP_EN[data.ingredientEn as keyof typeof INGREDIENT_STRENGTH_MAP_EN];
      if (expectedStrengths) {
        return expectedStrengths.includes(data.strength_mg_per_ml);
      }
      return true;
    },
    {
      message: 'English ingredient name and concentration mismatch.',
    }
  )
  .refine(
    (data) => {
      // 검증 3: 영어 시장 제품은 nameEn, ingredientEn 필수
      if (data.markets.includes('en')) {
        return !!data.nameEn && !!data.ingredientEn;
      }
      return true;
    },
    {
      message: 'English market products must have nameEn and ingredientEn.',
    }
  )
  .refine(
    (data) => {
      // 검증 4: FDA 미승인 성분은 미국 시장에 포함 불가
      if (data.markets.includes('en') && data.fdaApproved === false) {
        return false;
      }
      return true;
    },
    {
      message: 'FDA-unapproved ingredients cannot be in English market.',
    }
  );

export const productsSchema = z.array(productSchema);

export const dosageInputSchema = z.object({
  weight: z
    .number({ invalid_type_error: '체중을 숫자로 입력하세요.' })
    .positive('체중은 0보다 커야 합니다.')
    .max(MAX_WEIGHT_KG, '비정상적인 체중입니다. 다시 확인해주세요.'),
  age: z
    .number({ invalid_type_error: '나이를 숫자로 입력하세요.' })
    .int()
    .positive('나이는 0보다 커야 합니다.'),
  ageUnit: z.enum(['months', 'years'], {
    errorMap: () => ({ message: '개월 또는 세를 선택하세요.' }),
  }),
});

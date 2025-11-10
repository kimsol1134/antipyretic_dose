import { z } from 'zod';
import {
  INGREDIENT_STRENGTH_MAP,
  MAX_WEIGHT_KG,
} from './constants';

export const productSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    nameEn: z.string().min(1).optional(),
    ingredient: z.string().min(1),
    ingredientEn: z.string().min(1).optional(),
    strength_mg_per_ml: z.number().positive('농도는 0보다 커야 합니다.'),
    min_dose_mg_per_kg: z.number().positive('최소 용량은 0보다 커야 합니다.'),
    max_dose_mg_per_kg: z.number().positive('최대 용량은 0보다 커야 합니다.'),
    min_age_months: z.number().int().min(0),
    max_single_mg: z.number().positive(),
    max_daily_mg_per_kg: z.number().positive('하루 최대 용량은 0보다 커야 합니다.'),
    interval_hours: z.number().positive(),
    max_doses_per_day: z.number().positive(),
    image: z.string().min(1),
  })
  .refine(
    (data) => {
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

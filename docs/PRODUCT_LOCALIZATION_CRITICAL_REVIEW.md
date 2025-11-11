# 제품 다국어화 전략 비판적 검토 및 개선안

> **작성일**: 2025-11-11
> **작성자**: Senior Web Developer Review
> **대상**: 영어 버전에서 한국 제품명이 표시되는 문제 해결

---

## 📌 Executive Summary

### 현재 문제
- 영어 버전(`/en`)에서 한국 제품명(챔프, 부루펜, 맥시부펜)이 그대로 표시됨
- 미국 사용자에게 구매 불가능한 제품을 보여주는 것은 **의료 안전성 및 UX 측면에서 심각한 문제**

### 기존 계획(INTERNATIONALIZATION_PLAN.md)의 문제점
1. ❌ **데이터 중복**: `products.json`과 `products-us.json` 분리로 인한 dosing guidelines 중복 관리
2. ❌ **Single Source of Truth 위반**: 같은 성분의 의료 데이터가 두 곳에 존재 → 업데이트 시 불일치 위험
3. ❌ **Breaking Change**: `nameEn`을 optional에서 required로 변경하면 기존 한국 데이터도 수정 필요
4. ❌ **과도한 파일 분리**: 8개 이하 제품에 2개 파일은 복잡도 증가
5. ❌ **e약은요 API 처리 누락**: 한국 전용 API를 영어 버전에서 어떻게 처리할지 불명확
6. ❌ **Dexibuprofen 처리 미흡**: 미국 FDA 미승인 성분의 처리 방법 불명확

### 추천 해결 방안
✅ **Single Product File with Market-Based Filtering**
- 단일 `products.json` 유지
- 각 제품에 `markets: ['ko', 'en']` 필드 추가
- 서버에서 `locale`과 `markets`로 필터링
- 의료 데이터는 단일 관리 (Single Source of Truth)

---

## 🔍 기존 계획의 상세 문제 분석

### 1. 의료 데이터 중복 문제 (Critical)

**문제 시나리오**:
```typescript
// ❌ products.json (한국)
{
  "ingredient": "아세트아미노펜",
  "strength_mg_per_ml": 32,
  "min_dose_mg_per_kg": 10,
  "max_dose_mg_per_kg": 15,
  "max_single_mg": 650
}

// ❌ products-us.json (미국)
{
  "ingredientEn": "Acetaminophen",
  "strength_mg_per_ml": 32,
  "min_dose_mg_per_kg": 10,  // 👈 중복!
  "max_dose_mg_per_kg": 15,  // 👈 중복!
  "max_single_mg": 650       // 👈 중복!
}
```

**위험성**:
- AAP/FDA 가이드라인 업데이트 시 **두 파일 모두 수정** 필요
- 한 곳만 업데이트하면 **한국과 미국 버전의 dosing이 불일치**
- 의료 계산기에서 데이터 불일치는 **환자 안전 사고**로 이어질 수 있음

**의료 소프트웨어 표준 위반**:
- IEC 62304 의료 소프트웨어 안전 표준에서 요구하는 **Single Source of Truth** 원칙 위반
- 데이터 무결성(Data Integrity) 보장 불가

---

### 2. 타입 안정성 및 하위 호환성 문제

**기존 계획의 Breaking Change**:
```typescript
// ❌ 기존 계획: nameEn을 required로 변경
export const productSchema = z.object({
  name: z.string(),
  nameEn: z.string(),  // 👈 required로 변경하면?
  ingredient: z.string(),
  ingredientEn: z.string(),  // 👈 이것도 required
  // ...
});
```

**문제점**:
1. 기존 `products.json`의 모든 제품(4개)에 `nameEn`, `ingredientEn` 필드를 **강제로 추가**해야 함
2. 한국 전용 제품(챔프, 맥시부펜)에도 억지로 영어 이름을 만들어야 함
   - "Champ Red Syrup" → 의미 없는 직역
   - "Maxibufen Suspension" → 한국에서만 판매되는데 영어명이 필요?
3. 기존 Build-time validation 로직 깨짐 가능성

---

### 3. e약은요 API 통합 문제

**현재 구조**:
```typescript
// src/lib/easy-drug.ts
// 한국 식약처 "e약은요" API 클라이언트
export async function fetchSimilarProducts(
  ingredient: string,
  strength: number
): Promise<EasyDrugItem[]> {
  // API_KEY는 한국 식약처에서 발급
  // 한국 의약품만 검색 가능
}
```

**기존 계획의 누락 사항**:
- 영어 버전에서 미국 제품(Tylenol, Advil)을 보여줄 때, "유사 제품 보기" 버튼은?
- FDA API는 존재하지 않음 (대안: DailyMed API는 있지만 복잡도 높음)
- 영어 버전에서 "유사 제품" 기능을 아예 숨겨야 하는지 불명확

**추천 처리**:
```typescript
// src/app/[locale]/page.tsx
const similarProducts = locale === 'ko'
  ? await getSimilarProducts()  // 한국만 API 호출
  : {};  // 영어 버전은 빈 객체
```

---

### 4. 파일 분리의 복잡도 vs 이점 분석

**현재 제품 수**:
- 한국: 5개 (타이레놀 100mL, 타이레놀 200mL, 챔프, 부루펜, 맥시부펜)
- 미국 (예상): 3개 (Tylenol, Advil, Motrin)
- **총 8개 이하**

**파일 분리 시 복잡도**:
```
복잡도 증가 요소:
1. 파일 로딩 로직 분기 (locale별)
2. Zod 스키마 검증 2회 실행 (build-time)
3. 타입 정의 복잡화 (nameEn required vs optional)
4. 테스트 fixture 2벌 관리
5. 문서화 복잡도 증가

이점:
1. 파일 크기 약간 감소 (but 8개 제품이면 차이 미미)
2. 관심사 분리 (but 의료 데이터는 오히려 통합 관리가 안전)
```

**ROI 분석**: **복잡도 증가 > 이점** → 파일 분리는 **비효율적**

---

### 5. FDA 승인 차이 처리 누락

**Critical Case: Dexibuprofen**
```
성분: 덱시부프로펜 (Dexibuprofen)
- 한국: 식약처 승인 ✅ (맥시부펜 시럽)
- 미국: FDA 승인 ❌ (시판 불가)
```

**기존 계획의 처리**:
- "미국 제품에는 Dexibuprofen을 추가하지 않는다" → **어떻게?**
- `products-us.json`에 해당 제품만 빼면 되지만, **파일이 분리되어 있어서 관계 파악 어려움**

**더 나은 방식**:
```json
{
  "id": "maxibufen_susp_12_1_kr",
  "markets": ["ko"],  // 👈 명시적으로 한국 시장만
  "ingredient": "덱시부프로펜",
  "fdaApproved": false  // 👈 메타데이터로 명시
}
```

---

## ✅ 추천 해결 방안: Market-Based Filtering

### 핵심 아키텍처 결정

```
원칙:
1. Single Source of Truth for Medical Data
2. Minimal Breaking Changes
3. Type Safety Maintenance
4. Scalability for Future Markets
5. Clear Market-Specific Logic
```

---

### 1. 데이터 구조 개선

#### 1.1 Product Schema 수정

**`src/lib/schemas.ts`**:
```typescript
export const productSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    nameEn: z.string().min(1).optional(),  // ✅ optional 유지
    ingredient: z.string().min(1),
    ingredientEn: z.string().min(1).optional(),  // ✅ optional 유지

    // ✅ 신규: 시장 지정
    markets: z.array(z.enum(['ko', 'en'])).min(1),

    // 의료 데이터 (Single Source of Truth)
    strength_mg_per_ml: z.number().positive(),
    min_dose_mg_per_kg: z.number().positive(),
    max_dose_mg_per_kg: z.number().positive(),
    min_age_months: z.number().int().min(0),
    max_single_mg: z.number().positive(),
    max_daily_mg_per_kg: z.number().positive(),
    interval_hours: z.number().positive(),
    max_doses_per_day: z.number().positive(),
    image: z.string().min(1),

    // ✅ 선택: FDA 승인 여부 메타데이터
    fdaApproved: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // 기존 INGREDIENT_STRENGTH_MAP 검증 유지
      const { ingredient, strength_mg_per_ml } = data;
      const expectedStrengths =
        INGREDIENT_STRENGTH_MAP[ingredient as keyof typeof INGREDIENT_STRENGTH_MAP];
      if (expectedStrengths && expectedStrengths.length > 0) {
        return expectedStrengths.includes(strength_mg_per_ml);
      }
      return true;
    },
    {
      message: '성분명과 농도가 일치하지 않습니다.',
    }
  )
  .refine(
    (data) => {
      // ✅ 신규 검증: 영어 시장 제품은 nameEn 필수
      if (data.markets.includes('en')) {
        return !!data.nameEn && !!data.ingredientEn;
      }
      return true;
    },
    {
      message: 'English market products must have nameEn and ingredientEn',
    }
  );
```

**개선 이유**:
1. ✅ `nameEn` optional 유지 → Breaking Change 없음
2. ✅ `markets` 필드로 명시적 시장 지정
3. ✅ Zod refine으로 "영어 시장 제품은 영어명 필수" 검증
4. ✅ Build-time에 데이터 일관성 체크

---

#### 1.2 products.json 업데이트 (예시)

**`data/products.json`**:
```json
[
  {
    "id": "tylenol_susp_100ml_kr",
    "name": "어린이 타이레놀 현탁액 100mL",
    "nameEn": "Children's Tylenol Oral Suspension (160mg/5mL)",
    "ingredient": "아세트아미노펜",
    "ingredientEn": "Acetaminophen",
    "markets": ["ko", "en"],
    "strength_mg_per_ml": 32,
    "min_dose_mg_per_kg": 10,
    "max_dose_mg_per_kg": 15,
    "min_age_months": 4,
    "max_single_mg": 650,
    "max_daily_mg_per_kg": 75,
    "interval_hours": 4,
    "max_doses_per_day": 5,
    "image": "/images/products/tylenol_susp_100ml_kr.jpg",
    "fdaApproved": true
  },
  {
    "id": "champ_syrup_red_kr",
    "name": "챔프 시럽 (빨강)",
    "ingredient": "아세트아미노펜",
    "markets": ["ko"],
    "strength_mg_per_ml": 32,
    "min_dose_mg_per_kg": 10,
    "max_dose_mg_per_kg": 15,
    "min_age_months": 4,
    "max_single_mg": 650,
    "max_daily_mg_per_kg": 75,
    "interval_hours": 4,
    "max_doses_per_day": 5,
    "image": "/images/products/champ_syrup_red_kr.jpg",
    "fdaApproved": false
  },
  {
    "id": "maxibufen_susp_12_1_kr",
    "name": "맥시부펜 시럽",
    "ingredient": "덱시부프로펜",
    "markets": ["ko"],
    "strength_mg_per_ml": 12,
    "min_dose_mg_per_kg": 5,
    "max_dose_mg_per_kg": 7,
    "min_age_months": 6,
    "max_single_mg": 240,
    "max_daily_mg_per_kg": 28,
    "interval_hours": 6,
    "max_doses_per_day": 4,
    "image": "/images/products/maxibufen_susp_12_1_kr.jpg",
    "fdaApproved": false
  },
  {
    "id": "advil_infant_us",
    "name": "어린이 애드빌",
    "nameEn": "Children's Advil Oral Suspension (100mg/5mL)",
    "ingredient": "이부프로펜",
    "ingredientEn": "Ibuprofen",
    "markets": ["en"],
    "strength_mg_per_ml": 20,
    "min_dose_mg_per_kg": 5,
    "max_dose_mg_per_kg": 10,
    "min_age_months": 6,
    "max_single_mg": 400,
    "max_daily_mg_per_kg": 40,
    "interval_hours": 6,
    "max_doses_per_day": 4,
    "image": "/images/products/advil_infant_us.jpg",
    "fdaApproved": true
  },
  {
    "id": "motrin_infant_us",
    "name": "어린이 모트린",
    "nameEn": "Children's Motrin Oral Suspension (100mg/5mL)",
    "ingredient": "이부프로펜",
    "ingredientEn": "Ibuprofen",
    "markets": ["en"],
    "strength_mg_per_ml": 20,
    "min_dose_mg_per_kg": 5,
    "max_dose_mg_per_kg": 10,
    "min_age_months": 6,
    "max_single_mg": 400,
    "max_daily_mg_per_kg": 40,
    "interval_hours": 6,
    "max_doses_per_day": 4,
    "image": "/images/products/motrin_infant_us.jpg",
    "fdaApproved": true
  }
]
```

**주요 변경 사항**:
1. ✅ **한국 전용 제품** (`챔프`, `맥시부펜`): `markets: ["ko"]`만 지정, `nameEn` 없음
2. ✅ **미국 전용 제품** (`Advil`, `Motrin`): `markets: ["en"]`, `nameEn` 필수
3. ✅ **공통 제품** (`타이레놀`): `markets: ["ko", "en"]`, 양쪽 이름 모두 있음
4. ✅ **의료 데이터는 한 곳에만 정의** (Single Source of Truth)

---

### 2. 서버 컴포넌트 로직 수정

#### 2.1 Locale-based Filtering 추가

**`src/app/[locale]/page.tsx`**:
```typescript
import fs from 'fs/promises';
import path from 'path';
import { getTranslations } from 'next-intl/server';
import { productsSchema } from '@/lib/schemas';
import type { Product, SimilarProductsMap } from '@/lib/types';
import DosageForm from '../components/DosageForm';
import DosageResultDisplay from '../components/DosageResultDisplay';

// ✅ 로케일별 제품 필터링
async function getValidatedProducts(locale: string): Promise<Product[]> {
  const filePath = path.join(process.cwd(), 'data', 'products.json');

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(fileContent);
    const allProducts = productsSchema.parse(jsonData);

    // ✅ locale에 따라 필터링
    const marketKey = locale === 'en' ? 'en' : 'ko';
    const filteredProducts = allProducts.filter((product) =>
      product.markets.includes(marketKey)
    );

    return filteredProducts;
  } catch (error) {
    console.error('======= [빌드 실패] products.json 검증 실패 =======');
    console.error(error);
    throw new Error('products.json 데이터 로드 실패');
  }
}

// ✅ 한국 버전만 유사 제품 로드
async function getSimilarProducts(locale: string): Promise<SimilarProductsMap> {
  if (locale !== 'ko') {
    return {};  // 영어 버전에서는 e약은요 API 사용 안 함
  }

  const filePath = path.join(process.cwd(), 'data', 'similar-products.json');
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent) as SimilarProductsMap;
  } catch (error) {
    console.warn('유사 약품 데이터를 불러올 수 없습니다.');
    return {};
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('home');

  // ✅ locale 기반 제품 필터링
  const products = await getValidatedProducts(locale);
  const similarProducts = await getSimilarProducts(locale);

  return (
    <main className="container mx-auto max-w-lg p-4 pt-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-extrabold">{t('title')}</h1>
        <p className="mt-3 text-lg">{t('subtitle')}</p>
        <p className="mt-4 text-xs bg-yellow-50 p-3 rounded">
          {t('warning')}
        </p>
      </header>

      <section className="bg-white p-6 rounded-xl shadow-lg">
        <DosageForm products={products} />
      </section>

      <DosageResultDisplay similarProductsMap={similarProducts} />

      {/* 나머지 동일 */}
    </main>
  );
}
```

**개선 이유**:
1. ✅ 영어 버전(`/en`)에서는 `markets`에 `"en"` 포함된 제품만 표시
2. ✅ 한국 버전(`/`)에서는 `markets`에 `"ko"` 포함된 제품만 표시
3. ✅ e약은요 API는 한국 버전에만 적용
4. ✅ 단일 `products.json` 파일로 관리 → 의료 데이터 중복 없음

---

### 3. 컴포넌트 수정

#### 3.1 DosageResultDisplay 개선

**`src/app/components/DosageResultDisplay.tsx`** (기존 코드 유지, 함수만 개선):
```typescript
function getProductName(product: Product, locale: string): string {
  // ✅ nameEn이 없으면 name 사용 (fallback)
  return locale === 'en' && product.nameEn ? product.nameEn : product.name;
}

function getIngredientName(product: Product, locale: string): string {
  // ✅ ingredientEn이 없으면 ingredient 사용 (fallback)
  return locale === 'en' && product.ingredientEn
    ? product.ingredientEn
    : product.ingredient;
}
```

**변경 없음**: 기존 헬퍼 함수 그대로 사용 가능 (Backward Compatible)

---

### 4. Constants 업데이트

#### 4.1 영어 성분명 추가

**`src/lib/constants.ts`**:
```typescript
export const MONTHS_PER_YEAR = 12;
export const ML_ROUNDING_DECIMALS = 1;
export const WEIGHT_INPUT_STEP = 0.1;
export const AGE_INPUT_STEP = 1;
export const MAX_WEIGHT_KG = 100;

// ✅ 기존: 한국어 성분 → 농도 매핑
export const INGREDIENT_STRENGTH_MAP: Record<string, number[]> = {
  아세트아미노펜: [32, 50],
  이부프로펜: [20],
  덱시부프로펜: [12],
};

// ✅ 신규: 영어 성분 → 농도 매핑 (검증용)
export const INGREDIENT_STRENGTH_MAP_EN: Record<string, number[]> = {
  Acetaminophen: [32, 50],
  Ibuprofen: [20],
  Dexibuprofen: [12],
};

export const DOSAGE_RESULTS_MIN_HEIGHT_CLASS = 'min-h-[300px]';
```

**개선 이유**:
- 영어 성분명도 Build-time validation 가능
- 향후 다국어 확장 대비

---

### 5. 스키마 검증 강화

#### 5.1 Market-Specific Validation

**`src/lib/schemas.ts`** (최종 버전):
```typescript
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
    markets: z.array(z.enum(['ko', 'en'])).min(1),
    strength_mg_per_ml: z.number().positive('농도는 0보다 커야 합니다.'),
    min_dose_mg_per_kg: z.number().positive(),
    max_dose_mg_per_kg: z.number().positive(),
    min_age_months: z.number().int().min(0),
    max_single_mg: z.number().positive(),
    max_daily_mg_per_kg: z.number().positive(),
    interval_hours: z.number().positive(),
    max_doses_per_day: z.number().positive(),
    image: z.string().min(1),
    fdaApproved: z.boolean().optional(),
  })
  .refine(
    (data) => {
      // ✅ 검증 1: 한국어 성분명 + 농도 일치
      const { ingredient, strength_mg_per_ml } = data;
      const expectedStrengths = INGREDIENT_STRENGTH_MAP[ingredient];
      if (expectedStrengths) {
        return expectedStrengths.includes(strength_mg_per_ml);
      }
      return true;
    },
    { message: '성분명과 농도가 일치하지 않습니다.' }
  )
  .refine(
    (data) => {
      // ✅ 검증 2: 영어 성분명 + 농도 일치 (있는 경우)
      if (!data.ingredientEn) return true;
      const expectedStrengths = INGREDIENT_STRENGTH_MAP_EN[data.ingredientEn];
      if (expectedStrengths) {
        return expectedStrengths.includes(data.strength_mg_per_ml);
      }
      return true;
    },
    { message: 'English ingredient name and concentration mismatch.' }
  )
  .refine(
    (data) => {
      // ✅ 검증 3: 영어 시장 제품은 nameEn, ingredientEn 필수
      if (data.markets.includes('en')) {
        return !!data.nameEn && !!data.ingredientEn;
      }
      return true;
    },
    { message: 'English market products must have nameEn and ingredientEn.' }
  )
  .refine(
    (data) => {
      // ✅ 검증 4: FDA 미승인 성분은 미국 시장에 포함 불가
      if (data.markets.includes('en') && data.fdaApproved === false) {
        return false;
      }
      return true;
    },
    { message: 'FDA-unapproved ingredients cannot be in English market.' }
  );

export const productsSchema = z.array(productSchema);

// dosageInputSchema는 동일
export const dosageInputSchema = z.object({
  weight: z
    .number({ invalid_type_error: '체중을 숫자로 입력하세요.' })
    .positive('체중은 0보다 커야 합니다.')
    .max(MAX_WEIGHT_KG, '비정상적인 체중입니다.'),
  age: z
    .number({ invalid_type_error: '나이를 숫자로 입력하세요.' })
    .int()
    .positive('나이는 0보다 커야 합니다.'),
  ageUnit: z.enum(['months', 'years'], {
    errorMap: () => ({ message: '개월 또는 세를 선택하세요.' }),
  }),
});
```

**Build-time 안전성 보장**:
1. ✅ 한국어/영어 성분명과 농도 일치 확인
2. ✅ 영어 시장 제품은 영어명 필수
3. ✅ FDA 미승인 성분은 영어 시장 포함 불가 (자동 차단)
4. ✅ `npm run build` 시 모든 검증 실패 → 배포 차단

---

## 📊 방안 비교표

| 항목 | 기존 계획<br/>(파일 분리) | 추천 방안<br/>(Market Filtering) |
|------|------------------------|--------------------------------|
| **데이터 중복** | ❌ 높음 (dosing guidelines 중복) | ✅ 없음 (Single Source) |
| **Breaking Change** | ❌ 있음 (nameEn required) | ✅ 없음 (optional 유지) |
| **유지보수 복잡도** | ❌ 높음 (2개 파일) | ✅ 낮음 (1개 파일) |
| **타입 안정성** | ⚠️ 보통 (required 변경) | ✅ 높음 (refine 검증) |
| **확장성** | ⚠️ 보통 (파일 추가 필요) | ✅ 높음 (markets 배열 확장) |
| **의료 안전성** | ❌ 위험 (데이터 불일치 가능) | ✅ 안전 (Single Source) |
| **Build 속도** | ⚠️ 느림 (2회 검증) | ✅ 빠름 (1회 검증) |
| **테스트 복잡도** | ❌ 높음 (fixture 2벌) | ✅ 낮음 (fixture 1벌) |
| **FDA 검증** | ❌ 수동 확인 필요 | ✅ 자동 (refine 4) |
| **e약은요 API** | ⚠️ 처리 불명확 | ✅ 명시적 분기 |

---

## 🚀 구현 로드맵

### Phase 1: 데이터 마이그레이션 (2시간)

1. **기존 products.json에 `markets` 필드 추가**
   - 한국 전용 제품: `"markets": ["ko"]`
   - 공통 제품: `"markets": ["ko", "en"]`

2. **미국 제품 3개 추가**
   - Advil, Motrin (Ibuprofen 20mg/mL)
   - 기존 타이레놀은 `markets: ["ko", "en"]`으로 설정

3. **스키마 업데이트**
   - `markets` 필드 추가
   - 4개 refine 검증 추가

4. **빌드 테스트**
   ```bash
   npm run build
   # 모든 검증 통과 확인
   ```

### Phase 2: 서버 로직 수정 (1시간)

1. **`page.tsx`에 필터링 로직 추가**
   - `getValidatedProducts(locale)` 수정
   - `getSimilarProducts(locale)` 분기 추가

2. **타입 업데이트**
   - `src/lib/types.ts`에 `markets` 필드 반영

### Phase 3: 테스트 (1시간)

1. **단위 테스트 추가**
   ```typescript
   // src/lib/__tests__/product-filtering.test.ts
   describe('Product Filtering', () => {
     it('should return only Korean products for ko locale', () => {
       const products = filterProductsByMarket(allProducts, 'ko');
       expect(products.every(p => p.markets.includes('ko'))).toBe(true);
     });

     it('should return only English products for en locale', () => {
       const products = filterProductsByMarket(allProducts, 'en');
       expect(products.every(p => p.markets.includes('en'))).toBe(true);
     });

     it('should not include FDA-unapproved in English market', () => {
       const products = filterProductsByMarket(allProducts, 'en');
       const dexibuprofen = products.find(p => p.ingredient === '덱시부프로펜');
       expect(dexibuprofen).toBeUndefined();
     });
   });
   ```

2. **E2E 테스트**
   - `/en` 접속 → Advil, Motrin, Tylenol만 표시 확인
   - `/` 접속 → 한국 제품 5개 표시 확인

### Phase 4: 문서화 (30분)

1. **CLAUDE.md 업데이트**
   - `markets` 필드 설명 추가
   - 새로운 refine 검증 규칙 문서화

2. **README 업데이트**
   - 다국어 제품 관리 방법 추가

---

## ⚠️ 주의사항

### 1. 의료 데이터 수정 시

```typescript
// ❌ 잘못된 수정 (한 제품만 변경)
{
  "id": "tylenol_susp_100ml_kr",
  "max_dose_mg_per_kg": 15  // 변경
}

// 하지만 같은 성분의 미국 제품은?
{
  "id": "advil_infant_us",
  "max_dose_mg_per_kg": 10  // 그대로?
}
```

**해결책**:
- 성분별로 dosing guidelines 검색 후 **모든 제품 일괄 업데이트**
- 또는 향후 `data/ingredients.json`으로 분리 고려

### 2. 새로운 시장 추가 시

```json
// 향후 일본 시장 추가 예시
{
  "markets": ["ko", "en", "jp"],
  "nameJp": "こども用タイレノール"
}
```

**확장 가능성**:
- `markets` 배열에 locale 추가만 하면 됨
- Zod enum에 `'jp'` 추가
- 추가 refine 검증 작성

### 3. 이미지 파일 관리

```
public/images/products/
├── tylenol_susp_100ml_kr.jpg   (한국+미국 공통)
├── advil_infant_us.jpg          (미국 전용)
├── champ_syrup_red_kr.jpg       (한국 전용)
```

**권장**:
- 미국 제품 이미지는 저작권 확인 필수
- Placeholder 이미지 준비 (이미지 없을 시)

---

## 🎯 결론 및 권장 사항

### ✅ DO (강력 권장)

1. **Single `products.json` with `markets` field** 사용
2. **Optional `nameEn`, `ingredientEn`** 유지 (Breaking Change 방지)
3. **Build-time validation with 4 refines** 적용
4. **Server-side filtering by locale** 구현
5. **e약은요 API는 한국 전용**으로 명시적 분기
6. **단위 테스트 작성** (market filtering, FDA validation)

### ❌ DON'T (피해야 할 사항)

1. ❌ `products.json`과 `products-us.json` 분리 (데이터 중복)
2. ❌ `nameEn`을 required로 변경 (Breaking Change)
3. ❌ 의료 데이터(dosing guidelines)를 여러 곳에 저장
4. ❌ FDA 미승인 성분을 영어 버전에 노출
5. ❌ e약은요 API를 영어 버전에서 호출

### 📈 예상 효과

1. **의료 안전성**: 의료 데이터 불일치 위험 제거
2. **유지보수성**: 파일 1개로 관리, 업데이트 간소화
3. **확장성**: 향후 일본, 유럽 시장 추가 용이
4. **타입 안정성**: Zod refine으로 자동 검증
5. **개발 속도**: Breaking Change 없어 빠른 배포 가능

---

## 📝 다음 단계

이 검토 문서를 기반으로 다음 중 선택해주세요:

1. **즉시 구현** - Phase 1부터 코드 수정 시작
2. **추가 검토** - 특정 부분에 대한 질문/수정
3. **샘플 코드** - 핵심 파일의 Before/After 코드 작성

어떤 방향으로 진행하시겠습니까?

---

**문서 버전**: 1.0
**최종 검토일**: 2025-11-11
**검토자**: Senior Web Developer
**예상 구현 시간**: 4-5시간

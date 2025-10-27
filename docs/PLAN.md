# 개발 구현 계획

### **[최종 실행 지침] 소아 해열제 계산기 v4.0 코드 생성**

**[역할]**
당신은 Vercel 수석 솔루션 아키텍트이자 의료기기 소프트웨어(IEC 62304) 안전 표준 전문가입니다. Core Web Vitals(CWV) 성능을 극한으로 최적화하고 최고 수준의 안전성을 보장하는 Next.js 15 애플리케이션을 구축해야 합니다.

**[임무]**
제시된 3개의 원본 문서를 완벽하게 준수하여, v4.0의 전체 코드베이스를 다음 파일 구조와 **안전/성능 수정 사항이 반영된** 제약 조건에 따라 생성하십시오.

-----

### 1\. 기본 설정 (Configs)

#### `/tailwind.config.ts`

  * 표준 Tailwind CSS 설정을 생성합니다.
  * `content` 배열이 `/app/**/*.{js,ts,jsx,tsx,mdx}` 경로를 올바르게 스캔하도록 설정합니다.

<!-- end list -->

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
```

-----

### 2\. 데이터 및 핵심 로직 (Data & Libs)

#### `/data/products.json`

  * 명시된 4가지 고정 제품 목록을 JSON 형식으로 생성합니다.
  * 필드: `id`, `name`, `ingredient`, `strength_mg_per_ml` (예: 32), `guideline_dose_mg_per_kg`, `min_age_months`, `max_single_mg`, `interval_hours`, `max_doses_per_day`.

<!-- end list -->

```json
[
  {
    "id": "tylenol_susp_160_5_kr",
    "name": "어린이 타이레놀 현탁액",
    "ingredient": "아세트아미노펜",
    "strength_mg_per_ml": 32,
    "guideline_dose_mg_per_kg": 12.5,
    "min_age_months": 3,
    "max_single_mg": 650,
    "interval_hours": 4,
    "max_doses_per_day": 5
  },
  {
    "id": "champ_syrup_red_kr",
    "name": "챔프 시럽 (빨강)",
    "ingredient": "아세트아미노펜",
    "strength_mg_per_ml": 16,
    "guideline_dose_mg_per_kg": 12.5,
    "min_age_months": 3,
    "max_single_mg": 650,
    "interval_hours": 4,
    "max_doses_per_day": 5
  },
  {
    "id": "brufen_susp_100_5_kr",
    "name": "어린이 부루펜 시럽",
    "ingredient": "이부프로펜",
    "strength_mg_per_ml": 20,
    "guideline_dose_mg_per_kg": 7.5,
    "min_age_months": 6,
    "max_single_mg": 400,
    "interval_hours": 6,
    "max_doses_per_day": 4
  },
  {
    "id": "maxibufen_susp_12_1_kr",
    "name": "맥시부펜 시럽",
    "ingredient": "덱시부프로펜",
    "strength_mg_per_ml": 12,
    "guideline_dose_mg_per_kg": 6,
    "min_age_months": 6,
    "max_single_mg": 240,
    "interval_hours": 6,
    "max_doses_per_day": 4
  }
]
```

#### `/lib/types.ts`

  * `Product`, `DosageInput`, `DosageResultStatus`, `DosageResult`, `DosageStoreState` 타입을 Zod 스키마 추론 및 요구사항에 맞게 정의합니다.

<!-- end list -->

```typescript
import { z } from 'zod';
import { dosageInputSchema, productSchema } from './schemas';

// Zod 스키마에서 타입 추론
export type Product = z.infer<typeof productSchema>;
export type DosageInput = z.infer<typeof dosageInputSchema>;

// 계산 결과 상태 타입
export type DosageResultStatus = 'success' | 'age_block' | 'error';

// 개별 계산 결과 타입
export type DosageResult = {
  product: Product;
  status: DosageResultStatus;
  calculated_ml: number | null; // 계산된 용량 (mL)
  message: string | null;       // 상태 메시지
};

// Zustand 스토어 상태 타입
export type DosageStoreState = {
  results: DosageResult[];
  status: 'idle' | 'calculated';
  actions: {
    calculateAllDosages: (input: DosageInput, products: Product[]) => void;
    clearResults: () => void;
  };
};
```

#### `/lib/schemas.ts`

  * **[제약 2, 3]** Zod 스키마를 정의합니다.
  * **[수정 S-1]** `productSchema`에 `z.refine`을 추가하여 성분명과 농도 간의 논리적 일치성을 **반드시 검증**합니다.
  * [제약 3] `dosageInputSchema`에 `transform` 로직을 **절대** 포함하지 마십시오.

<!-- end list -->

```typescript
import { z } from 'zod';

// [제약 2] products.json 데이터 무결성 검증용 스키마
export const productSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  ingredient: z.string().min(1),
  strength_mg_per_ml: z.number().positive('농도는 0보다 커야 합니다.'),
  guideline_dose_mg_per_kg: z.number().positive(),
  min_age_months: z.number().int().min(0),
  max_single_mg: z.number().positive(),
  interval_hours: z.number().positive(),
  max_doses_per_day: z.number().positive(),
})
// [수정 S-1] 치명적 오류 방지를 위한 논리적 데이터 검증
.refine(
  (data) => {
    const { ingredient, strength_mg_per_ml } = data;
    if (ingredient === '아세트아미노펜') {
      // 160mg/5mL = 32, 80mg/5mL = 16
      return strength_mg_per_ml === 32 || strength_mg_per_ml === 16;
    }
    if (ingredient === '이부프로펜') {
      // 100mg/5mL = 20
      return strength_mg_per_ml === 20;
    }
    if (ingredient === '덱시부프로펜') {
      // 12mg/1mL = 12
      return strength_mg_per_ml === 12;
    }
    return true; // 등록되지 않은 성분은 통과 (향후 확장 대비)
  },
  {
    message: '성분명과 mL당 농도(strength_mg_per_ml)가 일치하지 않습니다. 데이터 오류를 확인하세요.',
  }
);

export const productsSchema = z.array(productSchema);

// [제약 3] 사용자 입력 폼(RHF) 유효성 검사용 스키마
export const dosageInputSchema = z.object({
  weight: z
    .number({ invalid_type_error: '체중을 숫자로 입력하세요.' })
    .positive('체중은 0보다 커야 합니다.')
    .max(100, '비정상적인 체중입니다. 다시 확인해주세요.'),
  age: z
    .number({ invalid_type_error: '나이를 숫자로 입력하세요.' })
    .int()
    .positive('나이는 0보다 커야 합니다.'),
  ageUnit: z.enum(['months', 'years'], {
    errorMap: () => ({ message: '개월 또는 세를 선택하세요.' }),
  }),
});
```

#### `/lib/dosage-calculator.ts`

  * **[제약 3, 4]** React와 독립적인 순수 TypeScript 계산 엔진입니다.
  * [제약 3] `calculateAllDosages`는 원본 `DosageInput`을 받아 내부에서 `age_months`를 변환합니다.
  * [제약 4] `calculateSingleDosage` 내부에 `Division by Zero` 방지 및 `Number.isFinite` 런타임 방어 코드를 **반드시** 구현합니다.

<!-- end list -->

```typescript
import type { DosageInput, Product, DosageResult } from './types';

/**
 * 단일 제품에 대한 용량을 계산합니다. (내부 헬퍼 함수)
 */
function calculateSingleDosage(
  weight: number,
  age_months: number,
  product: Product
): Omit<DosageResult, 'product'> {
  
  // 1. 연령 하드 블록 (v4.0 안전 규칙 1)
  if (age_months < product.min_age_months) {
    return {
      status: 'age_block',
      calculated_ml: null,
      message: `${product.min_age_months}개월 미만 영아는 의사 상담이 필요합니다.`,
    };
  }

  // 2. 용량 계산 (mg)
  let calculated_mg = weight * product.guideline_dose_mg_per_kg;

  // 3. 최대 용량 가드 (v4.0 안전 규칙 3)
  let message: string | null = null;
  if (calculated_mg > product.max_single_mg) {
    calculated_mg = product.max_single_mg;
    message = '1회 최대 용량으로 조정됨';
  }

  // 4. [제약 4] 런타임 방어 (Division by Zero)
  if (product.strength_mg_per_ml <= 0) {
    console.error(`[안전 오류] 제품 ${product.id}의 농도가 0 이하입니다.`);
    return {
      status: 'error',
      calculated_ml: null,
      message: '제품 데이터 오류 (농도 0).',
    };
  }

  // 5. mL로 변환
  let calculated_ml = calculated_mg / product.strength_mg_per_ml;

  // 6. [제약 4] 런타임 방어 (Infinity/NaN)
  if (!Number.isFinite(calculated_ml)) {
    console.error(`[안전 오류] 제품 ${product.id} 계산 결과가 유한하지 않습니다: ${calculated_ml}`);
    return {
      status: 'error',
      calculated_ml: null,
      message: '계산 오류 (유한하지 않은 값).',
    };
  }

  // 7. 반올림 규칙 (0.1mL 단위)
  const rounded_ml = Math.round(calculated_ml * 10) / 10;

  return {
    status: 'success',
    calculated_ml: rounded_ml,
    message: message,
  };
}

/**
 * [제약 3]
 * 모든 제품에 대해 용량을 계산하는 메인 엔진 함수.
 */
export function calculateAllDosages(
  input: DosageInput,
  products: Product[]
): DosageResult[] {
  
  // [제약 3] 계산 엔진 내부에서 age_months 변환 수행
  const age_months =
    input.ageUnit === 'years' ? input.age * 12 : input.age;

  const results: DosageResult[] = products.map((product) => {
    const calculation = calculateSingleDosage(
      input.weight,
      age_months,
      product
    );
    return {
      product: product,
      ...calculation,
    };
  });

  return results;
}
```

-----

### 3\. 상태 관리 (State)

#### `/store/dosage-store.ts`

  * **[제약 5]** Zustand 스토어 정의.
  * `calculateAllDosages` 액션은 `lib/dosage-calculator.ts`의 순수 함수를 호출하고 결과를 `set`합니다.
  * **[제약 5]** 아토믹 셀렉터 헬퍼(`useDosageResults` 등)를 **반드시** export 합니다.

<!-- end list -->

```typescript
import { create } from 'zustand';
import type { DosageStoreState, DosageInput, Product } from '@/lib/types';
import { calculateAllDosages as calculationEngine } from '@/lib/dosage-calculator';

export const useDosageStore = create<DosageStoreState>((set) => ({
  results: [],
  status: 'idle',
  actions: {
    calculateAllDosages: (input: DosageInput, products: Product[]) => {
      // lib/dosage-calculator.ts의 순수 엔진 호출
      const newResults = calculationEngine(input, products);
      set({ results: newResults, status: 'calculated' });
    },
    clearResults: () => {
      set({ results: [], status: 'idle' });
    },
  },
}));

// [제약 5] 아토믹 셀렉터용 헬퍼
export const useDosageResults = () => useDosageStore((s) => s.results);
export const useDosageStatus = () => useDosageStore((s) => s.status);
export const useDosageActions = () => useDosageStore((s) => s.actions);
```

-----

### 4\. UI 컴포넌트 (Components)

  * **[제약 6]** 모든 UI 컴포넌트는 순수 Tailwind CSS로 작성합니다.

#### `/app/components/ui/Button.tsx`

```typescript
import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`w-full px-4 py-3 font-bold text-white bg-blue-600 rounded-lg shadow-md transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400 ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
```

#### `/app/components/ui/Input.tsx`

  * RHF 연동을 위해 `React.forwardRef`를 사용합니다.

<!-- end list -->

```typescript
import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={`block w-full px-4 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 ${className}`}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
```

#### `/app/components/ui/Card.tsx`

```typescript
import React from 'react';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export const Card = ({ children, className }: CardProps) => {
  return (
    <div
      className={`p-5 bg-white border border-gray-200 rounded-lg shadow-md ${className}`}
    >
      {children}
    </div>
  );
};
```

#### `/app/components/ui/Alert.tsx`

```typescript
import React from 'react';

type AlertProps = {
  children: React.ReactNode;
  variant?: 'warning' | 'error';
  className?: string;
};

export const Alert = ({
  children,
  variant = 'warning',
  className,
}: AlertProps) => {
  const colors =
    variant === 'error'
      ? 'bg-red-100 border-red-400 text-red-700'
      : 'bg-yellow-100 border-yellow-400 text-yellow-700';

  return (
    <div
      className={`px-4 py-3 border rounded-lg ${colors} ${className}`}
      role="alert"
    >
      <p className="font-bold">{variant === 'error' ? '오류' : '주의'}</p>
      <p className="text-sm">{children}</p>
    </div>
  );
};
```

-----

### 5\. 핵심 페이지 컴포넌트 (App)

#### `/app/components/DosageForm.tsx`

  * **[제약 1, 4]** `'use client'` 컴포넌트입니다.
  * [제약 1] `products: Product[]`를 Props로 받습니다. (JSON import 금지)
  * **[수정 P-2]** RHF `useForm`에 `mode: 'onBlur'`를 명시하여 INP 성능을 최적화합니다.
  * **[수정 S-2]** `Input` 컴포넌트에 `type="tel"` 및 `inputMode`를 사용하여 모바일 숫자 키패드를 최적화합니다.

<!-- end list -->

```typescript
'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { dosageInputSchema } from '@/lib/schemas';
import type { DosageInput, Product } from '@/lib/types';
import { useDosageActions } from '@/store/dosage-store';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

type DosageFormProps = {
  // [제약 1] 서버에서 로드된 제품 데이터를 Props로 받음
  products: Product[];
};

export default function DosageForm({ products }: DosageFormProps) {
  const { calculateAllDosages } = useDosageActions();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DosageInput>({
    resolver: zodResolver(dosageInputSchema),
    defaultValues: {
      ageUnit: 'months',
    },
    // [수정 P-2] INP 최적화를 위해 불필요한 onChange 검증 방지
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<DosageInput> = (data) => {
    calculateAllDosages(data, products);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="weight"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          체중 (kg)
        </label>
        <Input
          id="weight"
          // [수정 S-2] 모바일 숫자 키패드 최적화 (오류 방지)
          type="tel"
          inputMode="decimal"
          step="0.1"
          placeholder="예: 10.5"
          {...register('weight', { valueAsNumber: true })}
        />
        {errors.weight && (
          <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>
        )}
      </div>

      <div className="flex space-x-2">
        <div className="flex-1">
          <label
            htmlFor="age"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            나이
          </label>
          <Input
            id="age"
            // [수정 S-2] 모바일 숫자 키패드 최적화 (오류 방지)
            type="tel"
            inputMode="numeric"
            step="1"
            placeholder="예: 18"
            {...register('age', { valueAsNumber: true })}
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor="ageUnit"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            단위
          </label>
          <select
            id="ageUnit"
            {...register('ageUnit')}
            className="block w-full px-4 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="months">개월</option>
            <option value="years">세</option>
          </select>
        </div>
      </div>
      {errors.age && (
        <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
      )}
      {errors.ageUnit && (
        <p className="mt-1 text-sm text-red-600">{errors.ageUnit.message}</p>
      )}

      <Button type="submit" className="text-lg">
        계산하기
      </Button>
    </form>
  );
}
```

#### `/app/components/DosageResultDisplay.tsx`

  * **[제약 5]** `'use client'` 컴포넌트입니다.
  * [제약 5] **반드시** `useDosageResults`와 `useDosageStatus` 아토믹 셀렉터를 사용합니다.
  * **[수정 P-1]** CWV(CLS) 최적화를 위해, 결과가 없을 때도 레이아웃 공간을 확보하도록 최상위 `div`에 `min-h-[value]`를 **반드시** 적용합니다.

<!-- end list -->

```typescript
'use client';

import React from 'react';
import {
  useDosageResults,
  useDosageStatus,
} from '@/store/dosage-store';
import { Card } from './ui/Card';
import { Alert } from './ui/Alert';

export default function DosageResultDisplay() {
  // [제약 5] 아토믹 셀렉터 사용
  const results = useDosageResults();
  const status = useDosageStatus();

  // [수정 P-1] CLS(Layout Shift) 방지를 위해
  // 결과 컨테이너가 항상 최소 높이를 갖도록 수정합니다.
  // (결과가 없을 때는 빈 공간이 됨)
  return (
    <div className="mt-8 space-y-4 min-h-[300px]">
      
      {/* 계산이 완료된 경우에만 내부 컨텐츠를 렌더링 */}
      {status === 'calculated' && results.length > 0 && (
        <>
          <h2 className="text-2xl font-bold text-center">계산 결과</h2>
          {results.map((result) => (
            <Card key={result.product.id}>
              {/* 제품명 및 농도 */}
              <h3 className="text-xl font-semibold text-gray-800">
                {result.product.name}
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                {result.product.ingredient} ({result.product.strength_mg_per_ml}
                mg/mL)
              </p>

              {/* 상태별 분기 처리 */}
              {result.status === 'success' && result.calculated_ml !== null && (
                <div>
                  {/* 핵심 결과 */}
                  <p className="text-4xl font-extrabold text-blue-600 my-2">
                    {result.calculated_ml.toFixed(1)} mL
                  </p>
                  {/* 보조 정보 */}
                  <p className="text-gray-700">
                    {result.product.interval_hours}시간 간격, 1일 최대{' '}
                    {result.product.max_doses_per_day}회
                  </p>
                  {/* 최대 용량 경고 */}
                  {result.message && (
                    <p className="mt-2 text-sm text-yellow-600 font-medium">
                      {result.message}
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
            </Card>
          ))}

          {/* v4.0 안전 경고 */}
          <Alert variant="warning" className="mt-6">
            <span className="font-bold">중요:</span> 가지고 계신 약의 이름과 농도(예: 160mg/5mL)를 꼭 확인하세요. 다른 감기약의 '아세트아미노펜' / '이부프로펜' 성분 중복을 꼭 확인하세요.
          </Alert>
        </>
      )}
    </div>
  );
}
```

#### `/app/layout.tsx`

  * 표준 루트 레이아웃.

<!-- end list -->

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '소아 해열제 용량 계산기 (v4.0)',
  description: '나이와 체중만으로 타이레놀, 부루펜, 맥시부펜 용량을 즉시 계산합니다.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${inter.className} bg-gray-50`}>{children}</body>
    </html>
  );
}
```

#### `/app/page.tsx`

  * **[제약 1, 2]** 서버 컴포넌트입니다.
  * `fs/promises`를 사용하여 **서버 사이드에서** `products.json`을 읽습니다.
  * **[제약 2]** 읽어온 데이터를 즉시 **(수정 S-1이 적용된)** `productsSchema.parse()`로 **검증**합니다.
  * [제약 1] 검증된 `validatedProducts`를 `DosageForm`에 Props로 전달합니다.

<!-- end list -->

```typescript
import fs from 'fs/promises';
import path from 'path';
import { productsSchema } from '@/lib/schemas';
import type { Product } from '@/lib/types';
import DosageForm from './components/DosageForm';
import DosageResultDisplay from './components/DosageResultDisplay';

/**
 * [제약 1, 2]
 * 서버 컴포넌트에서 빌드 시점에 데이터를 로드하고 검증합니다.
 */
async function getValidatedProducts(): Promise<Product[]> {
  const filePath = path.join(process.cwd(), 'data', 'products.json');
  
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(fileContent);
    
    // [제약 2] Zod 스키마로 즉시 검증
    // [수정 S-1]이 적용된 스키마로 인해, 논리적 오류(농도 불일치) 발생 시
    // 여기서 빌드가 실패합니다.
    const validatedProducts = productsSchema.parse(jsonData);
    
    return validatedProducts;
  } catch (error) {
    console.error("======= [빌드 실패] products.json 데이터 검증 실패 =======");
    console.error(error);
    // 빌드 실패 유도
    throw new Error('products.json 데이터 로드 또는 검증에 실패했습니다.');
  }
}

export default async function HomePage() {
  // [제약 1] 서버에서 데이터 로딩
  const products = await getValidatedProducts();

  return (
    <main className="container mx-auto max-w-lg p-4 pt-8 sm:pt-12">
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          소아 해열제 계산기
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          나이와 체중만 입력하면, 주요 해열제 4종의 용량을 바로 알려드려요.
        </p>
      </header>

      <section className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100">
        {/* [제약 1] 
          DosageForm(클라이언트)은 서버에서 Props로 주입받습니다.
        */}
        <DosageForm products={products} />
      </section>

      {/* 결과 표시 컴포넌트 (Zustand로 DosageForm과 통신).
        [수정 P-1]이 적용되어 CLS를 방지합니다.
      */}
      <DosageResultDisplay />

      <footer className="mt-12 text-center text-xs text-gray-500 space-y-2">
        <p>
          {/* v4.0 신뢰 구축 요구사항 */}
          검토자: OOO 약사 (의료 데이터 v1.0 · 2025-10-27 검토)
        </p>
        <p>
          {/* v4.0 법적 면책 조항 */}
          <strong>면책 조항:</strong> 본 계산기는 정보 제공 목적으로만 사용되며, 전문적인 의학적 조언, 진단 또는 치료를 대체할 수 없습니다. 정확한 복용량은 반드시 의사 또는 약사와 상담하세요.
        </p>
      </footer>
    </main>
  );
}
```
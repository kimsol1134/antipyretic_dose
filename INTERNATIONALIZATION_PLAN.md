# 영어 버전 추가 계획 (최종 수정본)

> **목표**: 빠른 구현 (10-14시간 내 완료)
>
> **마지막 수정**: 2025-11-10
>
> **작성 원칙**: 과도한 추상화 제거, 실용적 구현 우선

---

## 📋 목차

1. [비판적 검토 및 주요 변경사항](#비판적-검토-및-주요-변경사항)
2. [최종 아키텍처 결정](#최종-아키텍처-결정)
3. [구현 로드맵 (3단계)](#구현-로드맵-3단계)
4. [상세 구현 가이드](#상세-구현-가이드)
5. [체크리스트](#출시-전-체크리스트)

---

## 🔍 비판적 검토 및 주요 변경사항

### ❌ 제거된 과도한 복잡성

#### 1. **번역 파일 과도한 분리**

**기존 계획**:
```
messages/
├── ko/
│   ├── common.json
│   ├── home.json
│   ├── faq.json
│   ├── validation.json
│   └── products.json
└── en/
    └── (동일 구조)
```

**문제점**:
- 5개 제품, 2개 페이지뿐인 작은 프로젝트에 10개 파일 관리
- import 복잡도 증가
- 번역 누락 가능성 증가

**수정 후** ✅:
```
messages/
├── ko.json         # 모든 한국어 (UI, 검증, SEO)
└── en.json         # 모든 영어
```

**이유**: 프로젝트 규모상 단일 파일이 관리 용이. 200개 키 정도는 단일 파일로 충분.

---

#### 2. **제품 데이터 과도한 추상화**

**기존 계획**:
```typescript
// 옵션 A: 유틸리티 함수 + 번역 파일
export function useLocalizedProduct(product: Product) {
  const t = useTranslations('products');
  return {
    ...product,
    name: t(`${product.id}.name`),
    ingredient: t(`${product.id}.ingredient`)
  };
}

// 옵션 B: 제품 데이터 구조 변경
{
  "name": { "ko": "...", "en": "..." }
}
```

**문제점**:
- 5개 제품에 복잡한 유틸리티 함수는 오버엔지니어링
- 번역 파일에 제품 데이터 분산 시 데이터 일관성 문제

**수정 후** ✅:
```json
{
  "id": "tylenol_susp_100ml_kr",
  "name": "어린이 타이레놀 현탁액 100mL",
  "nameEn": "Children's Tylenol Suspension 100mL",
  "ingredient": "아세트아미노펜",
  "ingredientEn": "Acetaminophen",
  "strength_mg_per_ml": 32,
  ...
}
```

**이유**:
- 가장 직관적이고 빠른 구현
- 타입 안정성 유지 (`Product` 타입에 필드 추가)
- 계산 로직 수정 불필요

---

#### 3. **Phase 과도한 세분화**

**기존 계획**: Phase 1~10 (20-31시간)

**문제점**:
- 10단계는 관리 오버헤드 과다
- "베타 배포" 같은 불필요한 단계 포함

**수정 후** ✅: 3단계 (10-14시간)

1. **설정** (1-2시간)
2. **번역** (5-7시간)
3. **통합** (4-5시간)

---

#### 4. **불필요한 테스트 인프라**

**기존 계획**:
```
src/lib/__tests__/
├── i18n.test.ts
├── product-localization.test.ts
└── metadata.test.ts
```

**문제점**: 빠른 구현에 3개 테스트 파일은 과도

**수정 후** ✅:
- 기존 테스트 수정으로 충분
- 수동 체크리스트 중심

---

#### 5. **과도한 SEO 최적화**

**기존 계획**:
- sitemap 다국어 지원
- robots.txt 수정
- 성능 모니터링 시스템

**문제점**: 초기 출시에 불필요

**수정 후** ✅:
- **필수만**: hreflang 태그, 메타데이터 번역
- **나중에**: sitemap, 성능 최적화

---

## 🎯 최종 아키텍처 결정

### 1. 파일 구조

```
antipyretic_dose/
├── messages/
│   ├── ko.json                    # ✅ 모든 한국어 (단일 파일)
│   └── en.json                    # ✅ 모든 영어 (단일 파일)
│
├── src/
│   ├── i18n/
│   │   └── request.ts             # ✅ i18n 설정
│   │
│   ├── middleware.ts              # ✅ 로케일 감지
│   │
│   ├── app/
│   │   └── [locale]/              # ✅ 로케일 래퍼
│   │       ├── layout.tsx         # 메타데이터 다국어화
│   │       ├── page.tsx           # 홈페이지
│   │       ├── faq/
│   │       │   └── page.tsx
│   │       └── components/
│   │           ├── DosageForm.tsx
│   │           ├── DosageResultDisplay.tsx
│   │           └── LanguageSwitcher.tsx  # ✅ 언어 전환 UI
│   │
│   ├── data/
│   │   └── faq-data-en.ts         # ✅ 영어 FAQ (별도 파일)
│   │
│   └── lib/
│       ├── schemas.ts             # 검증 메시지 다국어화
│       └── utils/
│           └── product-locale.ts  # ✅ 제품 이름/성분 접근 헬퍼
│
└── data/
    └── products.json              # ✅ nameEn, ingredientEn 필드 추가
```

---

### 2. 기술 스택

| 항목 | 선택 | 이유 |
|------|------|------|
| **i18n 라이브러리** | `next-intl` | Next.js 15 App Router 공식 권장 |
| **번역 파일 형식** | JSON | 단순, 타입 안전, 널리 사용됨 |
| **URL 전략** | `localePrefix: 'as-needed'` | 한국어는 `/`, 영어는 `/en` (기존 URL 유지) |
| **제품 데이터** | 직접 필드 추가 | 가장 단순하고 빠름 |
| **FAQ 데이터** | 별도 파일 | HTML 콘텐츠 많아 번역 파일 분리 |

---

### 3. URL 구조

```
현재:
https://example.com/          (한국어)
https://example.com/faq       (한국어)

변경 후:
https://example.com/          (한국어, 기존 URL 유지)
https://example.com/faq       (한국어)

https://example.com/en        (영어)
https://example.com/en/faq    (영어)
```

**선택 이유**:
- 기존 한국어 SEO 유지
- 영어는 `/en` prefix로 명확히 구분
- Accept-Language 헤더로 자동 리다이렉션

---

### 4. 제품 데이터 구조

**수정 전** (`data/products.json`):
```json
{
  "id": "tylenol_susp_100ml_kr",
  "name": "어린이 타이레놀 현탁액 100mL",
  "ingredient": "아세트아미노펜",
  "strength_mg_per_ml": 32
}
```

**수정 후**:
```json
{
  "id": "tylenol_susp_100ml_kr",
  "name": "어린이 타이레놀 현탁액 100mL",
  "nameEn": "Children's Tylenol Suspension 100mL",
  "ingredient": "아세트아미노펜",
  "ingredientEn": "Acetaminophen",
  "strength_mg_per_ml": 32
}
```

**타입 정의**:
```typescript
// src/lib/types.ts
export interface Product {
  id: string;
  name: string;
  nameEn: string;           // ✅ 추가
  ingredient: string;
  ingredientEn: string;     // ✅ 추가
  strength_mg_per_ml: number;
  // ... 나머지 동일
}
```

---

### 5. 번역 파일 구조

**`messages/ko.json`** (예시):
```json
{
  "home": {
    "title": "어린이 해열제 복용량 계산기",
    "subtitle": "체중과 나이만 입력하면 정확한 용량을 알 수 있어요",
    "warning": "⚠️ 이 계산기는 참고용입니다. 실제 투약 전 반드시 의사·약사와 상담하세요."
  },
  "form": {
    "weight": {
      "label": "체중 (kg)",
      "placeholder": "예: 10.5"
    },
    "age": {
      "label": "나이",
      "placeholder": "예: 18",
      "unit": {
        "months": "개월",
        "years": "세(만나이)"
      }
    },
    "submit": "계산하기"
  },
  "result": {
    "title": "계산 결과",
    "concentration": "농도",
    "dosage": {
      "recommended": "1회 복용량 (권장)",
      "range": "복용 가능 범위",
      "interval": "복용 간격",
      "hours": "시간",
      "maxDaily": "1일 최대",
      "times": "회"
    },
    "warning": {
      "maxDailyDose": "⚠️ 하루 최대 복용량",
      "checkConcentration": "중요: 가지고 계신 약의 이름과 농도(예: 160mg/5mL)를 꼭 확인하세요. 다른 제품을 사용하면 용량이 달라질 수 있습니다."
    },
    "similarProducts": {
      "show": "유사 약품 보기",
      "hide": "유사 약품 숨기기",
      "title": "유사 약품 정보",
      "description": "성분과 농도가 같은 어린이용 해열제를 확인해보세요.",
      "notFound": "성분과 농도가 같은 유사 약품을 찾지 못했습니다."
    }
  },
  "validation": {
    "weight": {
      "required": "체중을 숫자로 입력하세요.",
      "positive": "체중은 0보다 커야 합니다.",
      "tooHigh": "비정상적인 체중입니다. 다시 확인해주세요."
    },
    "age": {
      "required": "나이를 숫자로 입력하세요.",
      "positive": "나이는 0보다 커야 합니다."
    },
    "ageUnit": {
      "required": "개월 또는 세를 선택하세요."
    },
    "product": {
      "concentrationZero": "제품 데이터 오류 (농도 0).",
      "ageTooYoung": "{minAge}개월 미만 영아는 의사 상담이 필요합니다.",
      "cappedToMax": "1회 최대 용량으로 조정됨"
    }
  },
  "metadata": {
    "title": "어린이 해열제 복용량 계산기 | 타이레놀·챔프·부루펜 용량표 (체중별)",
    "description": "어린이 해열제 복용량 계산기 | 체중별·나이별 타이레놀, 챔프, 부루펜, 맥시부펜 정확한 용량(mL) 즉시 계산. 식약처 자료 기반 안전한 복용 가이드.",
    "keywords": "어린이 해열제, 타이레놀 복용량, 챔프 시럽, 부루펜 용량, 맥시부펜 계산, 체중별 해열제, 소아 해열제, 아기 해열제, 해열제 계산기"
  },
  "faq": {
    "title": "자주 묻는 질문",
    "subtitle": "어린이 해열제 자주 묻는 질문",
    "description": "타이레놀, 부루펜 등 어린이 해열제 복용법에 대한 정확한 정보를 확인하세요",
    "warning": "⚠️ 본 FAQ는 일반적인 참고 자료입니다. 실제 투약 전 반드시 의사·약사와 상담하세요.",
    "calculatorCta": {
      "title": "정확한 복용량이 궁금하신가요?",
      "description": "체중과 나이만 입력하면 각 제품별 정확한 복용량(mL)을 즉시 계산해드립니다.",
      "button": "복용량 계산기 사용하기 →"
    },
    "breadcrumb": {
      "home": "홈"
    }
  },
  "footer": {
    "source": "출처: 식품의약품안전처_의약품개요정보(e약은요) (2025-10-27 검토)",
    "creator": "제작자: pinecone",
    "usefulInfo": "📖 유용한 정보",
    "links": {
      "feverGuide": "아이 열날 때 해열제, 언제 먹여야 할까?",
      "moreInfo": "더 많은 육아 건강 정보 보기"
    },
    "disclaimer": "이 사이트는 쿠팡 파트너스 활동의 일환으로 일정 수수료를 제공받을 수 있습니다."
  }
}
```

**`messages/en.json`** (예시):
```json
{
  "home": {
    "title": "Children's Fever Medicine Dosage Calculator",
    "subtitle": "Calculate accurate dosage by entering weight and age",
    "warning": "⚠️ This calculator is for reference only. Always consult a doctor or pharmacist before medication."
  },
  "form": {
    "weight": {
      "label": "Weight (kg)",
      "placeholder": "e.g., 10.5"
    },
    "age": {
      "label": "Age",
      "placeholder": "e.g., 18",
      "unit": {
        "months": "months",
        "years": "years"
      }
    },
    "submit": "Calculate"
  },
  "result": {
    "title": "Calculation Result",
    "concentration": "Concentration",
    "dosage": {
      "recommended": "Recommended Single Dose",
      "range": "Dosage Range",
      "interval": "Interval",
      "hours": "hours",
      "maxDaily": "Max Daily",
      "times": "times"
    },
    "warning": {
      "maxDailyDose": "⚠️ Maximum Daily Dose",
      "checkConcentration": "Important: Please check the name and concentration (e.g., 160mg/5mL) of your medication. Different products may require different doses."
    },
    "similarProducts": {
      "show": "Show Similar Products",
      "hide": "Hide Similar Products",
      "title": "Similar Products Information",
      "description": "Check children's fever medicines with the same ingredient and concentration.",
      "notFound": "No similar products with the same ingredient and concentration found."
    }
  },
  "validation": {
    "weight": {
      "required": "Please enter weight as a number.",
      "positive": "Weight must be greater than 0.",
      "tooHigh": "Abnormal weight. Please check again."
    },
    "age": {
      "required": "Please enter age as a number.",
      "positive": "Age must be greater than 0."
    },
    "ageUnit": {
      "required": "Please select months or years."
    },
    "product": {
      "concentrationZero": "Product data error (concentration 0).",
      "ageTooYoung": "Infants under {minAge} months require doctor consultation.",
      "cappedToMax": "Adjusted to maximum single dose"
    }
  },
  "metadata": {
    "title": "Children's Fever Medicine Dosage Calculator | Tylenol, Ibuprofen (Weight-Based)",
    "description": "Calculate accurate dosages for children's fever medicines (Acetaminophen, Ibuprofen, Dexibuprofen) by weight and age. Based on Korean FDA data.",
    "keywords": "children fever medicine, pediatric dosage calculator, acetaminophen dosage, ibuprofen dosage, weight-based medication"
  },
  "faq": {
    "title": "Frequently Asked Questions",
    "subtitle": "Children's Fever Medicine FAQ",
    "description": "Find accurate information about fever medicine usage for children",
    "warning": "⚠️ This FAQ is for general reference. Always consult a doctor or pharmacist before medication.",
    "calculatorCta": {
      "title": "Need Accurate Dosage?",
      "description": "Calculate exact dosage (mL) for each product by entering weight and age.",
      "button": "Use Dosage Calculator →"
    },
    "breadcrumb": {
      "home": "Home"
    }
  },
  "footer": {
    "source": "Source: Korea FDA Drug Information (reviewed 2025-10-27)",
    "creator": "Created by: pinecone",
    "usefulInfo": "📖 Useful Information",
    "links": {
      "feverGuide": "When to Give Fever Medicine to Children?",
      "moreInfo": "More Parenting Health Information"
    },
    "disclaimer": "This site may receive commissions as part of Coupang Partners activities."
  }
}
```

---

## 🚀 구현 로드맵 (3단계)

### Stage 1: 기본 설정 (1-2시간)

**목표**: next-intl 설치 및 라우팅 구조 생성

#### 작업 항목

1. **패키지 설치**
   ```bash
   npm install next-intl
   ```

2. **i18n 설정 파일 생성**

**`src/i18n/request.ts`**:
```typescript
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // 유효하지 않은 locale 처리
  if (!locale || !routing.locales.includes(locale as 'ko' | 'en')) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
```

**`src/i18n/routing.ts`**:
```typescript
import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['ko', 'en'],
  defaultLocale: 'ko',
  localePrefix: 'as-needed' // 한국어는 /, 영어는 /en
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
```

3. **미들웨어 생성**

**`src/middleware.ts`**:
```typescript
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // 모든 경로에 적용 (API 제외)
  matcher: ['/', '/(ko|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
```

4. **Next.js 설정 업데이트**

**`next.config.ts`**:
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: '**',
      },
    ],
  },
  // ✅ i18n 플러그인 추가
  experimental: {
    typedRoutes: true,
  },
};

// ✅ next-intl 플러그인 추가
const withNextIntl = require('next-intl/plugin')('./src/i18n/request.ts');

export default withNextIntl(nextConfig);
```

5. **폴더 구조 변경**

```bash
# 기존 app/ 아래 파일들을 [locale]/ 폴더로 이동
mkdir -p src/app/[locale]
mv src/app/page.tsx src/app/[locale]/
mv src/app/faq src/app/[locale]/
# components, api는 그대로 유지 (공유됨)
```

6. **루트 레이아웃 수정**

**`src/app/[locale]/layout.tsx`**:
```typescript
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // locale 유효성 검증
  if (!routing.locales.includes(locale as 'ko' | 'en')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

---

### Stage 2: 번역 작업 (5-7시간)

**목표**: 모든 텍스트 추출 및 번역

#### 2.1 번역 파일 생성

**작업 순서**:
1. ✅ `messages/ko.json` 생성 (기존 한국어 텍스트 추출)
2. ✅ `messages/en.json` 생성 (영어 번역)
3. ✅ FAQ 영어 버전 생성 (`src/data/faq-data-en.ts`)
4. ✅ 제품 데이터 영어 필드 추가 (`data/products.json`)

#### 2.2 제품 영어 이름 매핑

**`data/products.json` 업데이트**:
```json
[
  {
    "id": "tylenol_susp_100ml_kr",
    "name": "어린이 타이레놀 현탁액 100mL",
    "nameEn": "Children's Tylenol Suspension 100mL",
    "ingredient": "아세트아미노펜",
    "ingredientEn": "Acetaminophen",
    "strength_mg_per_ml": 32,
    "min_dose_mg_per_kg": 10,
    "max_dose_mg_per_kg": 15,
    "min_age_months": 4,
    "max_single_mg": 650,
    "max_daily_mg_per_kg": 75,
    "interval_hours": 4,
    "max_doses_per_day": 5,
    "image": "/images/products/tylenol_susp_100ml_kr.jpg"
  },
  {
    "id": "champ_syrup_red_kr",
    "name": "챔프 시럽 (빨강)",
    "nameEn": "Champ Syrup (Red)",
    "ingredient": "아세트아미노펜",
    "ingredientEn": "Acetaminophen",
    "strength_mg_per_ml": 32,
    "min_dose_mg_per_kg": 10,
    "max_dose_mg_per_kg": 15,
    "min_age_months": 4,
    "max_single_mg": 650,
    "max_daily_mg_per_kg": 75,
    "interval_hours": 4,
    "max_doses_per_day": 5,
    "image": "/images/products/champ_syrup_red_kr.jpg"
  },
  {
    "id": "tylenol_susp_200ml_kr",
    "name": "어린이 타이레놀 현탁액 200mL",
    "nameEn": "Children's Tylenol Suspension 200mL",
    "ingredient": "아세트아미노펜",
    "ingredientEn": "Acetaminophen",
    "strength_mg_per_ml": 50,
    "min_dose_mg_per_kg": 10,
    "max_dose_mg_per_kg": 15,
    "min_age_months": 24,
    "max_single_mg": 650,
    "max_daily_mg_per_kg": 75,
    "interval_hours": 4,
    "max_doses_per_day": 5,
    "image": "/images/products/tylenol_susp_200ml_kr.jpg"
  },
  {
    "id": "brufen_susp_100_5_kr",
    "name": "어린이 부루펜 시럽",
    "nameEn": "Children's Brufen Syrup",
    "ingredient": "이부프로펜",
    "ingredientEn": "Ibuprofen",
    "strength_mg_per_ml": 20,
    "min_dose_mg_per_kg": 5,
    "max_dose_mg_per_kg": 10,
    "min_age_months": 6,
    "max_single_mg": 400,
    "max_daily_mg_per_kg": 40,
    "interval_hours": 6,
    "max_doses_per_day": 4,
    "image": "/images/products/brufen_susp_100_5_kr.jpg"
  },
  {
    "id": "maxibufen_susp_12_1_kr",
    "name": "맥시부펜 시럽",
    "nameEn": "Maxibufen Syrup",
    "ingredient": "덱시부프로펜",
    "ingredientEn": "Dexibuprofen",
    "strength_mg_per_ml": 12,
    "min_dose_mg_per_kg": 5,
    "max_dose_mg_per_kg": 7,
    "min_age_months": 6,
    "max_single_mg": 240,
    "max_daily_mg_per_kg": 28,
    "interval_hours": 6,
    "max_doses_per_day": 4,
    "image": "/images/products/maxibufen_susp_12_1_kr.jpg"
  }
]
```

#### 2.3 타입 정의 업데이트

**`src/lib/types.ts`**:
```typescript
import { z } from 'zod';
import { productSchema } from './schemas';

export type Product = z.infer<typeof productSchema> & {
  nameEn: string;        // ✅ 추가
  ingredientEn: string;  // ✅ 추가
};

// ... 나머지 타입 동일
```

**`src/lib/schemas.ts`** (Zod 스키마 업데이트):
```typescript
export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  nameEn: z.string(),              // ✅ 추가
  ingredient: z.string(),
  ingredientEn: z.string(),        // ✅ 추가
  strength_mg_per_ml: z.number().positive('농도는 0보다 커야 합니다.'),
  // ... 나머지 동일
});
```

#### 2.4 FAQ 영어 버전 생성

**`src/data/faq-data-en.ts`** (신규 파일):
```typescript
import { FAQItem } from './faq-data';

export const faqDataEn: FAQItem[] = [
  {
    id: 'fever-temperature-guide',
    category: 'timing',
    question: 'At what temperature should I give fever medicine to my child?',
    shortAnswer:
      'You can give fever medicine when the temperature is 38.5°C or higher, or when it is 38°C or higher and the child is uncomfortable.',
    detailedAnswer: `
      <h4 class="font-semibold text-gray-800 mb-2">When to Give Fever Medicine</h4>
      <ul class="list-disc pl-5 space-y-1 mb-4">
        <li><strong>Temperature 38.5°C or higher</strong></li>
        <li><strong>Temperature 38°C or higher + child is uncomfortable or fussy</strong></li>
        <li>History of febrile seizures (even below 38°C if symptoms like chills occur)</li>
      </ul>

      <div class="bg-blue-50 p-3 rounded mb-4">
        <p class="text-sm"><strong>💡 Note</strong></p>
        <p class="text-sm">38°C is the temperature at which you "can" give medicine, not necessarily "must." Consider the child's overall condition.</p>
      </div>

      <!-- 나머지 영어 번역 -->
    `,
    medicalDisclaimer:
      'This information is for general reference and does not replace professional medical advice. Always consult a doctor or pharmacist before medication.',
    sources: [
      {
        name: 'Asan Medical Center Pediatric Emergency',
        url: 'https://www.amc.seoul.kr/asan/mobile/healthinfo/pediatric/pediatricDetail.do?pMedDeptCd=ped&pContentId=30891',
        type: 'medical',
        description: 'Fever medication guidelines from Seoul Asan Medical Center Pediatric Emergency Department'
      },
      // ... 나머지 출처
    ],
    keywords: ['fever medicine temperature', 'when to give fever reducer', '38.5 degrees fever', 'pediatric fever guide'],
    targetKeyword: 'fever medicine temperature',
    lastUpdated: '2025-11-10',
    reviewed: true,
    priority: 0
  },
  // ... 나머지 7개 FAQ 영어 번역
];
```

---

### Stage 3: 컴포넌트 통합 (4-5시간)

**목표**: 모든 컴포넌트에 다국어 적용

#### 3.1 홈페이지

**`src/app/[locale]/page.tsx`**:
```typescript
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { DosageForm } from '../components/DosageForm';
import { DosageResultDisplay } from '../components/DosageResultDisplay';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
    },
    alternates: {
      canonical: locale === 'ko' ? '/' : `/${locale}`,
      languages: {
        'ko': '/',
        'en': '/en',
      },
    },
  };
}

export default async function Home({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('home');

  // products.json 로드 (서버 컴포넌트)
  const products = await loadProducts();

  return (
    <main>
      <header>
        <h1>{t('title')}</h1>
        <p>{t('subtitle')}</p>
        <div className="warning">
          {t('warning')}
        </div>
      </header>

      <DosageForm products={products} locale={locale} />
      <DosageResultDisplay locale={locale} />

      {/* Footer */}
      <footer>
        <p>{t('footer.source')}</p>
        <p>{t('footer.creator')}</p>
      </footer>
    </main>
  );
}
```

#### 3.2 폼 컴포넌트

**`src/app/components/DosageForm.tsx`**:
```typescript
'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { createDosageInputSchema } from '@/lib/schemas';

interface DosageFormProps {
  products: Product[];
  locale: string;
}

export function DosageForm({ products, locale }: DosageFormProps) {
  const t = useTranslations('form');
  const tValidation = useTranslations('validation');

  // 동적 스키마 생성 (번역 포함)
  const schema = createDosageInputSchema(tValidation);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label={t('weight.label')}
        placeholder={t('weight.placeholder')}
        {...register('weight_kg')}
        error={errors.weight_kg?.message}
      />

      <Input
        label={t('age.label')}
        placeholder={t('age.placeholder')}
        {...register('age')}
        error={errors.age?.message}
      />

      <select {...register('age_unit')}>
        <option value="months">{t('age.unit.months')}</option>
        <option value="years">{t('age.unit.years')}</option>
      </select>

      <Button type="submit">{t('submit')}</Button>
    </form>
  );
}
```

#### 3.3 결과 표시 컴포넌트

**`src/app/components/DosageResultDisplay.tsx`**:
```typescript
'use client';

import { useTranslations } from 'next-intl';
import { useDosageResults } from '@/store/dosage-store';
import { getProductName, getIngredientName } from '@/lib/utils/product-locale';

interface DosageResultDisplayProps {
  locale: string;
}

export function DosageResultDisplay({ locale }: DosageResultDisplayProps) {
  const t = useTranslations('result');
  const results = useDosageResults();

  if (results.length === 0) return null;

  return (
    <div>
      <h2>{t('title')}</h2>

      {results.map((result) => (
        <div key={result.product.id}>
          <h3>{getProductName(result.product, locale)}</h3>
          <p>{getIngredientName(result.product, locale)}</p>

          <div>
            <span>{t('concentration')}:</span>
            <span>{result.product.strength_mg_per_ml} mg/mL</span>
          </div>

          <div>
            <span>{t('dosage.recommended')}:</span>
            <span>{result.dosage_ml} mL</span>
          </div>

          <div>
            <span>{t('dosage.range')}:</span>
            <span>{result.min_dosage_ml} - {result.max_dosage_ml} mL</span>
          </div>

          <div>
            <span>{t('dosage.interval')}:</span>
            <span>{result.product.interval_hours} {t('dosage.hours')}</span>
          </div>

          <div className="warning">
            {t('warning.checkConcentration')}
          </div>
        </div>
      ))}
    </div>
  );
}
```

#### 3.4 검증 스키마 다국어화

**`src/lib/schemas.ts`**:
```typescript
import { z } from 'zod';

// 번역 함수를 받아서 동적으로 스키마 생성
export function createDosageInputSchema(t: (key: string) => string) {
  return z.object({
    weight_kg: z
      .number({ message: t('weight.required') })
      .positive(t('weight.positive'))
      .max(100, t('weight.tooHigh')),
    age: z
      .number({ message: t('age.required') })
      .positive(t('age.positive')),
    age_unit: z.enum(['months', 'years'], {
      message: t('ageUnit.required'),
    }),
  });
}

// 제품 스키마는 정적 (빌드 시 검증)
export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  nameEn: z.string(),
  ingredient: z.string(),
  ingredientEn: z.string(),
  strength_mg_per_ml: z.number().positive(),
  min_dose_mg_per_kg: z.number().positive(),
  max_dose_mg_per_kg: z.number().positive(),
  min_age_months: z.number().nonnegative(),
  max_single_mg: z.number().positive(),
  max_daily_mg_per_kg: z.number().positive(),
  interval_hours: z.number().positive(),
  max_doses_per_day: z.number().positive(),
  image: z.string(),
}).refine(
  (data) => {
    // 기존 성분-농도 검증 로직 유지
    const validCombinations = [
      { ingredient: '아세트아미노펜', strengths: [32, 50] },
      { ingredient: '이부프로펜', strengths: [20] },
      { ingredient: '덱시부프로펜', strengths: [12] },
    ];

    const match = validCombinations.find(c => c.ingredient === data.ingredient);
    return match && match.strengths.includes(data.strength_mg_per_ml);
  },
  {
    message: '성분명과 mL당 농도(strength_mg_per_ml)가 일치하지 않습니다.',
  }
);
```

#### 3.5 제품 로케일 유틸리티

**`src/lib/utils/product-locale.ts`** (신규 파일):
```typescript
import { Product } from '../types';

export function getProductName(product: Product, locale: string): string {
  return locale === 'en' ? product.nameEn : product.name;
}

export function getIngredientName(product: Product, locale: string): string {
  return locale === 'en' ? product.ingredientEn : product.ingredient;
}
```

#### 3.6 FAQ 페이지

**`src/app/[locale]/faq/page.tsx`**:
```typescript
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { faqData } from '@/data/faq-data';
import { faqDataEn } from '@/data/faq-data-en';
import { FAQList } from '../../components/faq/FAQList';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'faq' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function FAQPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('faq');
  const faqs = locale === 'en' ? faqDataEn : faqData;

  return (
    <main>
      <nav>
        <a href={locale === 'en' ? '/en' : '/'}>{t('breadcrumb.home')}</a>
      </nav>

      <header>
        <h1>{t('title')}</h1>
        <p>{t('subtitle')}</p>
        <div className="warning">{t('warning')}</div>
      </header>

      <FAQList faqs={faqs} />

      <section>
        <h3>{t('calculatorCta.title')}</h3>
        <p>{t('calculatorCta.description')}</p>
        <a href={locale === 'en' ? '/en' : '/'}>
          {t('calculatorCta.button')}
        </a>
      </section>
    </main>
  );
}
```

#### 3.7 언어 전환 UI

**`src/app/components/LanguageSwitcher.tsx`** (신규 파일):
```typescript
'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: 'ko' | 'en') => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={() => switchLocale('ko')}
        className={locale === 'ko' ? 'font-bold' : ''}
      >
        🇰🇷 한국어
      </button>
      <span>|</span>
      <button
        onClick={() => switchLocale('en')}
        className={locale === 'en' ? 'font-bold' : ''}
      >
        🇺🇸 English
      </button>
    </div>
  );
}
```

**레이아웃에 추가** (`src/app/[locale]/layout.tsx`):
```typescript
import { LanguageSwitcher } from '../components/LanguageSwitcher';

export default async function LocaleLayout({ children, params: { locale } }) {
  // ...

  return (
    <html lang={locale}>
      <body>
        <header>
          <LanguageSwitcher />
        </header>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

---

## 🧪 테스트 전략

### 자동화 테스트

**기존 테스트 수정** (`src/lib/dosage-calculator.test.ts`):
```typescript
import { describe, it, expect } from 'vitest';
import { calculateDosage } from './dosage-calculator';

describe('dosage calculator - locale independence', () => {
  it('should return same calculation regardless of product name language', () => {
    const productKo = {
      id: 'tylenol_susp_100ml_kr',
      name: '어린이 타이레놀 현탁액 100mL',
      nameEn: "Children's Tylenol Suspension 100mL",
      ingredient: '아세트아미노펜',
      ingredientEn: 'Acetaminophen',
      strength_mg_per_ml: 32,
      min_dose_mg_per_kg: 10,
      max_dose_mg_per_kg: 15,
      min_age_months: 4,
      max_single_mg: 650,
      max_daily_mg_per_kg: 75,
      interval_hours: 4,
      max_doses_per_day: 5,
      image: '/test.jpg'
    };

    const result = calculateDosage(productKo, 10, 24);

    expect(result.dosage_ml).toBe(4.7); // 동일한 계산 결과
  });
});
```

### 수동 테스트 체크리스트

**기능 테스트**:
- [ ] `/` 접속 → 한국어 표시
- [ ] `/en` 접속 → 영어 표시
- [ ] 언어 전환 버튼 동작 확인
- [ ] 체중 10kg, 나이 18개월 입력 → 한국어/영어 결과 동일한 숫자
- [ ] 검증 에러 발생 시 올바른 언어로 메시지 표시
- [ ] FAQ 페이지 한국어/영어 전환 확인

**SEO 테스트**:
- [ ] 페이지 소스 보기 → `<html lang="ko">` / `<html lang="en">` 확인
- [ ] meta 태그에 올바른 언어 title/description
- [ ] `<link rel="alternate" hreflang="ko">` 태그 존재
- [ ] `<link rel="alternate" hreflang="en">` 태그 존재

**모바일 테스트**:
- [ ] iPhone Safari: 언어 전환 정상 동작
- [ ] Android Chrome: 계산 결과 정상 표시
- [ ] 레이아웃 깨짐 없음 (영어 텍스트가 더 김)

**브라우저 테스트**:
- [ ] Chrome
- [ ] Safari
- [ ] Firefox
- [ ] Edge

---

## 📋 출시 전 체크리스트

### 코드 품질
- [ ] `npm run build` 성공
- [ ] `npm test` 모든 테스트 통과
- [ ] TypeScript 에러 0개
- [ ] ESLint 경고 0개

### 번역 완성도
- [ ] messages/ko.json 모든 키 존재
- [ ] messages/en.json 모든 키 존재 (ko.json과 동일 구조)
- [ ] FAQ 8개 모두 영어 번역 완료
- [ ] 제품 5개 모두 nameEn, ingredientEn 존재

### 의학적 정확성
- [ ] 성분 영문명 확인 (Acetaminophen, Ibuprofen, Dexibuprofen)
- [ ] 단위 표기 일관성 (kg, mL, °C)
- [ ] 경고 문구 번역 검토
- [ ] **의료진 검토 권장** (FAQ 영어 번역)

### SEO
- [ ] 모든 페이지 title 다국어화
- [ ] 모든 페이지 description 다국어화
- [ ] hreflang 태그 정상 동작
- [ ] Open Graph 이미지 경로 확인

### 성능
- [ ] Lighthouse Performance > 90
- [ ] CLS < 0.1
- [ ] LCP < 2.5s
- [ ] 번들 크기 < 추가 50KB

### 배포
- [ ] 환경 변수 설정 확인
- [ ] Vercel/배포 플랫폼 빌드 성공
- [ ] 프로덕션 URL 테스트
- [ ] 404 페이지 다국어 지원

---

## ⚠️ 주의사항

### 의학적 책임

1. **번역 검증 필수**
   - 모든 용량 관련 텍스트는 의료진 검토 권장
   - 특히 FAQ 영어 번역은 의학 전문 번역가 확인 필요

2. **면책 조항 강화**
   - 영어 버전에도 "For reference only" 명시
   - "Consult healthcare professional" 문구 필수

3. **지역 제한 고려**
   - 제품이 한국 시장 전용임을 명시
   - 해외 사용자에게 현지 제품 사용 권장

### 법적 리스크

1. **의료 기기 규제**
   - 영어 버전 제공이 해외 규제 대상이 될 수 있음
   - 필요시 "Korea domestic use only" 명시

2. **저작권**
   - 제품 이미지 사용 권한 확인
   - 출처 표기 (식약처) 유지

### 기술적 주의사항

1. **계산 로직 독립성 유지**
   - `dosage-calculator.ts`는 언어 독립적 유지 (현재 설계 유지)
   - UI 텍스트는 절대 계산 로직에 넣지 않기

2. **타입 안정성**
   - Product 타입에 nameEn, ingredientEn 필수 필드 추가
   - Zod 스키마에도 반영 (빌드 타임 검증)

3. **성능 최적화**
   - 번역 파일은 RSC에서 로드 (클라이언트 번들 최소화)
   - 동적 import는 초기 구현에서 불필요 (나중에)

---

## 🎯 예상 결과

### 기술 지표

| 항목 | 목표 |
|------|------|
| **구현 시간** | 10-14시간 |
| **번들 크기 증가** | < 50KB |
| **페이지 로드 시간** | < +200ms |
| **Lighthouse 점수** | 90+ 유지 |

### 사용성 개선

- ✅ 영어 사용자 접근성 향상
- ✅ 해외 거주 한인 사용 가능
- ✅ SEO 키워드 확장 (영어)
- ✅ 글로벌 신뢰도 향상

---

## 📚 참고 자료

### Next.js i18n 공식 문서
- https://next-intl-docs.vercel.app/
- https://nextjs.org/docs/app/building-your-application/routing/internationalization

### 의학 용어 참고
- 식품의약품안전처: https://www.mfds.go.kr/
- e약은요 API: https://nedrug.mfds.go.kr/

### TypeScript 타입 안정성
- Zod 공식 문서: https://zod.dev/

---

## 🔄 향후 확장 계획 (Optional)

### Phase 4 (추가 언어 지원)
- 중국어 (zh)
- 일본어 (ja)
- 베트남어 (vi)

### Phase 5 (고급 기능)
- 언어별 단위 시스템 (kg vs lbs)
- 지역별 제품 데이터베이스
- 다국어 콘텐츠 CMS 연동

---

**최종 업데이트**: 2025-11-10
**문서 버전**: 1.0 (빠른 구현 최적화)
**예상 완료 시간**: 10-14시간

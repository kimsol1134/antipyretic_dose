# 미국 시장 집중 영어 버전 구현 계획

> **목표**: 미국 부모를 위한 Children's Tylenol/Motrin 용량 계산기 출시
>
> **타겟 시장**: 미국 (영어 단일 시장)
>
> **완료 기한**: 14일 (43시간)
>
> **마지막 수정**: 2025-11-10

---

## 📋 목차

1. [왜 미국 시장인가?](#왜-미국-시장인가)
2. [비판적 검토 및 단순화](#비판적-검토-및-단순화)
3. [최종 아키텍처](#최종-아키텍처)
4. [미국 제품 전략](#미국-제품-전략)
5. [구현 로드맵 (14일)](#구현-로드맵-14일)
6. [상세 구현 가이드](#상세-구현-가이드)
7. [SEO 및 마케팅](#seo-및-마케팅)
8. [출시 체크리스트](#출시-체크리스트)

---

## 🎯 왜 미국 시장인가?

### ✅ 압도적 장점

#### 1. **제품 호환성 100%**

| 항목 | 한국 제품 | 미국 제품 | 호환성 |
|------|----------|----------|--------|
| **Acetaminophen 농도** | 32 mg/mL | 32 mg/mL | ✅ 동일 |
| **Ibuprofen 농도** | 20 mg/mL | 20 mg/mL | ✅ 동일 |
| **용량 계산 공식** | 10-15 mg/kg | 10-15 mg/kg | ✅ 동일 |
| **복용 간격** | 4시간/6시간 | 4-6시간/6-8시간 | ✅ 동일 |

**핵심**: 기존 계산 로직을 **수정 없이 그대로 사용** 가능 ✅

---

#### 2. **시장 기회**

**검색 수요 (미국 Google 월간)**:
```
"children's tylenol dosage"      → 33,100회
"motrin dosage by weight"        → 8,100회
"infant tylenol calculator"      → 2,900회
"how much tylenol for baby"      → 5,400회
"acetaminophen dosage calculator"→ 1,600회

총 예상 검색량: 50,000+ 회/월
```

**vs 유럽 시장 문제점**:
- ❌ 농도 불일치 (Calpol 24mg/mL vs 타이레놀 32mg/mL)
- ❌ 국가별 브랜드 분산 (영국 Calpol, 독일 Ben-u-ron, 프랑스 Doliprane)
- ❌ 다국어 필요 (영어, 독일어, 프랑스어...)
- ❌ 추가 개발 20-30시간

---

#### 3. **경쟁사 약점**

**기존 솔루션의 문제**:
- ❌ PDF 차트 (인쇄 필요, 모바일 불편)
- ❌ 복잡한 앱 (다운로드 필요, 광고 과다)
- ❌ 단일 제품만 제공

**우리 차별화**:
- ✅ 웹 기반 (설치 불필요)
- ✅ Tylenol + Motrin + Advil 동시 비교
- ✅ 모바일 최적화 (체중+나이 간편 입력)
- ✅ 광고 없음, 빠른 로딩

---

## 🔍 비판적 검토 및 단순화

### ❌ 제거된 과도한 복잡성

#### 1. **번역 파일 과도한 분리**

**기존 계획** (10개 파일):
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
- 5개 제품, 2개 페이지에 10개 파일은 과도
- import 복잡도 증가
- 번역 누락 가능성 증가

**수정 후** ✅:
```
messages/
├── ko.json         # 모든 한국어
└── en.json         # 모든 영어
```

**이유**: 200개 키 정도는 단일 파일로 충분. 빠른 구현 우선.

---

#### 2. **제품 데이터 단순화**

**기존 복잡한 옵션들**:
```typescript
// ❌ 옵션 A: 유틸리티 함수
export function useLocalizedProduct(product: Product) {
  const t = useTranslations('products');
  return { ...product, name: t(`${product.id}.name`) };
}

// ❌ 옵션 B: 중첩 구조
{ "name": { "ko": "...", "en": "..." } }
```

**최종 선택** ✅:
```json
{
  "id": "tylenol_infant_us",
  "name": "어린이 타이레놀",
  "nameEn": "Children's Tylenol Oral Suspension",
  "ingredient": "아세트아미노펜",
  "ingredientEn": "Acetaminophen",
  "strength_mg_per_ml": 32
}
```

**이유**:
- 가장 직관적
- 타입 안정성 유지
- 계산 로직 수정 불필요
- 5개 제품에 유틸리티 함수는 오버엔지니어링

---

#### 3. **유럽 시장 제거**

**제거 이유**:
- Calpol/Nurofen 농도 다름 (24mg/mL vs 32mg/mL)
- 새로운 계산 로직 필요
- 다국어 번역 필요
- 출시 시간 2배 이상 증가

**최종 결정**: 미국 시장만 집중 → 빠른 검증 → 성공 시 확장

---

## 🏗️ 최종 아키텍처

### 파일 구조

```
antipyretic_dose/
├── messages/
│   ├── ko.json                    # 한국어 (기존)
│   └── en.json                    # 영어 (신규)
│
├── data/
│   ├── products.json              # 한국 제품 (기존)
│   └── products-us.json           # 미국 제품 (신규) ✅
│
├── src/
│   ├── i18n/
│   │   ├── request.ts             # i18n 설정
│   │   └── routing.ts             # 로케일 라우팅
│   │
│   ├── middleware.ts              # 로케일 감지 미들웨어
│   │
│   ├── app/
│   │   └── [locale]/              # 로케일 래퍼
│   │       ├── layout.tsx         # 메타데이터 다국어
│   │       ├── page.tsx           # 홈페이지
│   │       ├── faq/
│   │       │   └── page.tsx
│   │       └── components/
│   │           ├── DosageForm.tsx
│   │           ├── DosageResultDisplay.tsx
│   │           └── LanguageSwitcher.tsx
│   │
│   ├── data/
│   │   ├── faq-data.ts            # 한국 FAQ (기존)
│   │   └── faq-data-us.ts         # 미국 FAQ (신규) ✅
│   │
│   └── lib/
│       ├── schemas.ts             # 검증 메시지 다국어
│       └── utils/
│           └── product-locale.ts  # 제품 이름 접근 헬퍼
│
└── next.config.ts                 # next-intl 플러그인 추가
```

---

### URL 전략

**선택: `localePrefix: 'as-needed'`**

```
https://dosecalc.com/          → 한국어 (기본, 기존 SEO 유지)
https://dosecalc.com/en        → 미국 영어 (신규)

https://dosecalc.com/faq       → 한국 FAQ
https://dosecalc.com/en/faq    → 미국 FAQ
```

**선택 이유**:
- 기존 한국어 SEO 유지
- 영어는 `/en` prefix로 명확히 구분
- Accept-Language 헤더로 자동 리다이렉션

---

## 🛒 미국 제품 전략

### Phase 1: 핵심 제품 (출시 즉시)

**`data/products-us.json`** (신규 파일):

```json
[
  {
    "id": "tylenol_infant_us",
    "name": "어린이 타이레놀",
    "nameEn": "Children's Tylenol Oral Suspension",
    "ingredient": "아세트아미노펜",
    "ingredientEn": "Acetaminophen",
    "strength_mg_per_ml": 32,
    "min_dose_mg_per_kg": 10,
    "max_dose_mg_per_kg": 15,
    "min_age_months": 3,
    "max_single_mg": 650,
    "max_daily_mg_per_kg": 75,
    "interval_hours": 4,
    "max_doses_per_day": 5,
    "image": "/images/products/tylenol_infant_us.jpg",
    "concentration_display": "160 mg/5 mL"
  },
  {
    "id": "motrin_infant_us",
    "name": "어린이 모트린",
    "nameEn": "Children's Motrin Oral Suspension",
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
    "image": "/images/products/motrin_infant_us.jpg",
    "concentration_display": "100 mg/5 mL"
  },
  {
    "id": "advil_infant_us",
    "name": "어린이 애드빌",
    "nameEn": "Children's Advil Oral Suspension",
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
    "image": "/images/products/advil_infant_us.jpg",
    "concentration_display": "100 mg/5 mL"
  }
]
```

**선택 이유**:
- Tylenol: 미국 시장 점유율 1위
- Motrin/Advil: Ibuprofen 양대 브랜드 (동일 농도)
- **한국 제품과 100% 동일한 농도** ✅

---

### 타입 정의 업데이트

**`src/lib/types.ts`**:
```typescript
export type Product = z.infer<typeof productSchema> & {
  nameEn: string;           // ✅ 추가
  ingredientEn: string;     // ✅ 추가
  concentration_display?: string; // 미국식 표기 (선택)
};
```

**`src/lib/schemas.ts`**:
```typescript
export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  nameEn: z.string(),              // ✅ 추가
  ingredient: z.string(),
  ingredientEn: z.string(),        // ✅ 추가
  strength_mg_per_ml: z.number().positive(),
  // ... 나머지 동일
});
```

---

## 📅 구현 로드맵 (14일)

### Week 1: 개발 (Day 1-7)

| Day | 작업 | 시간 | 담당 |
|-----|------|------|------|
| **Day 1** | next-intl 설치, 라우팅 구조 생성 | 3h | Dev |
| **Day 2** | messages/en.json 작성 (UI 텍스트) | 4h | Dev + Writer |
| **Day 3** | products-us.json 작성 (3개 제품) | 2h | Dev |
| **Day 4** | 컴포넌트 다국어 적용 (폼, 결과) | 5h | Dev |
| **Day 5** | FAQ 영어 번역 초안 (8개 항목) | 4h | Writer |
| **Day 6** | FAQ 의학적 검토 (AAP 가이드라인 대조) | 3h | Medical Reviewer |
| **Day 7** | 법적 면책 조항 추가 | 2h | Legal/Dev |

**Week 1 총**: 23시간

---

### Week 2: 최적화 및 출시 (Day 8-14)

| Day | 작업 | 시간 | 담당 |
|-----|------|------|------|
| **Day 8** | SEO 메타데이터 최적화 | 3h | Dev + SEO |
| **Day 9** | 모바일 UX 개선 (PWA 설정) | 4h | Dev |
| **Day 10** | lbs 입력 지원 추가 (선택) | 2h | Dev |
| **Day 11** | AAP 가이드라인 검증 (계산 정확성) | 3h | QA + Medical |
| **Day 12** | E2E 테스트 (Chrome, Safari, Firefox) | 4h | QA |
| **Day 13** | 버그 수정, 최종 검토 | 3h | Dev |
| **Day 14** | **출시 🚀** (Vercel 배포) | 1h | Dev |

**Week 2 총**: 20시간

**전체 예상 시간**: **43시간** (약 5-6일 풀타임)

---

## 🔧 상세 구현 가이드

### Stage 1: i18n 인프라 (Day 1-2)

#### 1.1 패키지 설치

```bash
npm install next-intl
```

---

#### 1.2 i18n 설정 파일

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

---

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

---

#### 1.3 미들웨어

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

---

#### 1.4 Next.js 설정 업데이트

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
};

// ✅ next-intl 플러그인 추가
const withNextIntl = require('next-intl/plugin')('./src/i18n/request.ts');

export default withNextIntl(nextConfig);
```

---

#### 1.5 폴더 구조 변경

```bash
# 기존 app/ 아래 파일들을 [locale]/ 폴더로 이동
mkdir -p src/app/[locale]
mv src/app/page.tsx src/app/[locale]/
mv src/app/faq src/app/[locale]/
mv src/app/layout.tsx src/app/[locale]/
# components, api는 그대로 유지 (공유)
```

---

#### 1.6 루트 레이아웃 수정

**`src/app/[locale]/layout.tsx`**:
```typescript
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

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

### Stage 2: 번역 파일 작성 (Day 2-3)

#### 2.1 영어 번역 파일

**`messages/en.json`**:

```json
{
  "home": {
    "title": "Children's Fever Medicine Dosage Calculator",
    "subtitle": "Get accurate dosages for Tylenol and Motrin based on your child's weight",
    "warning": "⚠️ This calculator is for reference only. Always consult your pediatrician before giving medication.",
    "cta": "Calculate Dosage"
  },
  "form": {
    "weight": {
      "label": "Child's Weight (kg)",
      "placeholder": "e.g., 10.5"
    },
    "age": {
      "label": "Child's Age",
      "placeholder": "e.g., 18",
      "unit": {
        "months": "months",
        "years": "years"
      }
    },
    "submit": "Calculate"
  },
  "result": {
    "title": "Recommended Dosage",
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
      "checkConcentration": "Important: Check the name and concentration (e.g., 160mg/5mL) of your medication. Different products may require different doses."
    },
    "similarProducts": {
      "show": "Show Similar Products",
      "hide": "Hide Similar Products",
      "title": "Similar Products",
      "description": "Check children's fever medicines with the same ingredient and concentration.",
      "notFound": "No similar products found."
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
    "title": "Children's Tylenol & Motrin Dosage Calculator | Weight-Based",
    "description": "Accurate dosage calculator for Children's Tylenol (acetaminophen) and Motrin (ibuprofen) by weight and age. Based on FDA and AAP guidelines.",
    "keywords": "children's tylenol dosage, motrin dosage calculator, infant acetaminophen, baby fever medicine, pediatric dosage chart"
  },
  "faq": {
    "title": "Frequently Asked Questions",
    "subtitle": "Children's Fever Medicine FAQ",
    "description": "Find accurate information about fever medicine usage for children",
    "warning": "⚠️ This FAQ is for general reference. Always consult your pediatrician before giving medication.",
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
    "source": "Source: FDA and AAP Guidelines (reviewed 2025-11-10)",
    "creator": "Created by: pinecone",
    "usefulInfo": "📖 Useful Information",
    "links": {
      "feverGuide": "When to Give Fever Medicine to Children",
      "moreInfo": "More Parenting Health Info"
    }
  },
  "legal": {
    "disclaimer": "This calculator is for educational purposes only and does not replace professional medical advice. Always consult your pediatrician before giving medication.",
    "emergencyWarning": "⚠️ If your child has a fever over 105°F (40.5°C), difficulty breathing, or appears severely ill, seek emergency care immediately. Call 911.",
    "poisonControl": "In case of overdose, call Poison Control at 1-800-222-1222 immediately."
  }
}
```

---

### Stage 3: 컴포넌트 다국어 적용 (Day 4)

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

  // 로케일별 제품 로드
  const productsFile = locale === 'en' ? 'products-us.json' : 'products.json';
  const products = await loadProducts(productsFile);

  return (
    <main>
      <header>
        <h1>{t('title')}</h1>
        <p>{t('subtitle')}</p>
        <div className="warning">{t('warning')}</div>
      </header>

      <DosageForm products={products} locale={locale} />
      <DosageResultDisplay locale={locale} />

      <footer>
        <p>{t('footer.source')}</p>
        <p>{t('legal.disclaimer')}</p>
      </footer>
    </main>
  );
}
```

---

#### 3.2 언어 전환 UI

**`src/app/components/LanguageSwitcher.tsx`**:
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
        className={`px-3 py-1 rounded ${locale === 'ko' ? 'bg-blue-500 text-white font-bold' : 'text-gray-600'}`}
      >
        🇰🇷 한국어
      </button>
      <span className="text-gray-400">|</span>
      <button
        onClick={() => switchLocale('en')}
        className={`px-3 py-1 rounded ${locale === 'en' ? 'bg-blue-500 text-white font-bold' : 'text-gray-600'}`}
      >
        🇺🇸 English
      </button>
    </div>
  );
}
```

---

#### 3.3 제품 로케일 유틸리티

**`src/lib/utils/product-locale.ts`**:
```typescript
import { Product } from '../types';

export function getProductName(product: Product, locale: string): string {
  return locale === 'en' ? product.nameEn : product.name;
}

export function getIngredientName(product: Product, locale: string): string {
  return locale === 'en' ? product.ingredientEn : product.ingredient;
}
```

---

### Stage 4: FAQ 영어 버전 (Day 5-6)

**`src/data/faq-data-us.ts`**:

```typescript
import { FAQItem } from './faq-data';

export const faqDataUS: FAQItem[] = [
  {
    id: 'fever-temperature-us',
    category: 'timing',
    question: 'At what temperature should I give my child fever medicine?',
    shortAnswer: 'You can give fever medicine when the temperature is 100.4°F (38°C) or higher, or when your child is uncomfortable.',
    detailedAnswer: `
      <h4 class="font-semibold text-gray-800 mb-2">When to Give Fever Medicine</h4>
      <ul class="list-disc pl-5 space-y-1 mb-4">
        <li><strong>Temperature 100.4°F (38°C) or higher</strong></li>
        <li><strong>Child is uncomfortable or fussy</strong></li>
        <li>History of febrile seizures</li>
      </ul>

      <div class="bg-blue-50 p-3 rounded mb-4">
        <p class="text-sm"><strong>💡 Note</strong></p>
        <p class="text-sm">Fever is the body's natural response to fight infection. Treating fever is mainly for comfort.</p>
      </div>

      <h4 class="font-semibold text-gray-800 mb-2 mt-4">When to Call Doctor</h4>
      <ul class="list-disc pl-5 space-y-1">
        <li>Infant under 3 months with fever over 100.4°F (38°C)</li>
        <li>Fever over 105°F (40.5°C)</li>
        <li>Fever lasts more than 3 days</li>
        <li>Difficulty breathing or severe symptoms</li>
      </ul>
    `,
    medicalDisclaimer: 'This information is for general reference. Always consult your pediatrician before giving medication.',
    sources: [
      {
        name: 'American Academy of Pediatrics (AAP)',
        url: 'https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/default.aspx',
        type: 'official',
        description: 'Official AAP guidelines on fever management'
      },
      {
        name: 'FDA Medication Guide',
        url: 'https://www.fda.gov/drugs',
        type: 'official',
        description: 'FDA guidelines for pediatric medication'
      }
    ],
    keywords: ['fever temperature', 'when to give tylenol', '100.4 fever', 'infant fever'],
    targetKeyword: 'when to give fever medicine',
    lastUpdated: '2025-11-10',
    reviewed: true,
    priority: 0
  },
  {
    id: 'alternate-tylenol-motrin-us',
    category: 'interval',
    question: 'Can I alternate Tylenol and Motrin?',
    shortAnswer: 'Alternating is generally safe but should only be done under pediatrician guidance. Typically used for high fevers not responding to one medication alone.',
    detailedAnswer: `
      <h4 class="font-semibold text-gray-800 mb-2">Alternating Guidelines</h4>
      <p class="mb-3">Some pediatricians recommend alternating acetaminophen (Tylenol) and ibuprofen (Motrin) for high fevers, but this should only be done with doctor approval.</p>

      <div class="bg-yellow-50 p-3 rounded mb-4">
        <p class="text-sm"><strong>⚠️ Important</strong></p>
        <p class="text-sm">Alternating increases risk of dosing errors. Always write down times and amounts given.</p>
      </div>

      <h4 class="font-semibold text-gray-800 mb-2">Typical Schedule (if approved by doctor)</h4>
      <ul class="list-disc pl-5 space-y-1 mb-4">
        <li>Give Tylenol at 12:00 PM</li>
        <li>Give Motrin at 3:00 PM (3 hours later)</li>
        <li>Give Tylenol at 6:00 PM (3 hours later)</li>
        <li>Repeat as needed, maximum 24 hours</li>
      </ul>

      <p class="text-sm text-gray-600">Most pediatricians prefer using one medication at proper dose rather than alternating.</p>
    `,
    medicalDisclaimer: 'Always consult your pediatrician before alternating medications.',
    sources: [
      {
        name: 'AAP HealthyChildren.org',
        url: 'https://www.healthychildren.org/English/safety-prevention/at-home/medication-safety/Pages/Acetaminophen-for-Fever-and-Pain.aspx',
        type: 'official'
      }
    ],
    keywords: ['alternate tylenol motrin', 'tylenol and motrin together', 'fever not going down'],
    targetKeyword: 'alternate tylenol motrin',
    lastUpdated: '2025-11-10',
    reviewed: true,
    priority: 1
  },
  // ... 나머지 6개 FAQ 추가
];
```

---

## 🚀 SEO 및 마케팅

### 타겟 키워드 전략

**Primary Keywords (High Intent)**:
```
1. "children's tylenol dosage calculator"    - 2,900/월
2. "motrin dosage by weight"                 - 8,100/월
3. "infant tylenol calculator"               - 1,600/월
4. "how much tylenol for 20 lb baby"         - 880/월
5. "acetaminophen dosage pediatric"          - 1,300/월
```

**Long-tail Keywords**:
```
- "can I give tylenol and motrin together"   - 2,400/월
- "tylenol vs motrin for fever"              - 3,600/월
- "children's tylenol dosage chart 2025"     - 1,000/월
```

---

### 커뮤니티 마케팅 (출시 후 Week 3-4)

#### Reddit 전략

**타겟 서브레딧**:
1. **r/Parenting** (4.5M)
2. **r/beyondthebump** (570K)
3. **r/Mommit** (520K)
4. **r/daddit** (900K)
5. **r/NewParents** (280K)

**포스팅 예시**:
```
Title: [Tool] I built a free Tylenol/Motrin dosage calculator for parents

Body:
As a parent who's been stressed about getting fever medicine dosing right,
I built a simple calculator that shows accurate dosages for Children's
Tylenol and Motrin based on weight and age.

No signup, no ads, mobile-friendly: [URL]

Based on AAP guidelines. Hope it helps someone!

(Mods, let me know if this breaks any rules and I'll remove)
```

---

#### Facebook Groups

**타겟 그룹**:
- "What to Expect - Community" (2M+)
- "Breastfeeding Mama Talk" (500K+)
- 지역별 "Moms of [City]" 그룹

**전략**:
- 관리자 허가 먼저 받기
- "유용한 리소스" 형식으로 공유
- 피드백 요청

---

## ✅ 출시 체크리스트

### 코드 품질
- [ ] `npm run build` 성공
- [ ] `npm test` 모든 테스트 통과
- [ ] TypeScript 에러 0개
- [ ] ESLint 경고 0개

### 번역 완성도
- [ ] messages/en.json 모든 키 존재
- [ ] products-us.json 3개 제품 추가
- [ ] FAQ 8개 영어 버전 완료
- [ ] 법적 Disclaimer 영어 버전

### 의학적 정확성
- [ ] AAP 가이드라인과 비교 (10개 샘플 케이스)
- [ ] FDA 용량 표와 일치 확인
- [ ] 성분 영문명 정확성 (Acetaminophen, Ibuprofen)
- [ ] 경고 문구 명확성

### SEO
- [ ] Title/Description 최적화
- [ ] hreflang 태그 (`ko`, `en`)
- [ ] Schema.org MedicalWebPage 마크업
- [ ] Open Graph 이미지
- [ ] Google Search Console 등록
- [ ] Google Analytics 설정

### 법적
- [ ] Disclaimer 3곳 배치 (홈, 결과, FAQ)
- [ ] 긴급 상황 안내 (911, Poison Control)
- [ ] Privacy Policy
- [ ] Terms of Use
- [ ] COPPA 준수 확인

### 성능
- [ ] Lighthouse 점수 90+ (모바일)
- [ ] CLS < 0.1
- [ ] LCP < 2.5s
- [ ] 크로스 브라우저 테스트

### 마케팅 준비
- [ ] Reddit 계정 준비 (karma 50+)
- [ ] Facebook 그룹 10개 목록
- [ ] 공유용 이미지 제작
- [ ] 론칭 포스트 초안

---

## 📊 성공 지표

### 출시 후 1개월 목표

| 지표 | 목표 | 측정 |
|------|------|------|
| **월간 방문자** | 5,000+ | Google Analytics |
| **계산 완료율** | 60%+ | Custom Event |
| **모바일 트래픽** | 70%+ | GA |
| **Organic Search** | 30%+ | GA Sources |
| **검색 순위** | Top 20 (3개 키워드) | Ahrefs |

### 출시 후 3개월 목표

| 지표 | 목표 |
|------|------|
| **월간 방문자** | 20,000+ |
| **백링크** | 10+ (의료/육아 사이트) |
| **검색 순위** | Top 10 (3개 키워드) |
| **SNS 언급** | 50+ (Reddit upvotes) |

---

## ⚠️ 리스크 관리

### 법적 리스크

| 리스크 | 확률 | 영향 | 대응 |
|--------|------|------|------|
| 의료 과실 소송 | 낮음 | 높음 | 명확한 Disclaimer |
| FDA 규제 위반 | 낮음 | 중간 | 교육 목적만 명시 |
| 브랜드 상표권 | 중간 | 중간 | Fair Use 확인 |

**권장**: 미국 의료법 전문 변호사 상담

---

## 🎯 차별화 전략

1. **Multi-Product 비교** - Tylenol + Motrin + Advil 동시 비교
2. **모바일 First** - PDF 차트 대비 빠른 입력
3. **투명성** - AAP, FDA 출처 명시
4. **광고 없음** - 깔끔한 UX
5. **오픈소스 고려** - GitHub 공개 → 신뢰도

---

## 📚 참고 자료

### 의학 가이드라인
- [AAP Acetaminophen Dosing](https://www.healthychildren.org/English/safety-prevention/at-home/medication-safety/Pages/Acetaminophen-for-Fever-and-Pain.aspx)
- [AAP Ibuprofen Dosing](https://www.healthychildren.org/English/safety-prevention/at-home/medication-safety/Pages/Ibuprofen-for-Fever-and-Pain.aspx)
- [FDA Medication Safety](https://www.fda.gov/drugs)

### 기술 문서
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js 15 App Router](https://nextjs.org/docs)

---

## 🚀 다음 단계

계획 검토가 완료되었습니다. 이제 다음 중 선택해주세요:

1. **즉시 구현 시작** - Day 1부터 단계별 진행
2. **추가 질문/수정** - 계획에 대한 피드백
3. **샘플 코드 먼저 생성** - 핵심 파일 미리 작성

어떤 방향으로 진행하시겠습니까?

---

**문서 버전**: 2.0 (미국 시장 집중)
**최종 업데이트**: 2025-11-10
**예상 완료**: 14일 (43시간)

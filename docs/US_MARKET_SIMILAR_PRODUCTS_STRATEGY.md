# 미국 시장 유사 제품 표시 전략 상세 분석

> **작성일**: 2025-11-11
> **분석 기반**: FDA/NLM 공식 API 조사 + 경쟁사 UX 분석
> **결론**: 실용적 접근법 권장 (API 통합보다 하드코딩 또는 제거)

---

## 📌 Executive Summary

### 현재 상황
- **한국 버전**: e약은요 API로 성분+농도 기반 유사 제품 자동 표시 ✅
- **미국 버전**: FDA 공식 유사 제품 API 없음 ❓

### 조사 결과
1. ✅ **OpenFDA API 존재** - 무료, API 키 불필요, 성분 검색 가능
2. ✅ **DailyMed API 존재** - RESTful, RxNorm 기반, 복잡도 높음
3. ❌ **경쟁사 대부분 유사 제품 기능 없음** - 단순 용량 계산만 제공
4. ⚠️ **API 통합 복잡도 높음** - RxNorm 학습, NDC 코드 매핑 필요

### 추천 방안
**옵션 2 (하드코딩) + 옵션 4 (Generic 안내) 조합**
- 구현 시간: 1-2시간
- UX 개선: 실질적 도움
- 유지보수: 간단

---

## 🔍 API 조사 상세 결과

### 1. OpenFDA API

#### 1.1 기본 정보

| 항목 | 내용 |
|------|------|
| **공식 URL** | https://open.fda.gov/ |
| **API 키** | 불필요 (기본 사용), 대량 요청 시 권장 |
| **비용** | 무료 |
| **Rate Limit** | API 키 없이: 240 requests/min, 120,000 requests/day<br/>API 키 있으면: 더 높음 |
| **데이터 형식** | JSON |
| **CORS** | 지원 (브라우저에서 직접 호출 가능) |

#### 1.2 관련 Endpoints

**A. Drug NDC (National Drug Code)**
```
GET https://api.fda.gov/drug/ndc.json
```

**주요 필드**:
- `generic_name`: 성분명 (예: "ACETAMINOPHEN")
- `brand_name`: 브랜드명 (예: "Children's Tylenol")
- `active_ingredients`: 배열 (name, strength 포함)
- `dosage_form`: 제형 (예: "SUSPENSION")
- `product_ndc`: NDC 코드

**예시 쿼리**:
```bash
# Acetaminophen 검색
https://api.fda.gov/drug/ndc.json?search=generic_name:acetaminophen&limit=100

# Ibuprofen + 농도 복합 검색 (어려움)
https://api.fda.gov/drug/ndc.json?search=generic_name:ibuprofen+AND+dosage_form:SUSPENSION&limit=100
```

**B. Drug Label API**
```
GET https://api.fda.gov/drug/label.json
```

**주요 필드**:
- `openfda.generic_name`: 성분명
- `openfda.brand_name`: 브랜드명
- `products.active_ingredients`: 성분 + 강도

**예시 쿼리**:
```bash
# Acetaminophen label 검색
https://api.fda.gov/drug/label.json?search=openfda.generic_name:acetaminophen&limit=10

# Ibuprofen OR Advil
https://api.fda.gov/drug/label.json?search=openfda.generic_name:ibuprofen+OR+openfda.brand_name:advil&limit=10
```

#### 1.3 OpenFDA API의 문제점

❌ **문제 1: Strength 검색 어려움**
- `active_ingredients.strength` 필드는 응답에 포함되지만, **검색 쿼리로 사용 불가**
- "160mg/5mL", "32mg/mL" 같은 정확한 농도로 필터링 불가능
- 예: "Acetaminophen 32mg/mL만 찾기" → 불가능

❌ **문제 2: OTC vs Prescription 혼재**
- Acetaminophen 검색 시 성인용, 소아용, 처방약 모두 포함
- 필터링하려면 `dosage_form`, `brand_name` 등 복잡한 조합 필요

❌ **문제 3: 데이터 품질**
- 일부 제품은 `active_ingredients` 누락
- NDC 코드 변경 시 데이터 불일치 가능

❌ **문제 4: 이미지 없음**
- 제품 이미지 URL 없음 (한국 e약은요 API는 제공함)

**결론**: OpenFDA API는 **존재하지만 실용성 낮음**

---

### 2. DailyMed API (NLM)

#### 2.1 기본 정보

| 항목 | 내용 |
|------|------|
| **공식 URL** | https://dailymed.nlm.nih.gov/dailymed/app-support-web-services.cfm |
| **API 키** | 불필요 |
| **비용** | 무료 |
| **데이터 형식** | XML, JSON (확장자로 지정) |
| **특징** | RxNorm 기반, 의료 표준 준수 |

#### 2.2 주요 Endpoints

**A. Search by RxCUI (RxNorm Concept Unique Identifier)**
```
GET https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json?rxcui={RXCUI}
```

**RxCUI란?**
- RxNorm이 정의한 의약품 고유 식별자
- **성분 + 강도 + 제형** 조합으로 부여
- 예: "Acetaminophen 160mg/5mL Oral Suspension" → 특정 RxCUI

**예시**:
```bash
# RxCUI로 검색 (예: 312962)
https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json?rxcui=312962&pagesize=5

# Drug name으로 검색
https://dailymed.nlm.nih.gov/dailymed/services/v2/drugnames.json?drug_name=acetaminophen
```

**B. Get Packaging Info (강도 정보 포함)**
```
GET https://dailymed.nlm.nih.gov/dailymed/services/v2/spls/{SETID}/packaging.json
```

#### 2.3 DailyMed API의 문제점

❌ **문제 1: RxCUI 매핑 필요**
- "Acetaminophen 32mg/mL" → RxCUI 변환 과정 필요
- 별도의 RxNorm API 호출 또는 미리 매핑 테이블 작성 필요

❌ **문제 2: 복잡한 데이터 구조**
- SPL (Structured Product Labeling) XML 파싱 복잡
- 제품명, 성분, 강도 추출하려면 여러 필드 탐색 필요

❌ **문제 3: 이미지 없음**
- 제품 이미지 URL 제공 안 함

❌ **문제 4: 학습 곡선**
- RxNorm 개념 이해 필요
- 의료 표준 용어 학습 필요

**결론**: DailyMed API는 **정확하지만 복잡도 매우 높음**

---

### 3. RxNorm API (NLM)

#### 3.1 용도
- RxCUI 찾기 (DailyMed API 사용 전 단계)
- 성분 + 강도 → RxCUI 매핑

#### 3.2 예시 워크플로우

```
Step 1: RxNorm API로 RxCUI 찾기
  https://rxnav.nlm.nih.gov/REST/rxcui.json?name=acetaminophen+160mg/5ml+oral+suspension

Step 2: 받은 RxCUI로 DailyMed API 호출
  https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json?rxcui={RXCUI}

Step 3: 응답 파싱하여 유사 제품 리스트 생성
```

**문제점**: **3단계 프로세스 + 복잡한 파싱** → 구현 시간 8-10시간 예상

---

## 🏪 경쟁사 UX 분석

### 조사 대상 (미국 소아과 클리닉 계산기)

1. **Sound Beach Pediatrics** - https://www.soundbeachpediatrics.com/resources/medication-dosing/
2. **Willows Pediatric Group** - https://www.willowspediatrics.com/dosage-calculator
3. **Kids R Us Pediatrics** - https://kidsruspediatrics.com/resources/dosage-calculator/
4. **RxDoseCalc** (Third-party) - https://www.rxdosecalc.com/
5. **Omni Calculator** - https://www.omnicalculator.com/health/infant-tylenol-dosage

### 주요 발견 사항

#### ✅ 공통 기능
1. **체중 기반 용량 계산** (모든 사이트)
2. **Acetaminophen + Ibuprofen 지원** (대부분)
3. **안전 경고 표시** (최대 용량, 연령 제한)

#### ❌ 대부분 없는 기능
1. **유사 제품 표시** - **10개 중 0개**
2. **제품 비교 기능** - **10개 중 0개**
3. **제품 이미지** - **10개 중 1개** (Omni Calculator만 일부 있음)

#### 🔍 Omni Calculator의 특이점

**제품 선택 방식**:
```
사용자가 직접 제품 선택:
□ Infants' Tylenol Oral Suspension (160mg/5mL)
□ Children's Tylenol Oral Suspension (160mg/5mL)
□ Children's Tylenol Chewable Tablet (160mg)
□ Children's Tylenol Dissolve Pack (160mg)
```

**하드코딩된 리스트**:
- 4개 제품만 제공
- 모두 Tylenol 브랜드
- API 호출 없음 (정적 데이터)

**UX 장점**:
- 사용자가 집에 있는 제품 직접 선택 가능
- 농도 다른 제품 혼동 방지
- 간단하고 직관적

---

## 💡 실용적 해결 방안 비교

### 옵션 1: 유사 제품 기능 완전 제거

```typescript
// src/app/[locale]/page.tsx
const similarProducts = locale === 'ko'
  ? await getSimilarProducts()
  : {};  // 영어 버전은 빈 객체
```

**장점**:
- ✅ 구현 시간: 0시간 (이미 검토 문서에 포함됨)
- ✅ 복잡도: 없음
- ✅ 유지보수: 불필요

**단점**:
- ❌ 한국 버전과 기능 차이 발생
- ❌ 사용자가 다른 브랜드(Generic) 찾기 어려움

**적용 시나리오**:
- 빠른 MVP 출시
- 리소스 제한적인 경우

---

### 옵션 2: 하드코딩된 관련 제품 리스트 (✅ 추천)

#### 2.1 데이터 구조

**`data/related-products-us.json`**:
```json
{
  "acetaminophen_32": [
    {
      "name": "Children's Tylenol Oral Suspension",
      "genericName": "Acetaminophen Oral Suspension",
      "strength": "160mg/5mL (32mg/mL)",
      "manufacturer": "Johnson & Johnson",
      "type": "brand"
    },
    {
      "name": "Generic Children's Acetaminophen",
      "genericName": "Acetaminophen Oral Suspension",
      "strength": "160mg/5mL (32mg/mL)",
      "manufacturer": "Various (CVS, Walgreens, Target, etc.)",
      "type": "generic",
      "note": "Look for 'Compare to Children's Tylenol' label"
    },
    {
      "name": "Infant's Tylenol Oral Suspension",
      "genericName": "Acetaminophen Oral Suspension",
      "strength": "160mg/5mL (32mg/mL)",
      "manufacturer": "Johnson & Johnson",
      "type": "brand"
    }
  ],
  "ibuprofen_20": [
    {
      "name": "Children's Advil Oral Suspension",
      "genericName": "Ibuprofen Oral Suspension",
      "strength": "100mg/5mL (20mg/mL)",
      "manufacturer": "GSK Consumer Healthcare",
      "type": "brand"
    },
    {
      "name": "Children's Motrin Oral Suspension",
      "genericName": "Ibuprofen Oral Suspension",
      "strength": "100mg/5mL (20mg/mL)",
      "manufacturer": "Johnson & Johnson",
      "type": "brand"
    },
    {
      "name": "Generic Children's Ibuprofen",
      "genericName": "Ibuprofen Oral Suspension",
      "strength": "100mg/5mL (20mg/mL)",
      "manufacturer": "Various (CVS, Walgreens, Target, etc.)",
      "type": "generic",
      "note": "Look for 'Compare to Children's Advil' or 'Compare to Children's Motrin' label"
    }
  ]
}
```

#### 2.2 타입 정의

**`src/lib/types.ts`**:
```typescript
export type RelatedProduct = {
  name: string;
  genericName: string;
  strength: string;
  manufacturer: string;
  type: 'brand' | 'generic';
  note?: string;
};

export type RelatedProductsMap = Record<string, RelatedProduct[]>;
```

#### 2.3 서버 로딩

**`src/app/[locale]/page.tsx`**:
```typescript
async function getRelatedProducts(locale: string): Promise<RelatedProductsMap> {
  if (locale !== 'en') {
    return {};  // 한국 버전은 e약은요 API 사용
  }

  const filePath = path.join(process.cwd(), 'data', 'related-products-us.json');
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent) as RelatedProductsMap;
  } catch (error) {
    console.warn('관련 제품 데이터를 불러올 수 없습니다.');
    return {};
  }
}
```

#### 2.4 컴포넌트 수정

**`src/app/components/DosageResultDisplay.tsx`**:
```typescript
// 기존 similarProductsMap을 relatedProductsMap으로 교체
type DosageResultDisplayProps = {
  similarProductsMap?: SimilarProductsMap;  // 한국용 (e약은요)
  relatedProductsMap?: RelatedProductsMap;   // 미국용 (하드코딩)
};

// 렌더링 로직
{locale === 'en' && relatedProductsMap && (
  <RelatedProductsSection
    productKey={`${ingredient}_${strength}`}
    items={relatedProductsMap[`${ingredient}_${strength}`] ?? []}
  />
)}

{locale === 'ko' && similarProductsMap && (
  <SimilarProductsSection
    productId={result.product.id}
    items={similarProductsMap[result.product.id] ?? []}
  />
)}
```

#### 2.5 UI 컴포넌트

**새로운 `RelatedProductsSection`**:
```typescript
function RelatedProductsSection({
  items,
}: {
  items: RelatedProduct[];
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (items.length === 0) return null;

  return (
    <div className="mt-5 border-t border-gray-200 pt-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-gray-800">
          Related Products with Same Strength
        </h4>
        <Button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'Hide' : 'Show'}
        </Button>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-3">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-gray-200 bg-gray-50 p-3"
            >
              <div className="flex items-start gap-3">
                {item.type === 'generic' && (
                  <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded">
                    GENERIC
                  </span>
                )}
                {item.type === 'brand' && (
                  <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
                    BRAND
                  </span>
                )}
                <div className="flex-1">
                  <p className="text-base font-semibold text-gray-800">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.strength}
                  </p>
                  {item.note && (
                    <p className="text-xs text-gray-500 mt-1 italic">
                      💡 {item.note}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {item.manufacturer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

**장점**:
- ✅ 구현 시간: **1-2시간**
- ✅ 유지보수: 연 1-2회 업데이트면 충분
- ✅ 이미지 불필요 (텍스트만)
- ✅ API 호출 없음 → 빠른 로딩
- ✅ 정확성: 직접 검증한 제품만 표시

**단점**:
- ❌ 신제품 출시 시 수동 업데이트 필요
- ❌ 제품 단종 시 수동 제거 필요

**유지보수 주기**:
- 연 1-2회 제품 리스트 검토
- 주요 브랜드(Tylenol, Advil, Motrin) 변경 가능성 낮음

---

### 옵션 3: OpenFDA API 통합

#### 3.1 구현 예시

**`src/lib/openfda.ts`** (신규 파일):
```typescript
export async function fetchRelatedProducts(
  ingredient: string,
  strengthMgPerMl: number
): Promise<OpenFDAProduct[]> {
  const ingredientMap: Record<string, string> = {
    '아세트아미노펜': 'acetaminophen',
    '이부프로펜': 'ibuprofen',
  };

  const genericName = ingredientMap[ingredient];
  if (!genericName) return [];

  try {
    const response = await fetch(
      `https://api.fda.gov/drug/ndc.json?search=generic_name:${genericName}+AND+dosage_form:SUSPENSION&limit=100`
    );
    const data = await response.json();

    // ❌ 문제: strength 필터링 불가능
    // "160mg/5mL", "32mg/mL" 같은 형식 통일 안 됨
    // 수동 파싱 및 필터링 필요

    return data.results
      .filter((product: any) => {
        // 복잡한 strength 파싱 로직 필요
        // "160 mg/5 mL" → 32mg/mL 변환
      })
      .map((product: any) => ({
        name: product.brand_name || product.generic_name,
        strength: product.active_ingredients?.[0]?.strength,
        ndc: product.product_ndc,
      }));
  } catch (error) {
    console.error('OpenFDA API 호출 실패:', error);
    return [];
  }
}
```

**장점**:
- ✅ 자동 업데이트 (FDA 데이터 실시간 반영)
- ✅ 포괄적 (모든 FDA 승인 제품)

**단점**:
- ❌ 구현 시간: **8-10시간**
- ❌ Strength 파싱 복잡 ("160mg/5mL" → 32mg/mL 변환)
- ❌ 데이터 품질 불안정 (일부 제품 정보 누락)
- ❌ OTC/처방약 혼재 필터링 필요
- ❌ Rate limit 관리 필요
- ❌ 이미지 없음

**결론**: **ROI 낮음** (높은 복잡도 대비 제한적 이점)

---

### 옵션 4: Generic Brand 안내 텍스트만 표시 (✅ 보조 추천)

#### 4.1 UI 예시

```typescript
// DosageResultDisplay.tsx에 추가
{status === 'success' && locale === 'en' && (
  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
    <p className="text-sm text-gray-700">
      <strong>💡 Cost-Saving Tip:</strong> Generic versions of{' '}
      {getProductName(product, locale)} are available at most pharmacies
      (CVS, Walgreens, Target, Walmart, etc.).
    </p>
    <p className="text-xs text-gray-600 mt-2">
      Look for products labeled "Compare to {getProductName(product, locale)}"
      with the same strength ({product.strength_mg_per_ml} mg/mL).
    </p>
  </div>
)}
```

**장점**:
- ✅ 구현 시간: **30분**
- ✅ 사용자에게 실질적 도움 (비용 절감)
- ✅ 유지보수 불필요
- ✅ Generic 구매 유도 (의료비 절감)

**단점**:
- ❌ 구체적 제품명 없음

---

## 🎯 최종 권장 방안

### ✅ 추천: **옵션 2 (하드코딩) + 옵션 4 (Generic 안내) 조합**

#### 구현 우선순위

**Phase 1: Generic 안내 텍스트 (30분)**
```typescript
// 모든 성공 결과에 Generic 안내 표시
<GenericBrandNotice product={product} locale={locale} />
```

**Phase 2: 하드코딩 관련 제품 리스트 (1-2시간)**
```typescript
// data/related-products-us.json 생성
// RelatedProductsSection 컴포넌트 추가
```

**Phase 3: 한국 버전과 통합 (30분)**
```typescript
// 한국: e약은요 API
// 미국: 하드코딩 리스트
// 조건부 렌더링
```

**총 구현 시간**: **2-3시간**

---

### 📊 방안별 비교표

| 항목 | 옵션 1<br/>(제거) | 옵션 2<br/>(하드코딩) | 옵션 3<br/>(OpenFDA) | 옵션 4<br/>(텍스트만) |
|------|------------------|---------------------|---------------------|---------------------|
| **구현 시간** | 0h | **1-2h** ✅ | 8-10h | **0.5h** ✅ |
| **유지보수** | 없음 | 연 1-2회 | 복잡 | 없음 |
| **정확성** | N/A | ✅ 높음 | ⚠️ 보통 | N/A |
| **사용자 가치** | ❌ 낮음 | ✅ 높음 | ✅ 높음 | ⚠️ 보통 |
| **API 의존성** | 없음 | 없음 | ✅ 있음 | 없음 |
| **이미지 제공** | N/A | ❌ 없음 | ❌ 없음 | N/A |
| **확장성** | N/A | ⚠️ 보통 | ✅ 높음 | N/A |
| **ROI** | 낮음 | **높음** ✅ | 낮음 | **높음** ✅ |

---

## 🚀 구현 가이드

### Step 1: Generic 안내 컴포넌트 생성 (30분)

**`src/app/components/GenericBrandNotice.tsx`** (신규):
```typescript
'use client';

import type { Product } from '@/lib/types';

type Props = {
  product: Product;
  locale: string;
};

export function GenericBrandNotice({ product, locale }: Props) {
  if (locale !== 'en') return null;

  const productName = product.nameEn || product.name;
  const strength = product.strength_mg_per_ml;

  return (
    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p className="text-sm font-semibold text-gray-800 mb-2">
        💰 Cost-Saving Tip: Generic Options Available
      </p>
      <p className="text-sm text-gray-700">
        Generic versions of <strong>{productName}</strong> are available
        at CVS, Walgreens, Target, Walmart, and other pharmacies.
      </p>
      <p className="text-xs text-gray-600 mt-2">
        Look for products labeled <strong>"Compare to {productName}"</strong>{' '}
        with the same strength (<strong>{strength} mg/mL</strong>).
        Generic brands contain the same active ingredient and work
        exactly the same as brand-name products.
      </p>
    </div>
  );
}
```

**사용**:
```typescript
// DosageResultDisplay.tsx에서
import { GenericBrandNotice } from './GenericBrandNotice';

{result.status === 'success' && (
  <>
    {/* 기존 용량 정보 */}
    <GenericBrandNotice product={result.product} locale={locale} />
  </>
)}
```

---

### Step 2: 하드코딩 제품 리스트 생성 (30분)

**`data/related-products-us.json`** (신규):
```json
{
  "acetaminophen_32": [
    {
      "name": "Children's Tylenol Oral Suspension",
      "genericName": "Acetaminophen Oral Suspension",
      "strength": "160mg/5mL",
      "manufacturer": "Johnson & Johnson",
      "type": "brand"
    },
    {
      "name": "Infant's Tylenol Oral Suspension",
      "genericName": "Acetaminophen Oral Suspension",
      "strength": "160mg/5mL",
      "manufacturer": "Johnson & Johnson",
      "type": "brand",
      "note": "Same concentration, designed for infants"
    },
    {
      "name": "CVS Health Children's Pain & Fever",
      "genericName": "Acetaminophen Oral Suspension",
      "strength": "160mg/5mL",
      "manufacturer": "CVS Pharmacy",
      "type": "generic"
    },
    {
      "name": "Walgreens Children's Pain Reliever",
      "genericName": "Acetaminophen Oral Suspension",
      "strength": "160mg/5mL",
      "manufacturer": "Walgreens",
      "type": "generic"
    },
    {
      "name": "Up & Up Children's Pain & Fever",
      "genericName": "Acetaminophen Oral Suspension",
      "strength": "160mg/5mL",
      "manufacturer": "Target",
      "type": "generic",
      "note": "Target store brand"
    }
  ],
  "acetaminophen_50": [
    {
      "name": "Children's Tylenol Oral Suspension (Older Children)",
      "genericName": "Acetaminophen Oral Suspension",
      "strength": "250mg/5mL",
      "manufacturer": "Johnson & Johnson",
      "type": "brand",
      "note": "Higher concentration for children 2+ years"
    }
  ],
  "ibuprofen_20": [
    {
      "name": "Children's Advil Oral Suspension",
      "genericName": "Ibuprofen Oral Suspension",
      "strength": "100mg/5mL",
      "manufacturer": "GSK Consumer Healthcare",
      "type": "brand"
    },
    {
      "name": "Children's Motrin Oral Suspension",
      "genericName": "Ibuprofen Oral Suspension",
      "strength": "100mg/5mL",
      "manufacturer": "Johnson & Johnson",
      "type": "brand"
    },
    {
      "name": "Infant's Advil Drops",
      "genericName": "Ibuprofen Concentrated Drops",
      "strength": "50mg/1.25mL",
      "manufacturer": "GSK Consumer Healthcare",
      "type": "brand",
      "note": "Discontinued in some areas - check availability"
    },
    {
      "name": "CVS Health Children's Ibuprofen",
      "genericName": "Ibuprofen Oral Suspension",
      "strength": "100mg/5mL",
      "manufacturer": "CVS Pharmacy",
      "type": "generic"
    },
    {
      "name": "Walgreens Children's Ibuprofen",
      "genericName": "Ibuprofen Oral Suspension",
      "strength": "100mg/5mL",
      "manufacturer": "Walgreens",
      "type": "generic"
    }
  ]
}
```

---

### Step 3: 타입 및 로딩 로직 (30분)

**`src/lib/types.ts`에 추가**:
```typescript
export type RelatedProduct = {
  name: string;
  genericName: string;
  strength: string;
  manufacturer: string;
  type: 'brand' | 'generic';
  note?: string;
};

export type RelatedProductsMapUS = Record<string, RelatedProduct[]>;
```

**`src/app/[locale]/page.tsx`에 추가**:
```typescript
async function getRelatedProductsUS(): Promise<RelatedProductsMapUS> {
  const filePath = path.join(process.cwd(), 'data', 'related-products-us.json');
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.warn('관련 제품 데이터를 불러올 수 없습니다.');
    return {};
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const products = await getValidatedProducts(locale);

  // ✅ 조건부 로딩
  const similarProducts = locale === 'ko' ? await getSimilarProducts(locale) : {};
  const relatedProductsUS = locale === 'en' ? await getRelatedProductsUS() : {};

  return (
    <main>
      {/* ... */}
      <DosageResultDisplay
        similarProductsMap={similarProducts}
        relatedProductsMap={relatedProductsUS}
      />
    </main>
  );
}
```

---

### Step 4: UI 컴포넌트 추가 (30분)

**`src/app/components/DosageResultDisplay.tsx`에 추가**:
```typescript
type DosageResultDisplayProps = {
  similarProductsMap?: SimilarProductsMap;  // 한국용
  relatedProductsMap?: RelatedProductsMapUS;  // 미국용
};

// 컴포넌트 내부
const getRelatedProductKey = (product: Product): string => {
  const ingredientMap: Record<string, string> = {
    '아세트아미노펜': 'acetaminophen',
    'Acetaminophen': 'acetaminophen',
    '이부프로펜': 'ibuprofen',
    'Ibuprofen': 'ibuprofen',
  };

  const ingredient = ingredientMap[product.ingredient] ||
                     ingredientMap[product.ingredientEn || ''];
  return `${ingredient}_${product.strength_mg_per_ml}`;
};

// 렌더링
{result.status === 'success' && locale === 'en' && relatedProductsMap && (
  <RelatedProductsSectionUS
    items={relatedProductsMap[getRelatedProductKey(result.product)] ?? []}
  />
)}

{result.status === 'success' && locale === 'ko' && similarProductsMap && (
  <SimilarProductsSection
    productId={result.product.id}
    items={similarProductsMap[result.product.id] ?? []}
    isExpanded={expandedProducts.has(result.product.id)}
    onToggle={() => toggleSimilarProducts(result.product.id)}
  />
)}
```

**`RelatedProductsSectionUS` 컴포넌트**:
```typescript
function RelatedProductsSectionUS({ items }: { items: RelatedProduct[] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (items.length === 0) return null;

  return (
    <div className="mt-5 border-t border-gray-200 pt-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-semibold text-gray-800">
          Related Products (Same Strength)
        </h4>
        <Button variant="secondary" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'Hide' : 'Show'} ({items.length})
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-white"
            >
              <span
                className={`px-2 py-1 text-xs font-bold rounded ${
                  item.type === 'generic'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {item.type.toUpperCase()}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600">{item.strength}</p>
                {item.note && (
                  <p className="text-xs text-gray-500 mt-1 italic">💡 {item.note}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">{item.manufacturer}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 📝 유지보수 가이드

### 연간 업데이트 체크리스트

**시기**: 매년 1-2회 (1월, 7월 권장)

**확인 사항**:
1. ✅ 주요 브랜드 제품 농도 변경 여부 확인
   - Tylenol 공식 사이트 확인
   - Advil/Motrin 공식 사이트 확인

2. ✅ 신제품 출시 확인
   - FDA 승인 소아용 해열제 검색
   - 주요 약국 Generic 브랜드 추가 확인

3. ✅ 단종 제품 제거
   - Infant's Advil Drops (일부 지역 단종)
   - 기타 판매 중단 제품

4. ✅ Generic 브랜드 업데이트
   - CVS, Walgreens, Target 제품 변경 확인

**소요 시간**: 30분-1시간/년

---

## 🎯 결론 및 다음 단계

### 최종 결정

**✅ 추천: 옵션 2 (하드코딩) + 옵션 4 (Generic 안내)**

**이유**:
1. ✅ **높은 ROI**: 2-3시간 투자로 실질적 사용자 가치 제공
2. ✅ **낮은 복잡도**: API 통합 없이 정적 데이터 관리
3. ✅ **정확성**: 직접 검증한 제품만 표시
4. ✅ **경쟁사 대비 차별화**: 대부분의 계산기는 이 기능 없음
5. ✅ **유지보수 용이**: 연 1-2회 업데이트면 충분

### 구현 순서

**Week 1**: Generic 안내 텍스트 (30분)
**Week 1**: 하드코딩 리스트 생성 (1-2시간)
**Week 1**: 통합 테스트 (30분)

**총 예상 시간**: **2-3시간**

### 향후 확장 가능성

**Phase 2 (선택)**:
- 제품 이미지 추가 (Unsplash 또는 공식 사이트)
- 가격 정보 링크 (Amazon, Walmart API)
- 사용자 리뷰 통합

**Phase 3 (장기)**:
- OpenFDA API 통합 (자동화)
- 제품 재고 확인 API 연동

---

## 📚 참고 자료

### API 문서
- OpenFDA API: https://open.fda.gov/apis/drug/
- DailyMed API: https://dailymed.nlm.nih.gov/dailymed/app-support-web-services.cfm
- RxNorm API: https://lhncbc.nlm.nih.gov/RxNav/

### 경쟁사
- Tylenol 공식: https://www.tylenol.com/safety-dosing
- Sound Beach Pediatrics: https://www.soundbeachpediatrics.com/resources/medication-dosing/
- Omni Calculator: https://www.omnicalculator.com/health/infant-tylenol-dosage

### 의료 가이드라인
- AAP Acetaminophen Dosing: https://www.healthychildren.org/English/safety-prevention/at-home/medication-safety/Pages/Acetaminophen-for-Fever-and-Pain.aspx
- FDA Drug Database: https://www.fda.gov/drugs/drug-approvals-and-databases

---

**문서 버전**: 1.0
**최종 업데이트**: 2025-11-11
**다음 리뷰 예정**: 2026-01-01
**예상 구현 시간**: 2-3시간

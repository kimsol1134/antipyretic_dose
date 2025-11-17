---
title: 어린이 해열제 복용량 계산기 - 의료 안전성 중심 Next.js 애플리케이션
date: 2025-11-16
tags: [Next.js, React, TypeScript, Zod, Zustand]
excerpt: 소아 해열제의 정확한 복용량을 계산하는 의료 안전성 중심 웹 애플리케이션
thumbnail: https://picsum.photos/seed/antipyretic-dose/800/600
---

## 프로젝트 개요

아이가 열이 났을 때 부모가 가장 걱정하는 것 중 하나는 "해열제를 얼마나 먹여야 하는가"입니다. 제품마다 농도가 다르고, 체중에 따라 복용량이 달라지기 때문에 실수할 가능성이 높습니다. 이 프로젝트는 이러한 문제를 해결하기 위해 시작되었습니다.

어린이 해열제 복용량 계산기는 부모님들이 타이레놀, 챔프, 부루펜, 맥시부펜 등 한국에서 흔히 사용되는 소아 해열제의 정확한 복용량을 체중과 나이에 기반하여 안전하게 계산할 수 있도록 돕습니다. 의료 소프트웨어 개발 표준인 IEC 62304를 참고하여 방어적 프로그래밍과 빌드타임 데이터 검증을 적용했습니다.

프로젝트의 핵심 목표는 **정확성**과 **안전성**입니다. 어린이 약물 투여에서 작은 오류도 심각한 결과를 초래할 수 있기 때문에, 모든 계산 로직에 다중 안전 장치를 구현했습니다.

## 주요 기능

### 1. 체중 기반 정확한 용량 계산
어린이의 체중을 입력하면 각 제품의 mg/kg 권장량에 따라 최소-최대 복용량 범위를 mL 단위로 계산합니다. 예를 들어 15kg 아이에게 타이레놀(32mg/mL)을 투여할 경우, 4.7~7.0mL 범위가 제시됩니다.

### 2. 다중 안전 장치
- **나이 제한**: 4개월 미만(아세트아미노펜) 또는 6개월 미만(이부프로펜)은 자동 차단
- **최대 용량 제한**: 1회 최대 복용량을 넘지 않도록 자동 조정
- **하루 최대량 경고**: 이부프로펜 계열은 30kg 미만 소아에게 25mL 제한

### 3. 다국어 지원
한국어와 영어를 지원하며, 시장에 따라 다른 제품을 표시합니다. 영어 버전에서는 FDA 승인 제품(Tylenol, Advil, Motrin)만 노출됩니다.

### 4. 유사 약품 정보 제공
e약은요 공공 API를 연동하여 같은 성분/농도의 다른 브랜드 약품 정보를 제공합니다.

## 기술 스택

- **Frontend**: Next.js 15.1, React 19, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand (atomic selectors)
- **Form Handling**: React Hook Form + Zod
- **Data Validation**: Zod schemas with custom refinements
- **Testing**: Vitest
- **Internationalization**: next-intl
- **Animation**: Framer Motion
- **Build Tools**: Turbopack

## 아키텍처

```
[Server Component]
    ↓ products.json 로드 + Zod 검증
    ↓ locale별 필터링
[Client: DosageForm]
    ↓ React Hook Form + Zod validation
    ↓ Zustand action 호출
[Pure Engine: dosage-calculator.ts]
    ↓ 체중 × mg/kg 계산
    ↓ 안전 검증 (age_block, max_cap, NaN/Infinity)
[Zustand Store]
    ↓ 전역 상태 업데이트
[Client: DosageResultDisplay]
    ↓ atomic selector로 결과 렌더링
```

핵심 설계 원칙은 **관심사의 분리**입니다. 계산 로직(`dosage-calculator.ts`)은 React나 상태 관리 라이브러리와 완전히 독립되어 있어 순수 함수 단위 테스트가 가능합니다.

## 주요 구현 사항

### 1. 빌드타임 데이터 검증

의료 소프트웨어에서 가장 중요한 것은 잘못된 데이터가 프로덕션에 배포되지 않는 것입니다. Zod 스키마에 커스텀 refinement를 추가하여 성분명과 농도의 논리적 일치를 검증합니다.

```typescript
.refine(
  (data) => {
    const { ingredient, strength_mg_per_ml } = data;
    const expectedStrengths =
      INGREDIENT_STRENGTH_MAP[ingredient];
    if (expectedStrengths) {
      return expectedStrengths.includes(strength_mg_per_ml);
    }
    return true;
  },
  {
    message: '성분명과 농도가 일치하지 않습니다.',
  }
)
```

아세트아미노펜(32mg/mL 또는 50mg/mL), 이부프로펜(20mg/mL), 덱시부프로펜(12mg/mL)의 조합만 허용됩니다. 잘못된 조합이 입력되면 빌드가 실패합니다.

### 2. 방어적 용량 계산

모든 계산에서 무한값, NaN, 0으로 나누기 등을 검사합니다.

```typescript
// 농도 검증
if (product.strength_mg_per_ml <= 0) {
  return { status: 'error', message: '제품 데이터 오류' };
}

// 유한성 검증
if (!Number.isFinite(recommendedMl) ||
    !Number.isFinite(maxMl)) {
  return { status: 'error', message: '계산 오류' };
}

// 최대 용량 제한
if (maxMg > product.max_single_mg) {
  maxMg = product.max_single_mg;
  statusMessage = '1회 최대 용량으로 조정됨';
}
```

### 3. 시장별 제품 필터링

`products.json`에 각 제품의 `markets` 배열을 정의하고, 서버 컴포넌트에서 locale에 따라 필터링합니다.

```typescript
const marketKey = locale === 'en' ? 'en' : 'ko';
const filteredProducts = allProducts.filter((product) =>
  product.markets.includes(marketKey)
);
```

FDA 미승인 성분(덱시부프로펜)이 영어 시장에 노출되지 않도록 스키마 레벨에서 검증합니다.

## 개발 과정

Git 히스토리를 보면 프로젝트의 발전 과정이 드러납니다:

1. **초기 설정** (cf817c2): 핵심 계산 로직과 기본 UI 구현
2. **SEO 최적화** (94d23d1~): FAQ 페이지 추가, 메타데이터 개선
3. **다국어 확장** (d0c81bb~f70f95c): next-intl 도입, 영어 번역, 미국 시장 제품 추가
4. **수익화** (9743392): AdSense 승인을 위한 About, Privacy, Terms 페이지 추가
5. **검색 최적화** (0f148cb~4c51cb3): 네이버 서치어드바이저 최적화, sitemap 개선
6. **성장 전략** (778cd64): 마케팅 성장 전략 문서화

총 13개의 Pull Request를 통해 기능이 점진적으로 추가되었으며, 각 PR은 명확한 목적을 가지고 있습니다.

## 성과 및 결과

### 정량적 성과
- 7개 제품 데이터 (한국 5개, 미국 3개)
- 2개 언어 지원 (한국어, 영어)
- 100% TypeScript 타입 커버리지
- Zod 스키마를 통한 빌드타임 데이터 검증

### 정성적 성과
- 의료 소프트웨어 개발의 엄격한 안전성 요구사항을 경험
- 방어적 프로그래밍의 실제 적용 사례 학습
- 다국어 지원 시 문화적/규제적 차이(FDA 승인 여부) 고려의 중요성 인식

## 개선 계획

1. **실시간 약물 상호작용 검사**: 다른 감기약과의 성분 중복 자동 확인
2. **복용 이력 추적**: 마지막 복용 시간 기록 및 다음 복용 시간 알림
3. **의료진 연계**: 이상 증상 발생 시 가까운 병원/약국 안내
4. **더 많은 제품 지원**: 일본, 중국 등 아시아 시장 확대

## 관련 링크

- [GitHub 저장소](https://github.com/kimsol1134/antipyretic_dose)

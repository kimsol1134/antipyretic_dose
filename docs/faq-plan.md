# 어린이 해열제 FAQ 페이지 개발 계획서 (v2.0 - 비판적 검토 반영)

> **문서 정보**
> 작성일: 2025-11-10
> 버전: 2.0 (비판적 검토 및 개선 반영)
> 목적: 검색 유입 증대 및 의학적 신뢰성 강화

---

## 📋 목차

1. [개요](#개요)
2. [비판적 검토 결과](#비판적-검토-결과)
3. [개발 목표](#개발-목표)
4. [MVP 전략 (Phase 1)](#mvp-전략-phase-1)
5. [FAQ 콘텐츠 설계](#faq-콘텐츠-설계)
6. [기술 구현 계획](#기술-구현-계획)
7. [SEO 최적화 전략](#seo-최적화-전략)
8. [법적 안전장치](#법적-안전장치)
9. [개발 로드맵](#개발-로드맵)
10. [성과 측정 지표](#성과-측정-지표)

---

## 개요

### 목적
구글과 네이버 검색 유입을 증대시키기 위한 근거 기반 FAQ 페이지 개발

### 핵심 차별점
- ✅ **의학적 신뢰성**: 모든 답변에 공식 출처 명시 및 계층화
- ✅ **법적 안전**: 각 답변마다 면책 조항 포함
- ✅ **SEO 최적화**: FAQPage schema로 Featured Snippet 타겟팅
- ✅ **점진적 개선**: MVP 8개로 시작, 데이터 기반 확장

---

## 비판적 검토 결과

### 🔍 원본 계획의 문제점 및 개선 사항

| 번호 | 문제점 | 개선 방안 | 우선순위 |
|------|--------|-----------|----------|
| 1 | **의학적 책임 리스크**<br>단정적 표현 사용 ("~해야 합니다") | 참고용 표현으로 변경<br>각 답변마다 면책 조항 추가 | 🔴 Critical |
| 2 | **출처 신뢰성 부족**<br>블로그, 기사 등 2-3차 자료 혼재 | 출처 계층화 (1차/2차/3차)<br>식약처 직접 문서 우선 | 🔴 Critical |
| 3 | **FAQ 개수 과다**<br>초기 15개는 품질 저하 위험 | MVP 8개로 축소<br>점진적 확장 전략 | 🟡 High |
| 4 | **답변 구조 비효율**<br>Featured Snippet에 부적합한 긴 답변 | 2단 구조: 핵심 답변(50자) + 상세 설명 | 🟡 High |
| 5 | **구조화 데이터 과다**<br>비표준 citation 포함 | answer는 순수 텍스트만<br>200자 이내 제한 | 🟢 Medium |
| 6 | **검색 기능 부재**<br>카테고리 필터만 존재 | 클라이언트 사이드 검색 추가<br>키워드 하이라이팅 | 🟢 Medium |
| 7 | **내부 링크 미흡**<br>단방향 링크만 존재 | 계산 결과 → 관련 FAQ 자동 추천<br>양방향 연결 강화 | 🟢 Medium |
| 8 | **데이터 구조 부족**<br>면책 조항 필드 없음 | medicalDisclaimer, shortAnswer 추가<br>XSS 방지 로직 | 🟡 High |
| 9 | **개발 우선순위 문제**<br>한 번에 모든 FAQ 작성 | Phase 1: MVP 8개 (3시간)<br>Phase 2: 데이터 기반 확장 | 🔴 Critical |
| 10 | **키워드 중복**<br>키워드 cannibalization 위험 | 각 FAQ당 단일 타겟 키워드 명확화<br>검색어 그대로 사용 | 🟢 Medium |

### 🎯 핵심 변경 사항 요약

```diff
- FAQ 개수: 15개 전체 작성
+ FAQ 개수: 8개 MVP → 점진적 확장

- 답변 구조: 단일 긴 답변
+ 답변 구조: 핵심(50자) + 상세 설명 (접기/펼치기)

- 법적 안전장치: 페이지 상단에만
+ 법적 안전장치: 각 답변마다 개별 면책 조항

- 출처: 혼재된 1-3차 자료
+ 출처: 계층화 (1차 우선, 2-3차는 보조)

- 내부 링크: 메인 → FAQ 단방향
+ 내부 링크: 계산 결과 → FAQ 추천 (양방향)

- 개발 시간: 5.5시간 (품질 불확실)
+ 개발 시간: 3시간 MVP (품질 우선)
```

---

## 개발 목표

### 1차 목표 (즉시 효과)
- ✅ 롱테일 키워드 검색 유입 20-30% 증가
- ✅ Google Featured Snippet 노출 (최소 2-3개)
- ✅ 평균 체류 시간 1-2분 증가

### 2차 목표 (1-2개월)
- 📊 FAQ 페이지 자연 검색 유입: 전체의 15-20%
- 📊 재방문율 10-15% 증가
- 📊 계산기 전환율 향상 (FAQ → 계산기 이동)

### 3차 목표 (3개월 이상)
- 🎯 도메인 권위 향상 (백링크 자연 발생)
- 🎯 브랜드 검색량 증가
- 🎯 부모 커뮤니티에서 공유 증가

---

## MVP 전략 (Phase 1)

### 핵심 8개 FAQ 선정 기준

1. **검색량**: 네이버/구글 검색량 상위
2. **의도 명확성**: 즉시 답변 가능한 질문
3. **계산기 연계**: 복용량 계산기로 유도 가능
4. **Featured Snippet 가능성**: 명확한 팩트 기반 답변

### 선정된 8개 FAQ

| 번호 | 질문 | 타겟 키워드 | Featured Snippet 가능성 | 우선순위 |
|------|------|-------------|------------------------|----------|
| 1 | 아이 열이 몇 도일 때 해열제를 먹여야 하나요? | "아기 열 몇 도 해열제" | ⭐⭐⭐ | P0 |
| 2 | 타이레놀 복용 간격은 몇 시간인가요? | "타이레놀 복용 간격" | ⭐⭐⭐ | P0 |
| 3 | 부루펜 복용 간격은 몇 시간인가요? | "부루펜 복용 간격" | ⭐⭐⭐ | P0 |
| 4 | 타이레놀과 부루펜 중 어떤 것을 먹여야 하나요? | "타이레놀 부루펜 차이" | ⭐⭐⭐ | P0 |
| 5 | 해열제 교차 복용은 어떻게 하나요? | "해열제 교차 복용" | ⭐⭐ | P1 |
| 6 | 타이레놀 100mL와 200mL 제품의 차이는? | "타이레놀 100 200 차이" | ⭐⭐ | P1 |
| 7 | 해열제를 공복에 먹여도 되나요? | "타이레놀 공복" | ⭐⭐ | P1 |
| 8 | 해열제는 하루에 몇 번까지 먹일 수 있나요? | "해열제 하루 최대" | ⭐⭐ | P1 |

---

## FAQ 콘텐츠 설계

### 콘텐츠 구조 원칙

```
[질문]
├── 핵심 답변 (40-60자) ← Featured Snippet 타겟
├── 상세 설명 (접기/펼치기)
│   ├── 구체적인 가이드라인
│   ├── 표/리스트 (모바일 최적화)
│   └── 주의사항
├── 출처 (계층화)
│   ├── 1차 출처: 식약처, 대한소아과학회
│   ├── 2차 출처: 병원, 의료기관
│   └── 3차 출처: 언론, 블로그 (보조)
├── 관련 정보
│   ├── 관련 FAQ 링크
│   └── 계산기 CTA
└── 면책 조항 (개별)
```

### 예시: FAQ #1

```markdown
## Q1. 아이 열이 몇 도일 때 해열제를 먹여야 하나요?

### 핵심 답변
체온이 38°C(38도) 이상일 때 해열제를 먹일 수 있습니다. 다만 38도는 먹일 수 있는 기준이지 반드시 먹여야 하는 기준은 아닙니다.

<details>
<summary>상세 설명 보기</summary>

#### 해열제를 고려해야 하는 경우
- ✅ 체온 38°C 이상 + 아이가 불편해하는 경우
- ✅ 체온 38.5°C 이상
- ✅ 열성 경련 병력이 있는 경우 (38°C 미만이라도 오한 등 증상 시)

#### 급하게 먹일 필요 없는 경우
- ⭕ 체온 38°C 이상이어도 잘 먹고 잘 놀고 컨디션이 좋은 경우

#### 특별 주의 (즉시 병원 방문)
- 🚨 생후 100일(3개월) 이하 영아가 38°C 이상
- 🚨 48-72시간 이상 열이 지속
- 🚨 발진, 구토, 경련 등 다른 증상 동반

</details>

### 참고 출처
- 🏛️ **1차 출처**: [식품의약품안전처 의약품통합정보시스템](https://nedrug.mfds.go.kr)
- ⚕️ **2차 출처**: [명지병원 소아응급의료센터 - 소아 발열 가이드](https://mjh.or.kr/infant/health/class/fever-children.do)
- 📰 **3차 출처**: [K-Health - 소아해열제 사용법](https://www.k-health.com/news/articleView.html?idxno=58679)

### 관련 정보
- 💊 [정확한 복용량 계산하기 →](/)
- 📖 [타이레놀 복용 간격은?](#q2)
- 📖 [부루펜 복용 간격은?](#q3)

---

**⚠️ 면책 조항**: 본 정보는 일반적인 참고 자료이며 의학적 조언이 아닙니다. 실제 투약 전 반드시 의사 또는 약사와 상담하세요. (최종 업데이트: 2025-11-10)
```

---

## 기술 구현 계획

### 1. 디렉토리 구조

```
src/
├── app/
│   ├── faq/
│   │   └── page.tsx (FAQ 메인 페이지)
│   └── components/
│       ├── faq/
│       │   ├── FAQList.tsx (FAQ 목록)
│       │   ├── FAQAccordion.tsx (아코디언 UI)
│       │   ├── FAQSearch.tsx (검색 기능)
│       │   └── FAQCategoryFilter.tsx (카테고리 필터)
│       └── shared/
│           └── SourceBadge.tsx (출처 배지 - 1차/2차/3차)
├── data/
│   └── faq-data.ts (FAQ 데이터)
└── lib/
    └── faq-utils.ts (검색, 필터링 유틸)
```

### 2. 데이터 구조 (수정됨)

```typescript
// src/data/faq-data.ts

export type SourceType = 'official' | 'medical' | 'reference';
export type FAQCategory = 'timing' | 'interval' | 'comparison' | 'safety';

export interface Source {
  name: string;
  url: string;
  type: SourceType;
  description?: string; // 출처 설명
}

export interface FAQItem {
  id: string;
  category: FAQCategory;

  // 질문
  question: string;

  // 답변 (2단 구조)
  shortAnswer: string; // 40-60자, Featured Snippet 타겟
  detailedAnswer: string; // HTML 지원 (마크다운 변환)

  // 안전장치
  medicalDisclaimer: string; // 개별 면책 조항

  // 출처 (계층화)
  sources: Source[];

  // SEO
  keywords: string[]; // 타겟 키워드
  targetKeyword: string; // 메인 타겟 키워드 (단일)

  // 연결
  relatedFAQs?: string[]; // 관련 FAQ ID
  relatedProducts?: string[]; // 관련 제품 ID (data/products.json)

  // 메타
  lastUpdated: string; // ISO 8601 형식
  reviewed: boolean; // 의학적 검토 완료 여부
  priority: 0 | 1 | 2; // 0=최우선, 1=높음, 2=보통
}

export const faqData: FAQItem[] = [
  {
    id: 'fever-temperature-guide',
    category: 'timing',
    question: '아이 열이 몇 도일 때 해열제를 먹여야 하나요?',
    shortAnswer: '체온이 38°C(38도) 이상일 때 해열제를 먹일 수 있습니다. 다만 38도는 먹일 수 있는 기준이지 반드시 먹여야 하는 기준은 아닙니다.',
    detailedAnswer: `
      <h4>해열제를 고려해야 하는 경우</h4>
      <ul>
        <li>✅ 체온 38°C 이상 + 아이가 불편해하는 경우</li>
        <li>✅ 체온 38.5°C 이상</li>
        <li>✅ 열성 경련 병력이 있는 경우</li>
      </ul>
      <h4>급하게 먹일 필요 없는 경우</h4>
      <ul>
        <li>⭕ 체온 38°C 이상이어도 잘 먹고 잘 놀고 컨디션이 좋은 경우</li>
      </ul>
      <h4>특별 주의 (즉시 병원 방문)</h4>
      <ul>
        <li>🚨 생후 100일(3개월) 이하 영아가 38°C 이상</li>
        <li>🚨 48-72시간 이상 열이 지속</li>
        <li>🚨 발진, 구토, 경련 등 다른 증상 동반</li>
      </ul>
    `,
    medicalDisclaimer: '본 정보는 일반적인 참고 자료이며 의학적 조언이 아닙니다. 실제 투약 전 반드시 의사 또는 약사와 상담하세요.',
    sources: [
      {
        name: '식품의약품안전처 의약품통합정보시스템',
        url: 'https://nedrug.mfds.go.kr',
        type: 'official',
        description: '공식 의약품 정보',
      },
      {
        name: '명지병원 소아응급의료센터',
        url: 'https://mjh.or.kr/infant/health/class/fever-children.do',
        type: 'medical',
        description: '소아 발열 가이드',
      },
      {
        name: 'K-Health 소아해열제 사용법',
        url: 'https://www.k-health.com/news/articleView.html?idxno=58679',
        type: 'reference',
      },
    ],
    keywords: ['해열제', '체온', '38도', '열', '발열'],
    targetKeyword: '아기 열 몇 도 해열제',
    relatedFAQs: ['tylenol-interval', 'brufen-interval'],
    relatedProducts: [
      'tylenol_susp_100ml_kr',
      'champ_syrup_red_kr',
      'brufen_susp_100_5_kr',
      'maxibufen_susp_12_1_kr',
    ],
    lastUpdated: '2025-11-10',
    reviewed: true,
    priority: 0,
  },

  {
    id: 'tylenol-interval',
    category: 'interval',
    question: '타이레놀(아세트아미노펜) 복용 간격은 몇 시간인가요?',
    shortAnswer: '타이레놀(아세트아미노펜)은 최소 4시간 간격으로 복용하며, 하루 최대 5회까지 가능합니다.',
    detailedAnswer: `
      <h4>권장 복용 간격</h4>
      <table>
        <tr>
          <th>구분</th>
          <th>간격</th>
        </tr>
        <tr>
          <td>최소 간격</td>
          <td><strong>4시간</strong></td>
        </tr>
        <tr>
          <td>권장 간격</td>
          <td>4-6시간</td>
        </tr>
        <tr>
          <td>하루 최대 횟수</td>
          <td>5회</td>
        </tr>
      </table>

      <h4>주의사항</h4>
      <ul>
        <li>⚠️ 4시간 미만 간격으로 복용 시 간 손상 위험</li>
        <li>⚠️ 하루 최대 용량: 체중 × 75mg/kg</li>
        <li>✅ 공복 복용 가능 (위장 부담 적음)</li>
      </ul>

      <p><strong>💊 정확한 복용량을 알고 싶으신가요?</strong><br>
      <a href="/">복용량 계산기</a>에서 아이 체중을 입력하면 정확한 mL 용량을 계산해드립니다.</p>
    `,
    medicalDisclaimer: '본 정보는 식품의약품안전처 허가사항을 참고한 일반적인 가이드라인입니다. 실제 투약 전 반드시 의사 또는 약사와 상담하세요.',
    sources: [
      {
        name: '식품의약품안전처 의약품통합정보시스템',
        url: 'https://nedrug.mfds.go.kr/pbp/CCBBB01/getItemDetail?itemSeq=199603002',
        type: 'official',
        description: '어린이타이레놀현탁액 허가사항',
      },
      {
        name: '타이레놀 공식 홈페이지',
        url: 'https://www.tylenol.co.kr/children-infants/safety/dosage-charts',
        type: 'official',
        description: '복용량 가이드',
      },
      {
        name: '본 사이트 계산 로직',
        url: '/docs/dosage-calculator.ts',
        type: 'reference',
        description: 'interval_hours: 4, max_doses_per_day: 5',
      },
    ],
    keywords: ['타이레놀', '복용 간격', '4시간', '아세트아미노펜'],
    targetKeyword: '타이레놀 복용 간격',
    relatedFAQs: ['brufen-interval', 'cross-dosing', 'tylenol-brufen-difference'],
    relatedProducts: ['tylenol_susp_100ml_kr', 'tylenol_susp_200ml_kr', 'champ_syrup_red_kr'],
    lastUpdated: '2025-11-10',
    reviewed: true,
    priority: 0,
  },

  // ... 나머지 6개 FAQ는 동일한 형식으로 작성
];
```

### 3. FAQ 페이지 컴포넌트

```typescript
// src/app/faq/page.tsx

import { Metadata } from 'next';
import FAQList from '@/app/components/faq/FAQList';
import { faqData } from '@/data/faq-data';

export const metadata: Metadata = {
  title: '어린이 해열제 자주 묻는 질문 (FAQ) | 타이레놀·부루펜 복용 가이드',
  description:
    '타이레놀 복용 간격, 부루펜 차이, 해열제 교차 복용 등 부모들이 가장 궁금해하는 어린이 해열제 질문에 식약처 기준 답변을 확인하세요.',
  keywords: [
    '타이레놀 복용 간격',
    '부루펜 차이',
    '해열제 교차 복용',
    '아기 열 몇 도',
    '해열제 FAQ',
  ],
  openGraph: {
    title: '어린이 해열제 자주 묻는 질문 (FAQ)',
    description:
      '타이레놀, 부루펜 등 어린이 해열제 복용법 완벽 가이드 (식약처 기준)',
    url: 'https://antipyretic-dose.vercel.app/faq',
  },
};

export default function FAQPage() {
  // FAQPage 구조화 데이터
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.shortAnswer, // 핵심 답변만 (순수 텍스트)
      },
    })),
  };

  // Breadcrumb 구조화 데이터
  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: '홈',
        item: 'https://antipyretic-dose.vercel.app',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: '자주 묻는 질문',
        item: 'https://antipyretic-dose.vercel.app/faq',
      },
    ],
  };

  return (
    <>
      {/* 구조화 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

      <main className="container mx-auto max-w-4xl p-4 pt-8 sm:pt-12">
        {/* 헤더 */}
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            어린이 해열제 자주 묻는 질문
          </h1>
          <p className="mt-3 text-base text-gray-600">
            타이레놀, 부루펜 등 어린이 해열제 복용법에 대한 정확한 정보를
            확인하세요
          </p>
          <p className="mt-4 text-xs text-gray-500 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            ⚠️ 본 FAQ는 일반적인 참고 자료입니다. 실제 투약 전 반드시 의사·약사와
            상담하세요.
          </p>
        </header>

        {/* FAQ 리스트 */}
        <FAQList faqs={faqData} />

        {/* CTA */}
        <section className="mt-12 bg-blue-50 p-6 rounded-lg text-center">
          <h2 className="text-xl font-bold mb-4">
            정확한 복용량이 궁금하신가요?
          </h2>
          <p className="text-gray-600 mb-4">
            체중과 나이만 입력하면 각 제품별 정확한 복용량(mL)을 즉시
            계산해드립니다.
          </p>
          <a
            href="/"
            className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            복용량 계산기 사용하기 →
          </a>
        </section>
      </main>
    </>
  );
}
```

### 4. FAQ 아코디언 컴포넌트

```typescript
// src/app/components/faq/FAQAccordion.tsx
'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQItem } from '@/data/faq-data';
import SourceBadge from '../shared/SourceBadge';

export default function FAQAccordion({ faq }: { faq: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      id={faq.id}
      className="border rounded-lg bg-white shadow-sm hover:shadow-md transition"
    >
      {/* 질문 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left"
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-semibold text-gray-900 pr-4">
          {faq.question}
        </h3>
        <ChevronDown
          className={`flex-shrink-0 w-5 h-5 text-gray-500 transform transition ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* 핵심 답변 (항상 표시) */}
      <div className="px-4 pb-2">
        <p className="text-base text-gray-800 font-medium bg-blue-50 p-3 rounded border-l-4 border-blue-500">
          {faq.shortAnswer}
        </p>
      </div>

      {/* 상세 설명 (접기/펼치기) */}
      {isOpen && (
        <div className="px-4 pb-4">
          {/* 상세 내용 */}
          <div
            className="prose prose-sm max-w-none mt-4"
            dangerouslySetInnerHTML={{ __html: faq.detailedAnswer }}
          />

          {/* 출처 */}
          <div className="mt-6 pt-4 border-t">
            <p className="text-xs text-gray-700 font-semibold mb-2">
              📚 참고 출처:
            </p>
            <ul className="space-y-2">
              {faq.sources.map((source, i) => (
                <li key={i} className="text-xs text-gray-600">
                  <SourceBadge type={source.type} />
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline ml-2"
                  >
                    {source.name}
                  </a>
                  {source.description && (
                    <span className="text-gray-500 ml-1">
                      ({source.description})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* 관련 FAQ */}
          {faq.relatedFAQs && faq.relatedFAQs.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-gray-700 font-semibold mb-2">
                🔗 관련 질문:
              </p>
              <div className="flex flex-wrap gap-2">
                {faq.relatedFAQs.map((relatedId) => (
                  <a
                    key={relatedId}
                    href={`#${relatedId}`}
                    className="text-xs text-blue-600 hover:underline bg-blue-50 px-3 py-1 rounded"
                  >
                    이동 →
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* 면책 조항 */}
          <div className="mt-4 pt-4 border-t bg-gray-50 p-3 rounded">
            <p className="text-xs text-gray-500">
              ⚠️ <strong>면책 조항</strong>: {faq.medicalDisclaimer}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              최종 업데이트: {faq.lastUpdated}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 5. 출처 배지 컴포넌트

```typescript
// src/app/components/shared/SourceBadge.tsx

import { SourceType } from '@/data/faq-data';

export default function SourceBadge({ type }: { type: SourceType }) {
  const badges = {
    official: {
      emoji: '🏛️',
      text: '공식',
      color: 'bg-green-100 text-green-800',
    },
    medical: {
      emoji: '⚕️',
      text: '의료',
      color: 'bg-blue-100 text-blue-800',
    },
    reference: {
      emoji: '📰',
      text: '참고',
      color: 'bg-gray-100 text-gray-800',
    },
  };

  const badge = badges[type];

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${badge.color}`}
    >
      <span className="mr-1">{badge.emoji}</span>
      {badge.text}
    </span>
  );
}
```

### 6. FAQ 검색 컴포넌트

```typescript
// src/app/components/faq/FAQSearch.tsx
'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

export default function FAQSearch({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="궁금한 내용을 검색하세요... (예: 타이레놀 간격)"
        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}
```

### 7. FAQ 리스트 컴포넌트

```typescript
// src/app/components/faq/FAQList.tsx
'use client';

import { useState, useMemo } from 'react';
import { FAQItem, FAQCategory } from '@/data/faq-data';
import FAQAccordion from './FAQAccordion';
import FAQSearch from './FAQSearch';
import FAQCategoryFilter from './FAQCategoryFilter';

export default function FAQList({ faqs }: { faqs: FAQItem[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    FAQCategory | 'all'
  >('all');

  // 검색 및 필터링
  const filteredFAQs = useMemo(() => {
    let result = faqs;

    // 카테고리 필터
    if (selectedCategory !== 'all') {
      result = result.filter((faq) => faq.category === selectedCategory);
    }

    // 검색어 필터
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) ||
          faq.shortAnswer.toLowerCase().includes(query) ||
          faq.keywords.some((keyword) => keyword.toLowerCase().includes(query))
      );
    }

    // 우선순위 정렬
    return result.sort((a, b) => a.priority - b.priority);
  }, [faqs, searchQuery, selectedCategory]);

  return (
    <div>
      {/* 검색 */}
      <div className="mb-6">
        <FAQSearch onSearch={setSearchQuery} />
      </div>

      {/* 카테고리 필터 */}
      <div className="mb-6">
        <FAQCategoryFilter
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />
      </div>

      {/* 결과 개수 */}
      <p className="text-sm text-gray-600 mb-4">
        {filteredFAQs.length}개의 질문
        {searchQuery && ` "${searchQuery}" 검색 결과`}
      </p>

      {/* FAQ 목록 */}
      <div className="space-y-4">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>검색 결과가 없습니다.</p>
            <p className="text-sm mt-2">다른 키워드로 검색해보세요.</p>
          </div>
        ) : (
          filteredFAQs.map((faq) => <FAQAccordion key={faq.id} faq={faq} />)
        )}
      </div>
    </div>
  );
}
```

---

## SEO 최적화 전략

### 1. FAQPage Schema (수정됨)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "아이 열이 몇 도일 때 해열제를 먹여야 하나요?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "체온이 38°C(38도) 이상일 때 해열제를 먹일 수 있습니다. 다만 38도는 먹일 수 있는 기준이지 반드시 먹여야 하는 기준은 아닙니다."
      }
    }
  ]
}
```

**중요 변경사항:**
- ❌ `citation` 제거 (비표준)
- ✅ `text`는 순수 텍스트만 (HTML 제거)
- ✅ 200자 이내로 제한

### 2. Featured Snippet 최적화

**타겟 형식:**
- **단락형**: 40-60자 핵심 답변
- **리스트형**: 3-5개 항목
- **표 형식**: 비교표 (타이레놀 vs 부루펜)

**예시:**
```
Q: 타이레놀 복용 간격은?
A: 최소 4시간 간격으로 복용하며, 하루 최대 5회까지 가능합니다.
```

### 3. 내부 링크 전략

#### 메인 페이지 → FAQ
```typescript
// src/app/page.tsx 하단 추가
<section className="mt-12 bg-blue-50 p-6 rounded-lg">
  <h2 className="text-xl font-bold text-center mb-4">
    자주 묻는 질문
  </h2>
  <div className="grid gap-2">
    <a href="/faq#tylenol-interval" className="text-blue-600 hover:underline">
      ❓ 타이레놀 복용 간격은?
    </a>
    <a href="/faq#tylenol-brufen-difference" className="text-blue-600 hover:underline">
      ❓ 타이레놀과 부루펜 차이는?
    </a>
    <a href="/faq#cross-dosing" className="text-blue-600 hover:underline">
      ❓ 해열제 교차 복용 방법은?
    </a>
  </div>
  <a
    href="/faq"
    className="block text-center mt-4 text-blue-600 font-semibold"
  >
    전체 FAQ 보기 →
  </a>
</section>
```

#### 계산 결과 → 관련 FAQ (자동 추천)
```typescript
// src/app/components/DosageResultDisplay.tsx 수정

// 타이레놀 결과 표시 시
if (result.product.ingredient === '아세트아미노펜') {
  recommendedFAQs = [
    { id: 'tylenol-interval', text: '타이레놀 복용 간격은?' },
    { id: 'tylenol-100-200-difference', text: '100mL vs 200mL 차이는?' },
  ];
}

// 부루펜 결과 표시 시
if (result.product.ingredient === '이부프로펜') {
  recommendedFAQs = [
    { id: 'brufen-interval', text: '부루펜 복용 간격은?' },
    { id: 'empty-stomach', text: '공복에 먹여도 되나요?' },
  ];
}
```

---

## 법적 안전장치

### 1. 페이지 상단 전체 면책 조항

```
⚠️ 중요 안내

본 FAQ는 식품의약품안전처 허가사항 및 의료기관 가이드라인을 참고한
일반적인 정보 제공 목적의 콘텐츠입니다.

본 정보는 의학적 조언이 아니며, 개인의 특수한 상황을 고려하지 않습니다.
실제 투약 전 반드시 의사 또는 약사와 상담하시기 바랍니다.

본 사이트는 본 정보의 사용으로 인해 발생하는 어떠한 결과에 대해서도
책임을 지지 않습니다.
```

### 2. 각 FAQ 답변 하단 개별 면책 조항

```typescript
medicalDisclaimer: '본 정보는 식품의약품안전처 허가사항을 참고한 일반적인 가이드라인입니다. 실제 투약 전 반드시 의사 또는 약사와 상담하세요.'
```

### 3. 출처 명확화

- ✅ **1차 출처 우선**: 식약처, 대한소아과학회 공식 문서
- ✅ **2차 출처 보조**: 병원, 의료기관 가이드라인
- ✅ **3차 출처 참고**: 언론 기사, 블로그 (보조 자료로만)
- ✅ **출처 접근 불가 시 명시**: "원본 문서 확인 불가, 2차 자료 참고"

### 4. 표현 주의사항

**❌ 피해야 할 표현:**
- "~해야 합니다" (단정)
- "~하세요" (지시)
- "전문가 조언" (의료인 아님)

**✅ 권장 표현:**
- "~할 수 있습니다" (참고)
- "일반적으로 ~합니다" (일반론)
- "~을 참고한 정보입니다" (출처 명시)

---

## 개발 로드맵

### Phase 1: MVP (Week 1) - 예상 3시간

#### Day 1-2: 데이터 준비 (1.5시간)
- [ ] `src/data/faq-data.ts` 파일 생성
- [ ] 8개 핵심 FAQ 콘텐츠 작성
  - [ ] Q1: 열 몇 도에 해열제?
  - [ ] Q2: 타이레놀 복용 간격
  - [ ] Q3: 부루펜 복용 간격
  - [ ] Q4: 타이레놀 vs 부루펜 차이
  - [ ] Q5: 해열제 교차 복용
  - [ ] Q6: 타이레놀 100mL vs 200mL
  - [ ] Q7: 공복 복용 가능 여부
  - [ ] Q8: 하루 최대 횟수
- [ ] 출처 URL 유효성 검증
- [ ] 면책 조항 작성

#### Day 3: 컴포넌트 개발 (1시간)
- [ ] `/faq/page.tsx` 생성
- [ ] `FAQAccordion.tsx` 컴포넌트
- [ ] `SourceBadge.tsx` 컴포넌트
- [ ] `FAQList.tsx` 컴포넌트

#### Day 4: SEO 및 마무리 (30분)
- [ ] FAQPage JSON-LD 추가
- [ ] Breadcrumb schema 추가
- [ ] 메인 페이지 → FAQ 링크 추가
- [ ] 빌드 테스트
- [ ] Google Rich Results Test 검증

### Phase 2: 검색 기능 추가 (Week 2) - 예상 1시간

- [ ] `FAQSearch.tsx` 컴포넌트
- [ ] `FAQCategoryFilter.tsx` 컴포넌트
- [ ] 검색 로직 구현 (클라이언트 사이드)
- [ ] 키워드 하이라이팅

### Phase 3: 내부 링크 강화 (Week 2) - 예상 1시간

- [ ] 계산 결과 → 관련 FAQ 자동 추천 로직
- [ ] FAQ → 계산기 CTA 강화
- [ ] 제품별 FAQ 연결

### Phase 4: 데이터 기반 확장 (Month 2~)

- [ ] Google Search Console 검색어 분석
- [ ] 사용자 질문 수집 (Contact Form 추가)
- [ ] 주 1-2개씩 FAQ 추가
- [ ] A/B 테스트 (답변 구조 최적화)

---

## 성과 측정 지표

### 즉시 효과 측정 (1-2주)

| 지표 | 측정 방법 | 목표 |
|------|----------|------|
| Featured Snippet 노출 | Google Search Console | 2-3개 |
| FAQ 페이지 조회수 | Vercel Analytics | 전체의 10% |
| 평균 체류 시간 | Google Analytics | 1-2분 증가 |
| 검색 유입 증가 | Google Search Console | 20-30% |

### 중기 효과 측정 (1-2개월)

| 지표 | 측정 방법 | 목표 |
|------|----------|------|
| FAQ → 계산기 전환율 | Event Tracking | 30% 이상 |
| 재방문율 | Google Analytics | 10-15% 증가 |
| 타겟 키워드 순위 | Google Search Console | Top 10 진입 |
| 백링크 수 | Ahrefs / SEMrush | 5-10개 자연 발생 |

### 장기 효과 측정 (3개월 이상)

| 지표 | 측정 방법 | 목표 |
|------|----------|------|
| 도메인 권위 | Moz DA / Ahrefs DR | +5 증가 |
| 브랜드 검색량 | Google Trends | 2배 증가 |
| 커뮤니티 공유 | Social Listening | 월 10회 이상 |

---

## 체크리스트

### 개발 전 준비
- [ ] 식약처 공식 자료 확인 및 다운로드
- [ ] 의학적 검토 의뢰 (가능한 경우)
- [ ] 법률 자문 (면책 조항 검토)

### 개발 중
- [ ] 모든 출처 URL 유효성 확인
- [ ] 면책 조항 각 FAQ마다 포함
- [ ] 단정적 표현 제거
- [ ] 모바일 반응형 테스트

### 배포 전
- [ ] Google Rich Results Test 통과
- [ ] 빌드 오류 없음
- [ ] 링크 깨짐 확인
- [ ] 접근성 테스트 (WCAG 2.1 AA)

### 배포 후
- [ ] Google Search Console에 sitemap 재제출
- [ ] 네이버 서치어드바이저 수집 요청
- [ ] 메인 페이지에 FAQ 링크 추가 확인
- [ ] 1주일 후 성과 리뷰

---

## 참고 자료

### 공식 가이드라인
- [식품의약품안전처 의약품통합정보시스템](https://nedrug.mfds.go.kr)
- [대한소아과학회](http://www.pediatrics.or.kr/)
- [Google Search Central - FAQPage](https://developers.google.com/search/docs/appearance/structured-data/faqpage)

### 내부 문서
- [CLAUDE.md](../CLAUDE.md) - 프로젝트 아키텍처
- [해열제정보.md](./해열제정보.md) - 제품 상세 정보
- [dosage-calculator.ts](../src/lib/dosage-calculator.ts) - 계산 로직

### 도구
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [Screaming Frog SEO Spider](https://www.screamingfrog.co.uk/seo-spider/)

---

## 버전 히스토리

- **v2.0** (2025-11-10): 비판적 검토 반영, 10가지 개선사항 적용
- **v1.0** (2025-11-10): 초기 계획 작성

---

## 문의 및 피드백

계획서 관련 질문이나 제안 사항이 있으시면 GitHub Issue로 등록해주세요.

**작성자**: Claude (AI Assistant)
**검토자**: 개발팀
**승인자**: -

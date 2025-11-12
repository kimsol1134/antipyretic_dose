# Coupang 배너 구현 가이드

## 📋 Executive Summary

**목표:** Coupang 파트너스 배너를 통한 수익화
**우선순위:** 빠른 구현 (1시간 20분 이내)
**원칙:** 의료 안전성 우선, 불필요한 복잡성 제거

---

## 🎯 구현 범위 (확정)

### DO (구현하기)
- [ ] CoupangBanner.tsx 생성 (계획안 그대로)
- [ ] page.tsx에 배너 배치 (결과 위 1개 위치만)
- [ ] globals.css에 iframe 포지셔닝 CSS 추가
- [ ] Window 타입 선언 (인라인)
- [ ] 로컬 테스트 + 빌드 검증

### DON'T (구현하지 않기)

| 항목 | 이유 | 대신 |
|-----|------|------|
| **SRI + CSP 헤더** | 오버 엔지니어링 | Coupang은 신뢰도 높음 |
| **Hydration 미스매치 최적화** | 실제 영향 미미 | 향후 필요 시 추가 |
| **메모리 누수 방지 고도화** | YAGNI (배너 1-2개만) | 배너 5개 추가 시 리팩토링 |
| **Lazy Loading + Intersection Observer** | 복잡도 대비 효과 낮음 | 성능 이슈 발생 후 개선 |
| **배너 위치 2 (결과 중간 삽입)** | 의료 정보 명확성 위배 | 결과 아래 1개만 유지 |

---

## 📐 상세 구현 사항

### 1. CoupangBanner.tsx 생성

**경로:** `src/app/components/ads/CoupangBanner.tsx`

**요구사항:**
- Client Component (`'use client'` 선언)
- 모바일/데스크톱 반응형 (768px 기준)
  - 모바일: 320px × 100px
  - 데스크톱: 728px × 90px
- 배너 로드 실패 시 조용히 실패 (silent failure)
- Coupang ID: 936910, TrackingCode: AF3034941
- 고정 높이로 CLS 방지
- 5초 타임아웃 설정

**구현 코드:**

```typescript
'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    PartnersCoupang?: {
      G: new (config: {
        id: number;
        trackingCode: string;
        template: string;
        width: string;
        height: string;
      }) => void;
    };
  }
}

export default function CoupangBanner() {
  const [isMobile, setIsMobile] = useState(false);
  const [bannerError, setBannerError] = useState(false);

  useEffect(() => {
    // 클라이언트 환경에서만 크기 결정
    setIsMobile(window.innerWidth < 768);

    // 스크립트 로드 확인
    if (window.PartnersCoupang) {
      initBanner();
      return;
    }

    // 스크립트 동적 로드
    const script = document.createElement('script');
    script.src = 'https://ads-partners.coupang.com/g.js';
    script.async = true;
    script.onload = () => initBanner();
    script.onerror = () => setBannerError(true);
    document.head.appendChild(script);

    // 5초 타임아웃: 로드 안되면 에러 처리
    const timeout = setTimeout(() => {
      if (!window.PartnersCoupang) {
        setBannerError(true);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  const initBanner = () => {
    if (!window.PartnersCoupang) return;

    try {
      new window.PartnersCoupang.G({
        id: 936910,
        trackingCode: 'AF3034941',
        template: 'carousel',
        width: isMobile ? '320' : '728',
        height: isMobile ? '100' : '90',
      });
    } catch (error) {
      console.warn('[CoupangBanner] Initialization failed:', error);
      setBannerError(true);
    }
  };

  // 배너 로드 실패 → 아무것도 표시 안함 (계산기 기능 영향 없음)
  if (bannerError) return null;

  return (
    <div className="w-full flex justify-center my-6">
      <div
        className="relative bg-gray-100 rounded-lg animate-pulse"
        style={{
          width: isMobile ? '320px' : '728px',
          height: isMobile ? '100px' : '90px',
        }}
        aria-label="쿠팡 광고 배너 로딩 중"
      />
    </div>
  );
}
```

**설계 결정:**
- ✅ Window 타입 선언: 별도 파일 없이 인라인 추가 (파일 최소화)
- ✅ Skeleton loading: 로딩 중 gray-100 배경 + animate-pulse
- ✅ Try-catch: initBanner 실패 시 안전하게 처리
- ✅ 스크립트 오류 핸들러: script.onerror 추가

---

### 2. page.tsx 수정

**파일:** `src/app/page.tsx`

**변경사항:**
```typescript
// 상단에 import 추가
import CoupangBanner from './components/ads/CoupangBanner';

// 기존 return 부분 수정
export default async function HomePage() {
  const products = await getValidatedProducts();
  const similarProducts = await getSimilarProducts();

  return (
    <main className="container mx-auto max-w-lg p-4 pt-8 sm:pt-12">
      <header className="text-center mb-8">
        {/* 기존 코드 유지 */}
      </header>

      <section className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100">
        <DosageForm products={products} />
      </section>

      {/* ✅ 배너: 계산 폼과 결과 사이에 배치 */}
      <CoupangBanner />

      {/* 기존 결과 표시 */}
      <DosageResultDisplay similarProductsMap={similarProducts} />

      {/* 배너 아래 면책 문구 추가 (선택사항) */}
      <p className="text-xs text-gray-500 text-center mt-2 mb-8">
        이 사이트는 쿠팡 파트너스 활동의 일환으로, 일정액의 수수료를 제공받습니다.
      </p>

      <footer className="mt-12 text-center text-xs text-gray-500 space-y-2">
        {/* 기존 코드 유지 */}
      </footer>
    </main>
  );
}
```

**주의사항:**
- ✅ DosageResultDisplay 내부에 배너 배치하지 않기 (결과 중간 삽입 제거)
- ✅ 배너는 "계산 폼" 다음, "결과" 전에만 배치

---

### 3. DosageResultDisplay.tsx 확인

**파일:** `src/app/components/DosageResultDisplay.tsx`

**변경사항:** 없음 (계획안의 배너 위치 2 제거)

현재 코드에서 다음 부분이 있다면 제거:
```jsx
// ❌ 제거할 코드 (있으면 삭제)
{(index + 1) % 2 === 0 && index < results.length - 1 && (
  <CoupangBannerWrapper position="between-results" />
)}
```

---

### 4. globals.css 추가

**파일:** `src/app/globals.css`

**추가 코드:**
```css
/* Coupang 배너 iframe 포지셔닝 */
iframe[id^="coupang"] {
  position: relative !important;
  left: auto !important;
  right: auto !important;
  margin: 0 auto !important;
  display: block !important;
}
```

**설명:** Coupang 스크립트가 자동 생성하는 iframe의 위치를 중앙 정렬로 조정

---

## 🧪 테스트 체크리스트

### 로컬 개발 테스트

```bash
# 개발 서버 실행
npm run dev

# 확인사항:
# ✅ http://localhost:3000 접속
# ✅ 배너 위치: 입력 폼 아래에 gray-100 skeleton 표시
# ✅ 3-5초 후 실제 Coupang 배너 로드
# ✅ 모바일 크기 (375px 이하): 320px × 100px
# ✅ 데스크톱 크기 (768px 이상): 728px × 90px
# ✅ 계산 폼: 정상 작동
# ✅ 결과 표시: 정상 작동 (배너와 무관)
# ✅ 브라우저 콘솔: 에러 없음
```

### 빌드 테스트

```bash
# 프로덕션 빌드
npm run build

# 확인사항:
# ✅ 빌드 성공 (에러 없음)
# ✅ products.json 검증 통과

# 프로덕션 서버 실행
npm start

# 확인사항:
# ✅ 배너 정상 표시
# ✅ 계산기 기능 정상
```

### 선택사항: Lighthouse 측정

```bash
# Chrome DevTools > Lighthouse 실행
# 목표:
# - CLS (Cumulative Layout Shift) < 0.1 유지
# - LCP (Largest Contentful Paint) < 2.5s
# - INP (Interaction to Next Paint) < 200ms

# 측정 후 문제 발견 시:
# - CLS > 0.1: 배너 높이 재조정
# - LCP > 2.5s: Lazy loading 검토 (향후)
```

---

## ⚠️ 예상 이슈 및 대응

### 배너가 표시되지 않음

**원인:** Coupang 서버 응답 실패 또는 스크립트 로드 실패

**확인:**
1. 브라우저 DevTools Network 탭에서 `ads-partners.coupang.com/g.js` 로드 확인
2. Console 탭에서 에러 메시지 확인
3. 방화벽/프록시 설정 확인

**대응:** Silent failure이므로 에러 없이 배너만 보이지 않음 (정상 동작)

---

### 배너 크기가 잘못되어 보임

**원인:** CSS 충돌 또는 iframe 스타일 미적용

**대응:**
```css
/* globals.css 재확인 */
iframe[id^="coupang"] {
  position: relative !important;
  margin: 0 auto !important;
  display: block !important;
}

/* 또는 배너 컨테이너에 max-width 추가 */
<div className="w-full flex justify-center my-6">
  <div style={{ maxWidth: '728px' }}>
    {/* iframe 자동 생성됨 */}
  </div>
</div>
```

---

### 계산 결과에 배너가 끼어들어 보임

**확인:** page.tsx 배치 순서 재확인
```jsx
// ✅ 올바른 순서
<DosageForm />
<CoupangBanner />  ← 배너는 여기만
<DosageResultDisplay />
```

---

## 📊 구현 시간 추정

| 단계 | 작업 | 소요시간 | 누적 |
|-----|------|---------|------|
| 1 | CoupangBanner.tsx 생성 | 30분 | 30분 |
| 2 | page.tsx 수정 (import + 배치) | 5분 | 35분 |
| 3 | globals.css 추가 | 2분 | 37분 |
| 4 | 로컬 테스트 (npm run dev) | 10분 | 47분 |
| 5 | 빌드 테스트 (npm run build) | 5분 | 52분 |
| 6 | Lighthouse 측정 (선택) | 10분 | 62분 |

**총 소요시간: 약 1시간 (선택사항 제외)**

---

## 🎯 구현 후 checklist

- [ ] CoupangBanner.tsx 생성 및 타입 안전성 확인
- [ ] page.tsx import 및 배치 완료
- [ ] 배너 위치 2 (결과 중간) 제거 확인
- [ ] globals.css iframe CSS 추가
- [ ] npm run dev 테스트 성공
- [ ] npm run build 성공
- [ ] 배너 로드 확인 (3-5초 내)
- [ ] 계산 기능 정상 작동 확인
- [ ] 모바일 크기 확인 (DevTools 반응형 모드)
- [ ] 브라우저 콘솔 에러 없음 확인

---

## 📝 주의사항

### 의료 안전성
- ✅ 배너 실패가 계산 로직에 영향을 주지 않음 (silent failure)
- ✅ Zustand 상태와 완전히 독립적
- ✅ 사용자가 의약품 복용량을 정확히 계산할 수 있음

### 성능
- ✅ 고정 높이(320×100, 728×90)로 CLS 방지
- ✅ 스켈레톤 로딩으로 사용자 경험 개선
- ✅ Async 스크립트 로드로 메인 스레드 블로킹 방지

### 법적 준수
- ✅ 면책 문구 추가 (선택사항이나 권장)
- ✅ 배너 명확하게 광고로 표시

---

## 🚫 하지 말아야 할 것

```
❌ SRI (Subresource Integrity) 해시값 추가
   → Coupang CDN 침해 가능성 거의 없음

❌ CSP (Content Security Policy) 헤더 설정
   → 지금은 필요 없음, 보안 이슈 발생 후 추가

❌ 배너 여러 개 인스턴스 메모리 누수 방지
   → YAGNI: 배너 5개 이상 추가 시 리팩토링

❌ Lazy Loading + Intersection Observer
   → 구현 복잡도 높음, 실제 성능 개선 미미

❌ 배너 위치 2: 결과 카드 중간 삽입
   → 의료 정보 명확성 위배, 제거 필수
```

---

## ✅ 완료 기준

- 배너가 계산 폼과 결과 사이에 표시됨
- 3-5초 내 Coupang 배너 로드됨
- 배너 실패해도 계산기 기능 정상
- npm run build 성공
- 브라우저 콘솔 에러 없음

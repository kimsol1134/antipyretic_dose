
  <당신의 역할>
  당신은 **의료 기기 소프트웨어 안전성 전문가**이자 **프론트엔드 성능 최적화 전문가**입니다.

  - IEC 62304 의료 기기 소프트웨어 안전 표준에 정통함
  - Next.js 15 App Router 아키텍처 및 React 18 Server Components 전문가
  - Core Web Vitals (CLS, LCP, INP) 최적화 경험 10년 이상
  - Third-party 스크립트 통합의 보안 및 성능 위험성 평가 능력 보유

  <당신의 임무>
  다음 "쿠팡 배너 구현 계획"을 **다각도로 엄격하게 평가**하여, 잠재적 문제점과 개선 방안을 도출하세요.

  <평가 기준>
  1. **의료 안전성 (최우선)**
     - 배너 실패/오류가 계산 로직에 영향을 주는가?
     - 사용자의 약물 복용량 계산이 방해받을 가능성은?
     - Zustand 상태 오염 가능성은?

  2. **성능 영향**
     - CLS 증가 가능성 (목표: < 0.1)
     - LCP 지연 가능성 (목표: < 2.5s)
     - INP 악화 가능성 (목표: < 200ms)
     - 번들 크기 증가 (Third-party 스크립트)

  3. **보안 취약점**
     - `dangerouslySetInnerHTML` 사용의 XSS 위험
     - iframe sandbox 속성 미적용
     - CSP (Content Security Policy) 위반 가능성

  4. **아키텍처 건전성**
     - Server/Client Component 경계 설계의 적절성
     - 기존 코드베이스와의 일관성
     - 코드 재사용성 및 유지보수성

  5. **사용자 경험**
     - 광고가 의료 정보 가독성에 미치는 영향
     - 모바일 작은 화면에서의 침습성
     - 접근성 (a11y) 고려 여부

  6. **법적/윤리적 준수**
     - 면책 문구의 명확성 및 위치
     - 의료 기기로서의 광고 표시 적절성
     - 아동 대상 서비스에서의 광고 윤리

  <출력 형식>
  ## 🔴 Critical Issues (즉시 수정 필요)
  [문제점 나열, 각각에 대한 구체적 해결 방안 제시]

  ## 🟡 Warnings (개선 권장)
  [잠재적 위험 요소, 대안 제시]

  ## 🟢 Strengths (잘된 점)
  [설계의 강점, 유지해야 할 부분]

  ## 💡 Alternative Approaches
  [완전히 다른 접근 방식 제안 - 예: 서버 사이드 광고 삽입, Edge Middleware 활용 등]

  ## ✅ Final Recommendation
  [구현 진행 여부에 대한 최종 의견: 승인 / 조건부 승인 / 재설계 필요]

  ---
  📐 자세한 구현 계획

  1. 아키텍처 설계

  1-1. 컴포넌트 구조

  src/app/components/
    └── ads/
        ├── CoupangBanner.tsx          (핵심 배너 컴포넌트)
        ├── CoupangBannerWrapper.tsx   (포지셔닝 래퍼)
        └── useCoupangBanner.ts        (선택사항: 훅으로 로직 분리)

  선택 이유:
  - ads/ 폴더로 광고 관련 코드 격리 → 향후 다른 광고 플랫폼 추가 용이
  - 기존 프로젝트 구조(src/app/components/)와 일관성 유지

  1-2. Server vs Client Component 전략

  | 컴포넌트                | 타입     | 이유                          |
  |---------------------|--------|-----------------------------|
  | page.tsx            | Server | 기존 구조 유지, 배너는 children으로 포함 |
  | CoupangBanner       | Client | 동적 스크립트 삽입, useEffect 필요    |
  | DosageForm          | Client | 기존 구조 유지                    |
  | DosageResultDisplay | Client | 기존 구조 유지, 배너 삽입 위치 포함       |

  설계 결정:
  - Server Component에서 Product 데이터 로딩하는 기존 패턴 유지
  - 배너는 완전히 독립적인 Client Component로 구현
  - 계산 로직과 상태(Zustand)에 전혀 접근하지 않음 → 안전성 보장

  2. 핵심 기술 결정사항

  2-1. Next.js Script vs dangerouslySetInnerHTML

  결정: dangerouslySetInnerHTML 사용

  이유:
  1. 쿠팡 스크립트는 특정 DOM 위치에 iframe을 삽입 (script의 previous sibling)
  2. Next.js <Script> 컴포넌트는 head/body로 이동시켜 위치 제어 불가
  3. banner_guideline.md의 실증된 해결책과 일치

  트레이드오프:
  - ❌ Next.js Script 최적화 (priority, strategy) 미사용
  - ✅ 정확한 위치 제어 및 iframe 생성 보장

  2-2. 반응형 크기 구현 방식

  결정: Tailwind의 md: breakpoint + 조건부 스크립트 생성

  'use client';

  export default function CoupangBanner() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      setIsMobile(window.innerWidth < 768);
      // resize listener 추가
    }, []);

    return (
      <div className="w-full flex justify-center">
        <div
          className="relative"
          style={{
            width: isMobile ? '320px' : '728px',
            height: isMobile ? '100px' : '90px',
          }}
          dangerouslySetInnerHTML={{
            __html: `
              <script src="https://ads-partners.coupang.com/g.js"></script>
              <script>
                new PartnersCoupang.G({
                  "id": 936910,
                  "trackingCode": "AF3034941",
                  "template": "carousel",
                  "width": "${isMobile ? '320' : '728'}",
                  "height": "${isMobile ? '100' : '90'}"
                });
              </script>
            `
          }}
        />
      </div>
    );
  }

  이유:
  - CLS 방지: 고정 높이를 사전 할당 (프로젝트의 CLS 최적화 원칙 준수)
  - 쿠팡 공식 가이드의 권장 사이즈 준수
  - 모바일 우선 설계 (주 사용자가 모바일일 가능성 높음)

  2-3. CSS 포지셔닝 문제 해결

  결정: 3중 방어 전략

  // 1. 래퍼 div에 명시적 포지셔닝
  <div className="relative w-full flex justify-center my-6">

    // 2. 배너 컨테이너에 고정 크기
    <div style={{ width: '728px', height: '90px', position: 'relative' }}>

      // 3. Global CSS로 iframe 강제 조정 (fallback)
    </div>
  </div>

  Global CSS 추가 (src/app/globals.css):
  /* 쿠팡 배너 iframe 포지셔닝 강제 조정 */
  iframe[id^="coupang"] {
    position: relative !important;
    left: auto !important;
    right: auto !important;
    margin: 0 auto !important;
    display: block !important;
  }

  이유:
  - banner_guideline.md에서 검증된 해결책 조합
  - 브라우저/환경 차이에 대한 방어적 프로그래밍
  - 프로젝트의 의료 안전 철학과 일치 (Defensive Programming)

  3. 배너 배치 위치 구현

  3-1. 위치 1: 계산 폼 하단

  파일: src/app/page.tsx

  // 기존 구조 유지
  export default function Home() {
    const products = await loadProducts(); // 기존 Server Component 로직

    return (
      <main>
        <DosageForm products={products} />

        {/* 새로 추가: 배너 위치 1 */}
        <CoupangBannerWrapper position="below-form" />

        <DataSourceAttribution />
        <DosageResultDisplay />
      </main>
    );
  }

  설계 결정:
  - Server Component 구조 유지
  - 면책 문구(DataSourceAttribution) 위에 배치하여 의료 정보와 광고 명확히 분리

  3-2. 위치 2: 결과 카드 2개마다

  파일: src/app/components/DosageResultDisplay.tsx

  'use client';

  export default function DosageResultDisplay() {
    const results = useDosageResults();

    return (
      <div className="min-h-[300px]"> {/* 기존 CLS 방지 */}
        {results.map((result, index) => (
          <React.Fragment key={result.productId}>
            <DosageResultCard result={result} />

            {/* 2개마다 배너 삽입 (0-indexed이므로 홀수 인덱스 후) */}
            {(index + 1) % 2 === 0 && index < results.length - 1 && (
              <CoupangBannerWrapper position="between-results" />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  설계 결정:
  - 마지막 결과 후에는 배너 미삽입 (index < results.length - 1)
  - Fragment 사용으로 DOM 구조 오염 방지
  - 기존 min-h 유지로 CLS 이중 방지

  4. 성능 최적화

  4-1. 스크립트 Async 로딩

  useEffect(() => {
    // 쿠팡 스크립트가 이미 로드되었는지 확인
    if (window.PartnersCoupang) {
      initBanner();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://ads-partners.coupang.com/g.js';
    script.async = true;
    script.onload = () => initBanner();
    document.head.appendChild(script);

    return () => {
      // cleanup: 스크립트 제거는 하지 않음 (다른 배너 인스턴스 영향)
    };
  }, []);

  이유:
  - 메인 스레드 블로킹 방지
  - INP (Interaction to Next Paint) 성능 유지
  - 프로젝트의 Core Web Vitals 최적화 철학 준수

  4-2. CLS (Cumulative Layout Shift) 방지

  <div
    className="skeleton-loading" // 로딩 중 플레이스홀더
    style={{
      width: isMobile ? '320px' : '728px',
      height: isMobile ? '100px' : '90px',
      backgroundColor: '#f3f4f6', // Tailwind gray-100
    }}
  >
    {/* 배너 로딩 중... */}
  </div>

  이유:
  - DosageResultDisplay의 min-h-[300px] 패턴과 일관성
  - 쿠팡 서버 응답 지연 시에도 레이아웃 안정성 유지

  5. 안전성 및 에러 처리

  5-1. 배너 로딩 실패 시 Fallback

  const [bannerError, setBannerError] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!document.querySelector('iframe[id^="coupang"]')) {
        setBannerError(true);
      }
    }, 5000); // 5초 타임아웃

    return () => clearTimeout(timeout);
  }, []);

  if (bannerError) {
    return null; // 조용히 실패 (계산기 기능에 영향 없음)
  }

  설계 철학:
  - 의료 안전성 최우선: 광고 실패가 계산기를 망가뜨리면 안됨
  - Silent failure 전략 (사용자에게 에러 표시 안함)
  - CLAUDE.md의 "배너 로딩 실패 시에도 계산기 기능은 정상 작동해야 함" 요구사항 충족

  5-2. TypeScript 타입 안전성

  // global.d.ts 추가
  interface Window {
    PartnersCoupang?: {
      G: new (config: {
        id: number;
        trackingCode: string;
        template: string;
        width: string;
        height: string;
        subId?: string | null;
      }) => void;
    };
  }

  6. 법적 준수 - 면책 문구

  <CoupangBannerWrapper>
    <CoupangBanner />
    <p className="text-xs text-gray-500 text-center mt-2">
      이 사이트는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
    </p>
  </CoupangBannerWrapper>

  스타일링 결정:
  - text-xs: 법적 문구는 작게 (사용자 경험 방해 최소화)
  - text-gray-500: 눈에 띄되 침습적이지 않게
  - text-center: 배너와 시각적 정렬

  ---
  🧪 테스트 계획

  필수 테스트 시나리오

  1. 다양한 화면 크기
    - 모바일 (375px, 390px, 414px)
    - 태블릿 (768px)
    - 데스크톱 (1024px, 1440px)
  2. 네트워크 조건
    - 쿠팡 서버 정상: 배너 정상 표시
    - 쿠팡 서버 지연: 스켈레톤 로딩 표시
    - 쿠팡 서버 실패: 조용히 실패, 계산기는 정상 작동
  3. 브라우저 호환성
    - Chrome, Safari, Firefox (iOS/Android)
    - Edge, Samsung Internet
  4. 계산 기능 무결성
    - 배너 유무와 관계없이 dosage 계산 정확성 동일
    - Zustand 상태 오염 없음

  성능 검증

  # Lighthouse 점수 비교 (배너 추가 전후)
  npm run build
  npm start
  # Chrome DevTools > Lighthouse 실행

  # 목표:
  # - CLS: < 0.1 유지
  # - LCP: < 2.5s 유지  
  # - INP: < 200ms 유지

  ---
  📁 구현 파일 목록

  신규 생성

  1. src/app/components/ads/CoupangBanner.tsx (핵심 컴포넌트)
  2. src/app/components/ads/CoupangBannerWrapper.tsx (래퍼)
  3. src/types/global.d.ts (Window 타입 확장)

  수정 필요

  1. src/app/page.tsx (배너 위치 1 추가)
  2. src/app/components/DosageResultDisplay.tsx (배너 위치 2 추가)
  3. src/app/globals.css (iframe 포지셔닝 CSS)

  테스트

  1. src/app/components/ads/CoupangBanner.test.tsx (선택사항)

  ---
 

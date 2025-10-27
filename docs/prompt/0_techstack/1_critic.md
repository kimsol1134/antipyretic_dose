<AI 역할>
당신은 10년차 시니어 프론트엔드 아키텍트이며, 특히 의료/헬스케어 도메인의 PWA(Progressive Web App) 및 경량 웹사이트 구축에 특화된 전문가입니다. 당신의 최우선 가치는 '성능', '접근성', 그리고 의료 도구의 '안전성(Safety)'입니다.

<AI 임무>
제안된 기술 스택을 "의료 PWA 전문가"의 관점에서 냉철하게 검토하고, v4.0 기획안의 목표('속도', '단순성', '신뢰성')에 비추어 다음 항목들을 평가해주세요.
모든 주장은 구체적인 근거와 대안 코드를 바탕으로 제시해야 합니다.

1.  **스택 적절성 평가:** 제안된 스택(Zustand, RHF, Zod, Shadcn)이 v4.0의 '초고속, 최소 입력' 목표에 부합하는지 평가하세요. 특히 '속도' 측면에서 더 나은 대안이 있습니까?
2.  **대안 제시:** 더 가볍거나, 더 나은 대안이 있다면 제시하고 그 이유를 설명해주세요. (예: Zustand 대신 Jotai/Valtio? RHF 대신 순수 React state? Shadcn 대신 순수 Tailwind?)
3.  **의료 안전성 검토:** 의료 도구의 특성상 '안전성'과 '정확성'이 생명입니다. 이 스택(특히 RHF+Zod)이 계산 로직의 오류를 방지하고, 향후 단위 테스트(Unit Test) 용이성을 높이는 데 적합한 구조인지 검토해주세요.
4.  **확장성 평가:** 기획서 로드맵의 'PWA'와 'i18n'을 고려할 때, 이 초기 스택이 향후 확장에 용이한 구조인지, 아니면 오히려 발목을 잡을 요소가 있는지 평가해주세요. (예: `next-intl`을 지금 도입하는 것이 옳은 결정인가?)
5.  **최대 위험 지적:** 이 스택 조합으로 프로젝트를 진행할 때, 당신이 예상하는 가장 치명적인 기술적 부채(Technical Debt)나 위험 요소 1가지를 지적해주세요.

---

기본 스택(Next.js 15, TypeScript, Tailwind)을 전제로, 이 목표를 달성하기 위한 최소한의 필수 라이브러리 스택은 다음과 같습니다.

1.  **상태 관리: `Zustand`**
      * '나이', '체중' 입력값과 '계산 결과'라는 최소한의 전역 상태를 가장 가볍고 빠르게 공유합니다.
2.  **폼/유효성 검사: `React Hook Form` + `Zod`**
      * 비제어 방식(uncontrolled)으로 폼 성능을 극대화하고, `Zod` 스키마를 통해 의료 계산에 치명적인 입력값(음수, 비상식적 수치)을 완벽하게 검증합니다.
3.  **UI 컴포넌트: `Shadcn/ui` + `Lucide React`**
      * 기존 Tailwind와 완벽히 호환되며, `Input`, `Button`, `Card` 등 필수 컴포넌트를 즉시 구축하여 'No UI' 원칙에 맞는 최소한의 UI 개발 속도를 보장합니다.
4.  **미래 대비: `next-intl`**
      * v4.0 로드맵 1순위인 '현지화(Localization)'를 위해 App Router 표준인 `next-intl`을 초기부터 도입, 추후 확장 비용을 최소화합니다.

이 스택은 v4.0의 '극도의 단순성'과 '속도'라는 철학을 완벽하게 만족시키는 **'경량(Lightweight)·견고(Robust)·신속(Rapid)'** 조합입니다.

-----

### **제안 스택의 장점 및 예상 한계점**

#### **장점 (Advantages)**

  * **극도의 경량성 및 성능:** `Zustand`와 `React Hook Form`은 React 생태계에서 가장 가벼운 솔루션 중 하나입니다. Next.js의 SSG와 결합 시, 문서 목표인 '초고속 로딩' 및 '즉각적 계산'에 완벽하게 부합합니다.
  * **타입 안정성 및 계산 무결성:** `TypeScript` 기반 위에 `Zod`를 사용하여 입력 데이터의 스키마를 명확히 정의합니다. 이는 '6개월 미만 차단' 등 복잡한 의료 안전 규칙(Safety Rules)이 계산 엔진으로 전달되기 전에 모든 비정상적 입력을 차단하여, 계산 로직의 순수성과 안정성을 보장합니다.
  * **최고의 개발 속도:** `Shadcn/ui`는 라이브러리가 아닌 코드 스니펫 모음입니다. `Input`, `Button`, 결과 `Card` 등 필요한 UI를 즉시 가져와 Tailwind로 수정할 수 있어, 문서의 'v4.0 MVP' 흐름(입력 2개, 결과 4개)을 가장 빠르게 구현할 수 있습니다.
  * **유지보수성 및 분리:** `Zustand`는 UI와 상태 로직을 분리하고, `React Hook Form`은 폼 상태를 컴포넌트에서 분리합니다. 핵심 계산 로직은 순수 TS 모듈(`lib/dosage-calculator.ts`)로 분리되어, 기획서의 '전문가 검토' 및 단위 테스트(Unit Test)를 용이하게 합니다.

#### **예상 한계점 (Limitations)**

  * **상태 관리의 단순성:** `Zustand`는 v4.0의 단순한 상태(입력/결과)에는 최적이지만, 만약 로드맵의 '교차 복용 타이머'가 매우 복잡한 로직(여러 약물의 타이머 동시 관리, 알림 스케줄링)으로 발전한다면 `Zustand`만으로는 상태 관리가 복잡해질 수 있습니다. (단, v4.0 기준으로는 완벽한 선택입니다.)
  * **데이터의 정적 내장:** 기획서 v4.0(3부)의 요구사항(JSON 임베드) 자체가 가진 한계입니다. 약물 정보(농도, 최대 용량)가 변경될 경우, 반드시 **애플리케이션을 다시 빌드하고 배포**해야 합니다. 이는 '신속성'을 위한 트레이드오프이며, '버전 배지'로 신뢰성을 보완해야 합니다.

-----

### **라이브러리 선정 상세 및 근거**

#### 1\. 상태 관리: `Zustand`

문서의 v4.0 MVP 사용자 흐름은 **[입력 폼]** 컴포넌트와 **[결과 카드 목록]** 컴포넌트가 '나이', '체중', '계산 결과(4종)' 데이터를 공유해야 함을 명시합니다.

  * **선정 이유:**

      * **단순함:** Redux, Recoil 등은 이 프로젝트의 규모에 비해 과도한 보일러플레이트입니다. React Context API는 간단한 값 공유에는 좋지만, 상태 변경 시 불필요한 리렌더링을 유발할 수 있습니다.
      * **최소 설치:** `Zustand`는 별도 Provider 래핑(wrapping) 없이, 훅(hook) 기반으로 즉시 상태를 생성하고 구독할 수 있습니다. 이는 '최소 입력 도구'라는 기획 의도와 일치합니다.
      * **성능:** `Zustand`는 상태 변경 시 해당 상태를 구독하는 컴포넌트만 정확히 리렌더링하여 성능 저하를 방지합니다.

  * **구현 예시 (Store):**

    ```typescript
    // store/dosage-store.ts
    import { create } from 'zustand';

    interface DosageInput {
      ageInMonths: number | null;
      weightInKg: number | null;
    }

    interface DosageResult {
      productName: string;
      doseInMl: number | null;
      warning?: string; // "6개월 미만 상담" 등
      error?: string; // "계산 불가"
    }

    interface DosageState {
      input: DosageInput;
      results: DosageResult[];
      setInput: (input: DosageInput) => void;
      calculate: () => void; // 이 함수가 핵심 로직을 호출
    }

    export const useDosageStore = create<DosageState>((set, get) => ({
      input: { ageInMonths: null, weightInKg: null },
      results: [],
      setInput: (input) => set({ input }),
      calculate: () => {
        const { input } = get();
        // /lib/dosage-calculator.ts 의 핵심 로직 호출
        // const newResults = calculateAllDosages(input);
        // set({ results: newResults });
      },
    }));
    ```

#### 2\. 폼 처리 및 유효성 검사: `React Hook Form` + `Zod`

문서 6부(체크리스트 \#2, \#3, \#9)는 '연령 하드 블록', '최대용량 가드', '비상식적 입력 거부' 등 강력한 입력값 검증을 요구합니다.

  * **선정 이유:**

      * **성능:** `React Hook Form`은 비제어 컴포넌트를 사용하여 사용자가 '체중'을 입력할 때마다 발생하는 불필요한 리렌더링을 방지합니다. 기획서의 '실시간 자동 계산' UX를 구현하더라도 성능 저하가 없습니다.
      * **Type-Safe:** `Zod`는 TypeScript와 완벽하게 통합되어 런타임 유효성 검사 스키마를 정의합니다. (예: `weight: z.number().positive().max(100)`)
      * **통합:** `React Hook Form`은 `zodResolver`를 공식 지원하여, `Zod` 스키마를 폼 유효성 검사기로 즉시 사용할 수 있습니다.

  * **구현 예시 (Schema):**

    ```typescript
    // lib/schemas.ts
    import { z } from 'zod';

    // 나이 (개월/세) 입력을 개월 수로 통일하는 전처리 포함
    export const DosageInputSchema = z.object({
      ageValue: z.number().positive("나이를 입력하세요"),
      ageUnit: z.enum(['months', 'years']),
      weight: z.number().positive("체중은 0보다 커야 합니다.").max(150, "체중을 다시 확인하세요."),
      unitToggle: z.enum(['kg', 'lbs']).default('kg')
    }).transform((data) => ({
        // 계산 엔진이 사용할 단일 값(개월)으로 변환
        ageInMonths: data.ageUnit === 'years' ? data.ageValue * 12 : data.ageValue,
        weightInKg: data.unitToggle === 'lbs' ? data.weight * 0.453592 : data.weight,
    }));
    ```

#### 3\. UI 컴포넌트: `Shadcn/ui` + `Lucide React`

문서 3부(UI/UX)는 "No UI is the best UI"를 핵심 원칙으로, '2개의 입력창', '1개의 버튼', '4개의 결과 카드'라는 극도로 단순한 UI를 요구합니다.

  * **선정 이유:**
      * **Tailwind Native:** `Shadcn/ui`는 Tailwind CSS 위에 구축됩니다. 이미 `tailwind.config.js`가 설정된 프로젝트에 가장 자연스럽게 통합됩니다.
      * **No Runtime Bloat:** `Shadcn/ui`는 라이브러리가 아닙니다. `npx shadcn-ui add button` 명령은 `Button` 컴포넌트 코드를 우리 프로젝트에 복사/붙여넣기합니다. 이는 번들 크기를 최소화하여 SSG의 로딩 속도를 극대화하려는 v4.0 목표와 일치합니다.
      * **필수 컴포넌트 제공:** `Input`, `Button`, `Card` (결과 표시용), `Toggle` (kg/lbs 전환용), `Alert` (경고 문구 표시용) 등 MVP에 필요한 모든 것을 제공합니다.
      * **아이콘:** `Lucide React`는 `Shadcn/ui`의 기본 아이콘 팩이며, '최대 용량 경고'나 '성분 중복 경고' 등(문서 3부, 6부)에 필요한 시각적 아이콘을 제공합니다.

#### 4\. 핵심 로직: 순수 TypeScript (라이브러리 아님)

문서 2부('v4.0 핵심')는 '고정 제품 목록' JSON을 기반으로 한 명확한 계산 로직과 안전 규칙을 정의합니다.

  * **선정 이유:**
      * 이 계산 로직은 외부 라이브러리가 필요 없는 순수 비즈니스 로직입니다.
      * `lib/products.json`에 4개 제품 데이터를 저장하고, `lib/dosage-calculator.ts`에 계산 함수(연령 블록, 최대 용량 가드, 반올림 규칙 포함)를 작성합니다.
      * 로직을 별도 모듈로 분리하면 `Vitest`나 `Jest` 같은 테스팅 라이브러리를 사용하여 "10kg 5개월 입력 시 부루펜은 '상담 필요'를 반환하는가?"와 같은 핵심 안전 규칙을 자동으로 단위 테스트할 수 있습니다.

#### 5\. 향후 확장: `next-intl`

문서 5부(로드맵)는 MVP 이후 첫 번째 개선 사항으로 '현지화(Localization)' (미국/유럽 시장)를 명시합니다.

  * **선정 이유:**
      * `next-intl`은 Next.js App Router를 위한 사실상의 표준 i18n 라이브러리입니다.
      * 초기부터 `app/[locale]/page.tsx` 구조로 구축하고 모든 UI 텍스트(`messages/en.json`, `messages/ko.json`)를 분리해두면, 나중에 현지화 기능을 추가할 때 코어 로직을 수정할 필요가 전혀 없습니다.
      * 이는 "세계 최고의 프로그래머"로서 당장의 MVP뿐만 아니라 다음 단계를 고려한 아키텍처 설계입니다.

-----




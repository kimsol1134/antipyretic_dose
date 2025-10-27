
### \<AI 역할\>

당신은 **Vercel의 수석 솔루션 아키텍트**이자, 동시에 **의료 소프트웨어 안전성(IEC 62304) 표준에 정통한 리뷰어**입니다. 당신의 최우선 관심사는 두 가지입니다.

1.  **코어 웹 바이탈 (Core Web Vitals):** 단 1ms의 성능 저하도 용납하지 않으며, 번들 크기와 런타임 오버헤드에 극도로 민감합니다.
2.  **환자 안전 (Patient Safety):** 계산 로직의 오류 가능성, 테스트 커버리지의 사각지대, 잘못된 정보 전달로 인한 위험을 식별하는 데 집착합니다.

### \<AI 임무\>

아래에 제시된 **{코드베이스 구조, Building Blocks, Guidelines}** 설계안을 Vercel 아키텍트와 의료 안전 리뷰어의 관점에서 냉철하게 검토하고, 다음 질문에 답하십시오.

1.  **성능 병목 현상:** 이 설계가 '초고속 로딩' 목표를 달성하는 데 방해가 될 수 있는 숨겨진 병목 현상(예: `products.json` 로드 시점, Zustand의 불필요한 구독)은 없습니까?
2.  **안전성 사각지대:** '이중 방어' 설계(Zod + 계산 엔진)는 충분합니까? 혹은 두 계층 사이에서 누락되거나 충돌할 수 있는 엣지 케이스는 무엇입니까? (예: Zod의 transform 로직과 순수 계산 엔진 간의 암묵적 의존성)
3.  **유지보수성 vs. 제약 조건:** 'UI 라이브러리 금지'와 'i18n 연기'라는 강력한 제약 조건이 MVP 이후의 확장성(v4.0+ 로드맵의 '교차 복용 타이머' 추가)에 어떤 실질적인 악영향을 미칠 것이라고 예상하십니까?
4.  **Zustand 설계 비판:** `status`와 `results`를 하나의 스토어에서 관리하는 것이 최선입니까? `DosageResultDisplay` 컴포넌트가 불필요하게 리렌더링될 위험은 없습니까?
5.  **가장 치명적인 위험:** 이 아키텍처에서 환자 안전에 가장 큰 위협이 될 수 있는 단 하나의 요소를 꼽고, 이를 방어하기 위한 구체적인 코드 레벨의 보완책(예: 추가적인 assertion 함수)을 제안하십시오.

-----

## 아키텍처 설계안: 장점 및 예상 한계점

이 설계는 `v4.0 계획서`의 '긴급 도구'라는 목표와 `TECH_STACK.md`의 '최소주의' 철학을 융합하는 데 중점을 둡니다.

### 장점

1.  **최상의 성능 (Performance):** Next.js의 정적 배포(SSG), React Hook Form (RHF)의 비제어 컴포넌트 전략, 순수 Tailwind 사용은 런타임 오버헤드를 0에 가깝게 수렴시킵니다. 이는 '초고속 로딩' 목표를 완벽하게 달성합니다.
2.  **의료급 안전성 및 테스트 용이성 (Safety & Testability):** 가장 치명적인(mission-critical) 계산 로직을 `lib/dosage-calculator.ts`라는 순수 TypeScript 모듈로 분리(Rule 3)함으로써, UI와 무관하게 독립적인 단위 테스트가 가능합니다. 이는 의료 안전성을 보장하는 핵심입니다.
3.  **엄격한 제약 조건 준수 (Constraint Adherence):** UI 라이브러리(Rule 1)와 i18n(Rule 2)을 의도적으로 배제하여, MVP의 범위를 명확히 하고 불필요한 의존성을 제거합니다.
4.  **단순한 데이터 흐름 (Simplicity):** 사용자의 입력은 `RHF` -\> `Zod` (유효성 검사) -\> `Zustand` (상태 업데이트) -\> `계산 엔진` (로직) -\> `Zustand` (결과 저장) -\> `UI` (표시)라는 명확하고 예측 가능한 단방향 흐름을 따릅니다.

### 예상 한계점

1.  **UI 개발 속도 저하:** 'UI 라이브러리 금지'(Rule 1) 규칙은 Input, Button, Card 등 모든 UI 요소를 순수 Tailwind로 직접 구현해야 함을 의미합니다. 이는 초기 개발 속도를 저하시키며, 일관된 디자인 시스템을 유지하기 위해 개발자의 노력이 더 필요합니다.
2.  **i18n 리팩토링 비용:** 'i18n 연기'(Rule 2) 규칙으로 인해 모든 텍스트가 하드코딩됩니다. MVP 이후 로드맵 1순위인 '현지화' 진행 시, 모든 문자열을 추출하고 `next-intl` 같은 라이브러리를 도입하는 리팩토링 비용이 발생합니다. 이는 의식적인 기술 부채(technical debt)입니다.
3.  **스타일 일관성 유지:** `Shadcn/ui` 같은 라이브러리의 도움 없이 순수 Tailwind만 사용하므로, `ui/` 폴더 내의 커스텀 컴포넌트 설계가 부실할 경우 프로젝트 전반의 스타일 일관성(예: 패딩, 폰트 크기)이 깨지기 쉽습니다.

-----

## 1\. 코드베이스 구조 (Codebase Structure)

`TECH_STACK.md`의 최소 파일 구조를 기반으로, 의료 안전성과 유지보수성을 극대화하는 구조로 확장합니다.

```
/
├── /app
│   ├── /components
│   │   ├── /ui                   # [Rule 1] 순수 Tailwind로 제작한 재사용 UI
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Alert.tsx         # 경고 문구용 (예: 최대 용량)
│   │   ├── DosageForm.tsx        # RHF/Zod 기반 입력 폼
│   │   └── DosageResultDisplay.tsx # Zustand 스토어 구독 및 결과 카드 4개 렌더링
│   ├── layout.tsx                # 루트 레이아웃 (글꼴, Tailwind 설정)
│   └── page.tsx                  # 메인 페이지 (DosageForm, DosageResultDisplay 조합)
│
├── /lib
│   ├── dosage-calculator.ts      # [Rule 3] 핵심: 순수 TS 계산 엔진
│   ├── schemas.ts                # [Stack] Zod 스키마 (입력 유효성 검사)
│   ├── constants.ts              # 의료 안전 상수 (예: IBUPROFEN_MIN_AGE_MONTHS = 6)
│   └── types.ts                  # 핵심 타입 정의 (Product, DosageInput, DosageResult)
│
├── /data
│   └── products.json             # v4.0 계획서의 '고정 제품 목록' (4종)
│
├── /store
│   └── dosage-store.ts           # [Stack] Zustand 스토어 (입력값, 결과값)
│
└── tailwind.config.ts
```

### 설계 결정 및 이유

  * **/app/components/ui/:** 'UI 라이브러리 금지' 규칙을 준수하기 위해 필수적입니다. 일관된 `Input`, `Button` 등을 직접 만들어 사용함으로써, 순수 Tailwind 사용의 단점인 '일관성 부재'를 완화합니다.
  * **/lib/constants.ts:** "6개월 미만", "3개월 미만"과 같은 의료 안전 규칙(매직 넘버)을 `dosage-calculator.ts`에서 분리합니다. 이는 규칙이 변경될 때 코드 수정 범위를 최소화하고 가독성을 높입니다.
  * **/lib/types.ts:** `Product` (약물 정보), `DosageInput` (나이/체중), `DosageResult` (계산 결과/경고) 타입을 중앙에서 관리하여, Zod, 계산 엔진, Zustand, React 컴포넌트 간의 데이터 인터페이스를 통일합니다.
  * **/data/products.json:** `v4.0 계획서`에서 명시한 4가지 주요 제품 데이터를 코드(TS)와 분리하여 `json`으로 관리합니다. 이는 향후 약물 추가/변경 시 코드 수정 없이 데이터 파일만 업데이트하면 되도록 유연성을 제공합니다.

-----

## 2\. 핵심 빌딩 블록 (Building Blocks)

각 모듈의 명확한 책임(Responsibility)을 정의합니다.

### 1\. 데이터 및 타입 (`/data`, `/lib/types.ts`)

  * **`products.json`:** `v4.0 계획서`의 '고정 제품 목록' 4종을 정의합니다.
      * *구조 (예시):*
        ```json
        [
          {
            "id": "tylenol_susp_160_5_kr",
            "name": "어린이 타이레놀 현탁액",
            "concentration": "160mg/5mL",
            "strength_mg_per_ml": 32,
            "guideline_dose_mg_per_kg": 12.5,
            "min_age_months": 3,
            "max_single_mg": 650, // (성인 최대 용량 기준)
            "interval_hours": "4-6시간",
            "max_doses_per_day": 5
          },
          // ... (챔프, 부루펜, 맥시부펜)
        ]
        ```
  * **`types.ts`:** `Product` (JSON 스키마와 동일), `DosageInput { age: number, ageUnit: 'months' | 'years', weight: number }`, `DosageResult { productId: string, calculated_ml: number | null, status: 'ok' | 'age_block' | 'max_dose_warning' }`

### 2\. 유효성 검사 (1차 방어) (`/lib/schemas.ts`)

  * `Zod`와 `RHF`의 `zodResolver`를 사용합니다.
  * **`dosageInputSchema = z.object({ ... })`**
      * `weight`: `z.coerce.number().positive("체중은 0보다 커야 합니다.")`
      * `age`: `z.coerce.number().positive().int()`
      * `ageUnit`: `z.enum(['months', 'years'])`
      * `.transform(data => ...)`: RHF에서 받은 데이터를 계산 엔진이 사용하기 편한 `age_months` (개월 수)로 변환하는 로직을 Zod 스키마 내에 포함시킵니다.

### 3\. 계산 엔진 (2차 방어) (`/lib/dosage-calculator.ts`)

  * **[Rule 3]** React 의존성이 없는 순수 TypeScript 함수로 작성합니다.
  * **`calculateDosage(input: { age_months: number, weight: number }, product: Product): DosageResult`**
    1.  **연령 하드 블록 (v4.0 안전장치 1):** `if (input.age_months < product.min_age_months)` -\> `status: 'age_block'` 반환.
    2.  **용량 계산:** `calculated_mg = input.weight * product.guideline_dose_mg_per_kg`
    3.  **최대용량 가드 (v4.0 안전장치 2):** `if (calculated_mg > product.max_single_mg)` -\> `calculated_mg = product.max_single_mg`, `status: 'max_dose_warning'` 설정.
    4.  **mL 변환:** `calculated_ml = calculated_mg / product.strength_mg_per_ml`
    5.  **반올림 (v4.0 규칙 4):** 0.1mL 단위로 반올림 (예: `Math.round(calculated_ml * 10) / 10`).
    6.  `DosageResult` 객체 반환.
  * **`calculateAllDosages(validatedInput: DosageInput): DosageResult[]`**
    1.  `products.json` 데이터를 import 합니다.
    2.  `validatedInput`을 `age_months`로 변환합니다 (Zod transform에서 이미 처리되었을 수 있음).
    3.  4개의 약물에 대해 `calculateDosage`를 순회(loop)하며 호출합니다.
    4.  `DosageResult` 배열 (4개)을 반환합니다.

### 4\. 상태 관리 (`/store/dosage-store.ts`)

  * `Zustand`를 사용하여 계산 입력값과 결과값을 전역으로 관리합니다.
  * **`State`:**
      * `results: DosageResult[] = []`
      * `status: 'idle' | 'calculated' = 'idle'`
  * **`Actions`:**
      * **`calculate(input: DosageInput): void`**
        1.  `calculateAllDosages(input)` 호출.
        2.  `set({ results: ..., status: 'calculated' })`로 스토어 상태 업데이트.
      * **`reset(): void`**
        1.  `set({ results: [], status: 'idle' })`

### 5\. UI (View) (`/app/components/`)

  * **`DosageForm.tsx`:**
      * `useForm({ resolver: zodResolver(dosageInputSchema) })`
      * `onSubmit` 핸들러에서 RHF의 `data`를 받아 Zustand의 `calculate` 액션을 호출합니다.
      * `formState.errors`를 사용해 Zod 유효성 검사 오류를 사용자에게 표시합니다.
      * **[Rule 1, 2]** 순수 Tailwind로 만든 `ui/Input.tsx`, `ui/Button.tsx`을 사용하며, 레이블은 "나이", "체중(kg)"으로 하드코딩합니다.
  * **`DosageResultDisplay.tsx`:**
      * `const { results, status } = useDosageStore()`
      * `status === 'calculated'`일 때 `results` 배열을 map으로 순회합니다.
      * 각 `result` 항목을 `ui/Card.tsx`에 전달하여 렌더링합니다.
      * `result.status`에 따라 "XX.X mL", "6개월 미만 상담 필요"(age\_block), 또는 "최대 용량으로 조정됨"(max\_dose\_warning)을 조건부로 표시합니다.

-----

## 3\. 핵심 개발 가이드라인 (Guidelines)

1.  **[성능] 비제어(Uncontrolled) 우선:** `DosageForm`의 입력 필드는 반드시 RHF의 비제어 방식으로 구현합니다. `onChange`에서 Zustand 상태를 업데이트하여 리렌더링을 유발하는 안티 패턴을 금지합니다.
2.  **[안전] 로직 절대 분리:** `app/` 폴더 내의 React 컴포넌트에는 `weight * 12.5`와 같은 어떠한 계산 로직도 포함되어서는 안 됩니다. 모든 계산은 `lib/dosage-calculator.ts`에 위임해야 합니다.
3.  **[안전] 이중 방어:** 1차 방어(`lib/schemas.ts`)는 사용자의 비정상적인 입력(예: 음수 체중)을 막고, 2차 방어(`lib/dosage-calculator.ts`)는 유효한 입력값에 대해 의료 규칙(예: 연령 제한)을 적용합니다. 두 방어선은 독립적으로 작동해야 합니다.
4.  **[제약] i18n 하드코딩:** `next-intl` 설치는 금지됩니다(Rule 2). "계산하기", "가지고 계신 약의 이름과 농도를 꼭 확인하세요" 등 모든 UI 텍스트는 `.tsx` 파일 내에 한국어로 하드코딩합니다(Rule 2).
5.  **[제약] 순수 Tailwind 스타일링:** `style={{}}` 인라인 스타일 사용을 지양하고, 모든 스타일은 Tailwind 유틸리티 클래스(@apply 포함) 또는 `tailwind.config.ts`의 `theme` 확장을 통해 관리합니다(Rule 1).

-----


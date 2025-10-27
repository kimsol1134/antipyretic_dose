## 코드베이스구조 설계

### 1\. 역할 (Role)

당신은 **Vercel 수석 솔루션 아키텍트**입니다. 당신의 임무는 Core Web Vitals(CWV) 성능을 극한으로 최적화하고, IEC 62304 의료기기 소프트웨어 안전 표준을 준수하는 Next.js 애플리케이션을 구축하는 것입니다.

### 2\. 핵심 임무 (Task)

제시된 아키텍처와 \*\*[필수 제약 조건]\*\*을 기반으로 소아 해열제 용량 계산기 v1.0의 전체 코드를 생성합니다.

### 3\. 코드베이스 구조 (Structure)

다음 파일 구조를 **반드시** 준수하십시오.

```
/
├── /app
│   ├── /components
│   │   ├── /ui                   # (제약 6) 순수 Tailwind UI
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Alert.tsx
│   │   ├── DosageForm.tsx        # (제약 1, 4) RHF, Zod, Props로 데이터 받음
│   │   └── DosageResultDisplay.tsx # (제약 5) Zustand 아토믹 셀렉터 사용
│   ├── layout.tsx
│   └── page.tsx                  # (제약 1) 서버에서 JSON 로드 및 Props 전달
│
├── /lib
│   ├── dosage-calculator.ts      # (제약 3, 4) 순수 TS 계산 엔진 (모든 변환 로직 포함)
│   ├── schemas.ts                # (제약 2, 3) Zod 스키마 (입력값, 제품 데이터)
│   ├── constants.ts              # 의료 상수 (예: 최소 연령)
│   └── types.ts                  # TypeScript 타입 정의
│
├── /data
│   └── products.json             # 4종의 고정 제품 데이터
│
├── /store
│   └── dosage-store.ts           # (제약 5) Zustand 스토어
│
└── tailwind.config.ts
```

### 4\. 필수 제약 조건 (MUST FOLLOW Constraints)

**[제약 1: 성능 - 데이터 로딩]**

  * `products.json` 데이터는 **절대** 클라이언트 컴포넌트(`DosageForm` 등)에서 `import`되어서는 안 됩니다.
  * `app/page.tsx` (서버 컴포넌트)에서 `fs` 또는 `import`를 통해 **서버 사이드에서만** 데이터를 읽어야 합니다.
  * 읽어온 `products` 데이터는 `DosageForm` 클라이언트 컴포넌트에 **Props로 전달**되어야 합니다.

**[제약 2: 안전 - 데이터 무결성]**

  * `lib/schemas.ts`에 `productSchema`와 `productsSchema` (Zod)를 정의해야 합니다.
  * `page.tsx`가 `products.json`을 로드할 때, Zod `productsSchema.parse()`를 **즉시 실행**하여 데이터 무결성을 검증해야 합니다. 실패 시 빌드가 중단되어야 합니다.

**[제약 3: 안전 - 로직 분리 (이중 방어)]**

  * **1차 방어 (Zod):** `lib/schemas.ts`의 `dosageInputSchema`는 사용자 입력값(예: `weight > 0`)의 유효성만 검사합니다.
  * **절대 금지:** Zod `.transform()`을 사용하여 `age`와 `ageUnit`을 `age_months`로 변환하는 등의 **비즈니스 로직을 포함하지 마십시오.**
  * **2차 방어 (계산 엔진):** `lib/dosage-calculator.ts`는 React와 무관한 순수 TS 모듈이어야 합니다.
  * `calculateAllDosages` 함수는 **변환되지 않은 원본 `DosageInput`** (`age`, `ageUnit` 포함)을 인자로 받아야 하며, **내부에서 `age_months`로 변환하는 로직을 직접 수행**해야 합니다.

**[제약 4: 안전 - 런타임 방어]**

  * `dosage-calculator.ts`의 `calculateDosage` 함수 내부에 \*\*`Division by Zero`\*\*를 방지하는 방어 코드가 **반드시** 포함되어야 합니다.
  * `product.strength_mg_per_ml` 값이 `0` 이하인지 확인하고, `calculated_ml` 결과가 `Infinity` 또는 `NaN`이 아닌지 (`Number.isFinite`) 확인하는 **assertion(단언) 로직**을 구현하십시오.

**[제약 5: 성능 - 상태 관리]**

  * `DosageResultDisplay.tsx` 컴포넌트는 `useDosageStore(state => state)`와 같이 스토어 전체를 구독해서는 안 됩니다.
  * **반드시 아토믹 셀렉터** (예: `const results = useDosageStore(s => s.results);`, `const status = useDosageStore(s => s.status);`)를 사용하여 불필요한 리렌더링을 방지하십시오.

**[제약 6: MVP 범위]**

  * UI 라이브러리 (Shadcn/ui, Headless UI 등)를 사용하지 않습니다. 모든 UI는 `/app/components/ui` 내부에 순수 Tailwind로 제작합니다.
  * `i18n` 라이브러리 (`next-intl` 등)를 사용하지 않습니다. 모든 UI 텍스트(예: "체중(kg)", "계산하기")는 **한국어로 하드코딩**합니다.
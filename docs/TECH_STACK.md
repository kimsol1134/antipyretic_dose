# 기술 스택 정리

## **\<CONTEXT\>**

* **프로젝트명:** 의료용 계산기 PWA v4.0 (MVP)  
* **핵심 목표:** '초고속 로딩', '최소 입력', '계산 신뢰성'  
* **핵심 철학:** 극도의 성능과 단순성. 불필요한 의존성(dependency)을 0으로 수렴시킨다.

## **\<ROLE\>**

당신은 '성능', '안전성', '최소주의'를 최우선으로 하는 시니어 프론트엔드 엔지니어다.

## **\<TASK\>**

제시된 \<PRIMARY\_STACK\>을 기반으로 v4.0 MVP를 구축하라. \<CRITICAL\_RULES\>를 절대적으로 준수해야 한다.

## **\<PRIMARY\_STACK\> (필수 사용)**

1. **기반:** Next.js 15 (App Router), TypeScript, Tailwind CSS  
2. **상태 관리:** Zustand  
   * 목적: '입력값'과 '결과값' 공유를 위한 최소한의 전역 스토어.  
3. **폼 처리:** React Hook Form (RHF)  
   * 목적: 비제어(uncontrolled) 입력을 통한 리렌더링 방지 및 성능 최적화.  
4. **유효성 검사:** Zod  
   * 목적: RHF와 연동(zodResolver). 의료 안전 규칙(음수, 최대값 등)을 런타임에서 방어하는 '1차 안전 게이트'.

## **\<CRITICAL\_RULES\> (절대 준수)**

1. **\[UI 규칙\] UI 라이브러리 금지:**  
   * **행동:** v4.0에 필요한 모든 UI(Input, Button, Card)는 **순수 Tailwind CSS 클래스**를 사용해 직접 스타일링한다.  
   * **제약:** Shadcn/ui, Radix UI 또는 기타 UI 라이브러리를 **절대 npm install 하거나 사용하지 않는다.** 이는 '최소 의존성' 및 '경량화' 목표에 정면으로 위배된다.  
2. **\[i18n 규칙\] 현지화(i18n) 연기:**  
   * **행동:** 모든 UI 텍스트(레이블, 버튼명, 경고 문구)는 app/page.tsx 내에 \*\*한국어로 하드코딩(hardcoding)\*\*한다.  
   * **제약:** next-intl 라이브러리를 **절대 설치하지 않는다.** \[locale\] 라우팅 구조를 사용하지 않는다. i18n은 MVP 이후 로드맵 1순위이며, 현 단계에서는 '빠른 구현'에 집중한다.  
3. **\[로직 분리 규칙\] 안전성 및 테스트:**  
   * **행동:** 모든 핵심 계산 로직(연령/체중 기반 용량 계산, 안전 규칙 적용)은 React와 분리된 **순수 TypeScript 모듈**(lib/dosage-calculator.ts)로 작성한다.  
   * **목적:** 이는 React 의존성 없이 로직의 순수성을 보장하며, 향후 Vitest/Jest를 통한 단위 테스트(Unit Test)를 용이하게 하여 '의료 안전성'을 확보하는 핵심 아키텍처다.

## **\<DELIVERABLES\> (최소 파일 구조)**

/app  
  page.tsx          \# (순수 Tailwind로 UI 구현)  
/lib  
  schemas.ts        \# (Zod 스키마 및 transform 로직)  
  dosage-calculator.ts \# (순수 TS 계산 엔진 로직)  
  products.json     \# (약물 데이터)  
/store  
  dosage-store.ts   \# (Zustand 스토어 정의)  

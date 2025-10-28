# 어린이 해열제 복용량 계산기

어린이의 체중과 나이를 기반으로 안전한 해열제 복용량을 계산해주는 웹 애플리케이션입니다.

## 📋 프로젝트 소개

이 프로젝트는 부모님들이 어린이 해열제의 정확한 복용량을 쉽게 계산할 수 있도록 돕기 위해 만들어졌습니다. 체중과 나이를 입력하면 주요 해열제(타이레놀, 챔프, 부루펜, 맥시부펜)의 권장 복용량을 자동으로 계산해줍니다.

### ⚠️ 중요한 안내

**이 계산기는 참고용입니다.** 실제 투약 전에는 반드시:
- 제품 라벨의 복용 지침을 확인하세요
- 의사나 약사와 상담하세요
- 다른 감기약과의 성분 중복을 확인하세요

## ✨ 주요 기능

### 1. 정확한 용량 계산
- **범위 표시**: 최소~최대 권장 복용량을 mL 단위로 표시
- **체중 기반**: 어린이의 체중에 맞춘 정확한 계산
- **나이 제한**: 제품별 최소 연령 확인 및 경고

### 2. 안전성 기능
- **1회 최대 용량 제한**: 과다 복용 방지
- **하루 최대 용량 표시**: 24시간 내 총 복용량 제한
- **특수 제한**: 이부프로펜/덱시부프로펜 30kg 미만 제한 (25mL)

### 3. 제품 정보
- **5가지 주요 제품** 지원:
  - 어린이 타이레놀 현탁액 100mL (아세트아미노펜 32mg/mL)
  - 어린이 타이레놀 현탁액 200mL (아세트아미노펜 50mg/mL)
  - 챔프 시럽 빨강 (아세트아미노펜 32mg/mL)
  - 어린이 부루펜 시럽 (이부프로펜 20mg/mL)
  - 맥시부펜 시럽 (덱시부프로펜 12mg/mL)

### 4. 유사 약품 검색
- e약은요 API 연동으로 같은 성분/농도의 유사 약품 정보 제공
- 제품 이미지, 제조사 정보 표시

### 5. 사용자 친화적 UI
- 제품 이미지 표시
- 같은 농도 제품 그룹화
- 반응형 디자인 (모바일/데스크톱)
- 명확한 복용 정보 (간격, 횟수, 최대량)

## 🛠 기술 스택

### Frontend
- **Next.js 15.1** - React 프레임워크 (App Router)
- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 스타일링
- **Zustand** - 상태 관리

### Data & Validation
- **Zod** - 런타임 스키마 검증
- **React Hook Form** - 폼 관리
- **e약은요 API** - 의약품 정보 조회

### Testing & Quality
- **Vitest** - 유닛 테스트
- **ESLint** - 코드 품질
- **TypeScript** - 타입 체크

### Medical Safety Standards
- **IEC 62304** 참고 - 의료 소프트웨어 개발
- 방어적 프로그래밍 (Defensive Programming)
- 빌드타임 데이터 검증

## 🚀 시작하기

### 1. 저장소 클론

```bash
git clone https://github.com/kimsol1134/antipyretic_dose.git
cd antipyretic_dose
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경변수 설정

`.env.local.example` 파일을 복사하여 `.env.local` 생성:

```bash
cp .env.local.example .env.local
```

`.env.local` 파일에 API 키 입력:

```env
EASY_DRUG_API_KEY=your-decoded-easy-drug-key
```

#### e약은요 API 키 발급 방법:
1. [공공데이터포털](https://www.data.go.kr/) 접속
2. 회원가입 및 로그인
3. "의약품 개요정보(e약은요)" 검색
4. 활용신청
5. **"Decoding" 키** 사용 (일반 인증키 아님!)

### 4. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 접속

### 5. 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 📁 프로젝트 구조

```
antipyretic_dose/
├── data/                          # 정적 데이터
│   ├── products.json              # 제품 정보
│   ├── similar-products.json      # 유사 약품 (빌드타임 생성)
│   └── product-images.json        # 이미지 검색 결과
├── docs/                          # 문서
│   ├── 해열제정보.md              # 의학 정보 참고자료
│   ├── e약은요_API_info.md        # API 문서
│   └── PLAN.md                    # 개발 계획
├── public/
│   └── images/products/           # 제품 이미지
├── scripts/                       # 유틸리티 스크립트
│   ├── fetch-similar-products.ts  # 유사 약품 데이터 수집
│   └── fetch-product-images.ts    # 이미지 검색
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── api/easy-drug/         # API Route
│   │   ├── components/            # React 컴포넌트
│   │   │   ├── DosageForm.tsx     # 입력 폼
│   │   │   ├── DosageResultDisplay.tsx  # 결과 표시
│   │   │   └── ui/                # UI 컴포넌트
│   │   ├── layout.tsx             # 레이아웃
│   │   └── page.tsx               # 메인 페이지
│   ├── lib/                       # 비즈니스 로직
│   │   ├── dosage-calculator.ts   # 용량 계산 엔진
│   │   ├── easy-drug.ts           # API 클라이언트
│   │   ├── schemas.ts             # Zod 스키마
│   │   ├── types.ts               # TypeScript 타입
│   │   └── constants.ts           # 상수
│   └── store/                     # 상태 관리
│       └── dosage-store.ts        # Zustand store
└── CLAUDE.md                      # AI 개발 가이드
```

## 🧪 테스트

```bash
# 테스트 실행
npm test

# 빌드 검증
npm run build
```

### 테스트 커버리지
- `dosage-calculator.test.ts`: 용량 계산 로직 테스트
- `easy-drug.test.ts`: API 파싱 및 필터링 테스트

## 📊 데이터 수집 스크립트

### 유사 약품 정보 수집
```bash
npm run fetch-similar
```
- 각 제품의 유사 약품을 e약은요 API에서 검색
- `data/similar-products.json` 생성
- 빌드타임에 검증

### 제품 이미지 검색
```bash
npm run fetch-images
```
- e약은요 API에서 제품 이미지 URL 검색
- `data/product-images.json` 생성

## 🌐 Vercel 배포

### 1. GitHub 연동
이미 완료 (https://github.com/kimsol1134/antipyretic_dose)

### 2. Vercel 프로젝트 생성
1. https://vercel.com 접속
2. "Import Project" → GitHub repository 선택
3. Environment Variables 설정:
   ```
   EASY_DRUG_API_KEY = [e약은요 Decoding 키]
   ```
4. Deploy 클릭

### 3. 자동 배포
- `main` 브랜치에 push하면 자동 배포
- PR 생성 시 Preview 배포

## 🔒 안전성 및 품질

### 의료 소프트웨어 안전 기준
- **IEC 62304 참고**: 의료 소프트웨어 개발 표준
- **방어적 프로그래밍**: 모든 입력값 검증
- **빌드타임 검증**: Zod 스키마로 제품 데이터 검증
- **유한성 검증**: 계산 결과의 `Number.isFinite()` 확인

### 데이터 무결성
- 제품 데이터는 `data/products.json`에서 관리
- Zod 스키마로 빌드 시 검증
- 농도와 성분명 매칭 검증
- 잘못된 데이터는 빌드 실패

### 에러 처리
- 나이 제한 확인 (age_block)
- 데이터 오류 감지 (error status)
- 과다 복용 방지 (최대 용량 제한)

## 📖 사용 예시

### 입력
- 체중: 15kg
- 나이: 2세

### 출력 (타이레놀 100mL 기준)
```
1회 복용량: 4.7 ~ 7.0 mL
복용 간격: 4시간
1일 최대: 5회
⚠️ 하루 최대 복용량: 23.4 mL
```

## ⚠️ 면책 조항

이 애플리케이션은 **참고 목적**으로만 사용되어야 합니다.

- 의료 전문가의 조언을 대체하지 않습니다
- 실제 투약 전 반드시 의사나 약사와 상담하세요
- 제품 라벨의 지침을 따르세요
- 다른 약물과의 상호작용을 확인하세요
- 개발자는 이 도구 사용으로 인한 결과에 대해 책임지지 않습니다

## 📄 라이센스

이 프로젝트는 교육 및 참고 목적으로 공개되었습니다.

## 🤝 기여

이슈 제보 및 개선 제안은 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트 링크: [https://github.com/kimsol1134/antipyretic_dose](https://github.com/kimsol1134/antipyretic_dose)

---

**⚕️ 건강과 안전을 최우선으로 생각합니다. 항상 의료 전문가와 상담하세요.**

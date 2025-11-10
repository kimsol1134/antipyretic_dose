# Google Indexing API - Quick Start

Google Indexing API를 사용하여 사이트의 페이지 색인을 프로그래매틱하게 관리하는 기능이 구현되어 있습니다.

## 빠른 시작

### 1. Service Account 설정

1. [Google Cloud Console](https://console.cloud.google.com/)에서 프로젝트 생성
2. "Indexing API" 활성화
3. Service Account 생성 및 JSON 키 다운로드
4. [Google Search Console](https://search.google.com/search-console)에서 Service Account 이메일을 소유자로 추가

**자세한 설정 방법**: [`docs/GOOGLE_INDEXING_SETUP.md`](./GOOGLE_INDEXING_SETUP.md)를 참조하세요.

### 2. 환경 변수 설정

`.env.local` 파일에 Service Account JSON 추가:

```bash
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project-id",...}'
```

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 관리자 페이지 접속

브라우저에서 http://localhost:3000/admin/indexing 접속

## 사용법

### 관리자 UI 사용

관리자 페이지(`/admin/indexing`)에서:

1. **단일 URL 색인 생성**: URL 입력 후 "단일 URL 색인 생성" 버튼 클릭
2. **모든 중요 페이지 색인 생성**: "모든 중요 페이지 색인 생성" 버튼 클릭
3. **URL 색인 상태 조회**: URL 입력 후 "URL 색인 상태 조회" 버튼 클릭

### API 직접 호출

#### 단일 URL 색인 생성

```bash
curl -X POST http://localhost:3000/api/indexing \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-site.com/page",
    "type": "URL_UPDATED"
  }'
```

#### 여러 URL 일괄 색인 생성

```bash
curl -X POST http://localhost:3000/api/indexing/batch \
  -H "Content-Type: application/json" \
  -d '{
    "urls": [
      "https://your-site.com/page1",
      "https://your-site.com/page2"
    ],
    "type": "URL_UPDATED"
  }'
```

#### 모든 중요 페이지 색인 생성

```bash
curl -X POST http://localhost:3000/api/indexing/all \
  -H "Content-Type: application/json" \
  -d '{
    "baseUrl": "https://your-site.com",
    "type": "URL_UPDATED"
  }'
```

#### URL 색인 상태 조회

```bash
curl "http://localhost:3000/api/indexing/status?url=https://your-site.com/page"
```

## 주요 파일

| 파일 | 설명 |
|------|------|
| `src/lib/google-indexing.ts` | Google Indexing API 클라이언트 라이브러리 |
| `src/app/api/indexing/route.ts` | API 엔드포인트 (POST, GET) |
| `src/app/components/GoogleIndexingPanel.tsx` | 관리자 UI 컴포넌트 |
| `src/app/admin/indexing/page.tsx` | 관리자 페이지 |
| `docs/GOOGLE_INDEXING_SETUP.md` | 상세 설정 가이드 |
| `.env.example` | 환경 변수 예시 |

## 중요 페이지 관리

`src/lib/google-indexing.ts`의 `getImportantPageUrls()` 함수를 수정하여 색인을 생성할 중요 페이지를 관리:

```typescript
export function getImportantPageUrls(baseUrl: string): string[] {
  const normalizedBase = baseUrl.replace(/\/$/, '');

  return [
    normalizedBase,                  // 홈페이지
    `${normalizedBase}/faq`,         // FAQ 페이지
    `${normalizedBase}/about`,       // 소개 페이지 (예시)
    // 추가 페이지를 여기에 추가...
  ];
}
```

## 보안 주의사항

⚠️ **중요**: 현재 구현은 인증이 없습니다!

프로덕션 배포 전 반드시:

1. API 엔드포인트에 인증 추가
2. `/admin/indexing` 페이지 접근 제한
3. Service Account JSON을 Git에 커밋하지 않기 (`.gitignore`에 `.env.local` 추가 확인)

인증 추가 예시:

```typescript
// src/app/api/indexing/route.ts
export async function POST(request: Request) {
  // API 키 인증
  const apiKey = request.headers.get('x-api-key');
  if (apiKey !== process.env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 또는 세션 인증
  // const session = await getServerSession(authOptions);
  // if (!session?.user?.isAdmin) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  // ... 나머지 로직
}
```

## 제한사항

- **할당량**: 기본 200 requests/day
- **지원 콘텐츠**: JobPosting, BroadcastEvent (공식 지원)
- **일반 페이지**: 사용 가능하지만 공식 지원은 아님
- **색인 시간**: 요청 후 몇 시간~며칠 소요

## 문제 해결

일반적인 문제와 해결 방법은 [`docs/GOOGLE_INDEXING_SETUP.md`](./GOOGLE_INDEXING_SETUP.md)의 "문제 해결" 섹션을 참조하세요.

주요 문제:

1. **"GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set"**
   - `.env.local` 파일에 환경 변수가 설정되었는지 확인
   - 개발 서버를 재시작

2. **"Permission denied" (403)**
   - Search Console에서 Service Account 이메일을 "소유자"로 추가했는지 확인
   - 권한 반영에 최대 24시간 소요

3. **"Indexing API has not been used in project"**
   - Google Cloud Console에서 "Indexing API"가 활성화되었는지 확인

## 추가 리소스

- [Google Indexing API 공식 문서](https://developers.google.com/search/apis/indexing-api/v3/quickstart)
- [상세 설정 가이드](./GOOGLE_INDEXING_SETUP.md)
- [Google Search Console](https://search.google.com/search-console)
- [Google Cloud Console](https://console.cloud.google.com/)

## 참고

색인 생성 요청은 즉시 색인을 생성하지 않습니다. Google이 요청을 처리하고 페이지를 크롤링한 후 색인을 생성하는 데 시간이 걸립니다. Search Console의 "URL 검사" 도구로 색인 상태를 확인할 수 있습니다.

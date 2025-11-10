# Google Indexing API 설정 가이드

이 가이드는 Google Indexing API를 설정하고 사용하는 방법을 설명합니다.

## 목차

1. [Google Cloud Console 설정](#1-google-cloud-console-설정)
2. [Search Console 설정](#2-search-console-설정)
3. [환경 변수 설정](#3-환경-변수-설정)
4. [API 사용법](#4-api-사용법)
5. [문제 해결](#5-문제-해결)

---

## 1. Google Cloud Console 설정

### 1.1 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속합니다.
2. 상단의 프로젝트 선택 드롭다운을 클릭합니다.
3. "새 프로젝트"를 클릭하여 프로젝트를 생성합니다.
4. 프로젝트 이름을 입력하고 "만들기"를 클릭합니다.

### 1.2 Indexing API 활성화

1. 왼쪽 메뉴에서 "APIs & Services" > "Library"를 선택합니다.
2. 검색창에 "Indexing API"를 입력합니다.
3. "Indexing API"를 클릭하고 "사용 설정" 버튼을 클릭합니다.

### 1.3 Service Account 생성

1. 왼쪽 메뉴에서 "APIs & Services" > "Credentials"를 선택합니다.
2. 상단의 "+ CREATE CREDENTIALS"를 클릭합니다.
3. "Service account"를 선택합니다.
4. Service account 정보를 입력합니다:
   - **Service account name**: `indexing-api-service` (원하는 이름)
   - **Service account ID**: 자동 생성됨
   - **Description**: `Service account for Google Indexing API`
5. "CREATE AND CONTINUE"를 클릭합니다.
6. Role 선택 단계에서 "Owner" 역할을 선택합니다 (또는 최소 권한: "Service Account User").
7. "CONTINUE"를 클릭하고 "DONE"을 클릭합니다.

### 1.4 Service Account JSON 키 생성

1. 생성된 Service Account를 클릭합니다.
2. 상단의 "KEYS" 탭을 클릭합니다.
3. "ADD KEY" > "Create new key"를 클릭합니다.
4. Key type으로 "JSON"을 선택합니다.
5. "CREATE"를 클릭하면 JSON 파일이 자동으로 다운로드됩니다.
6. **이 JSON 파일을 안전하게 보관하세요!** (절대 Git에 커밋하지 마세요)

다운로드된 JSON 파일은 다음과 같은 형식입니다:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "indexing-api-service@your-project-id.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

---

## 2. Search Console 설정

Google Indexing API를 사용하려면 Service Account에 Search Console 접근 권한을 부여해야 합니다.

### 2.1 Service Account 이메일 확인

위에서 다운로드한 JSON 파일에서 `client_email` 값을 확인합니다.
예: `indexing-api-service@your-project-id.iam.gserviceaccount.com`

### 2.2 Search Console에 소유자 추가

1. [Google Search Console](https://search.google.com/search-console)에 접속합니다.
2. 사이트를 선택합니다 (또는 새 속성 추가).
3. 왼쪽 메뉴 하단의 "설정" (톱니바퀴 아이콘)을 클릭합니다.
4. "사용자 및 권한"을 클릭합니다.
5. "사용자 추가" 버튼을 클릭합니다.
6. Service Account의 `client_email`을 입력합니다.
7. 권한을 "소유자"로 설정합니다.
8. "추가"를 클릭합니다.

**중요**: 이메일 확인을 요청하는 메시지가 표시될 수 있지만, Service Account는 이메일 확인을 할 수 없습니다. 그냥 추가하면 됩니다.

---

## 3. 환경 변수 설정

### 3.1 `.env.local` 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성합니다 (이미 있다면 수정).

### 3.2 환경 변수 추가

다운로드한 JSON 파일의 **전체 내용**을 `GOOGLE_SERVICE_ACCOUNT_KEY` 환경 변수에 추가합니다.

**방법 1: 한 줄로 추가 (권장)**

```bash
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project-id",...}'
```

**방법 2: 여러 줄로 추가**

```bash
GOOGLE_SERVICE_ACCOUNT_KEY='{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "indexing-api-service@your-project-id.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}'
```

### 3.3 개발 서버 재시작

환경 변수를 변경한 후 개발 서버를 재시작합니다:

```bash
npm run dev
```

---

## 4. API 사용법

### 4.1 단일 URL 색인 생성 요청

```bash
curl -X POST http://localhost:3000/api/indexing \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-site.com/page",
    "type": "URL_UPDATED"
  }'
```

응답:

```json
{
  "success": true,
  "response": {
    "urlNotificationMetadata": {
      "url": "https://your-site.com/page",
      "latestUpdate": {
        "url": "https://your-site.com/page",
        "type": "URL_UPDATED",
        "notifyTime": "2024-01-01T00:00:00Z"
      }
    }
  }
}
```

### 4.2 여러 URL 일괄 색인 생성 요청

```bash
curl -X POST http://localhost:3000/api/indexing/batch \
  -H "Content-Type: application/json" \
  -d '{
    "urls": [
      "https://your-site.com/page1",
      "https://your-site.com/page2",
      "https://your-site.com/page3"
    ],
    "type": "URL_UPDATED"
  }'
```

응답:

```json
{
  "success": true,
  "results": [
    {
      "success": true,
      "url": "https://your-site.com/page1",
      "response": { ... }
    },
    {
      "success": true,
      "url": "https://your-site.com/page2",
      "response": { ... }
    },
    {
      "success": false,
      "url": "https://your-site.com/page3",
      "error": "Error message"
    }
  ],
  "summary": {
    "total": 3,
    "success": 2,
    "failure": 1
  }
}
```

### 4.3 사이트의 모든 중요 페이지 색인 생성

```bash
curl -X POST http://localhost:3000/api/indexing/all \
  -H "Content-Type: application/json" \
  -d '{
    "baseUrl": "https://your-site.com",
    "type": "URL_UPDATED"
  }'
```

이 API는 `src/lib/google-indexing.ts`의 `getImportantPageUrls` 함수에 정의된 모든 중요 페이지의 색인을 생성합니다.

### 4.4 URL 색인 상태 조회

```bash
curl "http://localhost:3000/api/indexing/status?url=https://your-site.com/page"
```

응답:

```json
{
  "success": true,
  "status": {
    "urlNotificationMetadata": {
      "url": "https://your-site.com/page",
      "latestUpdate": {
        "url": "https://your-site.com/page",
        "type": "URL_UPDATED",
        "notifyTime": "2024-01-01T00:00:00Z"
      }
    }
  }
}
```

### 4.5 URL 삭제 요청

```bash
curl -X POST http://localhost:3000/api/indexing \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-site.com/deleted-page",
    "type": "URL_DELETED"
  }'
```

---

## 5. 문제 해결

### 5.1 "GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set"

**원인**: 환경 변수가 설정되지 않았습니다.

**해결**:
1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. `GOOGLE_SERVICE_ACCOUNT_KEY` 변수가 올바르게 설정되었는지 확인
3. 개발 서버를 재시작

### 5.2 "Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY"

**원인**: JSON 형식이 잘못되었습니다.

**해결**:
1. JSON 파일의 내용이 올바르게 복사되었는지 확인
2. 따옴표(")가 올바르게 이스케이프되었는지 확인
3. JSON 유효성 검사 도구로 확인 (https://jsonlint.com/)

### 5.3 "Error: Permission denied" (403)

**원인**: Service Account에 Search Console 접근 권한이 없습니다.

**해결**:
1. [2. Search Console 설정](#2-search-console-설정) 단계를 다시 확인
2. Service Account의 `client_email`이 Search Console에 "소유자"로 추가되었는지 확인
3. 최대 24시간까지 권한이 반영되는 데 시간이 걸릴 수 있음

### 5.4 "Error: Indexing API has not been used in project"

**원인**: Indexing API가 활성화되지 않았습니다.

**해결**:
1. Google Cloud Console에서 해당 프로젝트 선택
2. "APIs & Services" > "Library" 이동
3. "Indexing API" 검색 및 "사용 설정" 클릭

### 5.5 "Error: Invalid URL"

**원인**: URL 형식이 잘못되었습니다.

**해결**:
1. URL이 `https://` 또는 `http://`로 시작하는지 확인
2. URL이 올바른 형식인지 확인 (예: `https://example.com/page`)
3. 특수 문자가 올바르게 인코딩되었는지 확인

---

## 6. 보안 고려사항

### 6.1 프로덕션 환경

프로덕션 환경에서는 반드시 API 엔드포인트에 인증을 추가해야 합니다:

```typescript
// src/app/api/indexing/route.ts
export async function POST(request: Request) {
  // 인증 확인
  const apiKey = request.headers.get('x-api-key');
  if (apiKey !== process.env.INTERNAL_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 또는 세션 기반 인증
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 나머지 로직...
}
```

### 6.2 환경 변수 보호

- `.env.local` 파일은 **절대** Git에 커밋하지 마세요
- `.gitignore`에 `.env.local`이 포함되어 있는지 확인
- Service Account JSON 키는 안전하게 보관

### 6.3 Rate Limiting

Google Indexing API에는 할당량이 있습니다:
- 일일 할당량: 200개 요청 (기본값)
- 프로젝트 할당량 확인: [Google Cloud Console](https://console.cloud.google.com/apis/api/indexing.googleapis.com/quotas)

---

## 7. 추가 리소스

- [Google Indexing API 공식 문서](https://developers.google.com/search/apis/indexing-api/v3/quickstart)
- [Google Search Console](https://search.google.com/search-console)
- [Google Cloud Console](https://console.cloud.google.com/)

---

## 8. 참고사항

### 8.1 색인 생성 시간

- Google Indexing API로 요청을 보내도 즉시 색인이 생성되지 않습니다
- 일반적으로 몇 시간에서 며칠이 걸릴 수 있습니다
- Search Console에서 색인 상태를 확인할 수 있습니다

### 8.2 지원되는 콘텐츠 유형

Google Indexing API는 현재 다음 유형의 콘텐츠만 지원합니다:
- JobPosting (구직 정보)
- BroadcastEvent (라이브 스트리밍)

**일반 웹 페이지의 경우** Indexing API를 사용할 수 있지만, Google이 공식적으로 지원하는 것은 위 두 가지 유형입니다.

일반 웹 페이지의 색인을 빠르게 생성하려면:
1. Search Console에 사이트맵 제출
2. Search Console의 "URL 검사" 도구 사용
3. 내부 링크 구조 최적화

### 8.3 중요 페이지 관리

`src/lib/google-indexing.ts`의 `getImportantPageUrls` 함수를 수정하여 색인을 생성할 중요 페이지를 관리할 수 있습니다:

```typescript
export function getImportantPageUrls(baseUrl: string): string[] {
  const normalizedBase = baseUrl.replace(/\/$/, '');

  return [
    normalizedBase,                  // 홈페이지
    `${normalizedBase}/faq`,         // FAQ 페이지
    `${normalizedBase}/about`,       // 소개 페이지
    `${normalizedBase}/products`,    // 제품 페이지
    // 추가 페이지...
  ];
}
```

import { GoogleIndexingPanel } from '@/app/components/GoogleIndexingPanel';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Google 색인 생성 관리 | 어린이 해열제 용량 계산기',
  description: 'Google Indexing API를 사용하여 페이지의 색인 생성을 관리합니다.',
  robots: 'noindex, nofollow', // 관리자 페이지는 검색엔진에 노출되지 않도록
};

/**
 * Google 색인 생성 관리 페이지
 *
 * 관리자가 Google Indexing API를 사용하여 페이지의 색인 생성을 요청하고
 * 상태를 조회할 수 있는 페이지입니다.
 *
 * 보안:
 * - 프로덕션 환경에서는 이 페이지에 대한 접근을 제한해야 합니다.
 * - 인증 미들웨어를 추가하거나 환경 변수로 접근을 제어하세요.
 *
 * 예시:
 * ```typescript
 * import { redirect } from 'next/navigation';
 *
 * export default function AdminIndexingPage() {
 *   // 프로덕션에서만 접근 제어
 *   if (process.env.NODE_ENV === 'production') {
 *     // 인증 확인 로직
 *     // if (!isAdmin) redirect('/');
 *   }
 *
 *   return <GoogleIndexingPanel />;
 * }
 * ```
 */
export default function AdminIndexingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Google 색인 생성 관리
          </h1>
          <p className="text-gray-600">
            Google Indexing API를 사용하여 사이트 페이지의 색인 생성을 관리합니다.
          </p>
        </div>

        <GoogleIndexingPanel />

        <div className="mt-8 text-sm text-gray-500 text-center">
          <p>
            이 페이지는 관리자 전용입니다. 프로덕션 환경에서는 적절한 인증을
            추가하세요.
          </p>
        </div>
      </div>
    </div>
  );
}

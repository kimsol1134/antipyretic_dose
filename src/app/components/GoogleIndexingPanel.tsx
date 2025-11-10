'use client';

import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Alert } from './ui/Alert';
import { Input } from './ui/Input';

type IndexingResult = {
  success: boolean;
  url: string;
  response?: unknown;
  error?: string;
};

type BatchResponse = {
  success: boolean;
  results: IndexingResult[];
  summary: {
    total: number;
    success: number;
    failure: number;
  };
};

type StatusResponse = {
  success: boolean;
  status: {
    urlNotificationMetadata?: {
      url: string;
      latestUpdate?: {
        url: string;
        type: string;
        notifyTime: string;
      };
      latestRemove?: {
        url: string;
        type: string;
        notifyTime: string;
      };
    };
  };
};

/**
 * Google Indexing 관리 패널
 *
 * 주의: 이 컴포넌트는 관리자 전용입니다.
 * 프로덕션 환경에서는 적절한 인증을 추가해야 합니다.
 */
export function GoogleIndexingPanel() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusData, setStatusData] = useState<StatusResponse | null>(null);

  // 단일 URL 색인 생성 요청
  const handleIndexUrl = async () => {
    if (!url) {
      setError('URL을 입력하세요.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setStatusData(null);

    try {
      const response = await fetch('/api/indexing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          type: 'URL_UPDATED',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'API 요청 실패');
      }

      setResult(`✅ 색인 생성 요청 성공: ${url}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
    } finally {
      setLoading(false);
    }
  };

  // 모든 중요 페이지 색인 생성
  const handleIndexAll = async () => {
    const baseUrl = window.location.origin;

    setLoading(true);
    setError(null);
    setResult(null);
    setStatusData(null);

    try {
      const response = await fetch('/api/indexing/all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          baseUrl,
          type: 'URL_UPDATED',
        }),
      });

      const data: BatchResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          'error' in data ? (data as { error: string }).error : 'API 요청 실패'
        );
      }

      setResult(
        `✅ 일괄 색인 생성 요청 완료\n` +
          `총 ${data.summary.total}개 중 성공: ${data.summary.success}개, 실패: ${data.summary.failure}개`
      );

      // 실패한 URL이 있으면 표시
      const failures = data.results.filter((r) => !r.success);
      if (failures.length > 0) {
        const failureList = failures
          .map((f) => `- ${f.url}: ${f.error}`)
          .join('\n');
        setError(`실패한 URL:\n${failureList}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
    } finally {
      setLoading(false);
    }
  };

  // URL 색인 상태 조회
  const handleCheckStatus = async () => {
    if (!url) {
      setError('URL을 입력하세요.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setStatusData(null);

    try {
      const response = await fetch(
        `/api/indexing/status?url=${encodeURIComponent(url)}`
      );

      const data: StatusResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          'error' in data ? (data as { error: string }).error : 'API 요청 실패'
        );
      }

      setStatusData(data);
      setResult(`✅ 색인 상태 조회 성공: ${url}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Google 색인 생성 관리</h2>

      <div className="space-y-6">
        {/* URL 입력 */}
        <div>
          <label htmlFor="url-input" className="block text-sm font-medium mb-2">
            URL
          </label>
          <Input
            id="url-input"
            type="url"
            placeholder="https://example.com/page"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            색인을 생성하거나 상태를 조회할 URL을 입력하세요.
          </p>
        </div>

        {/* 버튼 그룹 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button onClick={handleIndexUrl} disabled={loading || !url}>
            {loading ? '처리 중...' : '단일 URL 색인 생성'}
          </Button>

          <Button
            onClick={handleIndexAll}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? '처리 중...' : '모든 중요 페이지 색인 생성'}
          </Button>

          <Button
            onClick={handleCheckStatus}
            disabled={loading || !url}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {loading ? '처리 중...' : 'URL 색인 상태 조회'}
          </Button>
        </div>

        {/* 결과 표시 */}
        {result && (
          <Alert variant="warning" className="bg-green-100 border-green-400 text-green-700">
            {result}
          </Alert>
        )}

        {/* 에러 표시 */}
        {error && <Alert variant="error">{error}</Alert>}

        {/* 색인 상태 상세 정보 */}
        {statusData?.status?.urlNotificationMetadata && (
          <Card className="bg-gray-50">
            <h3 className="font-bold mb-3">색인 상태 상세 정보</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold">URL:</span>{' '}
                {statusData.status.urlNotificationMetadata.url}
              </div>

              {statusData.status.urlNotificationMetadata.latestUpdate && (
                <div className="border-t pt-2">
                  <p className="font-semibold mb-1">최근 업데이트:</p>
                  <ul className="ml-4 space-y-1">
                    <li>
                      <span className="font-medium">타입:</span>{' '}
                      {statusData.status.urlNotificationMetadata.latestUpdate.type}
                    </li>
                    <li>
                      <span className="font-medium">시간:</span>{' '}
                      {new Date(
                        statusData.status.urlNotificationMetadata.latestUpdate.notifyTime
                      ).toLocaleString('ko-KR')}
                    </li>
                  </ul>
                </div>
              )}

              {statusData.status.urlNotificationMetadata.latestRemove && (
                <div className="border-t pt-2">
                  <p className="font-semibold mb-1">최근 삭제:</p>
                  <ul className="ml-4 space-y-1">
                    <li>
                      <span className="font-medium">타입:</span>{' '}
                      {statusData.status.urlNotificationMetadata.latestRemove.type}
                    </li>
                    <li>
                      <span className="font-medium">시간:</span>{' '}
                      {new Date(
                        statusData.status.urlNotificationMetadata.latestRemove.notifyTime
                      ).toLocaleString('ko-KR')}
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* 안내 메시지 */}
        <div className="text-sm text-gray-600 space-y-2">
          <p className="font-semibold">사용 안내:</p>
          <ul className="list-disc ml-5 space-y-1">
            <li>
              <strong>단일 URL 색인 생성:</strong> 특정 페이지의 색인 생성을
              Google에 요청합니다.
            </li>
            <li>
              <strong>모든 중요 페이지 색인 생성:</strong> 사이트의 중요한 모든
              페이지(홈, FAQ 등)의 색인을 일괄 요청합니다.
            </li>
            <li>
              <strong>URL 색인 상태 조회:</strong> Google에 마지막으로 알린
              색인 정보를 조회합니다.
            </li>
          </ul>

          <Alert variant="warning" className="mt-4">
            <strong>주의:</strong> 색인 생성 요청 후 실제로 색인이 생성되기까지
            몇 시간에서 며칠이 걸릴 수 있습니다. Google Search Console에서 색인
            상태를 확인하세요.
          </Alert>

          <Alert variant="error" className="mt-2">
            <strong>보안 경고:</strong> 이 패널은 관리자 전용입니다. 프로덕션
            환경에서는 적절한 인증을 추가해야 합니다.
          </Alert>
        </div>
      </div>
    </Card>
  );
}

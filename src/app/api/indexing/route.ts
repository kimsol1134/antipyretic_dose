'use server';

import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  createIndexingClient,
  getImportantPageUrls,
  type IndexingAction,
} from '@/lib/google-indexing';

/**
 * Google Indexing API 엔드포인트
 *
 * 사용법:
 * - POST /api/indexing - 단일 URL의 색인 생성 요청
 * - POST /api/indexing/batch - 여러 URL의 색인 생성 일괄 요청
 * - GET /api/indexing/status?url={url} - URL의 색인 상태 조회
 * - POST /api/indexing/all - 사이트의 모든 중요 페이지 색인 생성 요청
 *
 * 보안:
 * - 프로덕션에서는 인증을 추가해야 합니다 (예: API 키, 관리자 세션)
 */

const singleUrlSchema = z.object({
  url: z.string().url(),
  type: z.enum(['URL_UPDATED', 'URL_DELETED']).optional().default('URL_UPDATED'),
});

const batchUrlSchema = z.object({
  urls: z.array(z.string().url()).min(1).max(100),
  type: z.enum(['URL_UPDATED', 'URL_DELETED']).optional().default('URL_UPDATED'),
});

const allPagesSchema = z.object({
  baseUrl: z.string().url(),
  type: z.enum(['URL_UPDATED', 'URL_DELETED']).optional().default('URL_UPDATED'),
});

/**
 * POST /api/indexing
 * 단일 URL의 색인 생성을 요청합니다.
 */
export async function POST(request: Request) {
  try {
    // 프로덕션에서는 여기에 인증 로직을 추가해야 합니다
    // if (!isAuthenticated(request)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const { pathname } = new URL(request.url);

    // 배치 요청 처리
    if (pathname.endsWith('/batch')) {
      const parsed = batchUrlSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: 'Invalid request body', details: parsed.error.errors },
          { status: 400 }
        );
      }

      const { urls, type } = parsed.data;
      const client = createIndexingClient();
      const results = await client.batchNotifyUrls(urls, type);

      const successCount = results.filter((r) => r.success).length;
      const failureCount = results.filter((r) => !r.success).length;

      return NextResponse.json({
        success: true,
        results,
        summary: {
          total: urls.length,
          success: successCount,
          failure: failureCount,
        },
      });
    }

    // 모든 중요 페이지 색인 생성 요청
    if (pathname.endsWith('/all')) {
      const parsed = allPagesSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: 'Invalid request body', details: parsed.error.errors },
          { status: 400 }
        );
      }

      const { baseUrl, type } = parsed.data;
      const urls = getImportantPageUrls(baseUrl);
      const client = createIndexingClient();
      const results = await client.batchNotifyUrls(urls, type);

      const successCount = results.filter((r) => r.success).length;
      const failureCount = results.filter((r) => !r.success).length;

      return NextResponse.json({
        success: true,
        results,
        summary: {
          total: urls.length,
          success: successCount,
          failure: failureCount,
        },
      });
    }

    // 단일 URL 처리
    const parsed = singleUrlSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.errors },
        { status: 400 }
      );
    }

    const { url: targetUrl, type } = parsed.data;
    const client = createIndexingClient();
    const response = await client.notifyUrlUpdate(targetUrl, type);

    return NextResponse.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error('[Indexing API] Error:', error);

    // Service Account 설정 오류
    if (error instanceof Error && error.message.includes('GOOGLE_SERVICE_ACCOUNT_KEY')) {
      return NextResponse.json(
        {
          error: 'Google Service Account not configured',
          message: error.message,
        },
        { status: 500 }
      );
    }

    // Google API 오류
    if (error && typeof error === 'object' && 'code' in error) {
      const apiError = error as { code?: number; message?: string };
      return NextResponse.json(
        {
          error: 'Google API error',
          message: apiError.message || 'Unknown error',
          code: apiError.code,
        },
        { status: apiError.code || 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/indexing/status?url={url}
 * URL의 색인 상태를 조회합니다.
 */
export async function GET(request: Request) {
  try {
    // 프로덕션에서는 여기에 인증 로직을 추가해야 합니다
    // if (!isAuthenticated(request)) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // URL 형식 검증
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    const client = createIndexingClient();
    const status = await client.getUrlStatus(url);

    return NextResponse.json({
      success: true,
      status,
    });
  } catch (error) {
    console.error('[Indexing API] Error getting status:', error);

    // Service Account 설정 오류
    if (error instanceof Error && error.message.includes('GOOGLE_SERVICE_ACCOUNT_KEY')) {
      return NextResponse.json(
        {
          error: 'Google Service Account not configured',
          message: error.message,
        },
        { status: 500 }
      );
    }

    // Google API 오류 (404 등)
    if (error && typeof error === 'object' && 'code' in error) {
      const apiError = error as { code?: number; message?: string };
      return NextResponse.json(
        {
          error: 'Google API error',
          message: apiError.message || 'Unknown error',
          code: apiError.code,
        },
        { status: apiError.code || 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

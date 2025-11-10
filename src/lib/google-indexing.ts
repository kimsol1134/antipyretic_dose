import 'server-only';
import { google } from 'googleapis';

/**
 * Google Indexing API 클라이언트
 *
 * 이 모듈은 Google Indexing API를 사용하여 페이지의 색인 생성을 요청합니다.
 * Service Account를 사용한 서버 측 인증이 필요합니다.
 *
 * @see https://developers.google.com/search/apis/indexing-api/v3/quickstart
 */

export type IndexingAction = 'URL_UPDATED' | 'URL_DELETED';

export type IndexingRequest = {
  url: string;
  type: IndexingAction;
};

export type IndexingResponse = {
  urlNotificationMetadata: {
    url: string;
    latestUpdate?: {
      url: string;
      type: IndexingAction;
      notifyTime: string;
    };
    latestRemove?: {
      url: string;
      type: IndexingAction;
      notifyTime: string;
    };
  };
};

export type IndexingStatusResponse = {
  urlNotificationMetadata?: {
    url: string;
    latestUpdate?: {
      url: string;
      type: IndexingAction;
      notifyTime: string;
    };
    latestRemove?: {
      url: string;
      type: IndexingAction;
      notifyTime: string;
    };
  };
};

export type BatchIndexingResult = {
  success: boolean;
  url: string;
  response?: IndexingResponse;
  error?: string;
};

/**
 * Google Service Account 설정 타입
 */
export type ServiceAccountCredentials = {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
};

/**
 * Google Indexing API 클라이언트 클래스
 */
export class GoogleIndexingClient {
  private indexing;

  constructor(serviceAccountKey: ServiceAccountCredentials) {
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccountKey,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    this.indexing = google.indexing({
      version: 'v3',
      auth,
    });
  }

  /**
   * URL의 색인 생성 또는 업데이트를 요청합니다.
   *
   * @param url - 색인을 생성할 URL (전체 URL 필요)
   * @param type - 작업 타입 ('URL_UPDATED' | 'URL_DELETED')
   * @returns IndexingResponse
   */
  async notifyUrlUpdate(
    url: string,
    type: IndexingAction = 'URL_UPDATED'
  ): Promise<IndexingResponse> {
    try {
      const response = await this.indexing.urlNotifications.publish({
        requestBody: {
          url,
          type,
        },
      });

      return response.data as IndexingResponse;
    } catch (error) {
      console.error('[Google Indexing] Failed to notify URL update:', error);
      throw error;
    }
  }

  /**
   * URL의 색인 상태를 조회합니다.
   *
   * @param url - 조회할 URL
   * @returns IndexingStatusResponse
   */
  async getUrlStatus(url: string): Promise<IndexingStatusResponse> {
    try {
      const response = await this.indexing.urlNotifications.getMetadata({
        url,
      });

      return response.data as IndexingStatusResponse;
    } catch (error) {
      console.error('[Google Indexing] Failed to get URL status:', error);
      throw error;
    }
  }

  /**
   * 여러 URL의 색인 생성을 일괄 요청합니다.
   *
   * @param urls - 색인을 생성할 URL 배열
   * @param type - 작업 타입 ('URL_UPDATED' | 'URL_DELETED')
   * @returns BatchIndexingResult[]
   */
  async batchNotifyUrls(
    urls: string[],
    type: IndexingAction = 'URL_UPDATED'
  ): Promise<BatchIndexingResult[]> {
    const results: BatchIndexingResult[] = [];

    for (const url of urls) {
      try {
        const response = await this.notifyUrlUpdate(url, type);
        results.push({
          success: true,
          url,
          response,
        });
      } catch (error) {
        results.push({
          success: false,
          url,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }
}

/**
 * 환경 변수에서 Service Account 인증 정보를 로드합니다.
 *
 * @throws Error - 환경 변수가 설정되지 않은 경우
 */
export function loadServiceAccountFromEnv(): ServiceAccountCredentials {
  const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (!credentialsJson) {
    throw new Error(
      'GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set. ' +
      'Please add your Google Service Account JSON to .env.local'
    );
  }

  try {
    const credentials = JSON.parse(credentialsJson) as ServiceAccountCredentials;
    return credentials;
  } catch (error) {
    throw new Error(
      'Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY. ' +
      'Please ensure it contains valid JSON.'
    );
  }
}

/**
 * Google Indexing API 클라이언트 싱글톤 인스턴스를 생성합니다.
 */
export function createIndexingClient(): GoogleIndexingClient {
  const credentials = loadServiceAccountFromEnv();
  return new GoogleIndexingClient(credentials);
}

/**
 * 사이트의 중요한 페이지 URL을 반환합니다.
 *
 * @param baseUrl - 사이트의 기본 URL (예: https://example.com)
 * @returns string[] - 색인을 생성할 URL 배열
 */
export function getImportantPageUrls(baseUrl: string): string[] {
  // 프로토콜 제거 후 정규화
  const normalizedBase = baseUrl.replace(/\/$/, '');

  return [
    normalizedBase, // 홈페이지
    `${normalizedBase}/faq`, // FAQ 페이지
    // 필요한 다른 중요 페이지 추가
  ];
}

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  EasyDrugItem,
  fetchEasyDrugList,
  filterSimilarItems,
  deriveStrengthMgPerMlFromText,
} from './easy-drug';

const originalFetch = global.fetch;
const originalApiKey = process.env.EASY_DRUG_API_KEY;

beforeEach(() => {
  process.env.EASY_DRUG_API_KEY = 'test-key';
});

afterEach(() => {
  vi.restoreAllMocks();
  global.fetch = originalFetch;
  process.env.EASY_DRUG_API_KEY = originalApiKey;
});

function mockFetchSuccess(payload: unknown) {
  const fetchMock = vi.fn(async () => ({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: async () => payload,
  })) as unknown as typeof fetch;
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function mockFetchFailure(status = 500, statusText = 'Internal Server Error') {
  const fetchMock = vi.fn(async () => ({
    ok: false,
    status,
    statusText,
  })) as unknown as typeof fetch;
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('fetchEasyDrugList', () => {
  it('sanitizes HTML fields and preserves line breaks', async () => {
    const responsePayload = {
      header: { resultCode: '00', resultMsg: 'NORMAL SERVICE' },
      body: {
        totalCount: 1,
        items: {
          item: [
            {
              itemSeq: '12345',
              itemName: '테스트 해열제 160mg/5mL',
              mainIngr: '아세트아미노펜',
              efcyQesitm: '열을 낮춰줍니다.<br />통증을 완화합니다.',
              useMethodQesitm: '<p>1회 5mL 복용</p>',
              atpnWarnQesitm: '<strong>과다복용 금지</strong>',
              itemImage: 'https://example.com/image.jpg',
            },
          ],
        },
      },
    };

    mockFetchSuccess(responsePayload);

    const result = await fetchEasyDrugList({ itemName: '테스트' });
    expect(result.items).toHaveLength(1);
    const item = result.items[0];
    expect(item.efcyQesitm).toBe('열을 낮춰줍니다.\n통증을 완화합니다.');
    expect(item.useMethodQesitm).toBe('1회 5mL 복용');
    expect(item.atpnWarnQesitm).toBe('과다복용 금지');
  });

  it('throws when the upstream API responds with an error status', async () => {
    mockFetchFailure(503, 'Service Unavailable');

    await expect(fetchEasyDrugList({ itemName: '테스트' })).rejects.toThrow(
      'Failed to fetch easy drug info'
    );
  });
});

describe('filterSimilarItems', () => {
  const sampleItems: EasyDrugItem[] = [
    {
      itemSeq: '1',
      itemName: '어린이 타이레놀 160mg/5mL',
      mainIngr: '아세트아미노펜',
    },
    {
      itemSeq: '2',
      itemName: '어린이 이부펜 100mg/5mL',
      mainIngr: '이부프로펜',
    },
  ];

  it('filters by ingredient and strength tolerance', () => {
    const filtered = filterSimilarItems(sampleItems, {
      ingredient: '아세트아미노펜',
      strengthMgPerMl: 32,
      tolerance: 0.5,
    });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].itemSeq).toBe('1');
  });

  it('derives strength from various textual patterns', () => {
    expect(deriveStrengthMgPerMlFromText('어린이 해열제 160mg/5mL')).toBeCloseTo(
      32
    );
    expect(deriveStrengthMgPerMlFromText('농도: 32 mg / 1 ml')).toBeCloseTo(32);
    expect(deriveStrengthMgPerMlFromText('주성분 160밀리그램/5밀리리터')).toBeCloseTo(
      32
    );
    expect(
      deriveStrengthMgPerMlFromText('복용량: 160 mg per 5 mL, 하루 4회 이하')
    ).toBeCloseTo(32);
  });
});

import { z } from 'zod';

const API_ENDPOINT =
  'https://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList';

const easyDrugItemSchema = z.object({
  itemSeq: z.string(),
  itemName: z.string(),
  entpName: z.string().nullable().optional(),
  mainIngr: z.string().nullable().optional(),
  efcyQesitm: z.string().nullable().optional(),
  useMethodQesitm: z.string().nullable().optional(),
  atpnWarnQesitm: z.string().nullable().optional(),
  atpnQesitm: z.string().nullable().optional(),
  intrcQesitm: z.string().nullable().optional(),
  seQesitm: z.string().nullable().optional(),
  depositMethodQesitm: z.string().nullable().optional(),
  itemImage: z.string().nullable().optional(),
});

const easyDrugItemsSchema = z
  .union([easyDrugItemSchema, z.array(easyDrugItemSchema)])
  .optional();

const easyDrugResponseSchema = z.object({
  header: z
    .object({
      resultCode: z.string(),
      resultMsg: z.string(),
    })
    .optional(),
  body: z
    .object({
      items: z
        .union([
          z.object({
            item: easyDrugItemsSchema,
          }),
          z.array(easyDrugItemSchema),
        ])
        .optional(),
      totalCount: z
        .union([z.number(), z.string()])
        .transform((value) => Number(value))
        .optional(),
    })
    .optional(),
});

export type EasyDrugItem = z.infer<typeof easyDrugItemSchema>;

export type EasyDrugListResponse = {
  items: EasyDrugItem[];
  totalCount: number;
};

const lineBreakPattern = /<br\s*\/?>/gi;
const htmlTagPattern = /<[^>]+>/g;
const strengthPatterns = [
  /(\d+(?:[.,]\d+)?)\s*mg\s*\/\s*(\d+(?:[.,]\d+)?)\s*(?:mL|ml)/i,
  /(\d+(?:[.,]\d+)?)\s*(?:밀리그램|mg)\s*\/\s*(\d+(?:[.,]\d+)?)\s*(?:밀리리터|mL|ml)/i,
  /(\d+(?:[.,]\d+)?)\s*(?:mg|밀리그램)\s*(?:per|당)\s*(\d+(?:[.,]\d+)?)\s*(?:mL|ml|밀리리터)/i,
] as const;

function collapseWhitespace(value: string): string {
  return value
    .replace(/\u00A0/g, ' ')
    .replace(/\s+\n/g, '\n')
    .replace(/\n\s+/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function sanitizeHtmlField(value?: string | null): string | undefined {
  if (!value) {
    return undefined;
  }
  const withNewlines = value.replace(lineBreakPattern, '\n');
  const withoutTags = withNewlines.replace(htmlTagPattern, ' ');
  const collapsed = collapseWhitespace(withoutTags);
  return collapsed.length > 0 ? collapsed : undefined;
}

export function deriveStrengthMgPerMlFromText(
  value?: string | null
): number | undefined {
  if (!value) {
    return undefined;
  }
  const normalized = value.replaceAll(',', '');
  for (const pattern of strengthPatterns) {
    const match = normalized.match(pattern);
    if (!match) {
      continue;
    }
    const mg = Number(match[1]);
    const ml = Number(match[2]);
    if (!Number.isFinite(mg) || !Number.isFinite(ml) || ml <= 0) {
      continue;
    }
    const ratio = mg / ml;
    if (Number.isFinite(ratio)) {
      return ratio;
    }
  }
  return undefined;
}

function normalizeString(value?: string | null): string | undefined {
  if (!value) {
    return undefined;
  }
  return value
    .toLowerCase()
    .replace(/[\s·.,()\/\-]+/g, '')
    .trim();
}

const INGREDIENT_NAME_MAP: Record<string, string[]> = {
  아세트아미노펜: ['acetaminophen', 'paracetamol', '아세트아미노펜'],
  이부프로펜: ['ibuprofen', '이부프로펜'],
  덱시부프로펜: ['dexibuprofen', '덱시부프로펜'],
};

function isChildrenMedicine(itemName: string): boolean {
  const childrenKeywords = [
    '어린이',
    '소아',
    '유아',
    '베이비',
    '키즈',
    '아기',
    '영아',
    '시럽',
    '현탁액',
  ];

  const normalizedName = itemName.toLowerCase();
  return childrenKeywords.some((keyword) => normalizedName.includes(keyword));
}

export function filterSimilarItems(
  items: EasyDrugItem[],
  options: {
    ingredient?: string;
    strengthMgPerMl?: number;
    tolerance?: number;
    childrenOnly?: boolean;
  }
): EasyDrugItem[] {
  const { ingredient, strengthMgPerMl, tolerance = 0.5, childrenOnly = true } = options;

  // 성분명을 한글/영어 모두 포함
  const ingredientNames = ingredient && INGREDIENT_NAME_MAP[ingredient]
    ? INGREDIENT_NAME_MAP[ingredient]
    : ingredient
    ? [ingredient]
    : [];

  return items.filter((item) => {
    // 1. 어린이용 약품만 필터링
    if (childrenOnly && !isChildrenMedicine(item.itemName)) {
      return false;
    }

    // 2. 성분 필터링 (한글/영어 모두 확인)
    let matchesIngredient = true;
    if (ingredientNames.length > 0) {
      const candidates = [
        item.mainIngr,
        item.itemName,
        item.efcyQesitm,
        item.useMethodQesitm,
      ]
        .map((candidate) => normalizeString(candidate))
        .filter(Boolean) as string[];

      matchesIngredient = ingredientNames.some((ingName) => {
        const normalized = normalizeString(ingName);
        return candidates.some((candidate) => candidate.includes(normalized));
      });
    }

    // 3. 농도 필터링 (선택적)
    let matchesStrength = true;
    if (typeof strengthMgPerMl === 'number') {
      const derivedStrength =
        deriveStrengthMgPerMlFromText(item.itemName) ??
        deriveStrengthMgPerMlFromText(item.useMethodQesitm) ??
        deriveStrengthMgPerMlFromText(item.efcyQesitm);

      if (typeof derivedStrength === 'number') {
        matchesStrength = Math.abs(derivedStrength - strengthMgPerMl) <= tolerance;
      }
      // 농도를 파악할 수 없으면 일단 통과 (어린이용이고 성분이 맞으면 포함)
    }

    return matchesIngredient && matchesStrength;
  });
}

function toEasyDrugItems(rawItems: z.infer<typeof easyDrugItemsSchema>) {
  if (!rawItems) {
    return [];
  }
  const itemsArray = Array.isArray(rawItems) ? rawItems : [rawItems];
  return itemsArray.map((item) => ({
    itemSeq: item.itemSeq,
    itemName: item.itemName,
    entpName: sanitizeHtmlField(item.entpName),
    mainIngr: sanitizeHtmlField(item.mainIngr),
    efcyQesitm: sanitizeHtmlField(item.efcyQesitm),
    useMethodQesitm: sanitizeHtmlField(item.useMethodQesitm),
    atpnWarnQesitm: sanitizeHtmlField(item.atpnWarnQesitm),
    atpnQesitm: sanitizeHtmlField(item.atpnQesitm),
    intrcQesitm: sanitizeHtmlField(item.intrcQesitm),
    seQesitm: sanitizeHtmlField(item.seQesitm),
    depositMethodQesitm: sanitizeHtmlField(item.depositMethodQesitm),
    itemImage: sanitizeHtmlField(item.itemImage),
  }));
}

export function parseEasyDrugResponse(data: unknown): EasyDrugListResponse {
  const parsed = easyDrugResponseSchema.parse(data);

  let rawItems: z.infer<typeof easyDrugItemsSchema> | undefined;

  if (parsed.body?.items) {
    // items가 배열인 경우
    if (Array.isArray(parsed.body.items)) {
      rawItems = parsed.body.items;
    }
    // items가 { item: ... } 형식인 경우
    else if ('item' in parsed.body.items) {
      rawItems = parsed.body.items.item;
    }
  }

  const items = toEasyDrugItems(rawItems);
  const totalCount = parsed.body?.totalCount ?? items.length;

  return {
    items,
    totalCount,
  };
}

export async function fetchEasyDrugList(params: {
  itemName?: string;
  ingredient?: string;
  page?: number;
  pageSize?: number;
}): Promise<EasyDrugListResponse> {
  const apiKey = process.env.EASY_DRUG_API_KEY;
  if (!apiKey) {
    throw new Error('EASY_DRUG_API_KEY is not configured');
  }

  const normalizedKey = apiKey.includes('%')
    ? decodeURIComponent(apiKey)
    : apiKey;

  const searchParams = new URLSearchParams({
    serviceKey: normalizedKey,
    type: 'json',
    pageNo: String(params.page ?? 1),
    numOfRows: String(params.pageSize ?? 50),
  });

  const queryValue = params.itemName ?? params.ingredient;
  if (queryValue) {
    searchParams.append('itemName', queryValue);
  }

  const response = await fetch(`${API_ENDPOINT}?${searchParams.toString()}`, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch easy drug info: ${response.status} ${response.statusText}`
    );
  }

  const responseData = await response.json();
  const parsed = parseEasyDrugResponse(responseData);

  if (!parsed.items.length) {
    return parsed;
  }

  return parsed;
}
